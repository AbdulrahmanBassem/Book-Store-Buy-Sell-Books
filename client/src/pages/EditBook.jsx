import { useEffect, useRef, useState } from "react";
import { Button, Form, Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../apis/api";
import { errorHandler } from "../utils/errorHandler";
import { Loading } from "../components/Loading/Loading";

// CSS
import "../styles/BookFrom.css";

export const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const titleRef = useRef();
  const authorRef = useRef();
  const descriptionRef = useRef();
  const priceRef = useRef();
  const conditionRef = useRef();
  const categoryRef = useRef();
  const stockRef = useRef();
  const imageRef = useRef();

  useEffect(() => {
    async function fetchBook() {
      try {
        const response = await api.get(`/api/books/${id}`);
        const book = response.data.data;

        if (titleRef.current) titleRef.current.value = book.title;
        if (authorRef.current) authorRef.current.value = book.author;
        if (descriptionRef.current) descriptionRef.current.value = book.description;
        if (priceRef.current) priceRef.current.value = book.price;
        if (conditionRef.current) conditionRef.current.value = book.condition;
        if (categoryRef.current) categoryRef.current.value = book.category || "Other";
        if (stockRef.current) stockRef.current.value = book.stock;
        
      } catch (error) {
        errorHandler(error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    }
    fetchBook();
  }, [id, navigate]);

  async function handleUpdateBook(e) {
    e.preventDefault();
    setSubmitting(true);

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

      await api.put(`/api/books/${id}`, formData);

      toast.success("Book updated successfully!");
      navigate(`/books/${id}`); 
    } catch (error) {
      errorHandler(error);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="form-card">
            <div className="form-header">
              <h2>Edit Listing</h2>
              <p className="text-white-50 mb-0">Update your book details</p>
            </div>
            
            <Card.Body className="p-4 p-md-5">
              <Form onSubmit={handleUpdateBook}>
                
                <h5 className="text-muted mb-4 border-bottom pb-2">Information</h5>
                <Row className="g-3 mb-4">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="form-label-custom">Book Title</Form.Label>
                      <Form.Control type="text" ref={titleRef} required />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="form-label-custom">Author</Form.Label>
                      <Form.Control type="text" ref={authorRef} required />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="g-3 mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="form-label-custom">Category</Form.Label>
                      <Form.Select ref={categoryRef} required>
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
                      <Form.Label className="form-label-custom">Stock Quantity</Form.Label>
                      <Form.Control type="number" ref={stockRef} required min="0" />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="g-3 mb-4">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="form-label-custom">Price ($)</Form.Label>
                      <Form.Control type="number" ref={priceRef} required min="0" step="0.01" />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="form-label-custom">Condition</Form.Label>
                      <Form.Select ref={conditionRef} required>
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
                  <Form.Label className="form-label-custom">Description</Form.Label>
                  <Form.Control as="textarea" rows={4} ref={descriptionRef} required />
                </Form.Group>

                <div className="file-upload-wrapper mb-4">
                  <Form.Group>
                    <Form.Label className="form-label-custom d-block mb-3">Update Cover Image</Form.Label>
                    <Form.Control type="file" ref={imageRef} accept="image/*" />
                    <Form.Text className="text-muted mt-2 d-block">
                      Leave empty to keep the current image.
                    </Form.Text>
                  </Form.Group>
                </div>

                <div className="d-flex gap-3 mt-5">
                  <Button variant="secondary" className="w-50 py-3 fw-bold" onClick={() => navigate(-1)}>
                    Cancel
                  </Button>
                  <Button variant="success" type="submit" className="w-50 py-3 btn-submit" disabled={submitting}>
                    {submitting ? "Updating..." : "Save Changes"}
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