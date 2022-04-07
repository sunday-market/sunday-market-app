import { useEffect, useRef, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Grid,
  InputLabel,
  Typography,
  TextField,
  Select,
  MenuItem,
  Alert,
  Button,
  Box,
  RadioGroup,
  Radio,
  FormControl,
  FormControlLabel,
  FormLabel,
  Modal,
} from "@mui/material";
import {
  Image as ImageIcon,
  Cancel as CancelIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import jwtDecode from "jwt-decode";
import axios from "axios";

import DataContext from "../../context/DataContext";
import { scrollToTop } from "../../utils/ux";

export default function EditMyStallPage() {
  const [stallName, setStallName] = useState("");
  const [image, setImage] = useState("");
  const [originalImage, setOriginalImage] = useState()
  const [categoryList, setCategoryList] = useState([]);
  const [activateStall, setActivateStall] = useState(false);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [location, setLocation] = useState("");
  // const [error, setError] = useState("");
  const [user, setCurrentUser] = useState(null);
  const [currentStalls, setCurrentStalls] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const { setError, setSuccess, setLoading } = useContext(DataContext);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

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

  // navigation
  const navigate = useNavigate();

  // params
  const params = useParams();
  const stallId = params.stallID;

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const getCategorys = async () => {
      try {
        setCategoryList((await axios.get("/api/category/", signal)).data);
      } catch (error) {
        if (axios.isCancel(error)) {
          return console.log("Successfully Aborted");
        }
        return setError([error]);
      }
    };
    getCategorys();
    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const getStall = async () => {
      try {
        const res = (await axios.get(`/api/stalls/${stallId}`, signal)).data[0];

        setStallName(res.stallName);
        setImage(res.image_url);
        setOriginalImage(res.image_url);
        setActivateStall(res.activated);
        setCategory(res.category);
        setDescription(res.description);
        setContactEmail(res.email);
        setLocation(res.city_location);
      } catch (error) {
        if (axios.isCancel(error)) {
          return console.log("Successfully Aborted");
        }
        return setError([error]);
      }
    };
    getStall();
    return () => {
      controller.abort();
    };
  }, [stallId]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const getCurrentStalls = async () => {
      try {
        setCurrentStalls((await axios.get("/api/stalls", signal)).data);
      } catch (error) {
        if (axios.isCancel(error)) {
          return console.log("Successfully Aborted");
        }
        return setError(error);
      }
    };
    getCurrentStalls();
    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      const getUser = async () => {
        try {
          setCurrentUser(jwtDecode(localStorage.getItem("authToken")));
        } catch (error) {
          if (error.response.status === 401) {
            localStorage.removeItem("authToken");
            navigate("/login");
          }
          return setError(error);
        }
      };
      getUser();
    }
  }, [navigate]);

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      navigate("/");
    }
  }, [navigate]);
  const saveStall = async (e) => {
    e.preventDefault();
    let sendPost = true;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };

    const stallData = new FormData();
    let userData;

    // Check user
    if (user) {
      try {
        userData = await axios.get(`/api/user/${user.id}`, config);
        userData = userData.data.data;
        if (userData.length === 0) {
          // if length is 0 then user is not genuine and
          // must remove token and navigate to home
          localStorage.removeItem("authToken");
          navigate("/login");
        } else {
          stallData.append("user", user.id);
        }
      } catch (error) {
        if (error.response.status === 401) {
          localStorage.removeItem("authToken");
          navigate("/login");
        }
        sendPost = false;
        return setError(error);
      }
    }

    // Check stall name for a value
    if (stallName === "" || stallName.trim() === "") {
      sendPost = false;
      return setError("You Need To Provide A Stall Name");
    } else {
      stallData.append("stallName", stallName);
    }
    currentStalls.forEach((currentStall) => {
      if (
        stallName === currentStall.stallName &&
        currentStall._id !== stallId
      ) {
        sendPost = false;
        return setError(
          `The stall name ${stallName}, is already taken please try another.`
        );
      }
    });

    // Check for Category selected
    if (!category) {
      sendPost = false;
      return setError("You need to select a category to upload a store");
    } else {
      stallData.append("category", category);
    }
    // set current activated to currently selected radio button - false by default
    stallData.append("activated", activateStall);

    // check and set description
    if (description) {
      stallData.append("description", description);
    }

    // check if image set
    // if (image) {
    //   stallData.append("image", image);
    // }

    if(originalImage !== image){
      stallData.append("image", image);
    } else if (image) {
      stallData.append("sameimage", image)
    }
    // check email
    if (!contactEmail) {
      stallData.append("email", userData.email);
    } else {
      stallData.append("email", contactEmail);
    }

    // check location
    if (!location) {
      sendPost = false;
      return setError("You must provide a location for the stall");
    } else {
      stallData.append("city_location", location);
    }
    if (sendPost) {
      // try and put the data
      try {
        await axios.put(`/api/stalls/${stallId}`, stallData, config);
        return navigate("/account/stalls/mystalls");
      } catch (error) {
        if (error.response.status === 401) {
          localStorage.removeItem("authToken");
          return navigate("/login");
        }
        return setError(error.response.data.error);
      }
    }
  };

  const handleCancel = () => {
    return navigate("/account/stalls/mystalls");
  };
  const handleDelete = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        data: {
          image: image,
        },
      };
      await axios.delete(`/api/stalls/${stallId}`, config);
      navigate("/account/stalls/mystalls");
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.removeItem("authToken");
        return navigate("/login");
      }
      return setError(error.response.data.error);
    }
  };
  return (
    <>
      <Box p={2}>
        <Typography variant="h4">
          Update {stallName ? stallName : ""}
        </Typography>
        <Grid container direction={"column"} spacing={1}>

          <Grid item>
            <InputLabel required>Stall Name</InputLabel>
            <TextField
              variant="outlined"
              fullWidth
              size="small"
              type="text"
              value={stallName}
              onChange={(e) => setStallName(e.target.value)}
              placeholder={stallName}
              sx={{ background: "white" }}
            />
          </Grid>
          {/* Image Upload  */}
          <Grid item>
            <InputLabel>Upload an image</InputLabel>
            <Typography variant="body2" gutterBottom>
              Update An Image And Express Your {stallName ? stallName : "Stall"}
            </Typography>
            <Button
              component="label"
              variant="contained"
              startIcon={<ImageIcon />}
              size="small"
              sx={{ margin: 1, marginLeft: 0 }}
            >
              <input
                accept="image/jpg, image/jpeg, image/png"
                hidden
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
              />
              Add Image
            </Button>
            <Button
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={() => setImage("")}
              size="small"
              sx={{ margin: 1 }}
            >
              Remove Image
            </Button>
            {image && (
              <Grid item mt={2}>
                <Typography variant="body2">
                  Image: {image.name ? image.name : image}
                </Typography>
              </Grid>
            )}
          </Grid>
          <Grid item>
            <FormControl>
              <FormLabel id="activate-stall-button-group">
                Activate {stallName ? stallName : "Stall"}
              </FormLabel>
              <Typography variant="body2" gutterBottom>
                Ready For {stallName ? stallName : "Your Stall"} To Go Live?
              </Typography>
              <RadioGroup
                row
                aria-labelledby="activate-stall-button-group"
                name="controll-radio-button-group"
                value={activateStall}
                onChange={(e) => setActivateStall(e.target.value)}
              >
                <FormControlLabel
                  value={false}
                  control={<Radio />}
                  label="No Keep Deactivated For Now"
                />
                <FormControlLabel
                  value={true}
                  control={<Radio />}
                  label="Yes Lets Activate It Now"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          {/* The category value needs to be stored as an id of category as the model only accepts object IDS */}
          <Grid item>
            <InputLabel required>Category</InputLabel>
            <Select
              disabled={categoryList.length === 0}
              variant="outlined"
              size="small"
              fullWidth
              value={category}
              placeholder="Choose A Category"
              onChange={(e) => setCategory(e.target.value)}
              sx={{ background: "white" }}
            >
              {categoryList.map((c) => (
                <MenuItem key={c._id} value={c._id}>
                  {c.category_name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item>
            <InputLabel>Stall Description</InputLabel>
            <TextField
              variant="outlined"
              fullWidth
              size="small"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={`Enter A Description About ${
                stallName ? stallName : "Your Stall"
              }`}
              sx={{ background: "white" }}
            />
          </Grid>
          <Grid item>
            <InputLabel>Stall Contact Details</InputLabel>
            <Typography variant="body2" gutterBottom>
              If the Stall uses a different email from your account enter it
              below
            </Typography>
            <TextField
              variant="outlined"
              fullWidth
              size="small"
              type="text"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder={`Enter ${
                stallName ? stallName : "A Stall"
              } Contact Email..`}
              sx={{ background: "white" }}
            />
          </Grid>
          <Grid item>
            <InputLabel required>Stall Location</InputLabel>
            <TextField
              variant="outlined"
              fullWidth
              size="small"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={`Enter where the ${
                stallName ? stallName : "Stall"
              } is based..`}
              sx={{ background: "white" }}
            />
          </Grid>
          <Grid item>
            <Grid container justifyContent="center">
              <Button
                sx={{ margin: 1 }}
                variant="contained"
                onClick={saveStall}
                startIcon={<SaveIcon />}
              >
                Save
              </Button>
              <Button
                sx={{ margin: 1 }}
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
          <Grid container justifyContent="center">
            <Button
              // variant="contained"
              startIcon={<DeleteIcon />}
              onClick={handleOpenModal}
              color="error"
            >
              Delete Stall
            </Button>
          </Grid>
        </Grid>
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Delete Stall?
            </Typography>
            <Typography id="modal-modal-description" mt={2} mb={2}>
              Are you sure you want to delete {stallName}? <br />
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
      </Box>
    </>
  );
}
