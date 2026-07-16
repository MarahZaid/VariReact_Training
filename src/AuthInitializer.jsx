import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { ref, get } from "firebase/database";
import { auth, db } from "./firebase/firebaseConfig";
import { setUser, setIsAdmin, setUnauthenticated } from "./store/authSlice";

export default function AuthInitializer({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        dispatch(setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
        }));

        try {
          const snapshot = await get(ref(db, `admins/${firebaseUser.uid}`));
          dispatch(setIsAdmin(snapshot.exists() && snapshot.val() === true));
        } catch (err) {
          console.error("Error checking admin status:", err);
          dispatch(setIsAdmin(false));
        }
      } else {
        dispatch(setUnauthenticated());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return children;
}