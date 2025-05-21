import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../../firebase";

export function useIsAuth() {
  const [ isAuth, setIsAuth ] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuth(true);
      }
      else {
        setIsAuth(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return { isAuth }
}