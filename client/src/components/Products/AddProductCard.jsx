import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import { Typography, Card } from "@mui/material";

const AddProductCard = (props) => {
  return (
    <Card
      sx={[
        {
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          border: "solid 1px #eeeeee",
          background: "#eeeeee",
        },
        {
          "&:hover": {
            background: "#e0e0e0",
          },
        },
      ]}
    >
      <AddCircleOutlineRoundedIcon
        color="disabled"
        sx={{ height: "100px", width: "100px" }}
      />
      <Typography gutterBottom>Add Product</Typography>
    </Card>
  );
};

export default AddProductCard;
