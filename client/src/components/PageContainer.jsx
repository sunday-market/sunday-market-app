import { Box } from "@mui/material";
import { Outlet } from "react-router";

const PageContainer = () => {
  return (
    <Box display="flex" justifyContent="center">
      <Box
        mt={3}
        backgroundColor="white"
        border="solid 1px #c3c3c3"
        borderRadius="5px"
        margin={1}
        py={4}
        px={{ xs: 1, sm: 3, md: 4 }}
        width={{ xs: "100%", md: "90%" }}
        maxWidth="1000px"
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default PageContainer;
