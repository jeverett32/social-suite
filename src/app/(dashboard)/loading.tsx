export default function DashboardLoading() {
  return (
    <div className="space-y-4">
      <div className="h-6 w-40 bg-border rounded" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 bg-panel border border-border rounded-lg" />
        ))}
      </div>
      <div className="h-64 bg-panel border border-border rounded-lg" />
    </div>
  );
}
