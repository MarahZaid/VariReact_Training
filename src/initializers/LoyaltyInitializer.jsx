import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase/firebaseConfig";
import { getCustomerByUid } from "../utils/customerActions";
import { showPointsToast, setPointsBalance } from "../store/loyaltySlice";

export default function LoyaltyInitializer({ children }) {
    const dispatch = useDispatch();
    const { user, status } = useSelector((state) => state.auth);
    const previousPoints = useRef(null);
    const isFirstSnapshot = useRef(true);

    useEffect(() => {
        previousPoints.current = null;
        isFirstSnapshot.current = true;

        if (status !== "authenticated" || !user) return;

        let unsubscribe = () => { };

        async function subscribeToPoints() {
            const customer = await getCustomerByUid(user.uid);
            if (!customer) return;

            unsubscribe = onValue(ref(db, `customers/${customer.id}/points`), (snapshot) => {
                const current = snapshot.exists() ? snapshot.val() : 0;
                dispatch(setPointsBalance(current));   

                if (isFirstSnapshot.current) {
                    previousPoints.current = current;
                    isFirstSnapshot.current = false;
                    return;
                }

                if (previousPoints.current !== null && current > previousPoints.current) {
                    dispatch(showPointsToast(current - previousPoints.current));
                }
                previousPoints.current = current;
            });
        }

        subscribeToPoints();
        return () => unsubscribe();
    }, [status, user, dispatch]);

    return children;
}