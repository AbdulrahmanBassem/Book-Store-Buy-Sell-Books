import { useEffect, useState } from "react";
import { Container, Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaExternalLinkAlt } from "react-icons/fa";
import { api } from "../apis/api";
import { errorHandler } from "../utils/errorHandler";
import { Loading } from "../components/Loading/Loading";

// CSS
import "../styles/PurchaseHistory.css";

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
      <div className="page-header">
        <h2 className="page-title">My Orders</h2>
        <p className="text-muted mb-0">Track your book purchases</p>
      </div>

      {purchases.length === 0 ? (
        <div className="text-center mt-5 py-5 bg-light rounded-3">
          <h4 className="text-muted mb-3">You haven't bought any books yet.</h4>
          <Link to="/">
            <Button variant="primary" className="px-4 py-2 fw-bold">
              Browse Books
            </Button>
          </Link>
        </div>
      ) : (
        <Table responsive className="history-table mb-0">
          <thead>
            <tr>
              <th>#</th>
              <th>Book Details</th>
              <th>Seller</th>
              <th>Price</th>
              <th>Date</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((purchase, index) => (
              <tr key={purchase._id}>
                <td>{index + 1}</td>
                {purchase.book ? (
                  <td>
                    <div className="fw-bold">{purchase.book.title}</div>
                    <small className="text-muted">
                      by {purchase.book.author}
                    </small>
                  </td>
                ) : (
                  <td className="text-muted fst-italic">
                    Book no longer exists
                  </td>
                )}
                <td>{purchase.book?.seller?.name || "Unknown"}</td>
                <td className="purchase-price">${purchase.book?.price}</td>
                <td>{new Date(purchase.purchaseDate).toLocaleDateString()}</td>
                <td className="text-center">
                  {purchase.book && (
                    <Button
                      as={Link}
                      to={`/books/${purchase.book._id}`}
                      variant="outline-secondary"
                      size="sm"
                      className="d-inline-flex align-items-center gap-1"
                    >
                      View <FaExternalLinkAlt size={10} />
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
