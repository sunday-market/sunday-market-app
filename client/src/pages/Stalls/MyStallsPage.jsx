import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";

import {
  Typography,
  Card,
  IconButton,
  Box,
  Grid,
  Container,
  Pagination,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useUser } from "../../hooks/useUser";
import StallCard from "../../components/Stalls/MyStallCard";
import axios from "axios";
import jwt from "jwt-decode";

export default function MyStalls() {
  const userData = useUser();
  const [myStalls, setMyStalls] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      const FetchUsersStalls = async () => {
        try {
          const currentUserID = await jwt(localStorage.getItem("authToken"));
          const stalls = await axios.get(`/api/mystalls/${currentUserID.id}`);
          setMyStalls(stalls.data);
        } catch (error) {
          console.log(error);
        }
      };
      FetchUsersStalls();
    }
  }, []);
  // console.log(myStalls);
  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
        }}
      >
        <Container maxWidth={false}>
          <Box sx={{ pt: 0 }}>
            <Grid container spacing={3}>
              <Grid item lg={3} md={4} xs={12}>
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
                  <Typography sx={{ fontWeight: "bold" }}>Add Stall</Typography>
                </Card>
              </Grid>
              {myStalls.map((stall, index) => (
                <Grid item lg={3} md={4} xs={12} key={index}>
                  <StallCard
                    cardTitle={stall.stallName}
                    stallActive={stall.activated}
                    imgTitle={`This is an image for the stall ${stall.stallName}`}
                    imgSource={stall.image_url}
                    cardCategory={stall.category}
                    cardDescription={stall.description}
                  />
                </Grid>
              ))}
            </Grid>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                pt: 3,
              }}
            >
              <Pagination color="primary" count={3} size="small" />
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}