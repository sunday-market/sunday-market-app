import {
  Grid,
  TextField,
  InputAdornment,
  Button,
  ButtonGroup,
} from "@mui/material";

const IncDecButton = ({
  counter,
  quantityInStock,
  incrementQuantity,
  decrementQuantity,
}) => {
  return (
    <>
      <Grid container direction="column" align="center" p={1}>
        <Grid item>
          {counter <= 0 ? (
            <Button
              disabled={quantityInStock <= 0}
              variant="contained"
              fullWidth
              onClick={incrementQuantity}
            >
              Add to Cart
            </Button>
          ) : (
            <ButtonGroup>
              <TextField
                disabled
                size="small"
                value={counter}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">ea.</InputAdornment>
                  ),
                }}
                sx={{ width: "12ch", textAlign: "center" }}
              >
                {counter}
              </TextField>
              <Button
                variant="contained"
                margin={1}
                onClick={decrementQuantity}
              >
                -
              </Button>
              <Button
                variant="contained"
                disabled={quantityInStock <= 0}
                margin={1}
                onClick={incrementQuantity}
              >
                +
              </Button>
            </ButtonGroup>
          )}
        </Grid>

        <Grid item></Grid>
      </Grid>
    </>
  );
};

export default IncDecButton;
