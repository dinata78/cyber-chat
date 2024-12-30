import { Auth } from "./Auth/Auth";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Chat } from "./Chat";
import { auth } from "../../firebase";
import { useEffect } from "react";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Auth />,
  },
  {
    path: "chats",
    element: <Chat />,
  }
]);

export function App() {
  return (
    <RouterProvider router={router}/>
  )
}