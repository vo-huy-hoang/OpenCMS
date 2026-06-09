export default function Loading() {
  return (
    <main className="opencms-console min-h-screen text-slate-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="h-20 animate-pulse rounded-lg bg-white shadow-sm" />
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_360px]">
          <div className="h-80 animate-pulse rounded-lg bg-slate-950 shadow-sm" />
          <div className="h-80 animate-pulse rounded-lg bg-white shadow-sm" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="h-64 animate-pulse rounded-lg bg-white shadow-sm" />
          <div className="h-64 animate-pulse rounded-lg bg-white shadow-sm" />
          <div className="h-64 animate-pulse rounded-lg bg-white shadow-sm" />
          <div className="h-64 animate-pulse rounded-lg bg-white shadow-sm" />
        </div>
      </div>
    </main>
  );
}
