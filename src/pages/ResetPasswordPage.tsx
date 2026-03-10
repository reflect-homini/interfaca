import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useSearch, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { resetPasswordSchema } from "@/schemas/auth";
import { resetPasswordApi } from "@/api/auth";
import { AuthLayout } from "@/components/AuthLayout";
import { ApiError } from "@/api/client";

export default function ResetPasswordPage() {
  const { token } = useSearch({ strict: false }) as { token?: string };
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (values: { password: string; passwordConfirmation: string; token: string }) =>
      resetPasswordApi(values),
    onSuccess: () => {
      toast.success("Password reset successfully");
      navigate({ to: "/login" });
    },
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
    defaultValues: { password: "", passwordConfirmation: "" },
    onSubmit: async ({ value }) => {
      if (!token) {
        toast.error("Missing reset token");
        return;
      }
      const result = resetPasswordSchema.safeParse(value);
      if (!result.success) {
        result.error.errors.forEach((e) => toast.error(e.message));
        return;
      }
      mutation.mutate({ ...result.data, token });
    },
  });

  if (!token) {
    return (
      <AuthLayout title="Invalid link">
        <p className="text-center text-muted-foreground text-sm">This password reset link is invalid or expired.</p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Set new password" subtitle="Enter your new password below">
      <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }} className="space-y-4">
        <form.Field name="password">
          {(field) => (
            <div className="space-y-1">
              <label htmlFor="new-password" className="text-sm font-medium text-foreground">New password</label>
              <input id="new-password" type="password" autoComplete="new-password" className="glow-input w-full" placeholder="••••••••"
                value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} onBlur={field.handleBlur} />
            </div>
          )}
        </form.Field>

        <form.Field name="passwordConfirmation">
          {(field) => (
            <div className="space-y-1">
              <label htmlFor="confirm-new" className="text-sm font-medium text-foreground">Confirm new password</label>
              <input id="confirm-new" type="password" autoComplete="new-password" className="glow-input w-full" placeholder="••••••••"
                value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} onBlur={field.handleBlur} />
            </div>
          )}
        </form.Field>

        <button type="submit" disabled={mutation.isPending} className="btn-primary w-full flex items-center justify-center gap-2">
          {mutation.isPending ? (
            <><span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" /> Resetting</>
          ) : "Reset password"}
        </button>
      </form>
    </AuthLayout>
  );
}
