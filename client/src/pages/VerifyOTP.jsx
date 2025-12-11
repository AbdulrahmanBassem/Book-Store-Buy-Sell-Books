import { useRef, useState } from "react";
import { Button, Form, Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { api } from "../apis/api";
import { errorHandler } from "../utils/errorHandler";
import { setUser } from "../store/slices/userSlice";
import { Loading } from "../components/Loading/Loading";
import { ResendOTP } from "../components/ResendOTP/ResendOTP";

// CSS
import "../styles/AuthForm.css";

export const VerifyOTP = () => {
  const [loading, setLoading] = useState(false);
  const otpRef = useRef();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function handleVerify(e) {
    e.preventDefault();
    setLoading(true);

    const email = localStorage.getItem("email");
    if (!email) {
      toast.error("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    try {
      const data = { email, otp: otpRef.current.value };
      const response = await api.post("/api/auth/verify", data);

      const { token } = response.data;
      localStorage.setItem("token", token);

      const userResponse = await api.get("/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(setUser(userResponse.data.data));
      toast.success("Account Verified! Welcome.");
      navigate("/");
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
              <h2>Verify Account</h2>
              <p>Check your email for the 6-digit code</p>
            </div>

            <Card.Body className="p-4 p-md-5">
              <Form onSubmit={handleVerify}>
                <Form.Group className="mb-4">
                  <Form.Label className="form-label-auth text-center w-100">
                    Enter OTP Code
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="------"
                    ref={otpRef}
                    maxLength={6}
                    required
                    className="form-control-auth text-center fw-bold fs-4"
                    style={{ letterSpacing: "8px" }}
                  />
                </Form.Group>

                <Button
                  variant="success"
                  type="submit"
                  className="btn-auth mb-3"
                >
                  Verify & Login
                </Button>

                <div className="text-center">
                  <ResendOTP />
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
