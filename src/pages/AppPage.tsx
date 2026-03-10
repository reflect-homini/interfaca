import { useAuth } from "@/auth/AuthProvider";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export default function AppPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => navigate({ to: "/login" }),
    onError: () => {
      toast.error("Unexpected error occurred");
      navigate({ to: "/login" });
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center auth-gradient-bg">
      <div className="glass-panel p-12 text-center space-y-6 slide-up max-w-md w-full">
        <h2 className="text-2xl font-bold font-display text-primary tracking-tight">
          Reflect<span className="text-foreground">AI</span>
        </h2>
        <h1 className="text-xl font-display text-foreground">Welcome back. You are logged in.</h1>
        {user && (
          <p className="text-sm text-muted-foreground">{user.email}</p>
        )}
        <button
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
          className="btn-primary inline-flex items-center gap-2"
        >
          {logoutMutation.isPending ? (
            <><span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" /> Signing out</>
          ) : "Sign out"}
        </button>
      </div>
    </div>
  );
}
