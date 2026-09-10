import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

import "./App.css";
import Products from "./pages/Products";


function App() {

  return (
    <BrowserRouter>

      <Routes>

        {/* Home */}
        <Route
          path="/"
          element={
            <Navigate to="/login" />
          }
        />

        {/* Login */}
        <Route
          path="/login"
          element={
            <Login />
          }
        />

        {/* Register */}
        <Route
          path="/register"
          element={
            <Register />
          }
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <Dashboard />
          }
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={
            <Profile />
          }
        />
        {/*Products */}
        <Route
         path="/products"
          element={
          <Products />
          }
           />

      </Routes>

    </BrowserRouter>
  );
}

export default App;