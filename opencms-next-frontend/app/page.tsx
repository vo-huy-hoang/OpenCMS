import {
  getOpenCmsStatusConfig,
  probeOpenCmsPath,
  type OpenCmsProbe,
} from "@/lib/opencms";

type EndpointCard = {
  title: string;
  description: string;
  href: string;
  probe: OpenCmsProbe;
  action: string;
};

const navItems = ["Status", "Workplace", "Content", "Setup"];

function absoluteUrl(baseUrl: string | undefined, path: string) {
  return baseUrl ? `${baseUrl}${path}` : path;
}

function getProbeLabel(probe: OpenCmsProbe) {
  if (probe.error) {
    return "Offline";
  }

  if (probe.status === 404) {
    return "Missing";
  }

  if (probe.status && probe.status >= 300 && probe.status < 400) {
    return "Redirect";
  }

  if (probe.ok) {
    return "Ready";
  }

  return "Issue";
}

function getProbeClasses(probe: OpenCmsProbe) {
  if (probe.error) {
    return {
      card: "border-rose-200 bg-rose-50",
      badge: "bg-rose-100 text-rose-800",
      dot: "bg-rose-500",
    };
  }

  if (probe.status === 404) {
    return {
      card: "border-amber-200 bg-amber-50",
      badge: "bg-amber-100 text-amber-800",
      dot: "bg-amber-500",
    };
  }

  if (probe.status && probe.status >= 300 && probe.status < 400) {
    return {
      card: "border-cyan-200 bg-cyan-50",
      badge: "bg-cyan-100 text-cyan-800",
      dot: "bg-cyan-500",
    };
  }

  if (probe.ok) {
    return {
      card: "border-emerald-200 bg-emerald-50",
      badge: "bg-emerald-100 text-emerald-800",
      dot: "bg-emerald-500",
    };
  }

  return {
    card: "border-slate-200 bg-white",
    badge: "bg-slate-100 text-slate-700",
    dot: "bg-slate-400",
  };
}

function getOverallStatus(cards: EndpointCard[]) {
  const adminReady = cards.some(
    (card) => card.title === "Admin login" && card.probe.ok
  );
  const hardDown = cards.every((card) => !card.probe.ok);
  const missingContent = cards.some((card) => card.probe.status === 404);

  if (hardDown) {
    return {
      label: "OpenCms chưa sẵn sàng",
      detail: "Không endpoint nào phản hồi thành công từ cấu hình hiện tại.",
      tone: "bg-rose-500",
    };
  }

  if (adminReady && missingContent) {
    return {
      label: "OpenCms đã chạy, nội dung site cần cấu hình",
      detail:
        "Workplace/login đã sẵn sàng. Site root hoặc headless endpoint vẫn đang 404.",
      tone: "bg-amber-500",
    };
  }

  return {
    label: "OpenCms đang vận hành",
    detail: "Các endpoint chính phản hồi từ Docker trên host hiện tại.",
    tone: "bg-emerald-500",
  };
}

export default async function HomePage() {
  const config = getOpenCmsStatusConfig();
  const [siteProbe, workplaceProbe, adminProbe, headlessProbe] =
    await Promise.all([
      probeOpenCmsPath(config.sitePath),
      probeOpenCmsPath(config.workplacePath),
      probeOpenCmsPath(config.adminPath),
      probeOpenCmsPath(config.headlessPath),
    ]);

  const cards: EndpointCard[] = [
    {
      title: "Admin login",
      description: "Đường dẫn đăng nhập đúng của OpenCms sau khi setup xong.",
      href: absoluteUrl(config.baseUrl, config.adminPath),
      probe: adminProbe,
      action: "Mở login",
    },
    {
      title: "Workplace",
      description: "Khu vực quản trị, thường redirect về trang login.",
      href: absoluteUrl(config.baseUrl, config.workplacePath),
      probe: workplaceProbe,
      action: "Mở workplace",
    },
    {
      title: "Site root",
      description: "Trang public root. Hiện có thể 404 nếu chưa publish content.",
      href: absoluteUrl(config.baseUrl, config.sitePath),
      probe: siteProbe,
      action: "Mở site",
    },
    {
      title: "Headless endpoint",
      description: "Endpoint thử nghiệm cho frontend Next.js đọc dữ liệu.",
      href: absoluteUrl(config.baseUrl, config.headlessPath),
      probe: headlessProbe,
      action: "Mở endpoint",
    },
  ];
  const overall = getOverallStatus(cards);
  const readyCount = cards.filter((card) => card.probe.ok).length;

  return (
    <main className="opencms-console min-h-screen text-slate-950">
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-slate-950 text-sm font-black text-white">
              OC
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-950">
                OpenCms Control Center
              </p>
              <p className="break-all text-xs text-slate-500">
                {config.baseUrl ?? "Chưa cấu hình OPENCMS_BASE_URL"}
              </p>
            </div>
          </div>

          <nav
            aria-label="Dashboard"
            className="flex gap-1 overflow-x-auto rounded-md bg-slate-100 p-1"
          >
            {navItems.map((item, index) => (
              <a
                className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ${
                  index === 0
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-600 hover:text-slate-950"
                }`}
                href={index === 0 ? "#" : `#${item.toLowerCase()}`}
                key={item}
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_360px]">
          <div className="relative overflow-hidden rounded-lg bg-slate-950 p-6 text-white shadow-sm sm:p-8">
            <div className="console-grid" />
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm text-slate-200 ring-1 ring-white/10">
                <span className={`h-2.5 w-2.5 rounded-full ${overall.tone}`} />
                Docker port 8082 mapped to OpenCms 8080
              </div>
              <h1 className="mt-5 text-4xl font-semibold text-white sm:text-5xl">
                {overall.label}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
                {overall.detail} Frontend này theo dõi đúng các URL thật sau khi
                bạn đổi port và tắt setup wizard.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  className="inline-flex h-11 items-center justify-center rounded-md bg-cyan-300 px-4 text-sm font-bold text-slate-950 transition hover:bg-cyan-200"
                  href={absoluteUrl(config.baseUrl, config.adminPath)}
                  rel="noreferrer"
                  target="_blank"
                >
                  Mở OpenCms login
                </a>
                <a
                  className="inline-flex h-11 items-center justify-center rounded-md bg-white/10 px-4 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/15"
                  href="/news"
                >
                  Xem trang tin tức
                </a>
              </div>
            </div>
          </div>

          <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Tổng quan phiên hiện tại
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-md bg-slate-100 p-4">
                <p className="text-xs font-medium text-slate-500">Ready</p>
                <p className="mt-2 text-3xl font-semibold text-slate-950">
                  {readyCount}/4
                </p>
              </div>
              <div className="rounded-md bg-slate-100 p-4">
                <p className="text-xs font-medium text-slate-500">Port</p>
                <p className="mt-2 font-mono text-3xl font-semibold text-slate-950">
                  8082
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-md border border-slate-200 p-4">
              <p className="text-xs font-medium text-slate-500">
                Login path đúng
              </p>
              <p className="mt-2 break-all font-mono text-sm text-slate-800">
                {config.adminPath}
              </p>
            </div>
          </aside>
        </section>

        <section
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
          id="workplace"
        >
          {cards.map((card) => {
            const classes = getProbeClasses(card.probe);

            return (
              <article
                className={`rounded-lg border p-5 shadow-sm ${classes.card}`}
                key={card.title}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-950">
                      {card.title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {card.description}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-2 rounded-md px-2.5 py-1 text-xs font-bold ${classes.badge}`}
                  >
                    <span className={`h-2 w-2 rounded-full ${classes.dot}`} />
                    {getProbeLabel(card.probe)}
                  </span>
                </div>

                <dl className="mt-5 grid gap-3 text-sm">
                  <div className="flex items-center justify-between gap-4 border-t border-black/5 pt-3">
                    <dt className="text-slate-500">HTTP</dt>
                    <dd className="font-mono font-semibold text-slate-900">
                      {card.probe.status ?? "ERR"}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-slate-500">Latency</dt>
                    <dd className="font-mono font-semibold text-slate-900">
                      {card.probe.durationMs}ms
                    </dd>
                  </div>
                </dl>

                {card.probe.redirectedTo && (
                  <p className="mt-4 truncate rounded-md bg-white/70 px-3 py-2 font-mono text-xs text-slate-600 ring-1 ring-black/5">
                    {card.probe.redirectedTo}
                  </p>
                )}

                <a
                  className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
                  href={card.href}
                  rel="noreferrer"
                  target="_blank"
                >
                  {card.action}
                </a>
              </article>
            );
          })}
        </section>

        <section
          className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
          id="content"
        >
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm font-medium text-slate-500">Chẩn đoán</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
              Port đã đúng, nội dung public mới là phần cần xử lý tiếp.
            </h2>
            <div className="mt-5 space-y-4 text-sm leading-7 text-slate-700">
              <p>
                OpenCms đã trả lời trên `localhost:8082`, và trang login đúng
                nằm ở `/system/login/index.html`.
              </p>
              <p>
                Nếu `Site root` hoặc `Headless endpoint` còn báo Missing, nghĩa
                là server chạy rồi nhưng chưa có resource public tương ứng.
              </p>
            </div>
          </article>

          <article className="rounded-lg border border-slate-200 bg-slate-950 p-5 text-white shadow-sm sm:p-6">
            <p className="text-sm font-semibold text-cyan-300">Next steps</p>
            <ol className="mt-5 grid gap-3">
              {[
                "Đăng nhập OpenCms bằng URL login đúng.",
                "Kiểm tra demo content hoặc publish site root nếu cần trang public.",
                "Tạo hoặc đổi endpoint headless rồi cập nhật OPENCMS_NEWS_PATH trong .env.local.",
              ].map((item, index) => (
                <li className="flex gap-3 rounded-md bg-white/8 p-3" key={item}>
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-cyan-300 text-sm font-bold text-slate-950">
                    {index + 1}
                  </span>
                  <span className="text-sm leading-6 text-slate-200">
                    {item}
                  </span>
                </li>
              ))}
            </ol>
          </article>
        </section>
      </div>
    </main>
  );
}
