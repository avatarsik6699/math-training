import { createBrowserRouter } from "react-router-dom";
import ContactPage, { contactLoader } from "../../pages/contact-page/contact-page";
import ErrorPage from "../../pages/error-page/error-page";
import MainPage from "../../pages/main-page/main-page";
import MainLayout, { mainAction, mainLoader } from "../../processes/layouts/main-layout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
  },
]);
