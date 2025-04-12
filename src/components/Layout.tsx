
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { BarChart2, Calendar, History, Home } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Don't show the navbar on the workout form page
  const hideNavbar = location.pathname.includes('/workout/');
  
  return (
    <div className="flex flex-col min-h-screen">
      <main className={`flex-1 ${hideNavbar ? 'pb-0' : 'pb-16'}`}>{children}</main>
      
      {!hideNavbar && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 z-20 shadow-lg">
          <div className="container mx-auto">
            <div className="flex justify-around items-center">
              <NavLink to="/" icon={<Home size={isMobile ? 20 : 24} />} label="Home" active={location.pathname === '/'} />
              <NavLink to="/history" icon={<History size={isMobile ? 20 : 24} />} label="History" active={location.pathname === '/history'} />
            </div>
          </div>
        </nav>
      )}
    </div>
  );
};

interface NavLinkProps {
  to: string;
  icon: ReactNode;
  label: string;
  active: boolean;
}

const NavLink = ({ to, icon, label, active }: NavLinkProps) => {
  const isMobile = useIsMobile();
  
  return (
    <Link
      to={to}
      className={`flex flex-col items-center justify-center px-4 py-1 ${
        active ? 'text-fitness-primary' : 'text-gray-500'
      }`}
    >
      <div className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} mb-1`}>{icon}</div>
      <span className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-medium`}>{label}</span>
    </Link>
  );
};

export default Layout;
