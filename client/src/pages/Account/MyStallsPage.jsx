import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import AddIcon from "@mui/icons-material/Add";
import { Typography, Card, IconButton } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useUser } from "../../hooks/useUser";
import StallCard from "../../components/MyStallCard";

export default function MyStalls() {
  const userData = useUser();

  return (
    <>
      <div>My Stalls</div>
      <Box
        sx={{
          flexGrow: 1,
          margin: 0,
          padding: "1% 2%",
          maxwidth: "100%",
          maxHeight: "100%",
          bgcolor: "#ffffff",
          minHeight: "100%",
        }}
      >
        <Box
          textAlign={"center"}
          justify={"center"}
          sx={{ display: "flex", flexWrap: "wrap" }}
        >
          {Array.from(Array(5)).map((_, index) => (
            <Box
              item
              key={index}
              sx={{
                margin: "auto",
                textAlign: "center",
                alignItems: "center",
                justifyContent: "center",
                p: 1,
              }}
            >
              <StallCard />
            </Box>
          ))}
          <Card
            sx={{
              width: "100%",
              maxWidth: 300,
              height: 450,
              maxHeight: 600,
              margin: "auto",
              borderRadius: 5,

              boxShadow: 3,
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            <Paper
              component={Stack}
              direction="column"
              justifyContent="center"
              sx={{
                bgcolor: "#eceff1",
                margin: "auto",
                width: "100%",
                height: "100%",
              }}
            >
              <IconButton
                sx={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  width: "45%",
                  height: "35%",
                  bgcolor: "white",
                }}
              >
                <AddIcon
                  sx={{
                    transform: "scale(5)",
                    color: "black",
                    margin: "auto",
                  }}
                />
              </IconButton>
              <Typography sx={{ fontWeight: "bold" }}>
                Add a new Stall
              </Typography>
            </Paper>
          </Card>
        </Box>
      </Box>
    </>
  );
}
