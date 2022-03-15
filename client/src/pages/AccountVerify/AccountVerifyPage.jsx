import {useEffect} from 'react'

import {Box, Paper, Typography, Grid, Button} from "@mui/material"
import {useNavigate} from "react-router-dom"

import successImage from "../../assets/success.svg"


const AccountVerifyPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <Box p={{ xs: 1, sm: 4, md: 8, lg: 20 }}>
      <Paper variant="outlined" align="center" sx={{ padding: "1em" }}>
        <img width="60%" style={{maxWidth: "200px"}} src={successImage} alt="Login"/>
        <Grid container direction="column" spacing={4}>
          <Grid item>
            <Typography variant="h4">
              Success!
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6">
            Thanks for signing up to <b>Sunday Markets</b>.
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body1">
              Please check your inbox to verify your account.  If you have not received an email from us <b>please check your spam/junk folder</b>.
            </Typography>
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={()=> {navigate("/login")}}>
              Login
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}

export default AccountVerifyPage