import { useEffect, useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

import DataContext from "../context/DataContext";

const PrivateRoute = () => {
  const { error, setError } = useContext(DataContext);

  // Check for Authorization
  useEffect(() => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("authToken");
      <Navigate to="/login" />;
    }
  }, [error, setError]);

  return localStorage.getItem("authToken") ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
