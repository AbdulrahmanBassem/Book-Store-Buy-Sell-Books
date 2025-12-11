import { Navbar as BNavbar, Button, Container, Nav } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { clearUser } from "../../store/slices/userSlice";
import { 
  FaBook, 
  FaHistory, 
  FaHome, 
  FaSignInAlt, 
  FaSignOutAlt, 
  FaUser, 
  FaUserPlus, 
  FaPlusCircle 
} from "react-icons/fa";

// CSS
import "./Navbar.css";

export const Navbar = () => {
  const { isLoggedIn, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const go = useNavigate();

  function handleLogout() {
    dispatch(clearUser());
    localStorage.removeItem("token");
    go("/login");
  }

  return (
    <BNavbar expand="lg" bg="dark" data-bs-theme="dark" className="navbar-custom sticky-top py-3">
      <Container>
        <BNavbar.Brand 
          as={Link} 
          to="/" 
          className="fw-bold fs-4 d-flex align-items-center gap-2 text-white"
        >
          <FaBook className="text-warning" size={28} /> 
          <span>BookStore</span>
        </BNavbar.Brand>

        <BNavbar.Toggle aria-controls="basic-navbar-nav" />

        <BNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center gap-3">
            
            <Nav.Link as={NavLink} to="/" className="nav-link-custom" end>
              <FaHome /> Home
            </Nav.Link>

            {!isLoggedIn ? (
              <>
                <Nav.Link as={NavLink} to="/login" className="nav-link-custom">
                  <FaSignInAlt /> Login
                </Nav.Link>
                <Nav.Link as={NavLink} to="/register" className="nav-link-custom">
                  <FaUserPlus /> Register
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/my-books" className="nav-link-custom">
                  <FaBook /> My Books
                </Nav.Link>

                <Nav.Link as={NavLink} to="/purchase-history" className="nav-link-custom">
                  <FaHistory /> History
                </Nav.Link>
                
                <Nav.Link as={NavLink} to="/profile" className="nav-link-custom">
                  <FaUser /> {user?.name ? user.name.split(' ')[0] : 'Profile'}
                </Nav.Link>

                <Button 
                  as={Link} 
                  to="/create-book" 
                  variant="warning" 
                  className="btn-sell rounded-pill px-4 ms-2"
                >
                  <FaPlusCircle /> Sell Book
                </Button>

                <Button 
                  variant="outline-light" 
                  onClick={handleLogout} 
                  size="sm"
                  className="btn-logout rounded-pill px-3 ms-2"
                  title="Logout"
                >
                  <FaSignOutAlt />
                </Button>
              </>
            )}
          </Nav>
        </BNavbar.Collapse>
      </Container>
    </BNavbar>
  );
};