import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEdit, FaTrash, FaEye, FaSync } from "react-icons/fa"; 
import { api } from "../apis/api";
import { errorHandler } from "../utils/errorHandler";
import { Loading } from "../components/Loading/Loading";

// CSS
import "../styles/MyBooks.css";

export const MyBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const baseURL = import.meta.env.VITE_BACKEND_BASE || "http://localhost:5000";

  useEffect(() => {
    fetchMyBooks();
  }, []);

  async function fetchMyBooks() {
    try {
      const response = await api.get("/api/books/my-books");
      setBooks(response.data.data);
    } catch (error) {
      errorHandler(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    try {
      await api.delete(`/api/books/${id}`);
      toast.success("Book deleted");
      setBooks((prev) => prev.filter((book) => book._id !== id));
    } catch (error) {
      errorHandler(error);
    }
  }

  async function handleMarkAvailable(id) {
    if (!window.confirm("Mark this book as available for sale again?")) return;

    setActionLoading(true);
    try {
      const formData = new FormData();
      formData.append("status", "available");
      formData.append("stock", 1); // Reset stock to 1

      await api.put(`/api/books/${id}`, formData);

      toast.success("Book is now available!");
      fetchMyBooks();
    } catch (error) {
      errorHandler(error);
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <Container className="my-5">
      <div className="page-header">
        <h2 className="page-title">My Listed Books</h2>
        <Button
          as={Link}
          to="/create-book"
          variant="success"
          className="fw-bold px-4 rounded-pill"
        >
          + Sell New Book
        </Button>
      </div>

      <Row className="g-4">
        {books.length > 0 ? (
          books.map((book) => (
            <Col key={book._id} sm={12} md={6} lg={4} xl={3}>
              <Card className="manage-card">
                <div className="manage-img-wrapper">
                  <Card.Img
                    variant="top"
                    src={
                      book.image
                        ? `${baseURL}/${book.image}`
                        : "https://via.placeholder.com/150"
                    }
                    className="manage-img"
                  />
                  {book.status === "sold" ? (
                    <Badge bg="danger" className="status-badge">
                      SOLD
                    </Badge>
                  ) : (
                    <Badge bg="success" className="status-badge">
                      ACTIVE
                    </Badge>
                  )}
                </div>

                <Card.Body className="d-flex flex-column">
                  <Card.Title
                    className="text-truncate fw-bold"
                    title={book.title}
                  >
                    {book.title}
                  </Card.Title>
                  <Card.Text className="text-primary fw-bold mb-1">
                    ${book.price}
                  </Card.Text>
                  <small className="text-muted mb-3">
                    {book.category} • {book.stock} left
                  </small>

                  <div className="card-actions">
                    {/* Status Toggle */}
                    {book.status === "sold" && (
                      <Button
                        variant="warning"
                        size="sm"
                        className="w-100 mb-2 fw-bold d-flex align-items-center justify-content-center gap-2"
                        onClick={() => handleMarkAvailable(book._id)}
                        disabled={actionLoading}
                      >
                        <FaSync /> Mark Available
                      </Button>
                    )}

                    <div className="d-flex gap-2">
                      <Button
                        as={Link}
                        to={`/edit-book/${book._id}`}
                        variant="outline-primary"
                        className="w-50 d-flex align-items-center justify-content-center gap-1"
                        size="sm"
                      >
                        <FaEdit /> Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        className="w-50 d-flex align-items-center justify-content-center gap-1"
                        size="sm"
                        onClick={() => handleDelete(book._id)}
                      >
                        <FaTrash /> Delete
                      </Button>
                    </div>

                    <div className="text-center mt-2">
                      <Link
                        to={`/books/${book._id}`}
                        className="text-decoration-none small text-muted"
                      >
                        <FaEye className="me-1" /> View Public Listing
                      </Link>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col className="text-center py-5">
            <h4 className="text-muted">You haven't listed any books yet.</h4>
            <Button
              as={Link}
              to="/create-book"
              variant="primary"
              className="mt-3 rounded-pill px-4"
            >
              Start Selling Today
            </Button>
          </Col>
        )}
      </Row>
    </Container>
  );
};
