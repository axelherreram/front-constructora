  import React, { useState, useEffect } from "react";
  import { useLocation } from "react-router-dom";
  import Container from "react-bootstrap/Container";
  import Nav from "react-bootstrap/Nav";
  import Navbar from "react-bootstrap/Navbar";
  import Button from "react-bootstrap/Button";
  import NavDropdown from "react-bootstrap/NavDropdown";
  import Modal from "react-bootstrap/Modal";
  import "bootstrap/dist/css/bootstrap.min.css";
  import "../Estilos/PageFYV.scss";
  import "../Estilos/photosvideos.scss";
  import logo from "../assets/logo.svg";
  import axios from "axios";
  import ComponenteA from "../components/cargavideos";
  import ComponenteB from "../components/cargaphotos";
  import { useNavigate } from "react-router-dom";

  const PageFYV = (props) => {
    const location = useLocation();
    const { usuario, municipio, role, Muni_id, proyectoID, nog, proyecto } =
      location.state || {};
    const [showModal, setShowModal] = useState(false);
    const [tipoArchivo, setTipoProyecto] = useState("Fotos");
    const [archivoProyecto, setArchivoProyecto] = useState(null);
    const [updateCounter, setUpdateCounter] = useState(0);
    const [updateCounter1, setUpdateCounter1] = useState(0);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
      document.title = `Proyectos en ${municipio}`;
    }, [municipio]);

    const handleOpenModal = () => {
      setShowModal(true);
      setError("");
    };

    const handleCloseModal = () => {
      setShowModal(false);
      setError("");
    };

    const handleCerrarSesion = async () => {
      try {
        const endpoint = "http://127.0.0.1:8000/api/logout/";
        await axios.post(endpoint);
    
        // Elimina solo la clave relacionada con la sesión
        localStorage.removeItem("isLoggedIn");
        
        // Puedes ajustar la ruta según tus necesidades
        navigate("/");
      } catch (error) {
        console.error("Error al cerrar sesión:", error.message);
      }
    };
  

    const handleGuardarArchivo = async () => {
      try {
        let endpoint = "";
        let formData = new FormData();
  
        
        if (tipoArchivo === "Fotos") {
          endpoint = "http://127.0.0.1:8000/api/v1/photos/";
        } else if (tipoArchivo === "Videos") {
          endpoint = "http://127.0.0.1:8000/api/v1/videos/";
        }
  
        formData.append("project_id", proyectoID);
        formData.append("name", archivoProyecto.name);
        formData.append("uploadedFile", archivoProyecto);
  
        // Validar el tipo de archivo antes de realizar la solicitud POST
        if ((tipoArchivo === "Fotos" && isImageFile(archivoProyecto)) || (tipoArchivo === "Videos" && isVideoFile(archivoProyecto))) {
          const response = await axios.post(endpoint, formData);
          if (response.status === 201) {
            console.log(`Archivo de ${tipoArchivo.toLowerCase()} creado exitosamente`);
            if (tipoArchivo === "Fotos") {
              setUpdateCounter((prevCounter) => prevCounter + 1);
            } else if (tipoArchivo === "Videos") {
              setUpdateCounter1((prevCounter1) => prevCounter1 + 1);
            }
            setError(""); // Limpiar el mensaje de error si no hay error
            setShowModal(false); // Cerrar el modal solo si no hay error
          } else {
            console.error(
              `Error al crear el archivo de ${tipoArchivo.toLowerCase()}. Estado de la respuesta:`,
              response.status
            );
            if (tipoArchivo === "Fotos") {
              setError("Formato Inválido no es una imagen");
            } else if (tipoArchivo === "Videos") {
              setError("Formato Inválido no es un video");
            }
          }
        } else {
          if (tipoArchivo === "Fotos") {
            setError("Formato Inválido no es una imagen");
          } else if (tipoArchivo === "Videos") {
            setError("Formato Inválido no es un video");
          }
        }
      } catch (error) {
        console.error(`Error en la solicitud POST:`, error.message);
        setError("Formato Inválido ");
      } finally {
        setTipoProyecto(tipoArchivo);
        setArchivoProyecto(null);
      }
    };
  
    
    const isImageFile = (file) => {
      return file.type.startsWith('image/');
    };
    
    const isVideoFile = (file) => {
      return file.type.startsWith('video/');
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
              <Nav className="me-auto">
              <NavDropdown title="Información" id="basic-nav-dropdown">
                  <NavDropdown.Item>Proyecto:{"  "}
                    <span className="fw-bold">{proyecto}</span> 
                  </NavDropdown.Item>
                  <NavDropdown.Item>NOG:{"  "}
                    <span className="fw-bold">{nog}</span> 
                  </NavDropdown.Item>
                  <NavDropdown.Item>Municipio:{"  "}
                    <span className="fw-bold text-capitalize">{municipio}</span> 
                  </NavDropdown.Item>
                  <NavDropdown.Item>Usuario: {"  "}
                    <span className="fw-bold text-capitalize">{usuario}</span> 
                  </NavDropdown.Item>
                </NavDropdown>
                <NavDropdown
                  className=""
                  title="Visualizar"
                  id="basic-nav-dropdown"
                >
                  <NavDropdown.Item
                    href=""
                    className="btn btn-primary"
                    onClick={() => setTipoProyecto("Fotos")}
                  >
                    Fotos
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    href=""
                    className="btn btn-primary"
                    onClick={() => setTipoProyecto("Videos")}
                  >
                    Videos
                  </NavDropdown.Item>
                </NavDropdown>
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
                  Cerrar sesion
                </Button>
              </div>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <div className="content-pro">
          <div className="Titulo">
            {tipoArchivo === "Fotos" && <p>Vista de Imágenes</p>}
            {tipoArchivo === "Videos" && <p>Vista de Videos</p>}
          </div>
          {tipoArchivo === "Videos" && (
            <ComponenteA
              proyectoID={proyectoID}
              updateCounter1={updateCounter1}
              role={role}
            />
          )}
          {tipoArchivo === "Fotos" && (
            <>
              <ComponenteB
                proyectoID={proyectoID}
                updateCounter={updateCounter}
                role={role}
              />
            </>
          )}
        </div>

        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title className="VentanaEmer1">Nuevo Proyecto</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="VentanaEmer">
              <h5>Datos Del Proyecto</h5>
              <div className="mb-3">
                <label htmlFor="tipoProyecto" className="form-label">
                  Tipo:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="tipoProyecto"
                  value={tipoArchivo}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label htmlFor="archivoProyecto" className="form-label">
                  Archivo:
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="archivoProyecto"
                  onChange={(e) => setArchivoProyecto(e.target.files[0])}
                />
              </div>
              {error && <p className="error-message">{error}</p>}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cerrar
            </Button>
            <Button variant="primary" onClick={handleGuardarArchivo}>
              Guardar
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  export default PageFYV;
