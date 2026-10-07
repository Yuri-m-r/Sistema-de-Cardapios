import { Outlet } from "react-router-dom";
import NavPages from "../components/NavPages";

export const MainLayout = () => {
  return (
    <>
      <NavPages />
      <main className="p-6">
        <Outlet />
      </main>
    </>
  );
};