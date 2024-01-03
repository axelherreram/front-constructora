import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import AdminPage from "./pages/AdminPage";
import PageFYV from "./pages/PageFYV";
import PageProyectos from "./pages/PageProyectos";

const App = () => {
  const [isLoggedIn, setLoggedIn] = useState(() => {
    const storedValue = localStorage.getItem("isLoggedIn");
    return storedValue ? storedValue === "true" : false;
  });

  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);

  const ProtectedRoute = ({ element: Element, isLoggedIn, ...props }) => {
    if (!isLoggedIn && (!props.location || props.location.pathname !== "/")) {
      return <Navigate to="/" replace />;
    }

    return <Element isLoggedIn={isLoggedIn} {...props} />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/municipalidad"
          element={
            <ProtectedRoute element={AdminPage} isLoggedIn={isLoggedIn} />
          }
        />
        <Route
          path="/municipalidad/proyectos"
          element={
            <ProtectedRoute element={PageProyectos} isLoggedIn={isLoggedIn} />
          }
        />
        <Route
          path="/municipalidad/proyectos/content"
          element={<ProtectedRoute element={PageFYV} isLoggedIn={isLoggedIn} />}
        />
        <Route path="/" element={<Login setLoggedIn={setLoggedIn} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
