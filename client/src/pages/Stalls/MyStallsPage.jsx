import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";

import {
  Typography,
  Card,
  Box,
  Grid,
  Container,
  Pagination,
  Alert,
} from "@mui/material";
import { useEffect, useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import StallCard from "../../components/Stalls/StallCard";
import axios from "axios";
import jwt from "jwt-decode";
import DataContext from "../../context/DataContext";

export default function MyStalls() {
  const navigate = useNavigate();
  const [myStalls, setMyStalls] = useState([]);
  const { categories, setError } = useContext(DataContext);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    if (localStorage.getItem("authToken")) {
      const FetchUsersStalls = async () => {
        try {
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            signal,
          };
          const currentUserID = jwt(localStorage.getItem("authToken"));
          const stalls = await axios.get(
            `/api/mystalls/${currentUserID.id}`,
            config
          );
          setMyStalls(stalls.data);
        } catch (error) {
          if (axios.isCancel(error)) {
            return;
          }
          return setError([error]);
        }
      };
      FetchUsersStalls();
    }
    return () => {
      controller.abort();
    };
  }, [navigate, setError]);

  const getCategoryName = (catId) => {
    if (categories) {
      for (const category of categories) {
        if (category._id === catId) {
          return category.category_name;
        }
      }
    } else {
      setTimeout(() => {
        getCategoryName(catId);
      }, 2000);
    }
  };

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
        }}
      >
        <Container maxWidth={false}>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={0}>
              <Grid item lg={3} md={4} xs={12} m={0} p={1}>
                <Card
                  onClick={() => navigate("../addstall")}
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
                  <Typography sx={{ fontWeight: "bold" }}>Add Stall</Typography>
                </Card>
              </Grid>
              {myStalls?.map((stall, index) => (
                <Grid item lg={3} md={4} xs={12} key={index} m={0} p={1}>
                  <StallCard
                    cardId={stall._id}
                    cardTitle={stall.stallName}
                    stallActive={stall.activated}
                    stallOwner={stall.user}
                    imgTitle={`This is an image for the stall ${stall.stallName}`}
                    imgSource={stall.image_url}
                    cardCategory={getCategoryName(stall.category)}
                    cardDescription={stall.description}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  );
}
