import { useEffect, useState } from "react";
import { useSearch, useNavigate } from "@tanstack/react-router";
import { oauthCallbackApi } from "@/api/auth";
import { useAuth } from "@/auth/AuthProvider";
import { ProcessingSkeleton } from "@/components/AuthSkeleton";
import { AuthLayout } from "@/components/AuthLayout";
import { Link } from "@tanstack/react-router";

export default function OAuthCallbackPage() {
  const { code, state } = useSearch({ strict: false }) as { code?: string; state?: string };
  const navigate = useNavigate();
  const { refetchUser } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    if (!code || !state) {
      setError("Missing OAuth parameters");
      return;
    }
    oauthCallbackApi("google", code, state)
      .then(() => {
        refetchUser();
        navigate({ to: "/app" });
      })
      .catch((err) => {
        setError(err?.message || "OAuth authentication failed");
      });
  }, [code, state, navigate, refetchUser]);

  if (error) {
    return (
      <AuthLayout title="Authentication failed">
        <div className="text-center space-y-4 fade-in">
          <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-muted-foreground text-sm">{error}</p>
          <Link to="/login" className="text-primary hover:underline text-sm inline-block">Back to sign in</Link>
        </div>
      </AuthLayout>
    );
  }

  return <ProcessingSkeleton message="Completing sign in" />;
}
