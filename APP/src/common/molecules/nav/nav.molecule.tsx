import { Link, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/common/ui/button";
import { LogOutIcon, X, Menu } from "lucide-react";
import { memo } from "react";
import { NavItemType } from "@/api/types/nav.types";
import { clearAuthStorage } from "@/common/storage/permission-store";

interface NavGeneralProps {
  isMobile: boolean;
  isExpanded: boolean;
  navItems: NavItemType[];
  setIsExpanded: (isExpanded: boolean) => void;
  name?: string | null;
}

const cn = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

// Memoized navigation item component
const NavItem = memo(({ 
  item, 
  isExpanded, 
  isActive,
  onClick
}: { 
  item: NavItemType; 
  isExpanded: boolean; 
  isActive: boolean;
  onClick?: () => void;
}) => (
  <Link
    to={item.href}
    className={cn(
      "flex items-center no-underline px-4 py-3 rounded-lg transition-all duration-200",
      isActive
        ? "bg-amber-900/50 text-white/60"
        : "text-white/70 hover:bg-white/10 hover:text-white"
    )}
    onClick={onClick}
  >
    <div className="flex-shrink-0 text-white/60">
      {item.icon}
    </div>
    <span className="ml-3 font-medium text-white/60 ">
      {item.title}
    </span>
    {isActive && (
      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-100"></div>
    )}
  </Link>
));

export const NavGeneral = ({
  isMobile,
  isExpanded,
  navItems,
  setIsExpanded,
  name
}: NavGeneralProps) => {
  const location = useLocation();

  const isRouteActive = (href: string) => {
   if (href === "/admin") {
      return location.pathname === "/admin";
    }
    
    // For other routes, check exact match or if it's a sub-route
    return location.pathname === href || 
      (location.pathname.startsWith(href + "/") && href !== "/admin");
  };
  
  

  const closeNav = () => setIsExpanded(false);

  return (
    <div className="flex flex-col h-full min-h-screen w-full bg-[#E6DCC8]">
      {/* Header - Always visible */}
      <header className="sticky top-0 z-30 bg-[#4e250a] backdrop-blur-lg border-b border-white/20 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
        <Button
          variant="ghost" 
          // size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-white/70 hover:text-white hover:bg-white/10"
        >
          <Menu className="h-8 w-8" />
        </Button>
          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
            <span className="font-bold text-white">Q</span>
          </div>
          <span className="font-bold text-white">{name || "QuizApp"}</span>
        </div>
      </header>

      {/* Overlay - Desktop only */}
      {!isMobile && isExpanded && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={closeNav}
        ></div>
      )}

      {/* Off-Canvas Navigation - Desktop */}
      {!isMobile && (
        <div
          className={cn(
            "fixed top-0 left-0 z-50 h-full w-72 bg-[#371a06] backdrop-blur-xl border-r border-white/10 shadow-xl transition-transform duration-300 ease-in-out",
            isExpanded ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Navigation Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-amber-500 flex items-center justify-center">
                <span className="font-bold text-white">Q</span>
              </div>
              <span className="font-bold text-white">{name || "QuizApp"}</span>
            </div>
            <Button
              variant="ghost" 
              size="icon"
              onClick={closeNav}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <X size={18} />
            </Button>
          </div>

          {/* Navigation Items */}
          <div className="p-3 overflow-y-auto max-h-[calc(100vh-64px)]">
            <nav className="space-y-1 text-white/60">
              {navItems.map((item) => (
                <NavItem 
                  key={item.href}
                  item={item} 
                  isExpanded={true} 
                  isActive={isRouteActive(item.href)}
                  onClick={closeNav}
                />
              ))}
            </nav>
          </div>

          {/* Logout Button */}
          <div className="absolute bottom-8 left-0 right-0 px-3">
           <Link to={'/'}
                onClick={()=> clearAuthStorage()}
                className="w-full flex items-center px-4 py-3 rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors"  
           >
              <LogOutIcon className="h-5 w-5" />
              <span className="ml-3 font-medium">Cerrar sesión</span>
           </Link>
          </div>
        </div>
      )}

   
      {/* Mobile Drawer Navigation */}
      {isMobile && isExpanded && (
        <>
          <div 
            className="fixed inset-0 bg-[] backdrop-blur-sm z-40"
            onClick={closeNav}
          ></div>
          
          <div className="fixed top-0 right-0 z-50 h-full w-72 bg-[#4e250a]/50 backdrop-blur-xl border-l border-white/10 shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <span className="font-bold text-white">Menú</span>
              <Button
                variant="ghost" 
                size="icon"
                onClick={closeNav}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <X size={18} />
              </Button>
            </div>
            
            <div className="p-3">
              <nav className="space-y-1 text-white/60">
                {navItems.map((item) => (
                  <NavItem 
                    key={item.href}
                    item={item} 
                    isExpanded={true} 
                    isActive={isRouteActive(item.href)}
                    onClick={closeNav}
                  />
                ))}
              </nav>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <main className="flex-1 pb-16">
        
        <Outlet />
      </main>
    </div>
  );
};