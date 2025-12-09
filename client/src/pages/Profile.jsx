import { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { api } from "../apis/api";
import { setUser } from "../store/slices/userSlice"; // To update Redux with new name
import { errorHandler } from "../utils/errorHandler";
import { Loading } from "../components/Loading/Loading";

export const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [userData, setUserData] = useState(null);

  const nameRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const dispatch = useDispatch();

  // 1. Fetch Profile Data
  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await api.get("/api/auth/profile");
        setUserData(response.data.data);
        
        // Pre-fill name if ref exists
        if (nameRef.current) nameRef.current.value = response.data.data.name;
      } catch (error) {
        errorHandler(error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  // 2. Handle Update
  async function handleUpdate(e) {
    e.preventDefault();
    setUpdating(true);

    const name = nameRef.current.value;
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;

    // Basic Validation
    if (password && password !== confirmPassword) {
      toast.error("Passwords do not match");
      setUpdating(false);
      return;
    }

    try {
      const data = { name };
      if (password) data.password = password;

      const response = await api.put("/api/auth/profile", data);
      
      // Update Redux state with new info
      dispatch(setUser(response.data.data));
      
      toast.success("Profile updated successfully");
      
      // Clear password fields
      passwordRef.current.value = "";
      confirmPasswordRef.current.value = "";
    } catch (error) {
      errorHandler(error);
    } finally {
      setUpdating(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-primary text-white text-center py-3">
              <h3 className="mb-0">My Profile</h3>
            </Card.Header>
            <Card.Body className="p-4">
              <Form onSubmit={handleUpdate}>
                {/* Read-Only Email */}
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control 
                    type="email" 
                    value={userData?.email || ""} 
                    disabled 
                    className="bg-light"
                  />
                  <Form.Text className="text-muted">
                    Email cannot be changed.
                  </Form.Text>
                </Form.Group>

                {/* Editable Name */}
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    ref={nameRef}
                    defaultValue={userData?.name}
                    required 
                  />
                </Form.Group>

                <hr className="my-4" />
                <h5 className="mb-3 text-muted">Change Password</h5>

                {/* Password Fields */}
                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control 
                    type="password" 
                    ref={passwordRef}
                    placeholder="Leave blank to keep current" 
                    minLength={6}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control 
                    type="password" 
                    ref={confirmPasswordRef}
                    placeholder="Confirm new password" 
                  />
                </Form.Group>

                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100" 
                  disabled={updating}
                >
                  {updating ? "Updating..." : "Save Changes"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};