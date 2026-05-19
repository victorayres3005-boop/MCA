export default function Loading() {
  return (
    <div className="flex flex-col h-full">
      {/* Header skeleton */}
      <div
        className="shrink-0 h-[60px] px-7 flex items-center gap-3"
        style={{
          background: "linear-gradient(110deg, #0D2B45 0%, #0D2B45 50%, #0A7B72 80%, #00B4A6 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div className="w-7 h-7 rounded-lg bg-white/10 animate-pulse" />
        <div className="space-y-1.5">
          <div className="h-2 w-16 rounded bg-white/15 animate-pulse" />
          <div className="h-3.5 w-32 rounded bg-white/20 animate-pulse" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-[#F5F7FA] p-6 space-y-5">
        {/* KPI cards skeleton */}
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#E9EBF0] p-5 space-y-3">
              <div className="h-3 w-28 rounded bg-[#E9EBF0] animate-pulse" />
              <div className="h-7 w-16 rounded bg-[#E9EBF0] animate-pulse" />
              <div className="h-2.5 w-24 rounded bg-[#E9EBF0] animate-pulse" />
            </div>
          ))}
        </div>

        {/* Table skeleton */}
        <div className="bg-white rounded-2xl border border-[#E9EBF0] overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[#E9EBF0] flex items-center justify-between">
            <div className="h-3.5 w-20 rounded bg-[#E9EBF0] animate-pulse" />
            <div className="h-7 w-24 rounded-lg bg-[#E9EBF0] animate-pulse" />
          </div>
          <div className="divide-y divide-[#F0F2F5]">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="px-5 py-3.5 flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#E9EBF0] animate-pulse shrink-0" />
                <div className="h-3 w-20 rounded bg-[#E9EBF0] animate-pulse" />
                <div className="h-3 flex-1 rounded bg-[#E9EBF0] animate-pulse" />
                <div className="h-3 w-16 rounded bg-[#E9EBF0] animate-pulse" />
                <div className="h-5 w-20 rounded-full bg-[#E9EBF0] animate-pulse" />
                <div className="h-3 w-12 rounded bg-[#E9EBF0] animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
