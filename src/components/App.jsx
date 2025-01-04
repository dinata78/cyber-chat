import { Auth } from "./Auth/Auth";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { Cyber } from "./Cyber/Cyber";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Auth />,
  },
  {
    path: "cyber",
    element: <Cyber />,
  },
  {
    path: "cyber/:parameter",
    element: <Cyber />
  }
]);

export function App() {
  return (
      <RouterProvider router={router}/>
  )
}