import { Box } from "@mui/system";
import { useEffect, useContext } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

import DataContext from "../context/DataContext";

const PrivateRoute = () => {
  const { error, setError } = useContext(DataContext);

  const navigate = useNavigate();

  // console.log(error[0]?.response?.statusCode)
  // console.log("ERROR STATUS: ", error[0]?.response?.status);
  // console.log("ERROR STATUSTEXT: ", error[0]?.response?.statusText);
  // console.log("ERRORR ESPONSE: ", error[0]?.response);
  // console.log("ERROR DATA: ", error[0]?.response?.data);
  // console.log("ERROR DATA.ERROR: ", error[0]?.response?.data?.error);

  // Check for Authorization
  useEffect(() => {
    if (error[0]?.response?.status === 401) {
      setError("You are not authorised to access this page");
      localStorage.removeItem("authToken");
    }

    if (!localStorage.getItem("authToken")) {
      setError("You are not authorised to access this page");
      setTimeout(() => {}, 500);
      navigate("/login");
    }
  }, [error, setError, navigate]);

  return <Outlet />;
};

export default PrivateRoute;
