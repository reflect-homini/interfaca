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
import { AuthProvider } from "@/auth/AuthProvider";
import { tokenStorage } from "@/auth/tokenStorage";
import { AuthSkeleton, ProcessingSkeleton } from "@/components/AuthSkeleton";
import { Analytics } from "@vercel/analytics/react";

const LoginPage = lazy(() => import("@/pages/LoginPage"));
const OAuthCallbackPage = lazy(() => import("@/pages/OAuthCallbackPage"));
const AppPage = lazy(() => import("@/pages/AppPage"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const ProjectsLayout = lazy(() => import("@/features/projects/pages/ProjectsLayout"));
const ProjectDetailsPage = lazy(() => import("@/features/projects/pages/ProjectDetailsPage"));

const queryClient = new QueryClient();

// Root route
const rootRoute = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Sonner />
        <AuthProvider>
          <Outlet />
          <Analytics />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  ),
});

// Auth guard helpers
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

const oauthCallbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth/$provider/callback",
  component: () => (
    <Suspense fallback={<ProcessingSkeleton message="Authenticating" />}>
      <OAuthCallbackPage />
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

const projectsLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/projects",
  beforeLoad: requireAuth,
  component: () => (
    <Suspense fallback={<ProcessingSkeleton message="Loading" />}>
      <ProjectsLayout />
    </Suspense>
  ),
});

const projectDetailRoute = createRoute({
  getParentRoute: () => projectsLayoutRoute,
  path: "/$projectId",
  component: () => (
    <Suspense fallback={<ProcessingSkeleton message="Loading" />}>
      <ProjectDetailsPage />
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
  oauthCallbackRoute,
  appRoute,
  projectsLayoutRoute.addChildren([projectDetailRoute]),
  catchAllRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
