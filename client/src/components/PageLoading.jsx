import { Box, CircularProgress } from "@mui/material";

const PageLoading = () => {
  return (
    <Box
      display="flex"
      direction="row"
      justifyContent="center"
      alignItems="center"
      height="50vh"
      width="100%"
    >
      <CircularProgress/>
    </Box>
  );
};

export default PageLoading;
