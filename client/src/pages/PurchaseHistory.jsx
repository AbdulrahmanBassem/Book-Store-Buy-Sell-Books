import { useEffect, useState } from "react";
import { Container, Table, Badge, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { api } from "../apis/api";
import { errorHandler } from "../utils/errorHandler";
import { Loading } from "../components/Loading/Loading";

export const PurchaseHistory = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPurchases() {
      try {
        const response = await api.get("/api/purchases");
        setPurchases(response.data.data);
      } catch (error) {
        errorHandler(error);
      } finally {
        setLoading(false);
      }
    }
    fetchPurchases();
  }, []);

  if (loading) return <Loading />;

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">My Purchase History</h2>
      
      {purchases.length === 0 ? (
        <div className="text-center mt-5">
          <h4>You haven't bought any books yet.</h4>
          <Link to="/">
            <Button variant="primary" className="mt-3">Browse Books</Button>
          </Link>
        </div>
      ) : (
        <Table responsive striped bordered hover className="shadow-sm">
          <thead className="bg-dark text-white">
            <tr>
              <th>#</th>
              <th>Book Title</th>
              <th>Author</th>
              <th>Price</th>
              <th>Seller</th>
              <th>Purchase Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((purchase, index) => (
              <tr key={purchase._id}>
                <td>{index + 1}</td>
                {purchase.book ? (
                  <>
                    <td className="fw-bold">{purchase.book.title}</td>
                    <td>{purchase.book.author}</td>
                    <td>${purchase.book.price}</td>
                    <td>{purchase.book.seller?.name || "Unknown"}</td>
                  </>
                ) : (
                  <td colSpan="4" className="text-muted fst-italic">
                    Book no longer exists (Deleted by seller)
                  </td>
                )}
                <td>
                  {new Date(purchase.purchaseDate).toLocaleDateString()}
                </td>
                <td>
                  {purchase.book && (
                    <Button 
                      as={Link} 
                      to={`/books/${purchase.book._id}`} 
                      variant="outline-info" 
                      size="sm"
                    >
                      View Book
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};