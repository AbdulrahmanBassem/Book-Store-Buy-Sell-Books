import { useRef, useState } from "react";
import { Button, Form, Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../apis/api";
import { errorHandler } from "../utils/errorHandler";
import { Loading } from "../components/Loading/Loading";

// CSS
import "../styles/AuthForm.css";

export const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  async function handleResetPassword(e) {
    e.preventDefault();
    setLoading(true);

    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const data = { token, password };
      const response = await api.post("/api/auth/reset-password", data);

      toast.success(response.data.message);
      navigate("/login");
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
              <h2>Reset Password</h2>
              <p>Enter a new strong password for your account</p>
            </div>

            <Card.Body className="p-4 p-md-5">
              <Form onSubmit={handleResetPassword}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-auth">
                    New Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter new password"
                    ref={passwordRef}
                    required
                    minLength={6}
                    className="form-control-auth"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="form-label-auth">
                    Confirm New Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm new password"
                    ref={confirmPasswordRef}
                    required
                    className="form-control-auth"
                  />
                </Form.Group>

                <Button variant="success" type="submit" className="btn-auth">
                  Change Password
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
