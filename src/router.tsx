import { lazy, Suspense } from "react";
import {
  createRouter,
  createRoute,
  createRootRoute,
  redirect,
  Outlet,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/auth/AuthProvider";
import { tokenStorage } from "@/auth/tokenStorage";
import { AuthSkeleton, ProcessingSkeleton } from "@/components/AuthSkeleton";

const LoginPage = lazy(() => import("@/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/RegisterPage"));
const VerifyRegistrationPage = lazy(() => import("@/pages/VerifyRegistrationPage"));
const OAuthCallbackPage = lazy(() => import("@/pages/OAuthCallbackPage"));
const PasswordResetPage = lazy(() => import("@/pages/PasswordResetPage"));
const ResetPasswordPage = lazy(() => import("@/pages/ResetPasswordPage"));
const AppPage = lazy(() => import("@/pages/AppPage"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// Root route
const rootRoute = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Sonner />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  ),
});

// Auth guard helper
function requireAuth() {
  if (!tokenStorage.hasTokens()) {
    throw redirect({ to: "/login" });
  }
}

function requireGuest() {
  if (tokenStorage.hasTokens()) {
    throw redirect({ to: "/app" });
  }
}

// Routes
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  beforeLoad: requireGuest,
  component: () => (
    <Suspense fallback={<AuthSkeleton />}>
      <LoginPage />
    </Suspense>
  ),
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  beforeLoad: requireGuest,
  component: () => (
    <Suspense fallback={<AuthSkeleton />}>
      <RegisterPage />
    </Suspense>
  ),
});

const verifyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/verify-registration",
  component: () => (
    <Suspense fallback={<ProcessingSkeleton message="Loading" />}>
      <VerifyRegistrationPage />
    </Suspense>
  ),
});

const oauthCallbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/oauth/callback",
  component: () => (
    <Suspense fallback={<ProcessingSkeleton message="Authenticating" />}>
      <OAuthCallbackPage />
    </Suspense>
  ),
});

const passwordResetRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/password-reset",
  component: () => (
    <Suspense fallback={<AuthSkeleton />}>
      <PasswordResetPage />
    </Suspense>
  ),
});

const resetPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reset-password",
  component: () => (
    <Suspense fallback={<AuthSkeleton />}>
      <ResetPasswordPage />
    </Suspense>
  ),
});

const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/app",
  beforeLoad: requireAuth,
  component: () => (
    <Suspense fallback={<ProcessingSkeleton message="Loading" />}>
      <AppPage />
    </Suspense>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/login" });
  },
});

const catchAllRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "$",
  component: () => (
    <Suspense fallback={null}>
      <NotFound />
    </Suspense>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  verifyRoute,
  oauthCallbackRoute,
  passwordResetRoute,
  resetPasswordRoute,
  appRoute,
  catchAllRoute,
]);

const queryClient = new QueryClient();

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
