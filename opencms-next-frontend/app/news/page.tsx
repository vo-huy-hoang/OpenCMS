import Link from "next/link";
import {
  fetchOpenCmsNews,
  getOpenCmsStatusConfig,
  probeOpenCmsPath,
  type NewsItem,
} from "@/lib/opencms";

type NewsState =
  | {
      ok: true;
      items: NewsItem[];
      error: "";
    }
  | {
      ok: false;
      items: [];
      error: string;
    };

function formatDate(date: string | null) {
  if (!date) {
    return "Chưa có ngày";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsed);
}

export default async function NewsPage() {
  const config = getOpenCmsStatusConfig();
  const endpointProbe = await probeOpenCmsPath(config.headlessPath);
  let newsState: NewsState;

  try {
    const items = await fetchOpenCmsNews(config.headlessPath);
    newsState = {
      ok: true,
      items,
      error: "",
    };
  } catch (err) {
    newsState = {
      ok: false,
      items: [],
      error: err instanceof Error ? err.message : "Không đọc được tin tức.",
    };
  }

  return (
    <main className="opencms-console min-h-screen text-slate-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              className="text-sm font-semibold text-cyan-700 hover:text-cyan-900"
              href="/"
            >
              Dashboard
            </Link>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">
              Danh sách tin tức
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Trang này đọc dữ liệu server-side từ OpenCms qua endpoint cấu hình
              trong `OPENCMS_NEWS_PATH`.
            </p>
          </div>

          <div className="rounded-md bg-slate-100 p-4">
            <p className="text-xs font-medium text-slate-500">Endpoint</p>
            <p className="mt-2 break-all font-mono text-sm text-slate-900">
              {config.headlessPath}
            </p>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">HTTP status</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">
              {endpointProbe.status ?? "ERR"}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Số tin đọc được</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">
              {newsState.items.length}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Latency</p>
            <p className="mt-2 font-mono text-3xl font-semibold text-slate-950">
              {endpointProbe.durationMs}ms
            </p>
          </div>
        </section>

        {!newsState.ok && (
          <section className="rounded-lg border border-amber-200 bg-amber-50 p-5 shadow-sm">
            <p className="text-sm font-semibold text-amber-800">
              Chưa đọc được endpoint tin tức
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
              Frontend đã sẵn sàng, nhưng OpenCms chưa có JSON tin tức tại path này.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-700">
              {newsState.error}
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-700">
              Hãy tạo/publish endpoint tin tức trong OpenCms, hoặc đổi
              `OPENCMS_NEWS_PATH` trong `.env.local` sang endpoint JSON thật.
            </p>
          </section>
        )}

        {newsState.ok && newsState.items.length === 0 && (
          <section className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-950">
              Endpoint trả về JSON nhưng chưa có item tin tức.
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Hãy kiểm tra cấu trúc JSON trong OpenCms. Frontend đang hỗ trợ các
              mảng phổ biến như `items`, `results`, `articles`, `news`, `data`.
            </p>
          </section>
        )}

        {newsState.items.length > 0 && (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {newsState.items.map((item) => (
              <article
                className="flex min-h-64 flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                key={item.id}
              >
                <p className="text-sm font-medium text-slate-500">
                  {formatDate(item.date)}
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-950">
                  {item.title}
                </h2>
                <p className="mt-4 line-clamp-4 text-sm leading-7 text-slate-600">
                  {item.summary || "Tin này chưa có mô tả ngắn."}
                </p>
                <a
                  className="mt-auto inline-flex h-10 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
                  href={item.href}
                  rel="noreferrer"
                  target="_blank"
                >
                  Đọc trong OpenCms
                </a>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
