import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { passwordResetRequestSchema } from "@/schemas/auth";
import { sendPasswordResetApi } from "@/api/auth";
import { useAuth } from "@/auth/AuthProvider";
import { AuthLayout } from "@/components/AuthLayout";
import { ApiError } from "@/api/client";
import { useState } from "react";

export default function PasswordResetPage() {
  const { user, isAuthenticated } = useAuth();
  const [submitted, setSubmitted] = useState(false);

  const mutation = useMutation({
    mutationFn: (email: string) => sendPasswordResetApi(email),
    onSuccess: () => setSubmitted(true),
    onError: (error) => {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        console.error(error);
        toast.error("Unexpected error occurred");
      }
    },
  });

  const form = useForm({
    defaultValues: { email: isAuthenticated && user ? user.email : "" },
    onSubmit: async ({ value }) => {
      if (isAuthenticated && user) {
        mutation.mutate(user.email);
        return;
      }
      const result = passwordResetRequestSchema.safeParse(value);
      if (!result.success) {
        result.error.errors.forEach((e) => toast.error(e.message));
        return;
      }
      mutation.mutate(result.data.email);
    },
  });

  if (submitted) {
    return (
      <AuthLayout title="Check your email">
        <div className="text-center space-y-4 fade-in">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center pulse-glow">
            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-muted-foreground text-sm">If an account exists, a reset link has been sent.</p>
          <Link to="/login" className="text-primary hover:underline text-sm inline-block">Back to sign in</Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle={isAuthenticated ? `We'll send a reset link to ${user?.email}` : "Enter your email to receive a reset link"}
      footer={<Link to="/login" className="text-primary hover:underline">Back to sign in</Link>}
    >
      <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }} className="space-y-4">
        {!isAuthenticated && (
          <form.Field name="email">
            {(field) => (
              <div className="space-y-1">
                <label htmlFor="reset-email" className="text-sm font-medium text-foreground">Email</label>
                <input id="reset-email" type="email" autoComplete="email" className="glow-input w-full" placeholder="you@example.com"
                  value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} onBlur={field.handleBlur} />
              </div>
            )}
          </form.Field>
        )}
        <button type="submit" disabled={mutation.isPending} className="btn-primary w-full flex items-center justify-center gap-2">
          {mutation.isPending ? (
            <><span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" /> Sending</>
          ) : "Send reset link"}
        </button>
      </form>
    </AuthLayout>
  );
}
