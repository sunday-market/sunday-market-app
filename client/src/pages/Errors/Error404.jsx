import { useNavigate } from "react-router-dom";

import { Typography, Button, Box, Grid } from "@mui/material";
import Error404Image from "../../assets/error404.svg";

const Error404 = () => {
  const navigate = useNavigate();

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="70vh"
      >
        <Box
          backgroundColor="white"
          border="solid 1px #c3c3c3"
          borderRadius="15px"
          padding={5}
          width="50%"
          minWidth="250px"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Box
            component="img"
            src={Error404Image}
            alt="404 Error"
            mb={3}
            sx={{ width: "200px" }}
          />
          <Typography variant="h5" mb={2}>
            Page not found!
          </Typography>
          <Button variant="contained" onClick={() => navigate("/")}>
            Home
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default Error404;
