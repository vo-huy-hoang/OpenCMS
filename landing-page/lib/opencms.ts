const OPENCMS_BASE_URL = process.env.OPENCMS_BASE_URL?.replace(/\/$/, "");
const OPENCMS_LANDING_PATH = process.env.OPENCMS_LANDING_PATH;
const REVALIDATE_SECONDS = Number(process.env.OPENCMS_REVALIDATE_SECONDS ?? 60);

const CONTENT_PATHS = {
  banner:
    process.env.OPENCMS_BANNER_PATH ?? "/api/landing-page/banner.json",
  services:
    process.env.OPENCMS_SERVICES_PATH ?? "/api/landing-page/services.json",
  projects:
    process.env.OPENCMS_PROJECTS_PATH ?? "/api/landing-page/projects.json",
  news: process.env.OPENCMS_NEWS_PATH ?? "/api/landing-page/news.json",
  contact:
    process.env.OPENCMS_CONTACT_PATH ?? "/api/landing-page/contact.json",
};

export type LandBanner = {
  title: string;
  subtitle: string;
  image: string;
  buttonLabel: string;
  buttonHref: string;
};

export type LandService = {
  name: string;
  description: string;
  icon: string;
};

export type LandProject = {
  name: string;
  customer: string;
  image: string;
  description: string;
  price?: string;
  area?: string;
  legalStatus?: string;
  status?: string;
};

export type LandNews = {
  title: string;
  content: string;
  image: string;
  publishDate: string;
};

export type LandContact = {
  phone: string;
  email: string;
  address: string;
};

export type LandLandingContent = {
  banner: LandBanner;
  services: LandService[];
  projects: LandProject[];
  news: LandNews[];
  contact: LandContact;
  source: "opencms" | "fallback";
};

export function getOpenCmsContentConfig() {
  return {
    baseUrl: OPENCMS_BASE_URL,
    landingPath: OPENCMS_LANDING_PATH,
    contentPaths: CONTENT_PATHS,
    revalidateSeconds: REVALIDATE_SECONDS,
  };
}

export const fallbackLandContent: LandLandingContent = {
  source: "fallback",
  banner: {
    title: "Đất Nền An Phú",
    subtitle:
      "Dự án đất nền pháp lý rõ ràng, vị trí kết nối nhanh, phù hợp đầu tư và an cư lâu dài.",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=2200&q=85",
    buttonLabel: "Nhận bảng giá",
    buttonHref: "#projects",
  },
  services: [
    {
      name: "Tư vấn pháp lý",
      description:
        "Kiểm tra sổ, quy hoạch, hiện trạng sử dụng đất và quy trình sang tên.",
      icon: "Legal",
    },
    {
      name: "Ký gửi nhà đất",
      description:
        "Tiếp nhận, thẩm định, định giá và truyền thông bất động sản cần bán.",
      icon: "Sell",
    },
    {
      name: "Dẫn khách xem đất",
      description:
        "Sắp lịch khảo sát thực địa, tư vấn lô phù hợp ngân sách và mục tiêu.",
      icon: "Tour",
    },
    {
      name: "Hỗ trợ đầu tư",
      description:
        "Phân tích vị trí, hạ tầng, biên độ tăng giá và kế hoạch dòng tiền.",
      icon: "Plan",
    },
  ],
  projects: [
    {
      name: "Khu dân cư An Phú",
      customer: "Bình Chánh, TP. Hồ Chí Minh",
      image:
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1400&q=85",
      description:
        "Đất nền sổ riêng, đường nội khu hoàn thiện, gần trường học, chợ và trục kết nối chính.",
      price: "Từ 1,85 tỷ",
      area: "80 - 120 m²",
      legalStatus: "Sổ riêng từng nền",
      status: "Đang mở bán",
    },
    {
      name: "Eco Garden Riverside",
      customer: "Long An",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85",
      description:
        "Khu đất ven sông, quy hoạch thấp tầng, phù hợp xây nhà vườn hoặc giữ tài sản dài hạn.",
      price: "Từ 2,4 tỷ",
      area: "100 - 180 m²",
      legalStatus: "Pháp lý hoàn chỉnh",
      status: "Còn 18 nền",
    },
    {
      name: "Central Link Residence",
      customer: "Đồng Nai",
      image:
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1400&q=85",
      description:
        "Vị trí gần khu công nghiệp và tuyến cao tốc, thuận tiện khai thác cho thuê hoặc chuyển nhượng.",
      price: "Từ 1,55 tỷ",
      area: "75 - 110 m²",
      legalStatus: "Sổ hồng riêng",
      status: "Nhận giữ chỗ",
    },
  ],
  news: [
    {
      title: "Cập nhật giá đất khu Tây tháng 6",
      content:
        "Nhu cầu tăng ở các khu vực có hạ tầng kết nối tốt, đặc biệt nhóm sản phẩm pháp lý hoàn chỉnh.",
      image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85",
      publishDate: "2026-06-01",
    },
    {
      title: "Checklist pháp lý trước khi xuống tiền",
      content:
        "Người mua nên kiểm tra quy hoạch, tình trạng thế chấp, thông tin thửa đất và điều kiện công chứng.",
      image:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=85",
      publishDate: "2026-06-04",
    },
    {
      title: "Hạ tầng mới tạo lực đẩy cho đất vùng ven",
      content:
        "Các tuyến vành đai, cao tốc và cầu kết nối đang làm thay đổi nhu cầu tìm kiếm bất động sản vùng ven.",
      image:
        "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=85",
      publishDate: "2026-06-08",
    },
  ],
  contact: {
    phone: "090 123 4567",
    email: "sales@datnenanphu.vn",
    address: "72 Nguyễn Hữu Thọ, Quận 7, TP. Hồ Chí Minh",
  },
};

function createOpenCmsUrl(path: string) {
  if (!OPENCMS_BASE_URL) {
    return null;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${OPENCMS_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getField(record: Record<string, unknown>, keys: string[]) {
  const lowerCaseEntries = Object.entries(record).reduce<Record<string, unknown>>(
    (fields, [key, value]) => {
      fields[key.toLowerCase()] = value;
      return fields;
    },
    {}
  );

  for (const key of keys) {
    if (key in record) {
      return record[key];
    }

    const lowerCaseValue = lowerCaseEntries[key.toLowerCase()];
    if (lowerCaseValue !== undefined) {
      return lowerCaseValue;
    }
  }

  return undefined;
}

function toText(value: unknown): string {
  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map(toText).find(Boolean) ?? "";
  }

  if (isRecord(value)) {
    for (const key of ["value", "text", "content", "html", "label", "name"]) {
      const text = toText(value[key]);
      if (text) {
        return text;
      }
    }
  }

  return "";
}

function readText(record: Record<string, unknown>, keys: string[]) {
  return toText(getField(record, keys));
}

function normalizeUrl(value: string) {
  if (!value) {
    return "";
  }

  if (
    value.startsWith("#") ||
    value.startsWith("mailto:") ||
    value.startsWith("tel:") ||
    value.startsWith("http://") ||
    value.startsWith("https://")
  ) {
    return value;
  }

  return createOpenCmsUrl(value) ?? value;
}

function extractItems(payload: unknown, keys: string[]) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!isRecord(payload)) {
    return [];
  }

  for (const key of keys) {
    const value = getField(payload, [key]);

    if (Array.isArray(value)) {
      return value;
    }
  }

  for (const key of ["items", "results", "data", "content"]) {
    const value = getField(payload, [key]);

    if (Array.isArray(value)) {
      return value;
    }
  }

  return [];
}

function extractRecord(payload: unknown, keys: string[]) {
  if (!isRecord(payload)) {
    return null;
  }

  for (const key of keys) {
    const value = getField(payload, [key]);

    if (isRecord(value)) {
      return value;
    }

    if (Array.isArray(value) && isRecord(value[0])) {
      return value[0];
    }
  }

  return payload;
}

async function fetchOpenCmsJson(path: string) {
  const url = createOpenCmsUrl(path);

  if (!url) {
    return null;
  }

  const response = await fetch(url, {
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`OpenCMS returned ${response.status} for ${url}`);
  }

  return response.json() as Promise<unknown>;
}

async function fetchSegment<T>(
  path: string,
  fallback: T,
  normalize: (payload: unknown, fallback: T) => T
): Promise<{ data: T; loaded: boolean }> {
  try {
    const payload = await fetchOpenCmsJson(path);
    return payload
      ? { data: normalize(payload, fallback), loaded: true }
      : { data: fallback, loaded: false };
  } catch {
    return { data: fallback, loaded: false };
  }
}

function normalizeBanner(payload: unknown, fallback: LandBanner): LandBanner {
  const record = extractRecord(payload, ["banner", "hero"]);

  if (!record) {
    return fallback;
  }

  return {
    title: readText(record, ["title", "headline", "name"]) || fallback.title,
    subtitle:
      readText(record, ["subtitle", "description", "summary", "text"]) ||
      fallback.subtitle,
    image:
      normalizeUrl(
        readText(record, ["image", "imageUrl", "background", "teaserImage"])
      ) || fallback.image,
    buttonLabel:
      readText(record, ["button", "buttonLabel", "cta", "ctaLabel"]) ||
      fallback.buttonLabel,
    buttonHref:
      normalizeUrl(readText(record, ["buttonHref", "buttonUrl", "ctaUrl"])) ||
      fallback.buttonHref,
  };
}

function normalizeServices(
  payload: unknown,
  fallback: LandService[]
): LandService[] {
  const items = extractItems(payload, ["services", "service"]);
  const services = items
    .filter(isRecord)
    .map((item, index) => ({
      name: readText(item, ["name", "title", "label"]) || fallback[index]?.name,
      description:
        readText(item, ["description", "summary", "text"]) ||
        fallback[index]?.description,
      icon: readText(item, ["icon", "symbol"]) || fallback[index]?.icon || "Land",
    }))
    .filter((item): item is LandService => Boolean(item.name && item.description));

  return services.length ? services : fallback;
}

function normalizeProjects(
  payload: unknown,
  fallback: LandProject[]
): LandProject[] {
  const items = extractItems(payload, ["projects", "project"]);
  const projects = items
    .filter(isRecord)
    .map((item, index) => ({
      name: readText(item, ["name", "title"]) || fallback[index]?.name,
      customer: readText(item, ["customer", "client"]) || fallback[index]?.customer,
      image:
        normalizeUrl(readText(item, ["image", "imageUrl", "thumbnail"])) ||
        fallback[index]?.image,
      description:
        readText(item, ["description", "summary", "text"]) ||
        fallback[index]?.description,
      price: readText(item, ["price", "priceRange"]) || fallback[index]?.price,
      area: readText(item, ["area", "acreage"]) || fallback[index]?.area,
      legalStatus:
        readText(item, ["legalStatus", "legal", "paper"]) ||
        fallback[index]?.legalStatus,
      status: readText(item, ["status", "state"]) || fallback[index]?.status,
    }))
    .filter((item) =>
      Boolean(item.name && item.customer && item.image && item.description)
    ) as LandProject[];

  return projects.length ? projects : fallback;
}

function normalizeNews(payload: unknown, fallback: LandNews[]): LandNews[] {
  const items = extractItems(payload, ["news", "articles", "posts"]);
  const news = items
    .filter(isRecord)
    .map((item, index) => ({
      title: readText(item, ["title", "headline", "name"]) || fallback[index]?.title,
      content:
        readText(item, ["content", "description", "summary", "text"]) ||
        fallback[index]?.content,
      image:
        normalizeUrl(readText(item, ["image", "imageUrl", "thumbnail"])) ||
        fallback[index]?.image,
      publishDate:
        readText(item, ["publishDate", "date", "publishedAt", "created"]) ||
        fallback[index]?.publishDate,
    }))
    .filter(
      (item): item is LandNews =>
        Boolean(item.title && item.content && item.image && item.publishDate)
    );

  return news.length ? news : fallback;
}

function normalizeContact(payload: unknown, fallback: LandContact): LandContact {
  const record = extractRecord(payload, ["contact"]);

  if (!record) {
    return fallback;
  }

  return {
    phone: readText(record, ["phone", "tel", "hotline"]) || fallback.phone,
    email: readText(record, ["email", "mail"]) || fallback.email,
    address: readText(record, ["address", "location"]) || fallback.address,
  };
}

function normalizeLanding(payload: unknown): LandLandingContent | null {
  if (!isRecord(payload)) {
    return null;
  }

  return {
    source: "opencms",
    banner: normalizeBanner(payload, fallbackLandContent.banner),
    services: normalizeServices(payload, fallbackLandContent.services),
    projects: normalizeProjects(payload, fallbackLandContent.projects),
    news: normalizeNews(payload, fallbackLandContent.news),
    contact: normalizeContact(payload, fallbackLandContent.contact),
  };
}

export async function getLandLandingContent(): Promise<LandLandingContent> {
  if (OPENCMS_LANDING_PATH) {
    try {
      const payload = await fetchOpenCmsJson(OPENCMS_LANDING_PATH);
      const landing = payload ? normalizeLanding(payload) : null;

      if (landing) {
        return landing;
      }
    } catch {
      return fallbackLandContent;
    }
  }

  const [banner, services, projects, news, contact] = await Promise.all([
    fetchSegment(CONTENT_PATHS.banner, fallbackLandContent.banner, normalizeBanner),
    fetchSegment(
      CONTENT_PATHS.services,
      fallbackLandContent.services,
      normalizeServices
    ),
    fetchSegment(
      CONTENT_PATHS.projects,
      fallbackLandContent.projects,
      normalizeProjects
    ),
    fetchSegment(CONTENT_PATHS.news, fallbackLandContent.news, normalizeNews),
    fetchSegment(
      CONTENT_PATHS.contact,
      fallbackLandContent.contact,
      normalizeContact
    ),
  ]);

  const hasOpenCmsData = [banner, services, projects, news, contact].some(
    (segment) => segment.loaded
  );

  return {
    source: hasOpenCmsData ? "opencms" : "fallback",
    banner: banner.data,
    services: services.data,
    projects: projects.data,
    news: news.data,
    contact: contact.data,
  };
}
