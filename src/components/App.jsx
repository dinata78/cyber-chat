import { Auth } from "./Auth";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Auth />,
  },
]);

export function App() {
  return (
    <RouterProvider router={router}/>
  )
}