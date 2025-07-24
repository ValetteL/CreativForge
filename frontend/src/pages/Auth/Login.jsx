import { GoogleLogin } from '@react-oauth/google';
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential })
      });
      if (!res.ok) throw new Error("Auth failed");
      const data = await res.json();
      login({ ...data.user, token: data.token });
      toast.success("Signed in!");
      // Redirect to dashboard or desired page
      navigate("/dashboard");
    } catch {
      toast.error("Login failed.");
    }
  };

  return (
    <div style={{ margin: "2rem auto", textAlign: "center" }}>
      <h2>Sign in with Google</h2>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => toast.error("Google Sign-In failed")}
        useOneTap
      />
    </div>
  );
}
