import React from "react";
import { Container, Spinner } from "react-bootstrap";

export const Loading = () => {
  return (
    <Container className="d-flex vh-100 justify-content-center align-items-center">
      <Spinner animation="border" variant="primary" />
    </Container>
  );
};