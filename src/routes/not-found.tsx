import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen flex items-center justify-center py-12">
      <Container>
        <div className="flex flex-col items-center justify-center text-center space-y-8 max-w-2xl mx-auto">
          {/* 404 Number */}
          <div className="relative">
            <h1 className="text-9xl md:text-[12rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 via-sky-400 to-purple-400 opacity-20 select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl md:text-8xl animate-bounce">🔍</div>
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">
              Page Not Found
            </h2>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              size="lg"
              onClick={() => navigate(-1)}
              variant="outline"
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
            <Link to="/">
              <Button size="lg" className="gap-2">
                <Home className="w-4 h-4" />
                Go Home
              </Button>
            </Link>
          </div>

          {/* Fun Message */}
          <div className="pt-8">
            <p className="text-sm text-muted-foreground italic">
              "Not all who wander are lost, but in this case, you might be." —
              J.R.R. Tolkien (probably)
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default NotFound;
