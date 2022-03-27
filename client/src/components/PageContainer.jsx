import { Box } from "@mui/material";
import { Outlet } from "react-router";

const PageContainer = () => {
  return (
    <Box display="flex" justifyContent="center">
      <Box
        mt={{ xs: 0, md: 3 }}
        backgroundColor="white"
        border={{ xs: "none", sm: "solid 1px #c3c3c3" }}
        borderRadius={{ xs: "none", md: 2 }}
        width={{ xs: "100%", md: "90%" }}
        maxWidth="1000px"
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default PageContainer;
