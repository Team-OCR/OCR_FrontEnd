import { createBrowserRouter } from "react-router";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import OCR_Convert from "../pages/OCR_Convert";
import OCR_History from "../pages/OCR_History";
import Profile from "../pages/Profile";
import SignUp from "../pages/SignUp";
import SignIn from "../pages/SignIn";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/About",
        element: 
            <About />,
      },
      {
        path: "/Contact",
        element: 
            <Contact />,
      },
      {
        path: "/OCR_Convert",
        element: 
            <OCR_Convert />,
      },
      {
        path: "/OCR_History",
        element: 
            <OCR_History />,
      },
      {
        path: "/Profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      {
        path: "/signUp",
        element: <SignUp />,
      },
      {
        path: "/signIn",
        element: <SignIn />,
      },
      {
        path: "*",
        element: <NotFound />
      },
    ],
  },
]);
