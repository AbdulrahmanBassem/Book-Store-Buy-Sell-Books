import { useRef, useState } from "react";
import { Button, Form, Container } from "react-bootstrap";
import toast from "react-hot-toast";
import { api } from "../apis/api";
import { errorHandler } from "../utils/errorHandler";
import { Loading } from "../components/Loading/Loading";

export const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const emailRef = useRef();

  async function handleForgotPassword(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        email: emailRef.current.value,
      };

      const response = await api.post("/api/auth/forgot-password", data);
      
      toast.success(response.data.message);
      
      // Clear input
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
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <h2 className="text-center mb-4">Forgot Password</h2>
          <p className="text-center text-muted mb-4">
            Enter your email address and we'll send you a link to reset your password.
          </p>
          
          <Form onSubmit={handleForgotPassword} className="border p-4 rounded shadow-sm bg-white">
            <Form.Group className="mb-4">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                ref={emailRef}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Send Reset Link
            </Button>
          </Form>
        </div>
      </div>
    </Container>
  );
};