import { useRef, useState } from "react";
import { Button, Form, Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../apis/api";
import { errorHandler } from "../utils/errorHandler";
import { Loading } from "../components/Loading/Loading";

// CSS
import "../styles/AuthForm.css";

export const Register = () => {
  const [loading, setLoading] = useState(false);
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        name: nameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value,
      };

      const response = await api.post("/api/auth/register", data);
      toast.success(response.data.message);
      localStorage.setItem("email", data.email);
      navigate("/verify-otp");
    } catch (error) {
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
              <h2>Create Account</h2>
              <p>Join our community of book lovers</p>
            </div>

            <Card.Body className="p-4 p-md-5">
              <Form onSubmit={handleRegister}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-auth">Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    ref={nameRef}
                    required
                    className="form-control-auth"
                  />
                </Form.Group>

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
                  <Form.Label className="form-label-auth">Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Create a password (min 6 chars)"
                    ref={passwordRef}
                    required
                    minLength={6}
                    className="form-control-auth"
                  />
                </Form.Group>

                <Button variant="success" type="submit" className="btn-auth">
                  Register
                </Button>

                <div className="auth-footer">
                  Already have an account?
                  <Link to="/login" className="auth-link">
                    Login
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
