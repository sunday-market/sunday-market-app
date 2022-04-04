import { useState, useEffect, forwardRef } from "react";

import { Snackbar, Typography } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const FeedbackAlert = ({ severity, message }) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (message) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [message]);

  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={open}
      onClose={handleClose}
      autoHideDuration={5500}
    >
      <Alert severity={severity} sx={{ width: "100%" }}>
        <Typography variant="body1">{message}</Typography>
      </Alert>
    </Snackbar>
  );
};

export default FeedbackAlert;
