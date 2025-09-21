import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  CheckCircle,
  Loader,
  Hash,
  MapPin,
  LinkIcon,
} from "lucide-react";
import "./AuthModal.scss";
import AiNuraLogo from "../../../public/assets/ainuracolorlogo.png";

function AuthModal({ isOpen, onClose, onLogin }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [verificationMode, setVerificationMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [pendingUser, setPendingUser] = useState(null);
  const [verificationCode, setVerificationCode] = useState("");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    first_name: "",
    last_name: "",
    location: "", // Yeni alan
    website: "", // Yeni alan
  });

  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        if (!isLoading) {
          onClose();
        }
      }
    };

    if (isOpen) {
      const timer = setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 100);

      return () => {
        clearTimeout(timer);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // Helper function to save auth data
  const saveAuthData = (user, token) => {
    try {
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.error("Error saving auth data:", error);
    }
  };

  // API Call Functions
  const loginUser = async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/api/gallery/auth/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  };

  const registerUser = async (userData) => {
    const response = await fetch(`${API_BASE_URL}/api/gallery/auth/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...userData,
        location: formData.location || "",
        website: formData.website || "",
        join_date: new Date().toISOString(), // Backend'e register tarihi gönder
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  };

  const verifyCode = async (user_id, code) => {
    const response = await fetch(
      `${API_BASE_URL}/api/gallery/auth/verify-code/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id, code }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  };

  const resendCode = async (user_id) => {
    const response = await fetch(
      `${API_BASE_URL}/api/gallery/auth/resend-code/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      if (verificationMode) {
        // Verification code check
        if (!verificationCode || verificationCode.length !== 6) {
          setErrors({ general: "Please enter a valid 6-digit code" });
          return;
        }

        const response = await verifyCode(
          pendingUser.user_id,
          verificationCode
        );

        // Save to localStorage
        saveAuthData(response.user, response.token);

        // Call parent callback
        onLogin({
          username: response.user.username,
          email: response.user.email,
          token: response.token,
          ...response.user,
        });

        onClose();
      } else if (isLoginMode) {
        const credentials = {
          username_or_email: formData.email,
          password: formData.password,
        };

        const response = await loginUser(credentials);

        // Save to localStorage
        saveAuthData(response.user, response.token);

        // Call parent callback
        onLogin({
          username: response.user.username,
          email: response.user.email,
          token: response.token,
          ...response.user,
        });

        onClose();
      } else {
        // Register logic
        if (formData.password !== formData.confirmPassword) {
          setErrors({ confirmPassword: "Passwords don't match!" });
          return;
        }

        const userData = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          first_name: formData.first_name,
          last_name: formData.last_name,
        };

        const response = await registerUser(userData);

        // Switch to verification mode
        setPendingUser({
          user_id: response.user_id,
          email: response.email,
        });
        setVerificationMode(true);
      }
    } catch (error) {
      console.error("Auth error:", error);

      if (error.error) {
        setErrors({ general: error.error });
      } else if (typeof error === "object") {
        const fieldErrors = {};
        Object.keys(error).forEach((key) => {
          if (Array.isArray(error[key])) {
            fieldErrors[key] = error[key][0];
          } else {
            fieldErrors[key] = error[key];
          }
        });
        setErrors(fieldErrors);
      } else {
        setErrors({ general: "An unexpected error occurred" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      await resendCode(pendingUser.user_id);
      setErrors({ success: "New verification code sent to your email!" });
      setTimeout(() => setErrors({}), 3000);
    } catch (error) {
      setErrors({ general: error.error || "Failed to resend code" });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setVerificationMode(false);
    setForgotPasswordMode(false);
    setPendingUser(null);
    setVerificationCode("");
    setErrors({});
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      username: "",
      first_name: "",
      last_name: "",
    });
  };

  const handleBackToLogin = () => {
    setVerificationMode(false);
    setForgotPasswordMode(false);
    setIsLoginMode(true);
    setPendingUser(null);
    setVerificationCode("");
    setErrors({});
  };

  const getHeaderContent = () => {
    if (verificationMode) {
      return {
        title: "Check Your Email",
        subtitle: `We've sent a 6-digit code to ${pendingUser?.email}`,
      };
    }

    if (forgotPasswordMode) {
      return {
        title: "Reset Password",
        subtitle:
          "Enter your email address and we'll send you a link to reset your password",
      };
    }

    return {
      title: isLoginMode ? "Welcome Back" : "Join AiNura",
      subtitle: isLoginMode
        ? "Sign in to your account to continue"
        : "Create your account and start making AI art",
    };
  };

  const headerContent = getHeaderContent();

  return (
    <div className="authModalOverlay">
      <div
        ref={modalRef}
        className={`authModalContent ${
          verificationMode ? "verification" : ""
        } ${isLoading ? "loading" : ""}`}
      >
        {/* Close Button */}
        <button className="closeButton" onClick={onClose} disabled={isLoading}>
          <X size={24} />
        </button>

        <div className="authLogo">
          <img src={AiNuraLogo} alt="AiNura Logo" className="logoImage" />
          <div className="logoText">
            <span className="aiText">AI</span>
            <span className="nuraText">Nura</span>
          </div>
        </div>

        <div className="authHeader">
          <h2>{headerContent.title}</h2>
          <p>{headerContent.subtitle}</p>
        </div>

        {errors.general && (
          <div className="errorMessage general">
            <p>{errors.general}</p>
          </div>
        )}

        {errors.success && (
          <div className="successMessage">
            <CheckCircle className="successIcon" size={24} />
            <p>{errors.success}</p>
          </div>
        )}

        {verificationMode ? (
          // Verification Code Form
          <form className="authForm" onSubmit={handleSubmit}>
            <div className="inputGroup">
              <div className="inputContainer">
                <Hash className="inputIcon" size={20} />
                <input
                  type="text"
                  name="verificationCode"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) =>
                    setVerificationCode(
                      e.target.value.replace(/\D/g, "").slice(0, 6)
                    )
                  }
                  required
                  disabled={isLoading}
                  className={errors.code ? "error" : ""}
                  maxLength={6}
                />
              </div>
              {errors.code && (
                <div className="errorMessage">
                  <p>{errors.code}</p>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="submitBtn"
              disabled={isLoading || verificationCode.length !== 6}
            >
              {isLoading && <Loader className="loadingIcon" size={20} />}
              {isLoading ? "Verifying..." : "Verify Account"}
            </button>

            <div className="resendSection">
              <p>Didn't receive the code?</p>
              <button
                type="button"
                className="resendBtn"
                onClick={handleResendCode}
                disabled={isLoading}
              >
                Resend Code
              </button>
            </div>
          </form>
        ) : (
          // Login/Register Form
          <form className="authForm" onSubmit={handleSubmit}>
            {!isLoginMode && !forgotPasswordMode && (
              <>
                <div className="nameFields">
                  <div className="inputGroup half">
                    <div className="inputContainer">
                      <User className="inputIcon" size={18} />
                      <input
                        type="text"
                        name="first_name"
                        placeholder="First Name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div className="inputGroup half">
                    <div className="inputContainer">
                      <User className="inputIcon" size={18} />
                      <input
                        type="text"
                        name="last_name"
                        placeholder="Last Name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                <div className="inputGroup">
                  <div className="inputContainer">
                    <User className="inputIcon" size={20} />
                    <input
                      type="text"
                      name="username"
                      placeholder="Username"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                      className={errors.username ? "error" : ""}
                    />
                  </div>
                  {errors.username && (
                    <div className="errorMessage">
                      <p>{errors.username}</p>
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="inputGroup">
              <div className="inputContainer">
                <Mail className="inputIcon" size={20} />
                <input
                  type="text"
                  name="email"
                  placeholder={
                    isLoginMode ? "Email or Username" : "Email address"
                  }
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className={errors.email ? "error" : ""}
                />
              </div>
              {errors.email && (
                <div className="errorMessage">
                  <p>{errors.email}</p>
                </div>
              )}
            </div>
            <div className="inputGroup">
              <div className="inputContainer">
                <MapPin className="inputIcon" size={20} />
                <input
                  type="text"
                  name="location"
                  placeholder="Location (optional)"
                  value={formData.location}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={errors.location ? "error" : ""}
                />
              </div>
              {errors.location && (
                <div className="errorMessage">
                  <p>{errors.location}</p>
                </div>
              )}
            </div>

            <div className="inputGroup">
              <div className="inputContainer">
                <LinkIcon className="inputIcon" size={20} />
                <input
                  type="text"
                  name="website"
                  placeholder="Website URL (optional)"
                  value={formData.website}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={errors.website ? "error" : ""}
                />
              </div>
              {errors.website && (
                <div className="errorMessage">
                  <p>{errors.website}</p>
                </div>
              )}
            </div>
            {!forgotPasswordMode && (
              <div className="inputGroup">
                <div className="inputContainer">
                  <Lock className="inputIcon" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className={errors.password ? "error" : ""}
                  />
                  <button
                    type="button"
                    className="togglePassword"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <div className="errorMessage">
                    <p>{errors.password}</p>
                  </div>
                )}
              </div>
            )}

            {!isLoginMode && !forgotPasswordMode && (
              <div className="inputGroup">
                <div className="inputContainer">
                  <Lock className="inputIcon" size={20} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className={errors.confirmPassword ? "error" : ""}
                  />
                  <button
                    type="button"
                    className="togglePassword"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div className="errorMessage">
                    <p>{errors.confirmPassword}</p>
                  </div>
                )}
              </div>
            )}

            <button type="submit" className="submitBtn" disabled={isLoading}>
              {isLoading && <Loader className="loadingIcon" size={20} />}
              {isLoading
                ? "Please wait..."
                : forgotPasswordMode
                ? "Send Reset Link"
                : isLoginMode
                ? "Sign In"
                : "Create Account"}
            </button>
          </form>
        )}

        <div className="authFooter">
          {verificationMode ? (
            <p>
              Want to try a different account?
              <button
                onClick={handleBackToLogin}
                className="toggleModeBtn"
                disabled={isLoading}
              >
                Back to Login
              </button>
            </p>
          ) : (
            <p>
              {isLoginMode
                ? "Don't have an account?"
                : "Already have an account?"}
              <button
                onClick={toggleMode}
                className="toggleModeBtn"
                disabled={isLoading}
              >
                {isLoginMode ? "Sign up" : "Sign in"}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
