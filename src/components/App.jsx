import { Auth } from "./Auth/Auth";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Chat } from "./Chat/Chat";
import { ResetPassword } from "./ResetPassword/ResetPassword";
import { Notifier } from "./Notification";

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
    path: "/chat",
    element: <Chat />,
  },
]);

export function App() {
  return (
    <>
      <RouterProvider router={router}/>
      <Notifier />    
    </>
  )
}