# Tong quan du an OpenCms Headless

## Muc tieu

Du an nay dung OpenCms lam CMS/backend noi dung va Next.js lam frontend rieng. OpenCms chay trong Docker, Next.js goi endpoint tu OpenCms de hien thi trang dashboard, trang tin tuc va theo doi trang thai cac duong dan quan trong.

## Cau truc thu muc

```text
opencms-headless-project/
├── docker-compose.yml
├── PROJECT.md
└── opencms-next-frontend/
    ├── app/
    │   ├── page.tsx
    │   ├── news/page.tsx
    │   ├── layout.tsx
    │   ├── loading.tsx
    │   └── globals.css
    ├── lib/opencms.ts
    ├── package.json
    └── README.md
```

## Thanh phan chinh

### OpenCms

OpenCms duoc khai bao trong `docker-compose.yml` voi image `alkacon/opencms-docker:latest`.

- Container: `opencms`
- Port public tren may: `8082`
- Port noi bo container: `8080`
- URL public: `http://localhost:8082`
- Database: MariaDB container `opencms-mariadb`

OpenCms hien da duoc import Mercury demo content va Mercury JSON demo content. Vi vay cac duong dan sau da co noi dung:

- `http://localhost:8082/`
- `http://localhost:8082/overview/`
- `http://localhost:8082/mercury-json/`
- `http://localhost:8082/mercury-json/headless-api/`
- `http://localhost:8082/system/login/index.html`

### Next.js frontend

Thu muc frontend nam tai `opencms-next-frontend`.

- Framework: Next.js 16
- React: 19
- TypeScript
- Tailwind CSS 4
- App Router

Frontend hien co cac trang:

- `/`: OpenCms Control Center, kiem tra trang thai cac endpoint OpenCms.
- `/news`: Trang danh sach tin tuc, server-side fetch du lieu tu OpenCms theo `OPENCMS_NEWS_PATH`.

File xu ly ket noi OpenCms:

- `opencms-next-frontend/lib/opencms.ts`

File nay chua cac ham:

- `getOpenCmsStatusConfig()`
- `probeOpenCmsPath()`
- `fetchOpenCmsJson()`
- `fetchOpenCmsHtml()`
- `fetchOpenCmsNews()`

## Bien moi truong

Trong `opencms-next-frontend/.env.local`, cau hinh can co:

```env
OPENCMS_BASE_URL=http://localhost:8082
OPENCMS_NEWS_PATH=/mercury-json/
```

Luu y: `OPENCMS_NEWS_PATH=/mercury-json/` hien dang tro den trang Mercury JSON demo overview. Duong dan nay khong con 404, nhung no khong nhat thiet la raw JSON tin tuc. Neu can trang `/news` doc du lieu tin tuc that, hay doi bien nay sang endpoint JSON that duoc tao/publish trong OpenCms.

## Cach chay du an

### 1. Chay OpenCms va MariaDB

Tu root du an:

```bash
docker compose up -d
```

Kiem tra container:

```bash
docker ps
```

OpenCms se nam o:

```text
http://localhost:8082/
```

Trang dang nhap:

```text
http://localhost:8082/system/login/index.html
```

### 2. Chay Next.js frontend

Tu thu muc frontend:

```bash
cd opencms-next-frontend
npm install
npm run dev
```

Mac dinh Next.js se chay tai:

```text
http://localhost:3000/
```

## Cac loi da xu ly

### `http://localhost:8082/` bi 404

Nguyen nhan: OpenCms chua co public home content trong site root.

Da xu ly:

- Import Mercury demo content.
- Publish content len Online project.
- Sau khi fix, `/` redirect den `/overview/`.
- Ket qua cuoi: `200 OK` sau redirect.

### `http://localhost:8082/mercury-json/` bi 404

Nguyen nhan: Chua import/publish Mercury JSON demo module.

Da xu ly:

- Import module `alkacon.mercury.template.jsondemo`.
- Publish folder `/mercury-json/`.
- Sau khi fix, `/mercury-json/` redirect den `/mercury-json/headless-api/`.
- Ket qua cuoi: `200 OK` sau redirect.

### Trang demo bi 500 sau khi het 404

Nguyen nhan: OpenCms bao thieu property `template` cho:

- `/overview/index.html`
- `/mercury-json/headless-api/index.html`

Da xu ly:

- Gan property `template` truc tiep cho hai file tren.
- Template duoc dung:

```text
/system/modules/alkacon.mercury.template/templates/mercury.jsp
```

- Publish lai hai file.
- Restart container `opencms` de reload cache OpenCms.

## Kiem tra nhanh

Kiem tra home OpenCms:

```bash
curl -s -L -o /dev/null -w '%{http_code} %{url_effective}\n' http://localhost:8082/
```

Ket qua mong doi:

```text
200 http://localhost:8082/overview/
```

Kiem tra Mercury JSON demo:

```bash
curl -s -L -o /dev/null -w '%{http_code} %{url_effective}\n' http://localhost:8082/mercury-json/
```

Ket qua mong doi:

```text
200 http://localhost:8082/mercury-json/headless-api/
```

Kiem tra frontend:

```bash
cd opencms-next-frontend
npm run lint
npm run build
```

## Huong phat trien tiep theo

- Tao endpoint JSON that trong OpenCms cho tin tuc.
- Cap nhat `OPENCMS_NEWS_PATH` de tro den endpoint JSON do.
- Hoan thien giao dien `/news` de hien thi title, summary, image, ngay dang va link chi tiet.
- Bo sung trang chi tiet tin tuc trong Next.js neu can SEO tot hon.
- Tach cac component dashboard thanh component rieng khi giao dien lon hon.
