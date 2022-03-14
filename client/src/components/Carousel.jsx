import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import { autoPlay } from "react-swipeable-views-utils";
import { useState } from "react";
import { Box, Button, Paper, Card, Typography } from "@mui/material";
import MobileStepper from "@mui/material/MobileStepper";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";

export default function Carousel({ Cards }) {
  const AutoPlaySwipeableViews = autoPlay(SwipeableViews);
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = Cards.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };
  return (
    <>
      <Card
        sx={{
          maxWidth: "90%",
          width: "100%",
          flexGrow: 1,
          padding: "1%",
          borderRadius: 5,
          boxShadow: 5,
          margin: "auto",
          bgcolor: "#eceff1",
        }}
      >
        <Paper
          square
          elevation={0}
          sx={{
            display: "flex",
            alignItems: "center",
            height: 50,
            pl: 2,
            margin: "auto",
            borderRadius: 2,
            boxShadow: 2,
            bgcolor: "#eceff1",
          }}
        >
          {/* This is the card header */}
          <Typography>{Cards[activeStep].textId}</Typography>
        </Paper>
        <AutoPlaySwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={activeStep}
          onChangeIndex={handleStepChange}
          enableMouseEvents
        >
          {Cards.map((step, index) => (
            <div key={step.label ? step.label : index}>
              {Math.abs(activeStep - index) <= 2 ? (
                <Box
                  sx={{
                    height: 300,
                    display: "block",
                    maxWidth: "90%",
                    overflow: "hidden",
                    width: "100%",
                    margin: "auto",
                    pt: 2,
                  }}
                >
                  {/* this is where the filling goes will need to change text after  */}
                  {step.text}
                </Box>
              ) : null}
            </div>
          ))}
        </AutoPlaySwipeableViews>
        {/* This is the next, back buttons and the mobile stepper is the dots */}
        <MobileStepper
          sx={{ bgcolor: "#eceff1", borderTop: "1px solid #000000" }}
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
              disabled={activeStep === maxSteps - 1}
            >
              Next
              {theme.direction === "rtl" ? (
                <KeyboardArrowLeft />
              ) : (
                <KeyboardArrowRight />
              )}
            </Button>
          }
          backButton={
            <Button
              size="small"
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              {theme.direction === "rtl" ? (
                <KeyboardArrowRight />
              ) : (
                <KeyboardArrowLeft />
              )}
              Back
            </Button>
          }
        />
      </Card>
    </>
  );
}
