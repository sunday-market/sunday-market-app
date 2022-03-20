import { useState, useEffect } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import {
  Image as ImageIcon,
  Cancel as CancelIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

import {
  Grid,
  InputLabel,
  Typography,
  TextField,
  Select,
  MenuItem,
  Alert,
  Button,
  Divider,
} from "@mui/material";

import { Link } from "react-router-dom";

import SubCategoriesData from "../../data/SubCategories.json";

const AddProduct = () => {
  const [userStalls, setUserStalls] = useState([]);
  const [stall, setStall] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [subCategoryOther, setSubCategoryOther] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState();
  const [quantity, setQuantity] = useState();

  const [error, setError] = useState("");

  // Get the User Stalls
  useEffect(() => {
    (async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) return;

        const decodedJWT = await jwtDecode(localStorage.getItem("authToken"));

        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };

        const stalls = await axios.get(
          `../../api/mystalls/${decodedJWT.id}`,
          config
        );
    
        if (!stalls) return;

        setUserStalls(stalls.data);
      } catch (error) {
        setTimeout(() => {
          setError("");
        }, 5000);
        return setError(error.response.data.error);
      }
    })();
  }, []);

  return (
    <>
      <Typography variant="h4">Add Product</Typography>

      {/* Stall */}
      <Grid container direction="column" spacing={2}>
        {/* Error Alert */}
        <Grid item>{error && <Alert severity="error">{error}</Alert>}</Grid>

        <Grid item></Grid>
        <Grid item>
          <InputLabel required>Stall</InputLabel>

          <Select
            disabled={userStalls.length === 0}
            variant="outlined"
            size="small"
            fullWidth
            value={stall}
            placeholder="Choose a Stall"
            onChange={(e) => setStall(e.target.value)}
            sx={{ background: "white" }}
          >
            {userStalls.map((stall) => (
              <MenuItem key={stall._id} value={stall._id}>
                {stall.stallName}
              </MenuItem>
            ))}
          </Select>
        </Grid>

        {/* No Stall Warning  */}
        <Grid item>
          {userStalls.length === 0 && (
            <Alert severity="warning">
              You do not have any stalls. You must have a stall in order to add
              a product.
              <br />
              <Link to="../../stalls/add">Click Here</Link> to add a stall.
            </Alert>
          )}
        </Grid>

        <Grid item>
          <Divider />
        </Grid>

        {/* Name */}
        <Grid item>
          <InputLabel required>Product Name</InputLabel>
          <TextField
            variant="outlined"
            fullWidth
            size="small"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Stall"
            sx={{ background: "white" }}
          />
        </Grid>

        {/* Description */}
        <Grid item>
          <InputLabel required>Description</InputLabel>
          <TextField
            variant="outlined"
            fullWidth
            multiline
            minRows={4}
            maxRows={8}
            size="small"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter a description of the product here..."
            sx={{ background: "white" }}
          />
        </Grid>

        {/* Category */}
        <Grid item>
          <InputLabel required>Product Category</InputLabel>

          <Select
            variant="outlined"
            size="small"
            fullWidth
            value={subCategory}
            placeholder="Product Category"
            onChange={(e) => setSubCategory(e.target.value)}
            sx={{ background: "white" }}
          >
            {SubCategoriesData.map((category) => (
              <MenuItem key={category.id} value={category.category}>
                {category.category}
              </MenuItem>
            ))}
          </Select>
          {stall}
        </Grid>

        {subCategory === "Other... (Please provide)" && (
          <Grid item>
            <InputLabel required>Category Other</InputLabel>
            <TextField
              variant="outlined"
              fullWidth
              size="small"
              type="text"
              value={subCategoryOther}
              onChange={(e) => setSubCategoryOther(e.target.value)}
              placeholder="Please provide your category..."
              sx={{ background: "white" }}
            />
          </Grid>
        )}

        {/* Price  */}
        <Grid item>
          <InputLabel required>Price</InputLabel>
          <TextField
            variant="outlined"
            size="small"
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            sx={{ background: "white" }}
          />
        </Grid>

        {/* Quanity In Stock  */}
        <Grid item>
          <InputLabel required>Quantity in Stock</InputLabel>
          <TextField
            variant="outlined"
            size="small"
            type="text"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="0"
            sx={{ background: "white" }}
          />
        </Grid>

        {/* Image Upload  */}
        <Grid item>
          <InputLabel>Upload an image</InputLabel>
          <Typography variant="body2" gutterBottom>
            Draw attention to your product by uploading an image
          </Typography>
          <Button
            component="label"
            variant="contained"
            endIcon={<ImageIcon />}
            size="small"
          >
            <input
              accept="image/*"
              hidden
              type="file"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
            Add Image
          </Button>
          <Button
            variant="outlined"
            startIcon={<DeleteIcon />}
            onClick={() => setImage("")}
            size="small"
          >
            Remove Image
          </Button>
          <Grid item mt={2}>
            {image && <Typography variant="body2">Image: {image} </Typography>}
          </Grid>
        </Grid>

        <Grid item>
          <Divider />
        </Grid>

        <Grid item>
          <Grid container justifyContent="center">
            <Button variant="contained" startIcon={<SaveIcon />}>
              Save
            </Button>
            <Button variant="outlined" startIcon={<CancelIcon />}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default AddProduct;
