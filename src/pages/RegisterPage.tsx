import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { registerSchema } from "@/schemas/auth";
import { registerApi } from "@/api/auth";
import { AuthLayout } from "@/components/AuthLayout";
import { ApiError } from "@/api/client";
import { useState } from "react";

export default function RegisterPage() {
  const [success, setSuccess] = useState(false);

  const mutation = useMutation({
    mutationFn: registerApi,
    onSuccess: () => setSuccess(true),
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
    defaultValues: { email: "", password: "", passwordConfirmation: "" },
    onSubmit: async ({ value }) => {
      const result = registerSchema.safeParse(value);
      if (!result.success) {
        result.error.errors.forEach((e) => toast.error(e.message));
        return;
      }
      mutation.mutate(result.data);
    },
  });

  if (success) {
    return (
      <AuthLayout title="Check your email" subtitle="We've sent you a verification link">
        <div className="text-center space-y-4 fade-in">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center pulse-glow">
            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-muted-foreground text-sm">
            Registration successful. Please check your email to verify your account.
          </p>
          <Link to="/login" className="text-primary hover:underline text-sm inline-block">
            Back to sign in
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start your AI-powered reflection journey"
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">Sign in</Link>
        </>
      }
    >
      <form
        onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }}
        className="space-y-4"
      >
        <form.Field name="email">
          {(field) => (
            <div className="space-y-1">
              <label htmlFor="reg-email" className="text-sm font-medium text-foreground">Email</label>
              <input id="reg-email" type="email" autoComplete="email" className="glow-input w-full" placeholder="you@example.com"
                value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} onBlur={field.handleBlur} />
            </div>
          )}
        </form.Field>

        <form.Field name="password">
          {(field) => (
            <div className="space-y-1">
              <label htmlFor="reg-password" className="text-sm font-medium text-foreground">Password</label>
              <input id="reg-password" type="password" autoComplete="new-password" className="glow-input w-full" placeholder="••••••••"
                value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} onBlur={field.handleBlur} />
            </div>
          )}
        </form.Field>

        <form.Field name="passwordConfirmation">
          {(field) => (
            <div className="space-y-1">
              <label htmlFor="reg-confirm" className="text-sm font-medium text-foreground">Confirm password</label>
              <input id="reg-confirm" type="password" autoComplete="new-password" className="glow-input w-full" placeholder="••••••••"
                value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} onBlur={field.handleBlur} />
            </div>
          )}
        </form.Field>

        <button type="submit" disabled={mutation.isPending} className="btn-primary w-full flex items-center justify-center gap-2">
          {mutation.isPending ? (
            <><span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" /> Creating account</>
          ) : "Create account"}
        </button>
      </form>
    </AuthLayout>
  );
}
