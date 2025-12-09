import { useRef, useState } from "react";
import { Button, Form, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../apis/api";
import { errorHandler } from "../utils/errorHandler";
import { Loading } from "../components/Loading/Loading";

export const CreateBook = () => {
  const [loading, setLoading] = useState(false);
  
  // Refs
  const titleRef = useRef();
  const authorRef = useRef();
  const descriptionRef = useRef();
  const priceRef = useRef();
  const conditionRef = useRef();
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
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <h2 className="text-center mb-4">Sell a Book</h2>
          <Form onSubmit={handleCreateBook} className="border p-4 rounded shadow-sm bg-white">
            
            {/* Title */}
            <Form.Group className="mb-3">
              <Form.Label>Book Title</Form.Label>
              <Form.Control type="text" ref={titleRef} required placeholder="e.g. The Great Gatsby" />
            </Form.Group>

            {/* Author */}
            <Form.Group className="mb-3">
              <Form.Label>Author</Form.Label>
              <Form.Control type="text" ref={authorRef} required placeholder="e.g. F. Scott Fitzgerald" />
            </Form.Group>

            {/* Description */}
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} ref={descriptionRef} required placeholder="Brief summary or details..." />
            </Form.Group>

            {/* Price & Condition*/}
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
                  <Form.Select ref={conditionRef} required defaultValue="">
                    <option value="" disabled>Select Condition</option>
                    <option value="New">New</option>
                    <option value="Like New">Like New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            {/* Image Upload */}
            <Form.Group className="mb-4">
              <Form.Label>Book Cover Image</Form.Label>
              <Form.Control type="file" ref={imageRef} accept="image/*" />
              <Form.Text className="text-muted">
                Upload a clear image of the book (Max 5MB).
              </Form.Text>
            </Form.Group>

            <Button variant="success" type="submit" className="w-100">
              List Book for Sale
            </Button>
          </Form>
        </div>
      </div>
    </Container>
  );
};