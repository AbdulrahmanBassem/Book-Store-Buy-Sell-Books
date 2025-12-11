import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form, InputGroup, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaSearch, FaBookOpen } from "react-icons/fa";
import { api } from "../apis/api";
import { errorHandler } from "../utils/errorHandler";
import { Loading } from "../components/Loading/Loading";

// CSS
import "../styles/Home.css";

export const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("All");

  const baseURL = import.meta.env.VITE_BACKEND_BASE || "http://localhost:5000";
  const categories = ["All", "Fiction", "Non-Fiction", "Science", "Technology", "History", "Biography", "Business", "Other"];

  async function fetchBooks(searchKey = "", selectedCategory = "All") {
    setLoading(true);
    try {
      let query = `?keyword=${searchKey}`;
      if (selectedCategory !== "All") query += `&category=${selectedCategory}`;
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

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks(keyword, category);
  };

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setCategory(newCategory);
    fetchBooks(keyword, newCategory);
  };

  if (loading) return <Loading />;

  return (
    <>
      <div className="hero-section bg-dark text-white">
        <Container className="text-center">
          <h1 className="display-4 fw-bold mb-3">Find Your Next Great Read</h1>
          <p className="lead mb-4 text-white-50">Explore a community-driven marketplace for book lovers.</p>
          
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <Form onSubmit={handleSearch} className="card search-card">
                <Row className="g-2">
                  <Col xs={8}>
                    <InputGroup>
                      <InputGroup.Text className="bg-white border-0"><FaSearch className="text-muted" /></InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Search title or author..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="border-0 shadow-none"
                      />
                    </InputGroup>
                  </Col>
                  <Col xs={4}>
                    <Form.Select 
                      value={category} 
                      onChange={handleCategoryChange}
                      className="border-0 bg-light category-select"
                    >
                      {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                    </Form.Select>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
        </Container>
      </div>

      <Container className="mb-5">
        <Row>
          {books.length > 0 ? (
            books.map((book) => (
              <Col key={book._id} sm={12} md={6} lg={4} xl={3} className="mb-4">
                <Card className="book-card">
                  <div className="card-img-wrapper">
                    <Card.Img
                      variant="top"
                      src={book.image ? `${baseURL}/${book.image}` : "https://via.placeholder.com/150"}
                      className="card-img-custom"
                    />
                    <Badge bg="warning" text="dark" className="category-badge">
                      {book.category}
                    </Badge>
                  </div>
                  
                  <Card.Body className="d-flex flex-column p-4">
                    <Card.Title className="text-truncate fw-bold mb-1" title={book.title}>
                      {book.title}
                    </Card.Title>
                    <Card.Subtitle className="mb-3 text-muted small">
                      by {book.author}
                    </Card.Subtitle>
                    
                    <div className="mt-auto">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="text-primary mb-0 fw-bold">${book.price}</h4>
                        <small className={book.stock > 0 ? "text-success fw-bold" : "text-danger fw-bold"}>
                          {book.stock > 0 ? `${book.stock} In Stock` : "Sold Out"}
                        </small>
                      </div>

                      <div className="d-grid">
                        <Button
                          as={Link}
                          to={`/books/${book._id}`}
                          variant="outline-primary"
                          className="fw-semibold"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col className="text-center py-5">
              <div className="mb-3 text-muted opacity-50">
                <FaBookOpen size={64} />
              </div>
              <h3 className="text-muted fw-light">No books found.</h3>
              <p className="text-muted mb-4">Try adjusting your search or category filter.</p>
              {(keyword || category !== "All") && (
                <Button 
                  variant="primary" 
                  onClick={() => { setKeyword(""); setCategory("All"); fetchBooks("", "All"); }}
                >
                  Clear Filters
                </Button>
              )}
            </Col>
          )}
        </Row>
      </Container>
    </>
  );
};