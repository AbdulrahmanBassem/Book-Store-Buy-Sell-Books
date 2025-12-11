import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form, InputGroup, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { api } from "../apis/api";
import { errorHandler } from "../utils/errorHandler";
import { Loading } from "../components/Loading/Loading";

export const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("All"); 

  const baseURL = import.meta.env.VITE_BACKEND_BASE || "http://localhost:5000";

  // Categories List 
  const categories = ["All", "Fiction", "Non-Fiction", "Science", "Technology", "History", "Biography", "Business", "Other"];

  // Fetch Books
  async function fetchBooks(searchKey = "", selectedCategory = "All") {
    setLoading(true);
    try {
      let query = `?keyword=${searchKey}`;
      if (selectedCategory !== "All") {
        query += `&category=${selectedCategory}`;
      }

      const response = await api.get(`/api/books${query}`);
      setBooks(response.data.data);
    } catch (error) {
      errorHandler(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBooks();
  }, []);

  // Handle Search Submit
  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks(keyword, category);
  };

  // Handle Category Change (Auto-fetch)
  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setCategory(newCategory);
    fetchBooks(keyword, newCategory);
  };

  if (loading) return <Loading />;

  return (
    <Container className="my-4">
      {/* Search & Filter Bar */}
      <Form onSubmit={handleSearch} className="mb-4">
        <Row className="g-2">
          <Col md={8}>
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
          </Col>
          <Col md={4}>
            <Form.Select 
              value={category} 
              onChange={handleCategoryChange}
              aria-label="Filter by category"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
      </Form>

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
                  <Badge 
                    bg="secondary" 
                    className="position-absolute bottom-0 start-0 m-2 opacity-75"
                  >
                    {book.category}
                  </Badge>
                </div>
                
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="text-truncate" title={book.title}>
                    {book.title}
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    by {book.author}
                  </Card.Subtitle>
                  
                  <Card.Text>
                    <strong className="text-primary fs-5">${book.price}</strong>
                    <br />
                    <small className="text-muted">
                      {book.condition} • {book.stock > 0 ? `${book.stock} left` : "Out of Stock"}
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
          <Col className="text-center py-5">
            <h4 className="text-muted">No books found in this category.</h4>
            {(keyword || category !== "All") && (
              <Button 
                variant="link" 
                onClick={() => {
                  setKeyword("");
                  setCategory("All");
                  fetchBooks("", "All");
                }}
              >
                Clear Filters
              </Button>
            )}
          </Col>
        )}
      </Row>
    </Container>
  );
};