import { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { api } from "../apis/api";
import { setUser } from "../store/slices/userSlice";
import { errorHandler } from "../utils/errorHandler";
import { Loading } from "../components/Loading/Loading";

// CSS
import "../styles/Profile.css";

export const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [userData, setUserData] = useState(null);

  const nameRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await api.get("/api/auth/profile");
        setUserData(response.data.data);
        if (nameRef.current) nameRef.current.value = response.data.data.name;
      } catch (error) {
        errorHandler(error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  async function handleUpdate(e) {
    e.preventDefault();
    setUpdating(true);

    const name = nameRef.current.value;
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;

    if (password && password !== confirmPassword) {
      toast.error("Passwords do not match");
      setUpdating(false);
      return;
    }

    try {
      const data = { name };
      if (password) data.password = password;

      const response = await api.put("/api/auth/profile", data);
      dispatch(setUser(response.data.data));
      toast.success("Profile updated successfully");
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
          <Card className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                {userData?.name?.charAt(0).toUpperCase()}
              </div>
              <h3 className="mb-0">{userData?.name}</h3>
              <p className="text-white-50 mb-0">{userData?.email}</p>
            </div>
            
            <Card.Body className="p-4 p-md-5">
              <Form onSubmit={handleUpdate}>
                
                <h5 className="section-title">Account Details</h5>
                
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control 
                    type="email" 
                    value={userData?.email || ""} 
                    disabled 
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    ref={nameRef}
                    defaultValue={userData?.name}
                    required 
                  />
                </Form.Group>

                <h5 className="section-title mt-5">Security</h5>

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

                <div className="d-grid mt-5">
                  <Button 
                    variant="success" 
                    type="submit" 
                    className="py-3 fw-bold text-uppercase" 
                    disabled={updating}
                  >
                    {updating ? "Updating..." : "Save Changes"}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};