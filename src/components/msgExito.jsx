import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "../Estilos/modal.scss";

const DialogModal = ({ show, onClose }) => {
  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
    >
      <Modal.Header closeButton
      >
        <Modal.Title>Éxito</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Archivo eliminado exitosamente.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onClose}
        className="btn btn-primary"
        >
          Aceptar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DialogModal;
