import React from 'react'
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Divider,
  Button,
} from "@mui/material";

const OrderCard = () => {
  return (
    <Card
    sx={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      border: "solid 1px #eeeeee",
    }}
  >
    <CardContent>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          pb: 1,
        }}
      >
        <Typography gutterBottom variant="body1" align="center">
          
        </Typography>
        <Typography
          gutterBottom
          align="center"
          variant="body2"
          sx={{ backgroundColor: "#eeeeee" }}
        >
        </Typography>
      </Box>

      <Typography
        align="center"
        color="textPrimary"
        variant="body2"
        sx={{
          textOverflow: "ellipsis",
          overflow: "hidden",
          display: "-webkit-box !important",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
        }}
      >
      </Typography>
    </CardContent>
    <Box sx={{ flexGrow: 1 }} />
    <Divider margin={1} />
    <Box sx={{ p: 2 }}>
      <Grid
        container
        direction="column"
        spacing={2}
        sx={{ justifyContent: "center" }}
      >
        <Grid
          item
          sx={{
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography
            color="grey.800"
            sx={{ pl: 1, fontFamily: "Tahoma" }}
            variant="h5"
          >

          </Typography>
          <Button>View</Button>
        </Grid>

        <Grid
          item
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >

        </Grid>
      </Grid>
    </Box>
  </Card>
  )
}

export default OrderCard