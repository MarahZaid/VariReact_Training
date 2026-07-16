import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    sendPasswordResetEmail,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence,
} from "firebase/auth";
import {
    Box,
    Typography,
    TextField,
    Button,
    InputAdornment,
    IconButton,
    Checkbox,
    FormControlLabel,
    Alert,
    CircularProgress,
    Link,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";

import { ref, get } from "firebase/database";
import { auth, db } from "../../firebase/firebaseConfig";


const BRAND = {
    navy: "#003349",
    navyDeep: "#001f2e",
    teal: "#007fad",
    tealLight: "#22aaff",
    ink: "#1a2b33",
    subtle: "#6b7c84",
    cardBg: "#ffffff",
    pageBg: "#f6f8f9",
    border: "rgba(0,51,73,0.08)",
    error: "#c62828",
    shadow: "0 1px 2px rgba(0,51,73,0.04), 0 8px 24px rgba(0,51,73,0.06)",
};

const inputSx = {
    "& .MuiOutlinedInput-root": {
        borderRadius: "10px",
        backgroundColor: "#fff",
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: BRAND.teal,
            borderWidth: "1.5px",
        },
    },
};

const TICKS = [
    { label: "Stand", major: true },
    { pos: 1 },
    { pos: 2 },
    { pos: 3 },
    { label: "Sit", major: true },
];

function ElevationMark() {
    return (
        <Box
            sx={{
                position: "relative",
                height: 260,
                width: 56,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "flex-start",
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    left: 6,
                    top: 0,
                    bottom: 0,
                    width: "2px",
                    backgroundColor: "rgba(255,255,255,0.18)",
                }}
            />

            {TICKS.map((tick, i) => (
                <Box
                    key={i}
                    sx={{ position: "relative", display: "flex", alignItems: "center", gap: 1.25 }}
                >
                    <Box
                        sx={{
                            width: tick.major ? 14 : 8,
                            height: "2px",
                            backgroundColor: tick.major ? "#fff" : "rgba(255,255,255,0.35)",
                            ml: tick.major ? 0 : 0.75,
                        }}
                    />
                    {tick.label && (
                        <Typography
                            variant="caption"
                            sx={{
                                color: "rgba(255,255,255,0.85)",
                                fontWeight: 600,
                                letterSpacing: "0.06em",
                                textTransform: "uppercase",
                                fontSize: "0.68rem",
                            }}
                        >
                            {tick.label}
                        </Typography>
                    )}
                </Box>
            ))}

            <Box
                sx={{
                    position: "absolute",
                    left: -6,
                    width: 26,
                    height: "3px",
                    borderRadius: "2px",
                    backgroundColor: BRAND.tealLight,
                    boxShadow: `0 0 12px ${BRAND.tealLight}`,
                    animation: "riseAndSit 5.5s ease-in-out infinite",
                    "@keyframes riseAndSit": {
                        "0%, 8%": { top: "calc(100% - 1px)" },
                        "42%, 58%": { top: "calc(100% - 1px)" },
                        "20%, 30%": { top: "0px" },
                        "70%, 92%": { top: "0px" },
                        "100%": { top: "calc(100% - 1px)" },
                    },
                }}
            />
        </Box>
    );
}

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [mode, setMode] = useState("signin");
    const [resetSent, setResetSent] = useState(false);

    const [name, setName] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    function switchMode(nextMode) {
        setMode(nextMode);
        setError("");
        setResetSent(false);
        setPassword("");
        setConfirmPassword("");
    }

    function friendlyError(err) {
        switch (err.code) {
            case "auth/invalid-email":
                return "That email address doesn't look right.";
            case "auth/user-not-found":
            case "auth/wrong-password":
            case "auth/invalid-credential":
                return "Incorrect email or password.";
            case "auth/too-many-requests":
                return "Too many attempts. Please wait a moment and try again.";
            case "auth/email-already-in-use":
                return "An account with this email already exists.";
            case "auth/weak-password":
                return "Password should be at least 6 characters.";
            default:
                return "Something went wrong. Please try again.";
        }
    }

    async function handleSignIn(e) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await setPersistence(
                auth,
                rememberMe ? browserLocalPersistence : browserSessionPersistence
            );
            const credential = await signInWithEmailAndPassword(auth, email.trim(), password);

            const snapshot = await get(ref(db, `admins/${credential.user.uid}`));
            const isAdmin = snapshot.exists() && snapshot.val() === true;

            navigate(isAdmin ? "/admin" : "/");
        } catch (err) {
            setError(friendlyError(err));
        } finally {
            setLoading(false);
        }
    }

    async function handleSignUp(e) {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords don't match.");
            return;
        }

        setLoading(true);
        try {
            await setPersistence(auth, browserLocalPersistence);
            const credential = await createUserWithEmailAndPassword(
                auth,
                email.trim(),
                password
            );
            if (name.trim()) {
                await updateProfile(credential.user, { displayName: name.trim() });
            }
            navigate("/");
        } catch (err) {
            setError(friendlyError(err));
        } finally {
            setLoading(false);
        }
    }

    async function handleReset(e) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email.trim());
            setResetSent(true);
        } catch (err) {
            setError(friendlyError(err));
        } finally {
            setLoading(false);
        }
    }

    const isSignup = mode === "signup";

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                backgroundColor: BRAND.pageBg,
                overflow: "hidden",
            }}
        >
            {/* Brand panel */}
            <Box
                sx={{
                    display: { xs: "none", md: "flex" },
                    flexDirection: "column",
                    justifyContent: "space-between",
                    width: "42%",
                    p: 6,
                    background: `linear-gradient(160deg, ${BRAND.navy} 0%, ${BRAND.navyDeep} 100%)`,
                    position: "relative",
                    overflow: "hidden",
                    zIndex: 2,
                    transform: isSignup ? "translateX(138.1%)" : "translateX(0%)",
                    transition: "transform 0.7s cubic-bezier(0.65, 0, 0.35, 1)",
                }}
            >
                <Typography
                    sx={{
                        color: "#fff",
                        fontWeight: 800,
                        fontSize: "1.75rem",
                        letterSpacing: "-0.02em",
                    }}
                >
                    vari.
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <ElevationMark />
                    <Box>
                        <Typography
                            sx={{
                                color: "#fff",
                                fontWeight: 800,
                                fontSize: "1.9rem",
                                lineHeight: 1.2,
                                letterSpacing: "-0.01em",
                                maxWidth: 280,
                            }}
                        >
                            Built for the way work moves.
                        </Typography>
                        <Typography
                            sx={{
                                color: "rgba(255,255,255,0.65)",
                                mt: 1.5,
                                fontSize: "0.9rem",
                                maxWidth: 260,
                            }}
                        >
                            Sign in to shop, track your orders, and manage your account.
                        </Typography>
                    </Box>
                </Box>

                <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: "0.78rem" }}>
                    Vari · Sit-Stand Desks
                </Typography>
            </Box>

            {/* Form panel */}
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 3,
                    position: "relative",
                    zIndex: 1,
                    transform: { md: isSignup ? "translateX(-72.41%)" : "translateX(0%)" },
                    transition: "transform 0.7s cubic-bezier(0.65, 0, 0.35, 1)",
                }}
            >
                <Box sx={{ width: "100%", maxWidth: 380 }}>
                    <Typography
                        sx={{
                            display: { xs: "block", md: "none" },
                            color: BRAND.navy,
                            fontWeight: 800,
                            fontSize: "1.5rem",
                            mb: 4,
                        }}
                    >
                        vari.
                    </Typography>

                    {mode === "signin" ? (
                        <>
                            <Typography
                                variant="h4"
                                sx={{ fontWeight: 800, color: BRAND.navy, letterSpacing: "-0.01em" }}
                            >
                                Sign in
                            </Typography>
                            <Typography variant="body2" sx={{ color: BRAND.subtle, mt: 0.5, mb: 4 }}>
                                Enter your details to continue.
                            </Typography>

                            {error && (
                                <Alert severity="error" sx={{ mb: 2.5, borderRadius: "10px" }}>
                                    {error}
                                </Alert>
                            )}

                            <Box component="form" onSubmit={handleSignIn}>
                                <Typography
                                    variant="caption"
                                    sx={{ display: "block", color: BRAND.subtle, mb: 0.5, fontWeight: 600 }}
                                >
                                    Email
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="medium"
                                    type="email"
                                    required
                                    autoFocus
                                    placeholder="you@vari.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    sx={{ ...inputSx, mb: 2.5 }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailIcon sx={{ color: BRAND.subtle, fontSize: 20 }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                                    <Typography variant="caption" sx={{ color: BRAND.subtle, fontWeight: 600 }}>
                                        Password
                                    </Typography>
                                    <Link
                                        component="button"
                                        type="button"
                                        variant="caption"
                                        onClick={() => switchMode("reset")}
                                        sx={{ color: BRAND.teal, fontWeight: 600, textDecoration: "none" }}
                                    >
                                        Forgot password?
                                    </Link>
                                </Box>
                                <TextField
                                    fullWidth
                                    size="medium"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    sx={{ ...inputSx, mb: 1.5 }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockOutlinedIcon sx={{ color: BRAND.subtle, fontSize: 20 }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword((v) => !v)}
                                                    edge="end"
                                                    size="small"
                                                >
                                                    {showPassword ? (
                                                        <VisibilityOff sx={{ fontSize: 20 }} />
                                                    ) : (
                                                        <Visibility sx={{ fontSize: 20 }} />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            size="small"
                                            sx={{
                                                color: BRAND.border,
                                                "&.Mui-checked": { color: BRAND.teal },
                                            }}
                                        />
                                    }
                                    label={
                                        <Typography variant="body2" sx={{ color: BRAND.subtle }}>
                                            Keep me signed in
                                        </Typography>
                                    }
                                    sx={{ mb: 2.5 }}
                                />

                                <Button
                                    type="submit"
                                    fullWidth
                                    disabled={loading}
                                    sx={{
                                        backgroundColor: BRAND.navy,
                                        color: "#fff",
                                        borderRadius: "10px",
                                        textTransform: "none",
                                        fontWeight: 700,
                                        fontSize: "0.95rem",
                                        py: 1.3,
                                        boxShadow: "none",
                                        "&:hover": { backgroundColor: BRAND.navyDeep },
                                    }}
                                >
                                    {loading ? (
                                        <CircularProgress size={22} sx={{ color: "#fff" }} />
                                    ) : (
                                        "Sign in"
                                    )}
                                </Button>

                                <Typography
                                    variant="body2"
                                    sx={{ color: BRAND.subtle, textAlign: "center", mt: 3 }}
                                >
                                    New here?{" "}
                                    <Link
                                        component="button"
                                        type="button"
                                        onClick={() => switchMode("signup")}
                                        sx={{ color: BRAND.teal, fontWeight: 700, textDecoration: "none" }}
                                    >
                                        Create an account
                                    </Link>
                                </Typography>
                            </Box>
                        </>
                    ) : mode === "signup" ? (
                        <>
                            <Typography
                                variant="h4"
                                sx={{ fontWeight: 800, color: BRAND.navy, letterSpacing: "-0.01em" }}
                            >
                                Create account
                            </Typography>
                            <Typography variant="body2" sx={{ color: BRAND.subtle, mt: 0.5, mb: 4 }}>
                                Create your account to get started.
                            </Typography>

                            {error && (
                                <Alert severity="error" sx={{ mb: 2.5, borderRadius: "10px" }}>
                                    {error}
                                </Alert>
                            )}

                            <Box component="form" onSubmit={handleSignUp}>
                                <Typography
                                    variant="caption"
                                    sx={{ display: "block", color: BRAND.subtle, mb: 0.5, fontWeight: 600 }}
                                >
                                    Full Name
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="medium"
                                    required
                                    autoFocus
                                    placeholder="Jane Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    sx={{ ...inputSx, mb: 2.5 }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonIcon sx={{ color: BRAND.subtle, fontSize: 20 }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <Typography
                                    variant="caption"
                                    sx={{ display: "block", color: BRAND.subtle, mb: 0.5, fontWeight: 600 }}
                                >
                                    Email
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="medium"
                                    type="email"
                                    required
                                    placeholder="you@vari.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    sx={{ ...inputSx, mb: 2.5 }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailIcon sx={{ color: BRAND.subtle, fontSize: 20 }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <Typography
                                    variant="caption"
                                    sx={{ display: "block", color: BRAND.subtle, mb: 0.5, fontWeight: 600 }}
                                >
                                    Password
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="medium"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    placeholder="At least 6 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    sx={{ ...inputSx, mb: 2.5 }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockOutlinedIcon sx={{ color: BRAND.subtle, fontSize: 20 }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword((v) => !v)}
                                                    edge="end"
                                                    size="small"
                                                >
                                                    {showPassword ? (
                                                        <VisibilityOff sx={{ fontSize: 20 }} />
                                                    ) : (
                                                        <Visibility sx={{ fontSize: 20 }} />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <Typography
                                    variant="caption"
                                    sx={{ display: "block", color: BRAND.subtle, mb: 0.5, fontWeight: 600 }}
                                >
                                    Confirm Password
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="medium"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    placeholder="Re-enter your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    sx={{ ...inputSx, mb: 3 }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockOutlinedIcon sx={{ color: BRAND.subtle, fontSize: 20 }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <Button
                                    type="submit"
                                    fullWidth
                                    disabled={loading}
                                    sx={{
                                        backgroundColor: BRAND.navy,
                                        color: "#fff",
                                        borderRadius: "10px",
                                        textTransform: "none",
                                        fontWeight: 700,
                                        fontSize: "0.95rem",
                                        py: 1.3,
                                        boxShadow: "none",
                                        "&:hover": { backgroundColor: BRAND.navyDeep },
                                    }}
                                >
                                    {loading ? (
                                        <CircularProgress size={22} sx={{ color: "#fff" }} />
                                    ) : (
                                        "Create account"
                                    )}
                                </Button>

                                <Typography
                                    variant="body2"
                                    sx={{ color: BRAND.subtle, textAlign: "center", mt: 3 }}
                                >
                                    Already have an account?{" "}
                                    <Link
                                        component="button"
                                        type="button"
                                        onClick={() => switchMode("signin")}
                                        sx={{ color: BRAND.teal, fontWeight: 700, textDecoration: "none" }}
                                    >
                                        Sign in
                                    </Link>
                                </Typography>
                            </Box>
                        </>
                    ) : (
                        <>
                            <Button
                                startIcon={<ArrowBackIcon />}
                                onClick={() => switchMode("signin")}
                                sx={{
                                    color: BRAND.subtle,
                                    textTransform: "none",
                                    fontWeight: 600,
                                    mb: 2,
                                    pl: 0,
                                    "&:hover": { backgroundColor: "transparent", color: BRAND.navy },
                                }}
                            >
                                Back to sign in
                            </Button>

                            <Typography
                                variant="h4"
                                sx={{ fontWeight: 800, color: BRAND.navy, letterSpacing: "-0.01em" }}
                            >
                                Reset password
                            </Typography>
                            <Typography variant="body2" sx={{ color: BRAND.subtle, mt: 0.5, mb: 4 }}>
                                We'll email you a link to set a new password.
                            </Typography>

                            {error && (
                                <Alert severity="error" sx={{ mb: 2.5, borderRadius: "10px" }}>
                                    {error}
                                </Alert>
                            )}

                            {resetSent ? (
                                <Alert severity="success" sx={{ borderRadius: "10px" }}>
                                    If an account exists for {email}, a reset link is on its way.
                                </Alert>
                            ) : (
                                <Box component="form" onSubmit={handleReset}>
                                    <Typography
                                        variant="caption"
                                        sx={{ display: "block", color: BRAND.subtle, mb: 0.5, fontWeight: 600 }}
                                    >
                                        Email
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        type="email"
                                        required
                                        autoFocus
                                        placeholder="you@vari.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        sx={{ ...inputSx, mb: 3 }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <EmailIcon sx={{ color: BRAND.subtle, fontSize: 20 }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                    <Button
                                        type="submit"
                                        fullWidth
                                        disabled={loading}
                                        sx={{
                                            backgroundColor: BRAND.navy,
                                            color: "#fff",
                                            borderRadius: "10px",
                                            textTransform: "none",
                                            fontWeight: 700,
                                            fontSize: "0.95rem",
                                            py: 1.3,
                                            boxShadow: "none",
                                            "&:hover": { backgroundColor: BRAND.navyDeep },
                                        }}
                                    >
                                        {loading ? (
                                            <CircularProgress size={22} sx={{ color: "#fff" }} />
                                        ) : (
                                            "Send reset link"
                                        )}
                                    </Button>
                                </Box>
                            )}
                        </>
                    )}
                </Box>
            </Box>
        </Box>
    );
}