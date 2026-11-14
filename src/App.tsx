import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Layout from "./Layout/Layout";
import Home from "./Pages/Home/Home";
import Profile from "./Pages/Profile/Profile";
import UserProfile from "./Pages/UserProfile/UserProfile";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import Notfound from "./Pages/Notfound/Notfound";
import AuthContextProvider from "./Components/Context/AuthContext";
import ProtectedRoute from "./Components/protectedRoute/protectedRoute";
import AuthRoute from "./Components/protectedRoute/AuthRoute";
import {QueryClientProvider, QueryClient} from "@tanstack/react-query";
import PostDetails from "./Pages/PostDetails/PostDetails";

const query = new QueryClient();

const routes = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      { index: true, element: <ProtectedRoute><Home /></ProtectedRoute> },
      { path: "Home", element: <ProtectedRoute><Home /></ProtectedRoute> },
      { path: "Profile", element: <ProtectedRoute><Profile /></ProtectedRoute> },
      { path: "userprofile/:id", element: <ProtectedRoute><UserProfile /></ProtectedRoute> },
      { path: "postdetails/:id", element: <ProtectedRoute><PostDetails /></ProtectedRoute> },
      { path: "Login", element: <AuthRoute><Login /></AuthRoute> },
      { path: "Register", element:<AuthRoute><Register /></AuthRoute> },
      { path: "*", element: <Notfound /> },
    ],
  },
]);

function App() {
  return (
    <>
      <QueryClientProvider client={query}>
        <AuthContextProvider>
          <RouterProvider router={routes}></RouterProvider>
        </AuthContextProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;