import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Button, Badge, Card, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { api } from "../apis/api";
import { errorHandler } from "../utils/errorHandler";
import { Loading } from "../components/Loading/Loading";

export const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useSelector((state) => state.user);
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const baseURL = import.meta.env.VITE_BACKEND_BASE || "http://localhost:5000";

  // Fetch Book Data
  useEffect(() => {
    async function fetchBook() {
      try {
        const response = await api.get(`/api/books/${id}`);
        setBook(response.data.data);
      } catch (error) {
        errorHandler(error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    }
    fetchBook();
  }, [id, navigate]);

  // Handle Buy Book
  async function handleBuy() {
    if (!isLoggedIn) {
      toast.error("Please login to buy books");
      navigate("/login");
      return;
    }

    // Confirm
    if (!window.confirm(`Are you sure you want to buy "${book.title}" for $${book.price}?`)) return;

    setActionLoading(true);
    try {
      await api.post(`/api/purchases/${book._id}`);
      toast.success("Purchase successful!");
      navigate("/");
    } catch (error) {
      errorHandler(error);
    } finally {
      setActionLoading(false);
    }
  }

  // Handle Delete Book
  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this listing? This cannot be undone.")) return;

    setActionLoading(true);
    try {
      await api.delete(`/api/books/${book._id}`);
      toast.success("Book deleted successfully");
      navigate("/");
    } catch (error) {
      errorHandler(error);
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) return <Loading />;
  if (!book) return <h2 className="text-center my-5">Book not found</h2>;

  // Check if current user is the owner
  const isOwner = isLoggedIn && user?._id === (book.seller._id || book.seller);

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={5} className="mb-4">
          <Card className="shadow-sm border-0">
            <Card.Img
              variant="top"
              src={book.image ? `${baseURL}/${book.image}` : "https://via.placeholder.com/400"}
              style={{ maxHeight: "500px", objectFit: "contain", backgroundColor: "#f8f9fa" }}
            />
          </Card>
        </Col>

        <Col md={7}>
          <h2 className="display-5 fw-bold">{book.title}</h2>
          <h4 className="text-muted mb-3">by {book.author}</h4>
          
          <div className="mb-4">
            <Badge bg={book.status === "available" ? "success" : "danger"} className="me-2 p-2">
              {book.status === "available" ? "Available" : "Sold Out"}
            </Badge>
            <Badge bg="info" className="p-2 text-dark">
              Condition: {book.condition}
            </Badge>
          </div>

          <h3 className="text-primary mb-4">${book.price}</h3>

          <p className="lead" style={{ fontSize: "1.1rem" }}>{book.description}</p>

          <hr className="my-4" />

          <div className="d-flex gap-3">
            {isOwner ? (
              <>
                <Button 
                  variant="outline-primary" 
                  size="lg"
                  onClick={() => navigate(`/edit-book/${book._id}`)} 
                  disabled={actionLoading}
                >
                  Edit Listing
                </Button>
                <Button 
                  variant="danger" 
                  size="lg"
                  onClick={handleDelete}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Deleting..." : "Delete Listing"}
                </Button>
              </>
            ) : (
              <Button 
                variant="success" 
                size="lg" 
                className="px-5"
                onClick={handleBuy}
                disabled={book.status === "sold" || actionLoading}
              >
                {actionLoading ? <Spinner size="sm" /> : book.status === "sold" ? "Sold Out" : "Buy Now"}
              </Button>
            )}
          </div>
          
          <div className="mt-3">
             <small className="text-muted">Seller: {book.seller?.name || "Unknown"}</small>
          </div>
        </Col>
      </Row>
    </Container>
  );
};