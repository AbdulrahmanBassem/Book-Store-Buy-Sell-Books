import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../apis/api";
import { errorHandler } from "../utils/errorHandler";
import { Loading } from "../components/Loading/Loading";

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
    <Container className="my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Listed Books</h2>
        <Button as={Link} to="/create-book" variant="success">
          + Sell New Book
        </Button>
      </div>

      <Row>
        {books.length > 0 ? (
          books.map((book) => (
            <Col key={book._id} sm={12} md={6} lg={4} xl={3} className="mb-4">
              <Card className="h-100 shadow-sm">
                <div style={{ height: "200px", overflow: "hidden", position: "relative" }}>
                  <Card.Img
                    variant="top"
                    src={book.image ? `${baseURL}/${book.image}` : "https://via.placeholder.com/150"}
                    style={{ objectFit: "cover", height: "100%", width: "100%" }}
                  />
                  {book.status === "sold" && (
                    <Badge bg="danger" className="position-absolute top-0 end-0 m-2">
                      SOLD
                    </Badge>
                  )}
                </div>
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="text-truncate">{book.title}</Card.Title>
                  <Card.Text>
                    <strong>Price:</strong> ${book.price}
                  </Card.Text>
                  
                  <div className="mt-auto d-flex flex-column gap-2">
                    {/* Status Toggle */}
                    {book.status === "sold" && (
                      <Button 
                        variant="warning" 
                        size="sm"
                        onClick={() => handleMarkAvailable(book._id)}
                        disabled={actionLoading}
                        className="mb-1"
                      >
                        Mark as Available
                      </Button>
                    )}

                    <div className="d-flex gap-2">
                      <Button 
                        as={Link} 
                        to={`/edit-book/${book._id}`} 
                        variant="outline-primary" 
                        className="w-50"
                        size="sm"
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        className="w-50"
                        size="sm"
                        onClick={() => handleDelete(book._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  
                  <Button 
                    as={Link} 
                    to={`/books/${book._id}`} 
                    variant="link" 
                    size="sm" 
                    className="text-decoration-none mt-2"
                  >
                    View Details
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col className="text-center mt-5">
            <h4>You haven't listed any books yet.</h4>
            <Button as={Link} to="/create-book" variant="primary" className="mt-3">
              Start Selling
            </Button>
          </Col>
        )}
      </Row>
    </Container>
  );
};