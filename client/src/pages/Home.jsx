import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  InputGroup,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { api } from "../apis/api";
import { errorHandler } from "../utils/errorHandler";
import { Loading } from "../components/Loading/Loading";

export const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");

  // Get Backend URL for images
  const baseURL = import.meta.env.VITE_BACKEND_BASE || "http://localhost:5000";

  // Fetch Books Function
  async function fetchBooks(searchKey = "") {
    setLoading(true);
    try {
      // Pass keyword if it exists
      const query = searchKey ? `?keyword=${searchKey}` : "";
      const response = await api.get(`/api/books${query}`);

      setBooks(response.data.data);
    } catch (error) {
      errorHandler(error);
    } finally {
      setLoading(false);
    }
  }

  // Initial Load
  useEffect(() => {
    fetchBooks();
  }, []);

  // Search Handler
  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks(keyword);
  };

  if (loading) return <Loading />;

  return (
    <Container className="my-4">
      {/* Search Bar */}
      <Form onSubmit={handleSearch} className="mb-4">
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="Search by title or author..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Button variant="outline-primary" type="submit">
            <FaSearch /> Search
          </Button>
        </InputGroup>
      </Form>

      {/* Books Grid */}
      <Row>
        {books.length > 0 ? (
          books.map((book) => (
            <Col key={book._id} sm={12} md={6} lg={4} xl={3} className="mb-4">
              <Card className="h-100 shadow-sm">
                <div style={{ height: "200px", overflow: "hidden" }}>
                  <Card.Img
                    variant="top"
                    src={
                      book.image
                        ? `${baseURL}/${book.image.replace(/\\/g, "/")}`
                        : "https://via.placeholder.com/150"
                    }
                    style={{
                      objectFit: "cover",
                      height: "100%",
                      width: "100%",
                    }}
                  />
                </div>
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="text-truncate" title={book.title}>
                    {book.title}
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    by {book.author}
                  </Card.Subtitle>
                  <Card.Text>
                    <strong>Price:</strong> ${book.price} <br />
                    <small className="text-muted">
                      Condition: {book.condition}
                    </small>
                  </Card.Text>

                  <Button
                    as={Link}
                    to={`/books/${book._id}`} 
                    variant="primary"
                    className="mt-auto w-100"
                  >
                    View Details
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <h4 className="text-center text-muted">No books found.</h4>
          </Col>
        )}
      </Row>
    </Container>
  );
};
