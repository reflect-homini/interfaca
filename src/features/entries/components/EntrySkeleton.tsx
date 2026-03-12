export function EntrySkeleton() {
  return (
    <div className="flex flex-col gap-4 p-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="glass-panel px-5 py-4 space-y-2">
          <div
            className="skeleton-shimmer rounded h-4"
            style={{ width: `${60 + Math.random() * 30}%` }}
          />
          <div
            className="skeleton-shimmer rounded h-4"
            style={{ width: `${40 + Math.random() * 40}%` }}
          />
          {i % 2 === 0 && (
            <div
              className="skeleton-shimmer rounded h-4"
              style={{ width: `${30 + Math.random() * 20}%` }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
