import { NavLink } from "react-router-dom";
import { navLinks } from "../constants/navLinks";

const NavPages = () => {
  return (
    <nav className="flex  bg-gray-200 p-4 text-center justify-around " >
        <NavLink to="/" end className={({ isActive }) => (isActive ? "font-bold under line" : "")}  >Home</NavLink>
      {navLinks.map((link) => (
        <NavLink key={link.to} to={link.to} className={({ isActive }) => (isActive ? "font-bold under line" : "")}>
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
};

export default NavPages;
