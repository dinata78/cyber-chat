import { Auth } from "./Auth/Auth";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Cyber } from "./Cyber/Cyber";
import { ResetPassword } from "./ResetPassword/ResetPassword";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Auth />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />
  },
  {
    path: "/cyber",
    element: <Cyber />,
  },
  {
    path: "/cyber/:parameter",
    element: <Cyber />
  },
]);

export function App() {
  return (
      <RouterProvider router={router}/>
  )
}