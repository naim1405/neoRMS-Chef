import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login.jsx";
import RequireChefAuth from "./components/routing/RequireChefAuth.jsx";
import ChefShell from "./components/layout/ChefShell.jsx";
import OrdersBoard from "./pages/chef/OrdersBoard.jsx";
import ChefProfile from "./pages/chef/ChefProfile.jsx";
import { OrdersProvider } from "./context/OrdersContext.jsx";

function HomeRedirect() {
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("authRole");
  const isChef = !role || role === "CHEF";
  return (
    <Navigate
      to={token && isChef ? "/chef/dashboard" : "/chef/login"}
      replace
    />
  );
}

function App() {
  return (
    <OrdersProvider>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/chef/login" element={<Login />} />

        <Route element={<RequireChefAuth />}>
          <Route element={<ChefShell />}>
            <Route path="/chef/dashboard" element={<OrdersBoard />} />
            <Route path="/chef/profile" element={<ChefProfile />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </OrdersProvider>
  );
}

export default App;
