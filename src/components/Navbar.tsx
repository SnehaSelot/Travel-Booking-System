import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Plane, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isLoggedIn = Boolean(user?.Email || user?.User_Id !== undefined);
  const isAdmin = user?.Email === "admin@example.com" || user?.role === "admin";

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/hotels", label: "Hotels" },
    ...(isLoggedIn ? [
      { to: "/dashboard", label: "Dashboard" },
      { to: "/profile", label: "Profile" },
      { to: "/reviews", label: "Reviews" }
    ] : [
      { to: "/login", label: "Login" },
      { to: "/register", label: "Register" }
    ]),
    ...(isAdmin ? [{ to: "/admin", label: "Admin" }] : []),
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-heading font-bold tracking-tight">
          <Plane className="h-6 w-6 text-accent" />
          <span>TravelGo</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-secondary ${
                location.pathname === link.to ? "bg-secondary" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isLoggedIn && (
            <Button variant="ghost" size="sm" className="ml-2" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          )}
        </div>

        {/* Mobile Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-primary-foreground hover:bg-secondary"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-secondary animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`block px-6 py-3 text-sm font-medium transition-colors hover:bg-secondary ${
                location.pathname === link.to ? "bg-secondary" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isLoggedIn && (
            <button
              onClick={() => {
                handleLogout();
                setMobileOpen(false);
              }}
              className="w-full text-left px-6 py-3 text-sm font-medium transition-colors hover:bg-secondary"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
