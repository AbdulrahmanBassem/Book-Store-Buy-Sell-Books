import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

// Components
import { Navbar } from "./components/Navbar/Navbar";
import { Loading } from "./components/Loading/Loading"; // Optional usage

// Pages
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { VerifyOTP } from "./pages/VerifyOTP";
import { Home } from "./pages/Home";
import { CreateBook } from "./pages/CreateBook";
import { BookDetails } from "./pages/BookDetails";
import { EditBook } from "./pages/EditBook";
import { PurchaseHistory } from "./pages/PurchaseHistory";
import { MyBooks } from "./pages/MyBooks";

// Utils
import { api } from "./apis/api";
import { setUser, clearUser } from "./store/slices/userSlice";
import { errorHandler } from "./utils/errorHandler";

export default function App() {
  const { isLoggedIn } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function validateToken() {
      if (token) {
        try {
          const response = await api.get("/api/auth/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });

          dispatch(setUser(response.data.data));
        } catch (error) {
          localStorage.removeItem("token");
          dispatch(clearUser());
          if (error.response) errorHandler(error);
        }
      }
    }

    validateToken();
  }, [dispatch, token]);

  return (
    <div>
      <Navbar />

      <Toaster position="top-center" />

      <Container className="my-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books/:id" element={<BookDetails />} />
          {!isLoggedIn && (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-otp" element={<VerifyOTP />} />
              
            </>
          )}

          {isLoggedIn && (
            <>
              <Route path="/create-book" element={<CreateBook />} />
              <Route path="/edit-book/:id" element={<EditBook />} />
              <Route path="/purchase-history" element={<PurchaseHistory />} />
              <Route path="/my-books" element={<MyBooks />} />
            </>
          )}

          {/* 404 Route */}
          <Route
            path="*"
            element={<h2 className="text-center mt-5">404 - Page Not Found</h2>}
          />
        </Routes>
      </Container>
    </div>
  );
}
