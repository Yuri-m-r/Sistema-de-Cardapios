import { Routes, Route } from "react-router-dom";
import "./App.css";

import { Home } from "./pages/Home";
import { Menus } from "./pages/Menus";
import { Requests } from "./pages/Requests";
import { Products } from "./pages/Products";
import { TechnicalDataSheets } from "./pages/TechnicalDataSheets";
import { MainLayout } from "./layouts/MainLayout";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route element={<MainLayout />}>
          <Route path="/menus" element={<Menus />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/products" element={<Products />} />
          <Route
            path="/technical-data-sheets"
            element={<TechnicalDataSheets />}
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
