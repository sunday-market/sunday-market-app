import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
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
  Modal,
} from "@mui/material";

import SubCategoriesData from "../../data/SubCategories.json";

const EditProduct = () => {
  const [product, setProduct] = useState({
    product_name: "",
    product_description: "",
    product_subcategory: "",
    product_stall: "",
    product_price: "",
    quantity_in_stock: "",
    image: "",
  });

  const [filePreview, setFilePreview] = useState(undefined);
  const [userStalls, setUserStalls] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;

  const errorRef = useRef(null);
  const successRef = useRef(null);

  const navigate = useNavigate();
  const { productId } = useParams();

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  useEffect(() => {
    (async () => {
      try {
        const decodedJWT = await jwtDecode(localStorage.getItem("authToken"));

        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        };

        // Get Product Information
        const productData = await axios.get(
          `/api/product/${productId}`,
          config
        );

        setProduct(productData.data);

        // Get User Stalls
        const stalls = await axios.get(
          `/api/mystalls/${decodedJWT.id}`,
          config
        );

        setUserStalls(stalls.data);
      } catch (error) {
        if (error.response.status === 401) {
          localStorage.removeItem("authToken");
          return navigate("/login");
        }
        setError(error.response.data.error);

        setTimeout(() => {
          setError("");
        }, 5000);
      }
    })();
  }, [navigate, productId]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    setProduct({ ...product, image: e.target.files[0] });
    setFilePreview(URL.createObjectURL(e.target.files[0]));
  };

  const handleClearForm = () => {
    setProduct({
      product_name: "",
      product_description: "",
      product_subcategory: "",
      product_stall: "",
      product_price: "",
      quantity_in_stock: "",
      image: filePreview,
    });
  };

  const handleDelete = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        data: {
          image: product.image,
        },
      };

      await axios.delete(`/api/product/${productId}`, config);
      navigate("/account/products/myproducts");
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.removeItem("authToken");
        return navigate("/login");
      }
      setError(error.response.data.error);

      setTimeout(() => {
        setError("");
      }, 5000);
    }
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
      setProduct({ ...product, quantity_in_stock: 0 });
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };

    try {
      await axios.put(`/api/product/${productId}`, formData, config);

      handleClearForm();

      setSuccess("Product updated");

      setTimeout(() => {
        navigate(-1);
      }, 3000);

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

  return (
    <>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <Typography variant="h4" mb={1}>
          Edit Product
        </Typography>
        <Divider />
        <Grid container spacing={0} mt={2} justifyContent="center">
          <Grid item xs={11} sm={4}>
            <Box>
              <Box
                component="img"
                width="100%"
                src={
                  filePreview !== undefined
                    ? filePreview
                    : product.image
                    ? `${PUBLIC_FOLDER}products/${product.image}`
                    : `${PUBLIC_FOLDER}products/noimage.jpg`
                }
                alt={product.product_name}
                border="solid 1px #e0e0e0"
              />
            </Box>

            <Box mt={2}>
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
                  fullWidth
                  align="center"
                  variant="contained"
                  size="small"
                  component="span"
                  startIcon={<ImageIcon />}
                >
                  Change Image
                </Button>
              </label>

              <Button
                fullWidth
                name="image"
                variant="outlined"
                startIcon={<DeleteIcon />}
                color="error"
                onClick={() => {
                  setProduct({ ...product, image: "noimage.jpg" });
                  setFilePreview(null);
                }}
                size="small"
                sx={{ marginTop: 1 }}
              >
                Remove Image
              </Button>

              <Divider />
            </Box>
          </Grid>

          <Grid item xs={12} sm={8} p={3}>
            <Typography variant="h5">{product.product_name}</Typography>

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
                    You do not have any stalls. You must have a stall in order
                    to add a product.
                    <br />
                    <Link to="../../stalls/add">Click Here</Link> to add a
                    stall.
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
                    sx={{ marginRight: 1 }}
                  >
                    Update
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item align="center" mt={4}>
              <Button
                // variant="contained"
                startIcon={<DeleteIcon />}
                onClick={handleOpenModal}
                color="error"
              >
                Delete Product
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Delete Product?
          </Typography>
          <Typography id="modal-modal-description" mt={2} mb={2}>
            Are you sure you want to delete this product? <br />
            This action cannot be undone.
          </Typography>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            sx={{ marginRight: 1 }}
          >
            Delete
          </Button>
          <Button variant="outlined" onClick={handleCloseModal}>
            Cancel
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default EditProduct;
