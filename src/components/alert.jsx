// SuccessMessage.js
import React, { useEffect } from "react";
import Alert from "react-bootstrap/Alert";
import "../Estilos/alert.scss";

const SuccessMessage = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000); 

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <Alert variant="success" className="success-message">
      {message}
    </Alert>
  );
};

export default SuccessMessage;
