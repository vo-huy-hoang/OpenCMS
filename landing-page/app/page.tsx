import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { getLandLandingContent, getOpenCmsContentConfig } from "@/lib/opencms";

const navItems = [
  { label: "Dịch vụ", href: "#services" },
  { label: "Dự án", href: "#projects" },
  { label: "Thị trường", href: "#news" },
  { label: "Liên hệ", href: "#contact" },
];

function imageStyle(url: string): CSSProperties {
  return {
    backgroundImage: `linear-gradient(180deg, rgba(15, 23, 42, 0.08), rgba(15, 23, 42, 0.28)), url("${url}")`,
  };
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export async function generateMetadata(): Promise<Metadata> {
  const content = await getLandLandingContent();

  return {
    title: `${content.banner.title} | Đất nền & đầu tư`,
    description: content.banner.subtitle,
    openGraph: {
      title: content.banner.title,
      description: content.banner.subtitle,
      images: [{ url: content.banner.image }],
      type: "website",
    },
  };
}

export default async function Home() {
  const content = await getLandLandingContent();
  const openCmsConfig = getOpenCmsContentConfig();
  const { banner, services, projects, news, contact } = content;
  const endpointRows = [
    ["Banner", openCmsConfig.contentPaths.banner],
    ["Service", openCmsConfig.contentPaths.services],
    ["Project", openCmsConfig.contentPaths.projects],
    ["News", openCmsConfig.contentPaths.news],
    ["Contact", openCmsConfig.contentPaths.contact],
  ];

  return (
    <main className="min-h-screen bg-[#f7f4ee] text-[#17201b]">
      <header className="fixed inset-x-0 top-0 z-30 border-b border-white/15 bg-[#14231d]/80 text-white backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <a className="text-base font-semibold" href="#">
            {banner.title}
          </a>
          <nav
            aria-label="Điều hướng chính"
            className="hidden items-center gap-1 rounded-md bg-white/10 p-1 md:flex"
          >
            {navItems.map((item) => (
              <a
                className="rounded-md px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/12 hover:text-white"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <a
            className="inline-flex h-10 items-center justify-center rounded-md bg-[#f2c14e] px-4 text-sm font-bold text-[#17201b] transition hover:bg-[#ffd66e]"
            href={banner.buttonHref}
          >
            {banner.buttonLabel}
          </a>
        </div>
      </header>

      <section
        className="relative flex min-h-[92svh] items-end overflow-hidden bg-cover bg-center px-5 pb-16 pt-28 text-white sm:px-8 lg:pb-20"
        style={imageStyle(banner.image)}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f1f19]/88 via-[#0f1f19]/54 to-transparent" />
        <div className="relative mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(280px,0.45fr)] lg:items-end">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#f2c14e]">
              Pháp lý rõ ràng, vị trí tăng trưởng
            </p>
            <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[1.02] text-white sm:text-7xl">
              {banner.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/82 sm:text-xl sm:leading-9">
              {banner.subtitle}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                className="inline-flex h-12 items-center justify-center rounded-md bg-[#f2c14e] px-6 text-sm font-bold text-[#17201b] transition hover:bg-[#ffd66e]"
                href={banner.buttonHref}
              >
                {banner.buttonLabel}
              </a>
              <a
                className="inline-flex h-12 items-center justify-center rounded-md border border-white/30 px-6 text-sm font-semibold text-white transition hover:bg-white/12"
                href="#services"
              >
                Xem dịch vụ
              </a>
            </div>
          </div>

          <aside className="grid gap-3 rounded-lg border border-white/16 bg-white/10 p-4 backdrop-blur-sm">
            {services.slice(0, 3).map((service) => (
              <div
                className="grid grid-cols-[3.25rem_1fr] gap-3 rounded-md bg-white/12 p-3"
                key={service.name}
              >
                <span className="grid h-13 w-13 place-items-center rounded-md bg-[#7bb796] text-xs font-black uppercase text-[#102018]">
                  {service.icon.slice(0, 4)}
                </span>
                <div>
                  <p className="font-semibold text-white">{service.name}</p>
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-white/72">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </aside>
        </div>
      </section>

      <section className="border-b border-[#d9d2c4] bg-[#f7f4ee] px-5 py-6 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 text-sm text-[#425149] sm:grid-cols-3">
          <p>
            <span className="font-bold text-[#17201b]">Tư vấn:</span> 08:00 -
            20:00 mỗi ngày
          </p>
          <p>
            <span className="font-bold text-[#17201b]">Địa chỉ:</span>{" "}
            {contact.address}
          </p>
          <p>
            <span className="font-bold text-[#17201b]">Hotline:</span>{" "}
            {contact.phone}
          </p>
        </div>
      </section>

      <section className="px-5 py-18 sm:px-8 lg:py-24" id="services">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#4e8f6a]">
              Service
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#17201b] sm:text-5xl">
              Dịch vụ bất động sản được cập nhật từ OpenCMS.
            </h2>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <article
                className="rounded-lg border border-[#ddd4c6] bg-white p-5 shadow-sm"
                key={service.name}
              >
                <span className="grid h-12 w-12 place-items-center rounded-md bg-[#e7f1e9] text-xs font-black uppercase text-[#2f6f4e]">
                  {service.icon.slice(0, 4)}
                </span>
                <h3 className="mt-5 text-xl font-semibold text-[#17201b]">
                  {service.name}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#5c655f]">
                  {service.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="bg-[#17201b] px-5 py-18 text-white sm:px-8 lg:py-24"
        id="projects"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.55fr_1fr] lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f2c14e]">
                Project
              </p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-5xl">
                Dự án đất nền nổi bật đang được giới thiệu.
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-white/70 lg:justify-self-end">
              Mỗi dự án được quản trị như content type Project trong OpenCMS,
              gồm vị trí, hình ảnh, mô tả, giá, diện tích và tình trạng pháp lý.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {projects.map((project) => (
              <article
                className="overflow-hidden rounded-lg border border-white/12 bg-white/8"
                key={project.name}
              >
                <div
                  className="aspect-[4/3] bg-cover bg-center"
                  style={imageStyle(project.image)}
                />
                <div className="p-5">
                  <p className="text-sm font-semibold text-[#9bd6b3]">
                    {project.customer}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold">{project.name}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/70">
                    {project.description}
                  </p>
                  <dl className="mt-5 grid gap-2 text-sm">
                    {[
                      ["Giá", project.price],
                      ["Diện tích", project.area],
                      ["Pháp lý", project.legalStatus],
                      ["Trạng thái", project.status],
                    ]
                      .filter(([, value]) => Boolean(value))
                      .map(([label, value]) => (
                        <div
                          className="flex items-center justify-between gap-4 border-t border-white/10 pt-2"
                          key={label}
                        >
                          <dt className="text-white/52">{label}</dt>
                          <dd className="text-right font-semibold text-white">
                            {value}
                          </dd>
                        </div>
                      ))}
                  </dl>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-18 sm:px-8 lg:py-24" id="news">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#b85042]">
                News
              </p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#17201b] sm:text-5xl">
                Tin tức thị trường và pháp lý nhà đất.
              </h2>
            </div>
            <div className="grid gap-4">
              {news.map((item) => (
                <article
                  className="grid gap-4 rounded-lg border border-[#ddd4c6] bg-white p-4 shadow-sm sm:grid-cols-[11rem_1fr]"
                  key={item.title}
                >
                  <div
                    className="aspect-[4/3] rounded-md bg-cover bg-center sm:aspect-auto"
                    style={imageStyle(item.image)}
                  />
                  <div>
                    <time className="text-sm font-semibold text-[#4e8f6a]">
                      {formatDate(item.publishDate)}
                    </time>
                    <h3 className="mt-2 text-xl font-semibold text-[#17201b]">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[#5c655f]">
                      {item.content}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        className="border-t border-[#d9d2c4] bg-[#eef5ef] px-5 py-18 sm:px-8 lg:py-24"
        id="contact"
      >
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#4e8f6a]">
              Contact
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#17201b] sm:text-5xl">
              Liên hệ đội ngũ tư vấn để nhận bảng giá và lịch xem đất.
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <a
              className="rounded-lg bg-white p-5 text-[#17201b] shadow-sm ring-1 ring-[#d4dfd4]"
              href={`tel:${contact.phone.replaceAll(" ", "")}`}
            >
              <p className="text-sm font-bold text-[#4e8f6a]">Điện thoại</p>
              <p className="mt-3 break-words text-lg font-semibold">
                {contact.phone}
              </p>
            </a>
            <a
              className="rounded-lg bg-white p-5 text-[#17201b] shadow-sm ring-1 ring-[#d4dfd4]"
              href={`mailto:${contact.email}`}
            >
              <p className="text-sm font-bold text-[#4e8f6a]">Email</p>
              <p className="mt-3 break-words text-lg font-semibold">
                {contact.email}
              </p>
            </a>
            <div className="rounded-lg bg-white p-5 text-[#17201b] shadow-sm ring-1 ring-[#d4dfd4]">
              <p className="text-sm font-bold text-[#4e8f6a]">Địa chỉ</p>
              <p className="mt-3 text-lg font-semibold leading-7">
                {contact.address}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
