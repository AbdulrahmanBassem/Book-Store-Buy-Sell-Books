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

export const Navbar = () => {
  const { isLoggedIn, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const go = useNavigate();

  function handleLogout() {
    dispatch(clearUser());
    localStorage.removeItem("token");
    go("/login");
  }

  const navLinkStyle = ({ isActive }) => ({
    color: isActive ? "#fff" : "rgba(255, 255, 255, 0.7)",
    fontWeight: isActive ? "600" : "400",
    borderBottom: isActive ? "3px solid #ffc107" : "3px solid transparent",
    paddingBottom: "5px",
    textDecoration: "none",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px"
  });

  return (
    <BNavbar expand="lg" bg="dark" data-bs-theme="dark" className="shadow-sm sticky-top py-3">
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
            
            <Nav.Link as={NavLink} to="/" style={navLinkStyle} end>
              <FaHome /> Home
            </Nav.Link>

            {!isLoggedIn ? (
              <>
                <Nav.Link as={NavLink} to="/login" style={navLinkStyle}>
                  <FaSignInAlt /> Login
                </Nav.Link>
                <Nav.Link as={NavLink} to="/register" style={navLinkStyle}>
                  <FaUserPlus /> Register
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/my-books" style={navLinkStyle}>
                  <FaBook /> My Books
                </Nav.Link>

                <Nav.Link as={NavLink} to="/purchase-history" style={navLinkStyle}>
                  <FaHistory /> History
                </Nav.Link>
                
                <Nav.Link as={NavLink} to="/profile" style={navLinkStyle}>
                  <FaUser /> {user?.name ? user.name.split(' ')[0] : 'Profile'}
                </Nav.Link>

                <Button 
                  as={Link} 
                  to="/create-book" 
                  variant="warning" 
                  className="fw-bold d-flex align-items-center gap-2 rounded-pill px-4 ms-2 text-dark"
                >
                  <FaPlusCircle /> Sell Book
                </Button>

                <Button 
                  variant="outline-light" 
                  onClick={handleLogout} 
                  size="sm"
                  className="d-flex align-items-center gap-2 rounded-pill px-3 ms-2"
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