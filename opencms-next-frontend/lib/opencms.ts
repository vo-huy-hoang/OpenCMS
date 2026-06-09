const OPENCMS_BASE_URL = process.env.OPENCMS_BASE_URL?.replace(/\/$/, "");
const OPENCMS_NEWS_PATH = process.env.OPENCMS_NEWS_PATH ?? "/mercury-json/";
const REQUEST_TIMEOUT_MS = 8000;

export type OpenCmsProbe = {
  path: string;
  url: string;
  ok: boolean;
  status: number | null;
  statusText: string;
  redirectedTo: string | null;
  durationMs: number;
  error: string | null;
};

export type NewsItem = {
  id: string;
  title: string;
  summary: string;
  href: string;
  date: string | null;
  image: string | null;
};

function getOpenCmsBaseUrl() {
  if (!OPENCMS_BASE_URL) {
    throw new Error("Thiếu OPENCMS_BASE_URL trong .env.local");
  }

  return OPENCMS_BASE_URL;
}

function createOpenCmsUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${getOpenCmsBaseUrl()}${normalizedPath}`;
}

export function getOpenCmsStatusConfig() {
  return {
    baseUrl: OPENCMS_BASE_URL,
    sitePath: "/",
    workplacePath: "/workplace/",
    adminPath: "/system/login/index.html",
    headlessPath: OPENCMS_NEWS_PATH,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getStringField(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

function extractNewsArray(payload: unknown): unknown[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!isRecord(payload)) {
    return [];
  }

  for (const key of ["items", "results", "articles", "news", "data"]) {
    const value = payload[key];

    if (Array.isArray(value)) {
      return value;
    }
  }

  return [];
}

function normalizeOpenCmsHref(href: string) {
  if (!href) {
    return "#";
  }

  if (href.startsWith("http") || href.startsWith("#")) {
    return href;
  }

  return createOpenCmsUrl(href);
}

function normalizeNewsItem(item: unknown, index: number): NewsItem | null {
  if (!isRecord(item)) {
    return null;
  }

  const title = getStringField(item, ["title", "headline", "name", "label"]);

  if (!title) {
    return null;
  }

  return {
    id:
      getStringField(item, ["id", "uuid", "path", "link", "url"]) ||
      `${index}-${title}`,
    title,
    summary: getStringField(item, [
      "summary",
      "description",
      "teaser",
      "intro",
      "text",
    ]),
    href: normalizeOpenCmsHref(getStringField(item, ["href", "link", "url", "path"])),
    date: getStringField(item, ["date", "publishedAt", "publishDate", "created"])
      || null,
    image:
      getStringField(item, ["image", "imageUrl", "thumbnail", "teaserImage"]) ||
      null,
  };
}

export async function fetchOpenCmsNews(path = OPENCMS_NEWS_PATH) {
  const payload = await fetchOpenCmsJson<unknown>(path);

  return extractNewsArray(payload)
    .map((item, index) => normalizeNewsItem(item, index))
    .filter((item): item is NewsItem => item !== null);
}

export async function probeOpenCmsPath(path: string): Promise<OpenCmsProbe> {
  const startedAt = Date.now();

  try {
    const url = createOpenCmsUrl(path);
    const res = await fetch(url, {
      cache: "no-store",
      method: "HEAD",
      redirect: "manual",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    return {
      path,
      url,
      ok: res.ok || (res.status >= 300 && res.status < 400),
      status: res.status,
      statusText: res.statusText,
      redirectedTo: res.headers.get("location"),
      durationMs: Date.now() - startedAt,
      error: null,
    };
  } catch (err) {
    return {
      path,
      url: OPENCMS_BASE_URL ? createOpenCmsUrl(path) : path,
      ok: false,
      status: null,
      statusText: "Request failed",
      redirectedTo: null,
      durationMs: Date.now() - startedAt,
      error: err instanceof Error ? err.message : "Lỗi không xác định",
    };
  }
}

export async function fetchOpenCmsJson<T>(path: string): Promise<T> {
  const url = createOpenCmsUrl(path);

  const res = await fetch(url, {
    cache: "no-store",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!res.ok) {
    throw new Error(
      `OpenCms API error: ${res.status} ${res.statusText}. URL: ${url}`
    );
  }

  return res.json() as Promise<T>;
}

export async function fetchOpenCmsHtml(path: string): Promise<string> {
  const url = createOpenCmsUrl(path);

  const res = await fetch(url, {
    cache: "no-store",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!res.ok) {
    throw new Error(
      `OpenCms HTML error: ${res.status} ${res.statusText}. URL: ${url}`
    );
  }

  return res.text();
}
