import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Badge, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { api } from "../apis/api";
import { errorHandler } from "../utils/errorHandler";
import { Loading } from "../components/Loading/Loading";

// CSS
import "../styles/BookDetails.css";

export const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useSelector((state) => state.user);
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const baseURL = import.meta.env.VITE_BACKEND_BASE || "http://localhost:5000";

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

  async function handleBuy() {
    if (!isLoggedIn) {
      toast.error("Please login to buy books");
      navigate("/login");
      return;
    }

    if (!window.confirm(`Are you sure you want to buy "${book.title}" for $${book.price}?`)) return;

    setActionLoading(true);
    try {
      await api.post(`/api/purchases/${book._id}`);
      toast.success("Purchase successful!");
      
      const response = await api.get(`/api/books/${id}`);
      setBook(response.data.data);
      
    } catch (error) {
      errorHandler(error);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;

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

  const isOwner = isLoggedIn && user?._id === (book.seller._id || book.seller);
  const isOutOfStock = book.stock < 1;

  return (
    <Container className="book-details-container">
      <Row className="g-5 justify-content-center">
        <Col md={5}>
          <div className="book-cover-wrapper">
            <img
              src={book.image ? `${baseURL}/${book.image}` : "https://via.placeholder.com/400"}
              alt={book.title}
              className="book-cover-img"
            />
          </div>
        </Col>

        <Col md={7}>
          <h1 className="book-title mb-2">{book.title}</h1>
          <p className="book-author mb-4">by {book.author}</p>
          
          <div className="mb-4 d-flex flex-wrap gap-2">
            <Badge bg="secondary" className="badge-custom">
              {book.category || "General"}
            </Badge>
            <Badge bg="info" className="badge-custom text-dark">
              Condition: {book.condition}
            </Badge>
            <Badge bg={isOutOfStock ? "danger" : "success"} className="badge-custom">
              {isOutOfStock ? "Out of Stock" : `${book.stock} In Stock`}
            </Badge>
          </div>

          <div className="mb-4">
            <span className="price-tag">${book.price}</span>
          </div>

          <h5 className="fw-bold mb-2">Description</h5>
          <p className="description-text mb-5">{book.description}</p>

          <div className="d-flex gap-3 mb-4">
            {isOwner ? (
              <>
                <Button 
                  variant="outline-primary" 
                  size="lg"
                  className="px-4 fw-bold"
                  onClick={() => navigate(`/edit-book/${book._id}`)} 
                  disabled={actionLoading}
                >
                  Edit Listing
                </Button>
                <Button 
                  variant="danger" 
                  size="lg"
                  className="px-4 fw-bold"
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
                className="px-5 py-3 fw-bold shadow-sm"
                onClick={handleBuy}
                disabled={isOutOfStock || actionLoading}
              >
                {actionLoading ? <Spinner size="sm" /> : isOutOfStock ? "Sold Out" : "Buy Now"}
              </Button>
            )}
          </div>
          
          <div className="seller-info">
             Sold by: <strong>{book.seller?.name || "Unknown"}</strong>
          </div>
        </Col>
      </Row>
    </Container>
  );
};