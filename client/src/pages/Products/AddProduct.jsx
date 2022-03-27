import { useState, useEffect, useRef } from "react";
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
  Box
} from "@mui/material";

import { Link, useNavigate } from "react-router-dom";

import SubCategoriesData from "../../data/SubCategories.json";

const AddProduct = () => {
  const [product, setProduct] = useState({
    product_name: "",
    product_description: "",
    product_subcategory: "",
    product_stall: "",
    product_price: "",
    quantity_in_stock: "",
    image: "",
  });
  const [imageName, setImageName] = useState("");
  const [userStalls, setUserStalls] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const errorRef = useRef(null);
  const successRef = useRef(null);

  const navigate = useNavigate();

  const handleClearForm = () => {
    setProduct({
      product_name: "",
      product_description: "",
      product_subcategory: "",
      product_stall: "",
      product_price: "",
      quantity_in_stock: "",
      image: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const decodedJWT = await jwtDecode(localStorage.getItem("authToken"));

    const formData = new FormData();

    formData.append("product_name", product.product_name);
    formData.append("product_description", product.product_description);
    formData.append("product_subcategory", product.product_subcategory);
    formData.append("product_stall", product.product_stall);
    formData.append("product_user", decodedJWT.id);
    formData.append("product_price", product.product_price);
    formData.append("quantity_in_stock", product.quantity_in_stock);
    formData.append("image", product.image);

    if (!product.product_stall) {
      setTimeout(() => {
        setError("");
      }, 5000);
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      return setError("You must select a stall");
    }

    if (!product.product_name) {
      setTimeout(() => {
        setError("");
      }, 5000);
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      return setError("You must provide a name for the product");
    }

    if (!product.product_subcategory) {
      setTimeout(() => {
        setError("");
      }, 5000);
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      return setError("You must provide a product category");
    }

    if (!product.product_price || product.product_price === 0) {
      setTimeout(() => {
        setError("");
      }, 5000);
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      return setError("You must specify a price to sell this product");
    }

    if (!product.quantity_in_stock) {
      setProduct(0);
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };

    try {
      await axios.post("/api/product/", formData, config);

      handleClearForm();

      setSuccess("Product added");

      setTimeout(() => {
        setSuccess("");
      }, 6000);
      successRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.removeItem("authToken");
        return navigate("/login");
      }

      setTimeout(() => {
        setError("");
      }, 5000);
      setError(error);

      errorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    setProduct({ ...product, image: e.target.files[0] });
    setImageName(e.target.files[0].name);
  };

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
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        };

        const stalls = await axios.get(
          `../../api/mystalls/${decodedJWT.id}`,
          config
        );

        setUserStalls(stalls.data);
      } catch (error) {
        if (error.response.status === 401) {
          localStorage.removeItem("authToken");
          navigate("/login");
        }
        setTimeout(() => {
          setError("");
        }, 5000);
        return setError(error.response.data.error);
      }
    })();
  }, [navigate]);

  return (
    <Box p={2}>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <Typography variant="h4">Add Product</Typography>

        {/* Stall */}
        <Grid container direction="column" spacing={2}>
          {/* Success Alert */}
          <Grid item ref={successRef}>
            {success && <Alert severity="success">{success}</Alert>}
          </Grid>
          {/* Error Alert */}
          <Grid item ref={errorRef}>
            {error && <Alert severity="error">{error}</Alert>}
          </Grid>

          <Grid item></Grid>
          <Grid item>
            <InputLabel required>Stall</InputLabel>

            <Select
              name="product_stall"
              disabled={userStalls.length === 0}
              variant="outlined"
              size="small"
              fullWidth
              value={product.product_stall}
              placeholder="Choose a Stall"
              onChange={handleChange}
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
                You do not have any stalls. You must have a stall in order to
                add a product.
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
              autoFocus
              name="product_name"
              variant="outlined"
              fullWidth
              size="small"
              type="text"
              value={product.product_name}
              onChange={handleChange}
              placeholder="Product Name"
              sx={{ background: "white" }}
            />
          </Grid>

          {/* Description */}
          <Grid item>
            <InputLabel>Description</InputLabel>
            <TextField
              name="product_description"
              variant="outlined"
              fullWidth
              multiline
              minRows={4}
              maxRows={8}
              size="small"
              type="text"
              value={product.product_description}
              onChange={handleChange}
              placeholder="Enter a description of the product here..."
              InputProps={{ style: { fontSize: "1em" } }}
              sx={{ background: "white" }}
            />
          </Grid>

          {/* Category */}
          <Grid item>
            <InputLabel required>Product Category</InputLabel>

            <Select
              name="product_subcategory"
              variant="outlined"
              size="small"
              fullWidth
              value={product.product_subcategory}
              placeholder="Product Category"
              onChange={handleChange}
              sx={{ background: "white" }}
            >
              {SubCategoriesData.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.category}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          {/* Price  */}
          <Grid item>
            <InputLabel required>Price</InputLabel>
            <TextField
              name="product_price"
              variant="outlined"
              size="small"
              type="text"
              value={product.product_price}
              onChange={handleChange}
              placeholder="0.00"
              sx={{ background: "white" }}
            />
          </Grid>

          {/* Quanity In Stock  */}
          <Grid item>
            <InputLabel required>Quantity in Stock</InputLabel>
            <TextField
              name="quantity_in_stock"
              variant="outlined"
              size="small"
              type="text"
              value={product.quantity_in_stock}
              onChange={handleChange}
              placeholder="0"
              sx={{ background: "white" }}
            />
          </Grid>

          {/* Image Upload  */}
          <Grid item>
            <InputLabel>Upload an image</InputLabel>
            <Typography variant="body2" mb={2}>
              Draw attention to your product by uploading an image
            </Typography>

            <label htmlFor="upload-button">
              <input
                accept="image/*"
                id="upload-button"
                name="productImage"
                type="file"
                style={{ display: "none" }}
                onChange={handleImage}
              />
              <Button
                variant="contained"
                size="small"
                component="span"
                startIcon={<ImageIcon />}
              >
                Upload
              </Button>
            </label>

            {product.image && (
              <>
                <Button
                  name="image"
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    setImageName("");
                    setProduct({ ...product, image: "" });
                  }}
                  size="small"
                >
                  Remove Image
                </Button>

                <Typography mt={1} variant="body2" color="disabled">
                  Selected: {imageName}
                </Typography>
              </>
            )}
          </Grid>

          <Grid item>
            <Divider />
          </Grid>

          {/* Product Actions  */}
          <Grid item>
            <Grid container justifyContent="center">
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={() => navigate("../myproducts")}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AddProduct;
