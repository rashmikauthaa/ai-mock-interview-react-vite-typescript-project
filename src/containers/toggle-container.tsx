import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { NavigationRoutes } from "../components/navigation-routes"
import { useAuthContext } from "@/context/auth-context";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

export const ToggleContainer = () => {
  const { userId } = useAuthContext();
  return (
    <Sheet>
      <SheetTrigger className="block md:hidden">
        <Menu/>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle />
        </SheetHeader>
        
        <nav className="gap-6 flex flex-col items-start">
          <NavigationRoutes isMobile/> 
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
      </SheetContent>
    </Sheet>
  )
}
