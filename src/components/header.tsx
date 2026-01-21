import { cn } from "@/lib/utils";
import { useAuthContext } from "@/context/auth-context";
import { Container } from "./container";
import { LogoContainer } from "./logo-container";
import { NavigationRoutes } from "./navigation-routes";
import { NavLink } from "react-router-dom";
import { ProfileContainer } from "../containers/profile-container";
import { ToggleContainer } from "../containers/toggle-container";
import { ThemeToggle } from "./theme-toggle";


const Header = () => {
  const { userId } = useAuthContext();

  return (
    <header
      className={cn("w-full border-b duration-150 transition-all ease-in-out")}
    >
      <Container>
        <div className="flex items-center gap-4 w-full">
          {/* logo section */}
          <LogoContainer />

          {/* navigation section */}
          <nav className="hidden md:flex items-center gap-3">
            <NavigationRoutes /> 
            {userId && (
              <>
                <NavLink to={"/generate"}
                  className={({ isActive }) =>
                    cn(
                      "text-base text-muted-foreground",
                      isActive && "text-foreground font-semibold"
                    )
                  }
                >
                  Take an Interview
                </NavLink>
                <NavLink to={"/resume-analysis"}
                  className={({ isActive }) =>
                    cn(
                      "text-base text-muted-foreground",
                      isActive && "text-foreground font-semibold"
                    )
                  }
                >
                  Resume Analysis
                </NavLink>
              </>
            )}
          </nav>

          <div className="ml-auto flex items-center gap-6">
            {/* theme toggle */}
            <ThemeToggle />

            {/* profile section*/}
            <ProfileContainer />

            {/* mobile toggle section*/}
            <ToggleContainer />
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
