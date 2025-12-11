import { useRef, useState } from "react";
import { Button, Form, Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../apis/api";
import { errorHandler } from "../utils/errorHandler";
import { Loading } from "../components/Loading/Loading";

// CSS
import "../styles/BookFrom.css";

export const CreateBook = () => {
  const [loading, setLoading] = useState(false);

  const titleRef = useRef();
  const authorRef = useRef();
  const descriptionRef = useRef();
  const priceRef = useRef();
  const conditionRef = useRef();
  const categoryRef = useRef();
  const stockRef = useRef();
  const imageRef = useRef();

  const navigate = useNavigate();

  async function handleCreateBook(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", titleRef.current.value);
      formData.append("author", authorRef.current.value);
      formData.append("description", descriptionRef.current.value);
      formData.append("price", priceRef.current.value);
      formData.append("condition", conditionRef.current.value);
      formData.append("category", categoryRef.current.value);
      formData.append("stock", stockRef.current.value);

      if (imageRef.current.files[0]) {
        formData.append("image", imageRef.current.files[0]);
      }

      await api.post("/api/books", formData);

      toast.success("Book listed successfully!");
      navigate("/");
    } catch (error) {
      errorHandler(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="form-card">
            <div className="form-header">
              <h2>Sell a Book</h2>
              <p className="text-white-50 mb-0">
                Fill in the details to list your book for sale
              </p>
            </div>

            <Card.Body className="p-4 p-md-5">
              <Form onSubmit={handleCreateBook}>
                <h5 className="text-muted mb-4 border-bottom pb-2">
                  Basic Information
                </h5>
                <Row className="g-3 mb-4">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="form-label-custom">
                        Book Title
                      </Form.Label>
                      <Form.Control
                        type="text"
                        ref={titleRef}
                        required
                        placeholder="e.g. The Great Gatsby"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="form-label-custom">
                        Author
                      </Form.Label>
                      <Form.Control
                        type="text"
                        ref={authorRef}
                        required
                        placeholder="e.g. F. Scott Fitzgerald"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <h5 className="text-muted mb-4 border-bottom pb-2">
                  Details & Inventory
                </h5>
                <Row className="g-3 mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="form-label-custom">
                        Category
                      </Form.Label>
                      <Form.Select ref={categoryRef} required defaultValue="">
                        <option value="" disabled>
                          Select Category
                        </option>
                        <option value="Fiction">Fiction</option>
                        <option value="Non-Fiction">Non-Fiction</option>
                        <option value="Science">Science</option>
                        <option value="Technology">Technology</option>
                        <option value="History">History</option>
                        <option value="Biography">Biography</option>
                        <option value="Business">Business</option>
                        <option value="Other">Other</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="form-label-custom">
                        Stock Quantity
                      </Form.Label>
                      <Form.Control
                        type="number"
                        ref={stockRef}
                        required
                        min="1"
                        defaultValue="1"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="g-3 mb-4">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="form-label-custom">
                        Price ($)
                      </Form.Label>
                      <Form.Control
                        type="number"
                        ref={priceRef}
                        required
                        min="0"
                        step="0.01"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="form-label-custom">
                        Condition
                      </Form.Label>
                      <Form.Select ref={conditionRef} required defaultValue="">
                        <option value="" disabled>
                          Select Condition
                        </option>
                        <option value="New">New</option>
                        <option value="Like New">Like New</option>
                        <option value="Good">Good</option>
                        <option value="Fair">Fair</option>
                        <option value="Poor">Poor</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label className="form-label-custom">
                    Description
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    ref={descriptionRef}
                    required
                    placeholder="Provide a brief summary and mention any specific defects..."
                  />
                </Form.Group>

                <h5 className="text-muted mb-4 border-bottom pb-2">
                  Cover Image
                </h5>
                <div className="file-upload-wrapper mb-4">
                  <Form.Group>
                    <Form.Label className="form-label-custom d-block mb-3">
                      Upload a clear photo
                    </Form.Label>
                    <Form.Control type="file" ref={imageRef} accept="image/*" />
                    <Form.Text className="text-muted mt-2 d-block">
                      Max file size: 5MB. Formats: JPG, PNG.
                    </Form.Text>
                  </Form.Group>
                </div>

                <div className="d-grid mt-5">
                  <Button
                    variant="success"
                    type="submit"
                    className="btn-submit py-3"
                    size="lg"
                  >
                    List Book for Sale
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
