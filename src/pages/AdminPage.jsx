import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Nav,
  Navbar,
  Button,
  Modal,
  Dropdown,
} from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Estilos/AdminStyles.scss";
import logo from "../assets/logo.svg";
import icon from "../assets/icon.svg";
import DialogModal from "../components/msgExito";
import SuccessMessage from "../components/alert";

const AdminPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, municipio, role, idMuni } = location.state || {};
  const [showModal, setShowModal] = useState(false);
  const [municipalidades, setMunicipalidades] = useState([]);
  const [selectedMunicipio, setSelectedMunicipio] = useState("");
  const [nombreMuni, setNombreMuni] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [contrasenaUsuario, setContrasenaUsuario] = useState("");
  const [selectedMunicipioId, setSelectedMunicipioId] = useState("");
  const [archivoProyecto, setArchivoProyecto] = useState(null);
  const [errorArchivo, setErrorArchivo] = useState("");
  const [errorArchivouser, setErrorArchivouser] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const role_id_fija = 2
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [errorContrasena, setErrorContrasena] = useState("");

  useEffect(() => {
    if (!role || !usuario || !municipio) {
      navigate("/");
    }
    const fetchMunicipalidades = async () => {
      try {
        const endPoint = "http://localhost:8000/api/v1/municipalidades/";
        const response = await axios.get(endPoint);
        setMunicipalidades(response.data);
      } catch (error) {
        console.error("Error al obtener las municipalidades", error);
      }
    };

    fetchMunicipalidades();
  }, [role, usuario, municipio, navigate]);

  const handleOpenModal = () => {
    setShowModal(true);
    setErrorArchivo("");
    setErrorArchivouser("");
    setArchivoProyecto(null);
    setNombreMuni("");
    setNombreUsuario("");
    setContrasenaUsuario("");
    setSelectedMunicipioId("");
    setArchivoProyecto(null);
    setShowDialog(false);
    setShowSuccessMessage(false);
    setErrorContrasena("");
    setSelectedMunicipio("");
  };
  

  const handleCloseModal = () => {
    setShowModal(false);
    setErrorArchivo("");
    setErrorArchivouser("");
    setArchivoProyecto(null);
  };

  const isImageFile = (file) => {
    const imageExtensions = ["jpg", "jpeg", "png"];
    const extension = file.name.split(".").pop().toLowerCase();
    return imageExtensions.includes(extension);
  };

  const showAndHideSuccessMessage = () => {
    setShowSuccessMessage(true);

    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 10000);
  };

  const handleGuardarMuni = async () => {
    try {
      setErrorArchivo("");
  
      if (!nombreMuni) {
        setErrorArchivo("Nombre de Municipalidad Vacío");
        return;
      }
  
      if (!archivoProyecto) {
        setErrorArchivo("No ha seleccionado ningún formato de imagen");
        return;
      }
  
      if (!isImageFile(archivoProyecto)) {
        setErrorArchivo("El formato seleccionado no es una imagen");
        return;
      }
  
      const formData = new FormData();
      formData.append("name", nombreMuni);
      formData.append("uploadedFile", archivoProyecto);
  
      const endPoint = "http://localhost:8000/api/v1/municipalidades/";
      const response = await axios.post(endPoint, formData);
  
      if (response.status === 201) {
        setSuccessMessage("Se ha creado la municipalidad exitosamente.");
        setShowSuccessMessage(true);
        setArchivoProyecto(null);
        setErrorArchivo("");
        setMunicipalidades((prevMunicipalidades) => [
          ...prevMunicipalidades,
          response.data,
        ]);
  
        setNombreMuni("");
        handleCloseModal();
      } else {
        console.error("Error al crear la municipalidad. Estado de la respuesta:", response.status);
        setErrorArchivo("Error al crear la municipalidad");
      }
    } catch (error) {
      console.error("Error en la solicitud POST:", error.message);
      setErrorArchivo("Error en la solicitud POST");
    }
  };
  

  const handleGuardarUser = async () => {
    try {
      setErrorArchivouser(""); // Limpiar el error general
      setErrorContrasena(""); // Limpiar el error específico de la contraseña
  
      if (!nombreUsuario.trim()) {
        setErrorArchivouser("Campo Nombre Vacío");
        return;
      }
  
      if (contrasenaUsuario.length < 8) {
        setErrorContrasena("Contraseña es menor a 8 dígitos");
        return;
      }
  
      if (!selectedMunicipioId) {
        setErrorArchivouser("No hay seleccionada una municipalidad");
        return;
      }
  
      const endPoint = "http://127.0.0.1:8000/api/register/";
  
      const postData = {
        username: nombreUsuario,
        password: contrasenaUsuario,
        munici_id: selectedMunicipioId,
        role_id: role_id_fija,
      };
  
      const response = await axios.post(endPoint, postData);
  
      if (response.status === 201) {
        setSuccessMessage("Se ha creado el usuario exitosamente.");
        setShowSuccessMessage(true);
  
        setNombreUsuario("");
        setContrasenaUsuario("");
        setSelectedMunicipio("");
        handleCloseModal();
      } else {
        console.error("Error al crear el usuario. Estado de la respuesta:", response.status);
        setErrorArchivouser(`Error al crear el usuario. Estado de la respuesta: ${response.status}`);
      }
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data) {
        if (error.response.data.username && error.response.data.username.includes("Usuario ya existe")) {
          setErrorArchivouser("Usuario ya existe");
        } else {
          setErrorArchivouser("Usuario ya existe");
        }
      } else {
        setErrorArchivouser(`Error en la solicitud POST: ${error.message}`);
      }
    }
  };
  

  const handleCerrarSesion = async () => {
    try {
      const endpoint = "http://127.0.0.1:8000/api/logout/";
      await axios.post(endpoint);

      localStorage.removeItem("isLoggedIn");
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
    }
  };

  const handleDelete = async (municipioId) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:8000/api/v1/municipalidades/${municipioId}/`);

      if (response.status === 204) {
        setSelectedMunicipioId(municipioId);
        setShowDialog(true);
        setMunicipalidades((prevMunicipalidades) => prevMunicipalidades.filter((muni) => muni.munici_id !== municipioId));
      } else {
        console.error(`Error al eliminar el municipio. Estado de la respuesta: ${response.status}`);
      }
    } catch (error) {
      console.error("Error en la solicitud DELETE:", error.message);
    }
  };

  return (
    <>
      <Navbar expand="md" bg="light" data-bs-theme="light">
        <Container>
          <Navbar.Brand href="">
            <img
              src={logo}
              width="100"
              className="d-inline-block align-top"
              alt="Logo Constructora"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="justify-content-end">
            <Nav className="me-auto"></Nav>
            <Nav>
              <Navbar.Text>
                Usuario:{" "}
                <a className="text-capitalize mx-2 fw-bold">{usuario}</a>
              </Navbar.Text>
            </Nav>
            <div className="d-flex justify-content-around ">
              {role === "admin" && (
                <Button
                  type="submit border"
                  className="mx-2"
                  onClick={handleOpenModal}
                >
                  Agregar
                </Button>
              )}
              <Button type="submit border" onClick={handleCerrarSesion}>
                Cerrar sesión
              </Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {selectedMunicipioId && (
        <DialogModal show={showDialog} onClose={() => setShowDialog(false)} />
      )}
      {role === "admin" && (
        <div className="content-pro">
          <div className="Titulo">
            <p className="tt-page" style={{ marginBottom: "10px" }}>
              LISTA DE MUNICIPIOS
            </p>
            <div className="municipalidades-container">
              {municipalidades.map(
                (muni) =>
                  muni.munici_id !== idMuni && (
                    <div
                      key={muni.munici_id}
                      className="municipalidad-card border"
                      style={{ position: "relative" }}
                    >
                      <img
                        className="img"
                        src={
                          muni.uploadedFile === "http://localhost:8000/media/NULL"
                            ? logo
                            : muni.uploadedFile
                        }
                        alt="img_muni"
                      />
                      <p style={{ margin: "0px" }}>{muni.name}</p>
                      <Dropdown className="Dropdown-muni">
                        <Dropdown.Toggle
                          className="btn-sm dropdown-toggle"
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
                          <Dropdown.Item
                            onClick={() => handleDelete(muni.munici_id)}
                          >
                            Eliminar
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() =>
                          navigate("/municipalidad/proyectos", {
                            state: {
                              usuario,
                              municipio: muni.name,
                              Muni_id: muni.munici_id,
                              role: role,
                            },
                          })
                        }
                      >
                        Ver Proyectos
                      </button>
                    </div>
                  )
              )}
            </div>
          </div>
        </div>
      )}
      {showSuccessMessage && (
        <SuccessMessage
          message={successMessage}
          onClose={() => setShowSuccessMessage(false)}
        />
      )}

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title className="Ventana">Datos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="VentanaEmer">
            <h5>Crear Municipalidad</h5>
            <div className="mb-3">
              <label htmlFor="nombreMuni" className="form-label">
                Nombre Muni:
              </label>
              <input
                type="text"
                className="form-control"
                id="nombreMuni"
                placeholder="Nombre de la municipalidad"
                value={nombreMuni}
                onChange={(e) => setNombreMuni(e.target.value)}
              />
              <div className="mb-3">
                <label htmlFor="archivoProyecto" className="form-label">
                  Foto Muni:
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="archivoProyecto"
                  onChange={(e) => setArchivoProyecto(e.target.files[0])}
                />
              </div>
              {errorArchivo && <p className="error-message">{errorArchivo}</p>}
              <Button
                variant="primary"
                className="GuardarButtonRight mt-2"
                onClick={handleGuardarMuni}
              >
                Guardar
              </Button>
            </div>
          </div>

          <div className="VentanaEmer">
            <h5>Asignar a Usuario</h5>
            <div className="mb-3">
              <label htmlFor="nombreUsuario" className="form-label">
                Nombre:
              </label>
              <input
                type="text"
                className="form-control"
                id="nombreUsuario"
                placeholder="Ingrese el nombre del usuario"
                value={nombreUsuario}
                onChange={(e) => setNombreUsuario(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="contrasenaUsuario" className="form-label">
                Contraseña:
              </label>
              <div className="input-group">
                <input
                  type={mostrarContrasena ? "text" : "password"}
                  className="form-control"
                  id="contrasenaUsuario"
                  placeholder="Ingrese la contraseña del usuario"
                  value={contrasenaUsuario}
                  onChange={(e) => setContrasenaUsuario(e.target.value)}
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setMostrarContrasena(!mostrarContrasena)}
                >
                  {mostrarContrasena ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="selectMunicipalidad" className="form-label">
                Seleccionar Municipalidad:
              </label>
              <select
                className="form-select"
                id="selectMunicipalidad"
                value={selectedMunicipio}
                onChange={(e) => {
                  const selectedMuniId = municipalidades.find(
                    (muni) => muni.name === e.target.value
                  )?.munici_id;
                  setSelectedMunicipioId(selectedMuniId || "");
                  setSelectedMunicipio(e.target.value);
                }}
              >
                <option value="" disabled>
                  Seleccionar una municipalidad
                </option>
                {municipalidades
                  .filter((muni) => muni.name !== municipio)
                  .map((muni) => (
                    <option key={muni.munici_id} value={muni.name}>
                      {muni.name}
                    </option>
                  ))}
              </select>
              {errorArchivouser && (
                <p className="error-message">{errorArchivouser}</p>
              )}
              {errorContrasena && <p className="error-message">{errorContrasena}</p>}
              <Button
                variant="primary"
                className="GuardarButtonRight mt-2"
                onClick={handleGuardarUser}
              >
                Guardar
              </Button>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="CerrarButton">
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AdminPage;
