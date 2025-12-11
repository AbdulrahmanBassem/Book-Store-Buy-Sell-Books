import { useRef, useState } from "react";
import { Button, Form, Container, Row, Col, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { api } from "../apis/api";
import { setUser } from "../store/slices/userSlice";
import { errorHandler } from "../utils/errorHandler";
import { Loading } from "../components/Loading/Loading";

// CSS
import "../styles/AuthForm.css";

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
      const data = { email: emailValue, password: passwordValue };
      const response = await api.post("/api/auth/login", data);

      const { token, _id, name, email } = response.data;
      const user = { _id, name, email };

      localStorage.setItem("token", token);
      dispatch(setUser(user));

      toast.success(`Welcome back, ${name}!`);
      navigate("/");
    } catch (error) {
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
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="auth-card">
            <div className="auth-header">
              <h2>Welcome Back</h2>
              <p>Sign in to continue to your account</p>
            </div>

            <Card.Body className="p-4 p-md-5">
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-auth">
                    Email Address
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    ref={emailRef}
                    required
                    className="form-control-auth"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <Form.Label className="form-label-auth mb-0">
                      Password
                    </Form.Label>
                    <Link
                      to="/forgot-password"
                      style={{ fontSize: "0.85rem", textDecoration: "none" }}
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    ref={passwordRef}
                    required
                    className="form-control-auth"
                  />
                </Form.Group>

                <Button variant="success" type="submit" className="btn-auth">
                  Login
                </Button>

                <div className="auth-footer">
                  Don't have an account?
                  <Link to="/register" className="auth-link">
                    Register
                  </Link>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
