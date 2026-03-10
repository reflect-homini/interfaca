import { Link } from "@tanstack/react-router";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center auth-gradient-bg">
      <div className="glass-panel p-12 text-center space-y-4 slide-up">
        <h1 className="text-6xl font-bold font-display text-primary">404</h1>
        <p className="text-lg text-muted-foreground">Page not found</p>
        <Link to="/login" className="btn-primary inline-block">
          Go home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
