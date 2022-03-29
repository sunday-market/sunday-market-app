import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

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
  Box,
} from "@mui/material";

const AddProduct = () => {
  const [product, setProduct] = useState({
    product_name: "",
    product_description: "",
    product_subcategory: "",
    product_stall: "",
    product_price: "",
    quantity_in_stock: 1,
    image: "",
  });

  const [request, setRequest] = useState(false);
  const [imageName, setImageName] = useState("");
  const [stalls, setStalls] = useState([]); // All User Stalls
  const [subCategories, setSubCategories] = useState();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const errorRef = useRef(null);
  const successRef = useRef(null);

  const navigate = useNavigate();

  // Get the User Stalls
  useEffect(() => {
    const controller = new AbortController();
    setRequest(true);

    (async () => {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) return;

      const decodedJWT = await jwtDecode(localStorage.getItem("authToken"));

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        signal: controller.signal,
      };

      await axios
        .get(`../../api/mystalls/${decodedJWT.id}`, config)
        .then((result) => {
          setStalls(result.data);
          setRequest(false);
          controller.abort();
        })
        .catch((error) => {
          if (axios.isCancel(error)) {
            return "Request cancelled...";
          }

          if (error.response.status === 401) {
            localStorage.removeItem("authToken");
            navigate("/login");
          }
          setTimeout(() => {
            setError("");
          }, 5000);

          return setError(error.response.data.error);
        });
    })();

    setRequest(false);

    return () => {
      controller.abort();
    };
  }, [navigate]);

  // update the product category when the stall changes
  useEffect(() => {
    const controller = new AbortController();
    setRequest(true);

    if (product.product_stall) {
      (async () => {
        setProduct((p) => ({ ...p, product_subcategory: "" }));

        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          signal: controller.signal,
        };

        await axios
          .get(
            `/api/category/stall/subcategories/${product.product_stall}`,
            config
          )
          .then((result) => {
            setSubCategories(result.data[0].stall_subcategories);
            controller.abort();
          })
          .catch((error) => {
            if (axios.isCancel(error)) {
              return "Request cancelled...";
            }
          });
      })();
    }

    setRequest(false);
    return () => {
      controller.abort();
    };
  }, [product.product_stall]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleFocus = (e) => {
    e.target.select();
  };

  const handleCurrencyOnBlur = (e) => {
    return setProduct({
      ...product,
      [e.target.name]: parseFloat(e.target.value).toFixed(2),
    });
  };

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
      setProduct((p) => ({ ...p, quantity_in_stock: 1 }));
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

  const handleImage = (e) => {
    setProduct({ ...product, image: e.target.files[0] });
    setImageName(e.target.files[0].name);
  };

  return (
    <Box p={4}>
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
              autoFocus
              name="product_stall"
              disabled={stalls.length === 0 || request}
              variant="outlined"
              size="small"
              fullWidth
              value={product.product_stall}
              placeholder="Choose a Stall"
              onChange={handleChange}
              sx={{ background: "white" }}
            >
              {stalls.map((stall) => (
                <MenuItem key={stall._id} value={stall._id}>
                  {stall.stallName}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          {/* No Stall Warning  */}
          <Grid item>
            {stalls.length === 0 && (
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
              disabled={request}
              name="product_name"
              variant="outlined"
              fullWidth
              size="small"
              type="text"
              value={product.product_name}
              onFocus={handleFocus}
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
              disabled={request}
              variant="outlined"
              fullWidth
              multiline
              minRows={4}
              maxRows={8}
              size="small"
              type="text"
              value={product.product_description}
              onFocus={handleFocus}
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
              id="select_subcategory"
              name="product_subcategory"
              disabled={request}
              variant="outlined"
              size="small"
              fullWidth
              value={product.product_subcategory}
              placeholder="Product Category"
              onChange={handleChange}
              sx={{ background: "white" }}
            >
              {subCategories &&
                subCategories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.subcategory}
                  </MenuItem>
                ))}
            </Select>
          </Grid>

          {/* Price  */}
          <Grid item>
            <InputLabel required>Price</InputLabel>

            <TextField
              disabled={request}
              name="product_price"
              variant="outlined"
              size="small"
              type="text"
              value={product.product_price}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleCurrencyOnBlur}
              placeholder="0.00"
              sx={{ background: "white" }}
            />
          </Grid>

          {/* Quanity In Stock  */}
          <Grid item>
            <InputLabel required>Quantity in Stock</InputLabel>
            <TextField
              disabled={request}
              name="quantity_in_stock"
              variant="outlined"
              size="small"
              type="text"
              value={product.quantity_in_stock}
              onChange={handleChange}
              onFocus={handleFocus}
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
                accept="image/jpg, image/jpeg, image/png"
                id="upload-button"
                name="productImage"
                type="file"
                style={{ display: "none" }}
                onChange={handleImage}
              />
              <Button
                disabled={request}
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
                  disabled={request}
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
                disabled={request}
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
              >
                Save
              </Button>
              <Button
                disabled={request}
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
