import React from 'react';
import { Box, Button, Paper, Step, StepButton, Stepper, TextField } from '@mui/material';

type RegisterObjectProps = {
  visible: boolean;
};

const STEPS = ['Vehicle', 'Device', 'Key'];

const RegisterObject: React.FC<RegisterObjectProps> = ({
  visible
}) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [stepsCompleted, setStepsCompleted] = React.useState<{
    [k: number]: boolean;
  }>({});

  return (
    <div
      style={{
        display: (visible ? 'block' : 'none'),
        marginRight: '2rem',
      }}
    >
      <Paper elevation={3} sx={{ padding: '1rem' }}>
        <div
          style={{
            fontSize: '1.2rem',
            fontWeight: 'bold',
            padding: '0 0.5rem',
          }}
        >Register or link to an existing object</div>
        <Stepper nonLinear activeStep={activeStep} sx={{ marginTop: '1rem', }}>
          {STEPS.map((label, i) => (
            <Step key={label} completed={stepsCompleted[i]}>
              <StepButton color="inherit" onClick={() => setActiveStep(i)}>
                {label}
              </StepButton>
            </Step>
          ))}
        </Stepper>
        {activeStep === 0 &&
          <div
            style={{
              marginTop: '1rem',
              padding: '0 0.5rem',
              width: '100%',
            }}
          >
            <div>Register a new Vehicle</div>
            <TextField label='Car plate number' variant='standard' sx={{ width: '50%', }} />
          </div>
        }
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={() => setActiveStep((prevActiveStep) => prevActiveStep - 1)}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          <Button
            onClick={() => setActiveStep(activeStep + 1)}
            sx={{ mr: 1 }}
            disabled={activeStep === STEPS.length - 1}
          >
            Next
          </Button>
          <Button onClick={() => {
            // TODO: Handle object creation + linking
          }}>
            Submit
          </Button>
        </Box>
      </Paper>
    </div>
  );
};

export default RegisterObject;
