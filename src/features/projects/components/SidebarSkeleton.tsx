export function SidebarSkeleton() {
  return (
    <div className="space-y-2 px-3 py-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-9 skeleton-shimmer rounded-md" />
      ))}
    </div>
  );
}
