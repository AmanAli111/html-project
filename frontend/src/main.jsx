import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AppStoreProvider } from "./context/expense_tracker_store.jsx";
import Home from "./pages/Dashboard/Home.jsx";
import Income from "./pages/Dashboard/Income.jsx";
import Expense from "./pages/Dashboard/Expense.jsx";
import Login from "./pages/Auth/Login.jsx";
import SignUp from "./pages/Auth/Signup.jsx";
import LandingPage from "./pages/Landing/LandingPage.jsx";
import AllTransactions from "./pages/All_Transaction/allTransaction.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/Home",
    element: <App />,
    children: [
      { path: "/Home", element: <Home /> },
      { path: "/Home/Dashboard", element: <Home /> },
      { path: "/Home/Income", element: <Income /> },
      { path: "/Home/Expenses", element: <Expense /> },
      { path: "/Home/AllTransaction", element: <AllTransactions /> },
    ],
  },
  {
    path: "/Login",
    element: <Login />,
  },
  {
    path: "/Signup",
    element: <SignUp />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppStoreProvider>
      <RouterProvider router={router} />
    </AppStoreProvider>
  </StrictMode>,
);
