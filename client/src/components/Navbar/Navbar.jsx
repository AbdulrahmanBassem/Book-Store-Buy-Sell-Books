import { Navbar as BNavbar, Button, Container, Nav } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, NavLink } from "react-router-dom"; // <--- Import NavLink
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

  const activeStyle = ({ isActive }) => ({
    color: isActive ? "#fff" : "rgba(255, 255, 255, 0.55)", 
    fontWeight: isActive ? "bold" : "normal",
  });

  return (
    <BNavbar expand="md" bg="dark" data-bs-theme="dark">
      <Container>
        <BNavbar.Brand as={Link} to="/">
          BookStore
        </BNavbar.Brand>

        <BNavbar.Toggle aria-controls="basic-navbar-nav" />

        <BNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            
            <Nav.Link as={NavLink} to="/" style={activeStyle} end>
              Home
            </Nav.Link>

            {!isLoggedIn && (
              <>
                <Nav.Link as={NavLink} to="/login" style={activeStyle}>
                  Login
                </Nav.Link>
                <Nav.Link as={NavLink} to="/register" style={activeStyle}>
                  Register
                </Nav.Link>
              </>
            )}

            {isLoggedIn && (
              <>
                <Nav.Link as={NavLink} to="/create-book" className="text-warning fw-bold me-3">
                  + Sell Book
                </Nav.Link>
                
                <Nav.Link as={NavLink} to="/my-books" style={activeStyle}>
                  My Books
                </Nav.Link>

                <Nav.Link as={NavLink} to="/purchase-history" style={activeStyle} className="me-3">
                  History
                </Nav.Link>
                
                <Nav.Link as={NavLink} to="/profile" style={activeStyle} className="me-3">
                  Profile
                </Nav.Link>

                <Button variant="outline-danger" onClick={handleLogout} size="sm">
                  Logout
                </Button>
              </>
            )}
          </Nav>
        </BNavbar.Collapse>
      </Container>
    </BNavbar>
  );
};