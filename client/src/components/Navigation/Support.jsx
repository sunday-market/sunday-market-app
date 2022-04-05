import { useNavigate } from "react-router-dom";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Grid, Typography } from "@mui/material";

const Support = () => {
  const navigate = useNavigate();

  return (
    <>
      <Grid item xs={3}>
        <HelpOutlineIcon
          style={{ fontSize: 45, color: "white" }}
          onClick={() => navigate("/support")}
        />
        <Typography
          variant="body2"
          color="white"
          display={{ xs: "none", sm: "none", md: "block" }}
        >
          Support
        </Typography>
      </Grid>
    </>
  );
};

export default Support;
