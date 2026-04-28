export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 animate-pulse">
      {/* ヘッダースケルトン */}
      <div className="h-4 bg-[#E8D5C0] rounded w-48 mb-8" />

      {/* タイトルスケルトン */}
      <div className="h-8 bg-[#E8D5C0] rounded w-2/3 mb-4" />
      <div className="h-4 bg-[#F5E6D3] rounded w-1/3 mb-10" />

      {/* カードグリッドスケルトン */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl overflow-hidden border border-[#E8D5C0]">
            <div className="aspect-[16/9] bg-[#F5E6D3]" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-[#E8D5C0] rounded w-3/4" />
              <div className="h-3 bg-[#F5E6D3] rounded w-full" />
              <div className="h-3 bg-[#F5E6D3] rounded w-5/6" />
              <div className="flex gap-2 pt-1">
                <div className="h-5 bg-[#F5E6D3] rounded-full w-12" />
                <div className="h-5 bg-[#F5E6D3] rounded-full w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
