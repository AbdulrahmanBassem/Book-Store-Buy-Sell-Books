import { useEffect, useRef, useState } from "react";
import { Button, Form, Container } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../apis/api";
import { errorHandler } from "../utils/errorHandler";
import { Loading } from "../components/Loading/Loading";

export const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Refs
  const titleRef = useRef();
  const authorRef = useRef();
  const descriptionRef = useRef();
  const priceRef = useRef();
  const conditionRef = useRef();
  const imageRef = useRef();

  // 1. Fetch Existing Data
  useEffect(() => {
    async function fetchBook() {
      try {
        const response = await api.get(`/api/books/${id}`);
        const book = response.data.data;

        // Pre-fill fields manually since we use refs
        if (titleRef.current) titleRef.current.value = book.title;
        if (authorRef.current) authorRef.current.value = book.author;
        if (descriptionRef.current) descriptionRef.current.value = book.description;
        if (priceRef.current) priceRef.current.value = book.price;
        if (conditionRef.current) conditionRef.current.value = book.condition;
        
      } catch (error) {
        errorHandler(error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    }
    fetchBook();
  }, [id, navigate]);

  // 2. Handle Update
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

      // Only append image if a new one was selected
      if (imageRef.current.files[0]) {
        formData.append("image", imageRef.current.files[0]);
      }

      await api.put(`/api/books/${id}`, formData);

      toast.success("Book updated successfully!");
      navigate(`/books/${id}`); // Go back to details page
    } catch (error) {
      errorHandler(error);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <Container className="my-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <h2 className="text-center mb-4">Edit Listing</h2>
          <Form onSubmit={handleUpdateBook} className="border p-4 rounded shadow-sm bg-white">
            
            <Form.Group className="mb-3">
              <Form.Label>Book Title</Form.Label>
              <Form.Control type="text" ref={titleRef} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Author</Form.Label>
              <Form.Control type="text" ref={authorRef} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} ref={descriptionRef} required />
            </Form.Group>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Price ($)</Form.Label>
                  <Form.Control type="number" ref={priceRef} required min="0" step="0.01" />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Condition</Form.Label>
                  <Form.Select ref={conditionRef} required>
                    <option value="New">New</option>
                    <option value="Like New">Like New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-4">
              <Form.Label>Update Cover Image (Optional)</Form.Label>
              <Form.Control type="file" ref={imageRef} accept="image/*" />
              <Form.Text className="text-muted">
                Leave empty to keep the current image.
              </Form.Text>
            </Form.Group>

            <div className="d-flex gap-2">
              <Button variant="secondary" className="w-50" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" className="w-50" disabled={submitting}>
                {submitting ? "Updating..." : "Save Changes"}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </Container>
  );
};