import { useState } from "react";
import axios from "axios";

function Login({ setIsAdmin, setShowDashboard, setIsLoggedIn, setShowLogin }) {

  const [isSignup, setIsSignup] = useState(false);

  const [name, setName] = useState(""); // only used for signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const API = import.meta.env.VITE_API_URL;

  const handleSubmit = async () => {
    try {

      const url = isSignup
        ? `${API}/api/auth/register`
        : `${API}/api/auth/login`;

      const payload = isSignup
        ? { name, email, password }
        : { email, password };

      const res = await axios.post(url, payload);

      /* save token */
      localStorage.setItem("token", res.data.token);

      /* mark user as logged in */
      setIsLoggedIn(true);

      /* close login/signup page */
      setShowLogin(false);

      const role = res.data.role;

      /* admin login */
      if (role === "admin") {
        setIsAdmin(true);
        setShowDashboard(true);
      } else {
        alert(isSignup ? "Signup successful 🎉" : "Login successful");
      }

    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (

    <div className="login-container">

      <h2>{isSignup ? "Sign Up" : "Login"}</h2>

      {isSignup && (
        <>
          <input
            placeholder="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <br /><br />
        </>
      )}

      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={handleSubmit}>
        {isSignup ? "Create Account" : "Login"}
      </button>

      <p
        style={{ cursor: "pointer", marginTop: "10px" }}
        onClick={() => setIsSignup(!isSignup)}
      >
        {isSignup
          ? "Already have an account? Login"
          : "Don't have an account? Sign up"}
      </p>

    </div>

  );

}

export default Login;