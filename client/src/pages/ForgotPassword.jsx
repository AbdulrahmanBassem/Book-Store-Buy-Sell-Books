import { useRef, useState } from "react";
import { Button, Form, Container, Row, Col, Card } from "react-bootstrap";
import toast from "react-hot-toast";
import { api } from "../apis/api";
import { errorHandler } from "../utils/errorHandler";
import { Loading } from "../components/Loading/Loading";
import { Link } from "react-router-dom";

// CSS
import "../styles/AuthForm.css";

export const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const emailRef = useRef();

  async function handleForgotPassword(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const data = { email: emailRef.current.value };
      const response = await api.post("/api/auth/forgot-password", data);

      toast.success(response.data.message);
      emailRef.current.value = "";
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
              <h2>Forgot Password</h2>
              <p>We'll send a recovery link to your email</p>
            </div>

            <Card.Body className="p-4 p-md-5">
              <Form onSubmit={handleForgotPassword}>
                <Form.Group className="mb-4">
                  <Form.Label className="form-label-auth">
                    Email Address
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    ref={emailRef}
                    required
                    className="form-control-auth"
                  />
                </Form.Group>

                <Button variant="success" type="submit" className="btn-auth">
                  Send Reset Link
                </Button>

                <div className="auth-footer">
                  <Link to="/login" className="auth-link">
                    Back to Login
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
