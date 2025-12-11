import { useRef, useState } from "react";
import { Button, Form, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../apis/api";
import { errorHandler } from "../utils/errorHandler";
import { Loading } from "../components/Loading/Loading";

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
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <h2 className="text-center mb-4">Sell a Book</h2>
          <Form onSubmit={handleCreateBook} className="border p-4 rounded shadow-sm bg-white">
            
            {/* Title & Author */}
            <Form.Group className="mb-3">
              <Form.Label>Book Title</Form.Label>
              <Form.Control type="text" ref={titleRef} required placeholder="e.g. The Great Gatsby" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Author</Form.Label>
              <Form.Control type="text" ref={authorRef} required />
            </Form.Group>

            {/* Category & Stock (New Row) */}
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select ref={categoryRef} required defaultValue="">
                    <option value="" disabled>Select Category</option>
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
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Stock Quantity</Form.Label>
                  <Form.Control type="number" ref={stockRef} required min="1" defaultValue="1" />
                </Form.Group>
              </div>
            </div>

            {/* Price & Condition */}
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

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} ref={descriptionRef} required />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Book Cover Image</Form.Label>
              <Form.Control type="file" ref={imageRef} accept="image/*" />
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