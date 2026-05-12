import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, CheckCircle, User } from "lucide-react";
import "./Login.css";
import {
    loginUser,
    signupUser,
    getUsers,
} from "../services/authService";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [isSignup, setIsSignup] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const user = await loginUser(email, password);

            if (user) {
                localStorage.setItem("user", JSON.stringify(user));
                navigate("/");
            } else {
                alert("Invalid credentials");
            }
        } catch (error) {
            console.error(error);
        }
    };

    // 📝 SIGNUP
    const handleSignup = async () => {
        if (!email || !password || !name) {
            alert("Fill all fields");
            return;
        }

        const users = await getUsers();
        const existingUser = users.find((u: any) => u.email === email);

        if (existingUser) {
            alert("User already exists");
            return;
        }

        const newUser = { email, password, name };

        await signupUser(newUser);

        setShowSuccessModal(true);
    };

    const closeSuccessModal = () => {
        setShowSuccessModal(false);
        setIsSignup(false);
    };

    return (
        <div className="login-page">
            <div className="login-card">

                <div className="login-header">
                    <div className="login-logo">H</div>
                    <h1 className="login-title">HRMS Portal</h1>
                    <p className="login-subtitle">
                        {isSignup ? "Create a new account" : "Please sign in to your account"}
                    </p>
                </div>

                <div className="login-form">
                    {/* Name field ONLY for signup */}
                    {isSignup && (
                        <div className="input-group">
                            <User className="input-icon" size={20} />
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="login-input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    )}

                    <div className="input-group">
                        <Mail className="input-icon" size={20} />
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="login-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <Lock className="input-icon" size={20} />
                        <input
                            type="password"
                            placeholder="Password"
                            className="login-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        className="login-button"
                        onClick={isSignup ? handleSignup : handleLogin}
                    >
                        {isSignup ? "Sign Up" : "Sign In"}
                        <ArrowRight size={20} />
                    </button>
                </div>

                <div className="login-footer">
                    {isSignup ? (
                        <p onClick={() => setIsSignup(false)} className="forgot-password" style={{ cursor: "pointer" }}>
                            Already have an account? Login
                        </p>
                    ) : (
                        <p onClick={() => setIsSignup(true)} className="forgot-password" style={{ cursor: "pointer" }}>
                            Don't have an account? Sign up
                        </p>
                    )}
                </div>
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <div className="modal-icon-wrapper">
                            <CheckCircle size={32} />
                        </div>
                        <h2 className="modal-title">Success!</h2>
                        <p className="modal-text">
                            Your account has been created successfully. You can now sign in using your credentials.
                        </p>
                        <button className="modal-button" onClick={closeSuccessModal}>
                            Go to Sign In
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Login;