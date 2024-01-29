import React, { useEffect, useState } from "react";
import "../Estilos/photosvideos.scss";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import icon from "../assets/icon.svg";
import DialogModal from "../components/msgExito";

const ComponenteB = ({ proyectoID, updateCounter, role }) => {
  const [proyectos, setProyectos] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImgID, setSelectedImgID] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedImageName, setSelectedImageName] = useState(null);
  const [showDialogModal, setShowDialogModal] = useState(false);
  const [showFullname, setShowFullname] = useState(false);
  const [showMoreImages, setShowMoreImages] = useState(false);
  const MAX_NAME_LENGTH = 60;
  const MAX_NAME_LENGTH_1 = 10;
  const MAX_IMAGES_TO_SHOW = 5;

  const fetchProyectos = async () => {
    try {
      const archivosEndpoint = `http://localhost:8000/api/proyectosfp/${proyectoID}`;
      const archivosResponse = await axios.get(archivosEndpoint);
      const archivos = archivosResponse.data;
      console.log(archivos);
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
      setSelectedImage(null);
      setSelectedImgID(id);
      setShowDialog(true);
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
        proyectos
          .slice(0, showMoreImages ? proyectos.length : MAX_IMAGES_TO_SHOW)
          .map((pkP) => (
            <div
              key={pkP.id}
              className="card-photos"
              style={{ position: "relative" }}
            >
              <div
                className="content-photos"
                onClick={() => openModal(pkP.uploadedFile, pkP.name)}
              >
                <div className="container-img">
                  <img src={pkP.uploadedFile} alt={pkP.name} />
                </div>
                <span className="">
                  {pkP.name.length > MAX_NAME_LENGTH_1 
                    ? `${pkP.name.substring(0, MAX_NAME_LENGTH_1)}...`
                    : pkP.name}
                </span>
              </div>

              {role === "admin" && (
                <Dropdown className="Dropdown-fotos">
                  <Dropdown.Toggle
                    className="dropdown-toggle"
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
          <Modal.Header
            closeButton
            style={{ maxHeight: "60px", overflow: "hidden" }}
          >
            <Modal.Title
              className={`fs-6 ${showFullname ? "" : "text-truncate"}`}
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {showFullname
                ? selectedImageName
                : selectedImageName.length > MAX_NAME_LENGTH
                ? `${selectedImageName.substring(0, MAX_NAME_LENGTH)}...`
                : selectedImageName}
            </Modal.Title>
            {selectedImageName.length > MAX_NAME_LENGTH && !showFullname && (
              <Button variant="link" onClick={() => setShowFullname(true)}>
                Mostrar más
              </Button>
            )}
          </Modal.Header>
          <Modal.Body>
            <div style={{ overflowY: "auto", maxHeight: "70vh" }}>
              <img
                src={selectedImage}
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
