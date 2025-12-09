import { useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { api } from "../apis/api";
import { errorHandler } from "../utils/errorHandler";
import { setUser } from "../store/slices/userSlice";
import { Loading } from "../components/Loading/Loading";
import { ResendOTP } from "../components/ResendOTP/ResendOTP";

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
      const data = {
        email,
        otp: otpRef.current.value,
      };

      const response = await api.post("/api/auth/verify", data);
      
      const { token } = response.data;

      // login after verification
      localStorage.setItem("token", token);
      
      const userResponse = await api.get("/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` }
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
    <div className="row justify-content-center mt-5">
      <div className="col-md-6 col-lg-4">
        <h2 className="text-center mb-4">Verify Account</h2>
        <p className="text-center text-muted">
          Check your email for the 6-digit code.
        </p>
        
        <Form onSubmit={handleVerify} className="border p-4 rounded shadow-sm bg-white">
          <Form.Group className="mb-3">
            <Form.Label>OTP Code</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter 6-digit OTP"
              ref={otpRef}
              maxLength={6}
              required
              className="text-center letter-spacing-2"
              style={{ letterSpacing: "4px", fontSize: "1.2rem" }}
            />
          </Form.Group>

          <Button variant="success" type="submit" className="w-100 mb-3">
            Verify
          </Button>

          <div className="d-flex justify-content-center">
            <ResendOTP />
          </div>
        </Form>
      </div>
    </div>
  );
};