import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Dropdown from "react-bootstrap/Dropdown";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import icon from "../assets/icon.svg";
import info from "../assets/info-circle.svg";
import DialogModal from "./msgExito";

const ComponenteA = ({ proyectoID, updateCounter1, role }) => {
  const [proyectos, setProyectos] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState({});
  const videoRef = useRef(null);

  const fetchProyectos = async () => {
    try {
      const archivosEndpoint = `https://backend-constructora.onrender.com/api/proyectosfv/${proyectoID}`;
      const archivosResponse = await axios.get(archivosEndpoint);
      const archivos = archivosResponse.data;

      if (Array.isArray(archivos)) {
        setProyectos(archivos);
      } else {
        console.error("La respuesta de la API no es un array:", archivos);
        setProyectos([]);
      }
    } catch (error) {
      console.error("Error al obtener la lista de proyectos", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://backend-constructora.onrender.com/api/v1/videos/${id}/`);
      setSelectedVideoId(id);
      setShowDialog(true);
      setProyectos((prevProyectos) =>
        prevProyectos.filter((proyecto) => proyecto.id !== id)
      );
    } catch (error) {
      console.error(`Error al eliminar el video con ID ${id}`, error);
    }
  };

  const playVideo = (id) => {
    if (selectedVideoId === id && isPlaying) {
      setIsPlaying(false);
      videoRef.current.pause();
    } else {
      setIsPlaying(true);
      setSelectedVideoId(id);
    }
  };

  const closeModal = () => {
    setShowDialog(false);
    setSelectedVideoId(null);
  };

  const toggleTooltip = (id) => {
    setTooltipVisible((prevTooltipVisible) => ({
      ...prevTooltipVisible,
      [id]: !prevTooltipVisible[id],
    }));
  };

  useEffect(() => {
    fetchProyectos();
  }, [proyectoID, updateCounter1]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".tooltip")) {
        setTooltipVisible({});
      }
    };

    document.body.addEventListener("click", handleClickOutside);

    return () => {
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="proyectos-container container-fluid">
      {proyectos.length === 0 ? (
        <p className="colorN">No hay videos disponibles</p>
      ) : (
        proyectos.map((pkP) => (
          <div key={pkP.id} className="card">
            <video
              width="100%"
              height="auto"
              ref={videoRef}
              controlsList="nodownload"
              controls
              muted
              onPlay={() => playVideo(pkP.id)}
              onClick={() => playVideo(pkP.id)}
            >
              <source src={`${pkP.uploadedFile}`} type="video/mp4" />
              Tu navegador no soporta el tag de video.
            </video>
            {role === "admin" && (
              <Dropdown className="Dropdown-videos">
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

            <OverlayTrigger
              show={tooltipVisible[pkP.id]}
              placement="top"
              overlay={
                <Tooltip id={`tooltip-${pkP.id}`}>
                  {pkP.name}
                </Tooltip>
              }
            >
              <img
                src={info}
                alt="Información"
                style={{
                  width: "25px",
                  height: "25px",
                  cursor: "pointer",
                  position: "absolute",
                  bottom: "263px",
                  right: "293px",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTooltip(pkP.id);
                }}
              />
            </OverlayTrigger>
          </div>
        ))
      )}
      {selectedVideoId && <DialogModal show={showDialog} onClose={closeModal} />}
    </div>
  );
};

export default ComponenteA;
