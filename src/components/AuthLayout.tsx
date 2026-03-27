import { type ReactNode } from "react";
import { Link } from "@tanstack/react-router";

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: Readonly<AuthLayoutProps>) {
  return (
    <div className="flex min-h-dvh items-center justify-center auth-gradient-bg p-4">
      <div className="glass-panel p-8 w-full max-w-md slide-up">
        <div className="text-center mb-8">
          <Link to="/login" className="inline-block mb-4">
            <h2 className="text-2xl font-bold font-display text-primary tracking-tight">
              Reflect<span className="text-foreground">AI</span>
            </h2>
          </Link>
          <h1 className="text-xl font-semibold font-display text-foreground">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {children}
        {footer && (
          <div className="mt-6 text-center text-sm text-muted-foreground">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
