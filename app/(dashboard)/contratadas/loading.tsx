export default function Loading() {
  return (
    <div className="flex flex-col h-full">
      <div
        className="shrink-0 h-[60px] px-7 flex items-center gap-3"
        style={{
          background: "linear-gradient(110deg, #0D2B45 0%, #0D2B45 50%, #0A7B72 80%, #00B4A6 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div className="w-7 h-7 rounded-lg bg-white/10 animate-pulse" />
        <div className="space-y-1.5">
          <div className="h-2 w-12 rounded bg-white/15 animate-pulse" />
          <div className="h-3.5 w-28 rounded bg-white/20 animate-pulse" />
        </div>
      </div>

      <div className="flex-1 bg-[#F5F7FA] p-6">
        <div className="bg-white rounded-2xl border border-[#E9EBF0] overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[#E9EBF0]">
            <div className="h-3 w-20 rounded bg-[#E9EBF0] animate-pulse" />
          </div>
          <div className="divide-y divide-[#F0F2F5]">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="px-5 py-3.5 flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[#E9EBF0] animate-pulse shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-40 rounded bg-[#E9EBF0] animate-pulse" />
                  <div className="h-2.5 w-28 rounded bg-[#E9EBF0] animate-pulse" />
                </div>
                <div className="h-3 w-16 rounded bg-[#E9EBF0] animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
