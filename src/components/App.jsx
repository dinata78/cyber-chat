import { Auth } from "./Auth/Auth";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Cyber } from "./Cyber";
import { createContext, useState } from "react";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Auth />,
  },
  {
    path: "cyber",
    element: <Cyber />,
  }
]);

export const LoadingContext = createContext({});

export function App() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      <RouterProvider router={router}/>
    </LoadingContext.Provider>
  )
}