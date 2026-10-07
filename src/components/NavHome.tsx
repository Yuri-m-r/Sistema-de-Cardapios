import { Link } from "react-router-dom";
import { navLinks } from "./NavLinks";

export const NavHome = () => {
  return (
    <div>
      <nav className="min-h-screen flex flex-col items-center justify-center">
        
        {navLinks.map((link) => (
          <Link key={link.to} to={link.to}>
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};
