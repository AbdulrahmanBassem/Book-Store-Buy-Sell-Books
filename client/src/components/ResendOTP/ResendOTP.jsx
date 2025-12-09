import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { errorHandler } from "../../utils/errorHandler";
import { api } from "../../apis/api";
import toast from "react-hot-toast";

export const ResendOTP = () => {
  // States
  const [loading, setLoading] = useState(false);

  // Handlers
  async function handleResend() {
    setLoading(true);
    try {
      const email = localStorage.getItem("email");

      if (!email) {
        toast.error("No email found. Please register again.");
        return;
      }

      // Call EndPoint
      const response = await api.post("/api/auth/resend-otp", { email });
      toast.success(response.data.message);
    } catch (error) {
      errorHandler(error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <Button
      type="button"
      variant="outline-secondary"
      onClick={handleResend}
      disabled={loading}
    >
      {loading ? "Resending..." : "Resend OTP"}
    </Button>
  );
};