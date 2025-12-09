import { Navbar as BNavbar, Button, Container, Nav } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearUser } from "../../store/slices/userSlice";

export const Navbar = () => {
  // Get User Logged Or Not
  const { isLoggedIn } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const go = useNavigate();

  // Handlers
  function handleLogout() {
    dispatch(clearUser());
    localStorage.removeItem("token");
    go("/login");
  }

  return (
    <BNavbar expand="md" bg="dark" data-bs-theme="dark">
      <Container>
        <BNavbar.Brand as={Link} to="/">
          BookStore
        </BNavbar.Brand>

        <BNavbar.Toggle aria-controls="basic-navbar-nav" />

        <BNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>

            {!isLoggedIn && (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
              </>
            )}

            {/* Show Logout if Logged In */}
            {isLoggedIn && (
              <Button variant="outline-danger" onClick={handleLogout} className="ms-2">
                Logout
              </Button>
            )}
          </Nav>
        </BNavbar.Collapse>
      </Container>
    </BNavbar>
  );
};