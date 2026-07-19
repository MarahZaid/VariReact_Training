import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase/firebaseConfig";
import { setCart, resetCart } from "../store/cartSlice";

export default function CartInitializer({ children }) {
  const dispatch = useDispatch();
  const { user, status } = useSelector((state) => state.auth);

  useEffect(() => {
    if (status !== "authenticated" || !user) {
      dispatch(resetCart());
      return;
    }

    const cartRef = ref(db, `carts/${user.uid}`);
    const unsubscribe = onValue(cartRef, (snapshot) => {
      dispatch(setCart(snapshot.exists() ? snapshot.val() : {}));
    });

    return () => unsubscribe();
  }, [status, user, dispatch]);

  return children;
}