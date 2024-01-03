import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Estilos/styles.scss";
import img1 from "../assets/imgs/img1.jpg";
import img2 from "../assets/imgs/img2.jpg";
import img3 from "../assets/imgs/img3.jpg";
import img4 from "../assets/imgs/img4.jpg";
import img5 from "../assets/imgs/img5.jpg";

const Login = ({ setLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [backgroundOpacity, setBackgroundOpacity] = useState(1);
  const navigate = useNavigate();

  const images = [img1, img2, img3, img4, img5];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setBackgroundOpacity(0);

      setTimeout(() => {
        setBackgroundOpacity(1);
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 100);
    }, 4000);

    return () => clearInterval(intervalId);
  }, [images.length]);

  const handleLogin = async () => {
    try {
      setLoading(true);

      // Actualizar el estado de autenticación aquí
      setLoggedIn(true);

      const response = await axios.post("http://127.0.0.1:8000/api/login/", {
        username: username,
        password: password,
      });

      const userData = response.data;

      if (userData.role === "admin") {
        navigate("/municipalidad", {
          state: {
            usuario: userData.user,
            municipio: userData.municipio,
            role: userData.role,
            idMuni: userData.Muni_id,
          },
        });
      } else if (userData.role === "user") {
        navigate("/municipalidad/proyectos", {
          state: {
            usuario: userData.user,
            municipio: userData.municipio,
            role: userData.role,
            Muni_id: userData.Muni_id,
          },
        });
      }
    } catch (error) {
      console.error("Error durante el inicio de sesión", error);

      if (error.response && error.response.status === 401) {
        setError("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
      } else {
        setError(
          "Se produjo un error durante el inicio de sesión. Por favor, inténtalo de nuevo más tarde."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  const backgroundStyle = {
    backgroundImage: `url(${images[currentImageIndex]})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: "100vh",
    transition: "opacity 1s ease-in-out",
    opacity: backgroundOpacity,
  };

  return (
    <div className="body" style={backgroundStyle}>
      <div className="login-container">
        <h2>Inicio de Sesión</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>Usuario</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Cargando..." : "Inicio de Sesión"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
