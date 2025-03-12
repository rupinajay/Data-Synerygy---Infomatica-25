
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="glass-card max-w-md w-full p-8 text-center rounded-2xl backdrop-blur-2xl border border-white/10">
        <h1 className="text-9xl font-bold mb-6 text-gradient bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">404</h1>
        <p className="text-xl text-muted-foreground mb-8">The page you're looking for can't be found.</p>
        <Button
          onClick={() => navigate("/")}
          size="lg"
          className="glass-button group transition-all duration-300"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:mr-3 transition-all" />
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
