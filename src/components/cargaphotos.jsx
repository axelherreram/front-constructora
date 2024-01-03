import React, { useEffect, useState } from "react";
import "../Estilos/photosvideos.scss";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import NavDropdown from "react-bootstrap/NavDropdown";
import icon from "../assets/icon.svg";
import DialogModal from "../components/msgExito";

const ComponenteB = ({ proyectoID, updateCounter, role }) => {
  const [proyectos, setProyectos] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImgID, setSelectedImgID] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedImageName, setSelectedImageName] = useState(null);
  const MAX_NAME_LENGTH = 30;
  const [showDialogModal, setShowDialogModal] = useState(false);
  const [showFullname, setShowFullname] = useState(false);

  const fetchProyectos = async () => {
    try {
      const archivosEndpoint = `http://localhost:8000/api/proyectosfp/${proyectoID}`;
      const archivosResponse = await axios.get(archivosEndpoint);
      const archivos = archivosResponse.data;
      if (Array.isArray(archivos)) {
        setProyectos(archivos);
      } else {
        console.error("La respuesta de la API no es un array:", archivos);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error al obtener la lista de proyectos", error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/photos/${id}/`);
      console.log(`Foto con ID ${id} eliminada exitosamente.`);
      setSelectedImage(null); // Cerrar el modal de imagen
      setSelectedImgID(id);
      setShowDialog(true); // Mostrar el DialogModal
      setProyectos((prevProyectos) =>
        prevProyectos.filter((proyecto) => proyecto.id !== id)
      );
    } catch (error) {
      console.error(`Error al eliminar la foto con ID ${id}`, error);
    }
  };

  useEffect(() => {
    fetchProyectos();
  }, [proyectoID, updateCounter]);

  const openModal = (image, name) => {
    setSelectedImage(image);
    setSelectedImageName(name);
    setShowFullname(false);
  };

  const closeModal = () => {
    setShowDialog(false);
    setShowDialogModal(false);
    setSelectedImage(null);
  };

  return (
    <div className="proyectos-container container-fluid">
      {loading ? (
        <p>Cargando...</p>
      ) : Array.isArray(proyectos) && proyectos.length === 0 ? (
        <p className="colorN">No hay imágenes disponibles</p>
      ) : (
        proyectos.map((pkP) => (
          <div key={pkP.id} className="card" style={{ position: "relative" }}>
            <img
              src={`http://localhost:8000/${pkP.uploadedFile}`}
              alt={pkP.name}
              onClick={() => openModal(pkP.uploadedFile, pkP.name)}
            />
            {role === "admin" && (
              <Dropdown className="Dropdown-fotos">
                <Dropdown.Toggle
                  className="dropdown-toggle"
                  variant="light"
                  id="dropdown-basic"
                >
                  <img
                    src={icon}
                    alt="Icon"
                    style={{ width: "25px", height: "25px" }}
                  />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleDelete(pkP.id)}>
                    Eliminar
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
        ))
      )}
      {selectedImage && (
        <Modal show={true} onHide={closeModal} centered>
          <Modal.Header closeButton>
            <Modal.Title
              className={`fs-6 ${showFullname ? "" : "text-truncate"}`}
            >
              {showFullname
                ? selectedImageName
                : selectedImageName.length > MAX_NAME_LENGTH
                ? `${selectedImageName.substring(0, MAX_NAME_LENGTH)}...`
                : selectedImageName}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Agrega un contenedor con estilos para permitir el desplazamiento vertical */}
            <div style={{ overflowY: "auto", maxHeight: "70vh" }}>
              <img
                src={`http://localhost:8000/${selectedImage}`}
                alt={`Imagen de ${selectedImage}`}
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {selectedImgID && <DialogModal show={showDialog} onClose={closeModal} />}
    </div>
  );
};

export default ComponenteB;
