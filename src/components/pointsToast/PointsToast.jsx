import { useDispatch, useSelector } from "react-redux";
import { Snackbar, Alert } from "@mui/material";
import { clearPointsToast } from "../../store/loyaltySlice";

export default function PointsToast() {
    const dispatch = useDispatch();
    const amount = useSelector((state) => state.loyalty.toastAmount);

    return (
        <Snackbar
            open={amount !== null}
            autoHideDuration={4000}
            onClose={() => dispatch(clearPointsToast())}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
            <Alert
                onClose={() => dispatch(clearPointsToast())}
                severity="success"
                variant="filled"
                sx={{ backgroundColor: "#007fad", fontWeight: 600 }}
            >
                🎉 You just earned {amount} points!
            </Alert>
        </Snackbar>
    );
}