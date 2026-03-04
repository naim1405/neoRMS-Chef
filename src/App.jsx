import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login.jsx";
import RequireChefAuth from "./components/routing/RequireChefAuth.jsx";
import ChefShell from "./components/layout/ChefShell.jsx";
import OrdersBoard from "./pages/chef/OrdersBoard.jsx";
import ChefProfile from "./pages/chef/ChefProfile.jsx";
import { OrdersProvider } from "./context/OrdersContext.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { SocketProvider } from "./context/SocketContext.tsx";

function HomeRedirect() {
  const { isAuthenticated, role } = useAuth();
  const isChef = !role || role === "CHEF";
  return (
    <Navigate
      to={isAuthenticated && isChef ? "/dashboard" : "/login"}
      replace
    />
  );
}

function App() {
  return (
    <AuthProvider>
      <OrdersProvider>
        <SocketProvider>
          <Routes>
            <Route path="/" element={<HomeRedirect />} />
            <Route path="/login" element={<Login />} />

            <Route element={<RequireChefAuth />}>
              <Route element={<ChefShell />}>
                <Route path="/dashboard" element={<OrdersBoard />} />
                <Route path="/profile" element={<ChefProfile />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SocketProvider>
      </OrdersProvider>
    </AuthProvider>
  );
}

export default App;
