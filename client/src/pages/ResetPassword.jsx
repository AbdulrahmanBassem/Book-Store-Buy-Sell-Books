import { useRef, useState } from "react";
import { Button, Form, Container } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../apis/api";
import { errorHandler } from "../utils/errorHandler";
import { Loading } from "../components/Loading/Loading";

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
      const data = {
        token,
        password,
      };

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
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <h2 className="text-center mb-4">Reset Password</h2>
          
          <Form onSubmit={handleResetPassword} className="border p-4 rounded shadow-sm bg-white">
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                ref={passwordRef}
                required
                minLength={6}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm new password"
                ref={confirmPasswordRef}
                required
              />
            </Form.Group>

            <Button variant="success" type="submit" className="w-100">
              Change Password
            </Button>
          </Form>
        </div>
      </div>
    </Container>
  );
};