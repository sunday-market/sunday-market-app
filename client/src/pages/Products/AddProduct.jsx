import { useState, useEffect, useContext } from "react";
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

import DataContext from "../../context/DataContext";
import { scrollToTop } from "../../utils/ux";

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

  const [imageName, setImageName] = useState("");
  const [stalls, setStalls] = useState([]); // All User Stalls
  const [subCategories, setSubCategories] = useState();
  const { setError, setSuccess, loading, setLoading } = useContext(DataContext);

  const navigate = useNavigate();

  // Get the User Stalls
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

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
        })
        .catch((error) => {
          setLoading(false);
          if (axios.isCancel(error)) return;
          setError([error]);
          scrollToTop();
        });
    })();

    setLoading(false);
    return () => {
      controller.abort();
    };
  }, [navigate, setError, setLoading]);

  // update the product category when the stall changes
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

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
          })
          .catch((error) => {
            setLoading(false);
            if (axios.isCancel(error)) return;
            setError([error]);
          });
      })();
    }

    setLoading(false);
    return () => {
      controller.abort();
    };
  }, [product.product_stall, setError, setLoading]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleFocus = (e) => {
    e.target.select();
  };

  const handleCurrencyOnBlur = (e) => {
    const value = e.target.value || 0;

    return setProduct({
      ...product,
      [e.target.name]: parseFloat(value).toFixed(2),
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

    const controller = new AbortController();
    const decodedJWT = await jwtDecode(localStorage.getItem("authToken"));

    if (!product.product_stall) {
      setError("You must select a stall");
      scrollToTop();
      return;
    }
    console.log("Stall passed");

    if (!product.product_name) {
      scrollToTop();
      return setError("You must provide a name for the product");
    }
    console.log("Name passed");

    if (!product.product_subcategory) {
      scrollToTop();
      return setError("You must provide a product category");
    }

    if (!product.product_price || product.product_price === 0) {
      scrollToTop();
      return setError("You must specify a price to sell this product");
    }

    if (!product.quantity_in_stock) {
      setProduct((p) => ({ ...p, quantity_in_stock: 1 }));
    }

    const formData = new FormData();

    formData.append("product_name", product.product_name);
    formData.append("product_description", product.product_description);
    formData.append("product_subcategory", product.product_subcategory);
    formData.append("product_stall", product.product_stall);
    formData.append("product_user", decodedJWT.id);
    formData.append("product_price", product.product_price);
    formData.append("quantity_in_stock", product.quantity_in_stock);
    formData.append("image", product.image);

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      signal: controller.signal,
    };
    setLoading(true);

    await axios
      .post("/api/product/", formData, config)
      .then(() => {
        setSuccess("Product added");
      })
      .catch((error) => {
        setLoading(false);
        if (axios.isCancel(error)) return;
        setError([error]);
        scrollToTop();
      });

    setLoading(false);
    handleClearForm();
    scrollToTop();
    return controller.abort();
  };

  const handleImage = (e) => {
    setProduct({ ...product, image: e.target.files[0] });
    setImageName(e.target.files[0].name);
  };

  return (
    <Box p={{ xs: 0, sm: 4, md: 8 }}>
      <form onSubmit={(e) => handleSubmit(e)} encType="multipart/form-data">
        <Typography variant="h4">Add Product</Typography>

        {/* Stall */}
        <Grid container direction="column" spacing={2}>
          <Grid item></Grid>
          <Grid item>
            <InputLabel required>Stall</InputLabel>

            <Select
              autoFocus
              name="product_stall"
              disabled={stalls?.length === 0 || loading}
              variant="outlined"
              size="small"
              fullWidth
              value={product?.product_stall}
              placeholder="Choose a Stall"
              onChange={handleChange}
              sx={{ background: "white" }}
            >
              {stalls.map((stall) => (
                <MenuItem key={stall?._id} value={stall?._id}>
                  {stall?.stallName}
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
              disabled={loading}
              name="product_name"
              variant="outlined"
              fullWidth
              size="small"
              type="text"
              value={product?.product_name}
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
              disabled={loading}
              variant="outlined"
              fullWidth
              multiline
              minRows={4}
              maxRows={8}
              size="small"
              type="text"
              value={product?.product_description}
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
              name="product_subcategory"
              disabled={loading}
              variant="outlined"
              size="small"
              fullWidth
              value={product?.product_subcategory}
              placeholder="Product Category"
              onChange={handleChange}
              sx={{ background: "white" }}
            >
              {subCategories &&
                subCategories?.map((category) => (
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
              disabled={loading}
              name="product_price"
              variant="outlined"
              size="small"
              type="text"
              value={product?.product_price}
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
              disabled={loading}
              name="quantity_in_stock"
              variant="outlined"
              size="small"
              type="text"
              value={product?.quantity_in_stock}
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
                disabled={loading}
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
                  disabled={loading}
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
                disabled={loading}
                onClick={(e) => handleSubmit(e)}
                variant="contained"
                startIcon={<SaveIcon />}
              >
                Save
              </Button>
              <Button
                disabled={loading}
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
