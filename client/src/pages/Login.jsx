import { useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { api } from "../apis/api";
import { setUser } from "../store/slices/userSlice";
import { errorHandler } from "../utils/errorHandler";
import { Loading } from "../components/Loading/Loading";

export const Login = () => {
  const [loading, setLoading] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    const emailValue = emailRef.current.value;
    const passwordValue = passwordRef.current.value;

    setLoading(true);

    try {
      const data = {
        email: emailValue,
        password: passwordValue,
      };

      const response = await api.post("/api/auth/login", data);
      
      const { token, _id, name, email } = response.data;
      const user = { _id, name, email };

      localStorage.setItem("token", token);
      dispatch(setUser(user));

      toast.success(`Welcome back, ${name}!`);
      navigate("/");
    } catch (error) {
      console.log("Login Error:", error.response);
      
      const status = error.response?.status;
      const message = error.response?.data?.message || "";

      if (status === 401 && message.toLowerCase().includes("verify")) {
        localStorage.setItem("email", emailValue);
        navigate("/verify-otp");
        return; 
      }

      errorHandler(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-6 col-lg-4">
        <h2 className="text-center mb-4">Login</h2>
        <Form
          onSubmit={handleLogin}
          className="border p-4 rounded shadow-sm bg-white"
        >
          <Form.Group className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              ref={emailRef}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              ref={passwordRef}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100 mb-3">
            Login
          </Button>

          <div className="text-center">
            <p className="mb-1">
              Don't have an account? <Link to="/register">Register</Link>
            </p>
            <p>
              <Link
                to="/forgot-password"
                style={{ textDecoration: "none", fontSize: "0.9rem" }}
              >
                Forgot Password?
              </Link>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
};
