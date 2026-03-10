export function AuthSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center auth-gradient-bg">
      <div className="glass-panel p-8 w-full max-w-md space-y-6">
        <div className="space-y-2">
          <div className="h-8 w-48 skeleton-shimmer rounded-lg mx-auto" />
          <div className="h-4 w-64 skeleton-shimmer rounded mx-auto" />
        </div>
        <div className="space-y-4">
          <div className="h-12 skeleton-shimmer rounded-lg" />
          <div className="h-12 skeleton-shimmer rounded-lg" />
          <div className="h-12 skeleton-shimmer rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function ProcessingSkeleton({ message = "Processing" }: { message?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center auth-gradient-bg">
      <div className="glass-panel p-12 text-center space-y-6 fade-in">
        <div className="w-16 h-16 mx-auto rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-lg text-foreground font-display">
          {message}<span className="loading-dots" />
        </p>
      </div>
    </div>
  );
}
