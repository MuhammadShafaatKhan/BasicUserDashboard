// Reference: https://github.com/mui/material-ui/tree/v5.16.4/docs/data/material/getting-started/templates/sign-in
import * as React from 'react';
import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ValidateField from '../components/ValidateField';
import TogglePasswordVisibility from '../components/TogglePasswordVisibility'
import { API } from "../constants.js";
import { setToken, getToken } from "../helper-functions/authToken.js";
import { useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignIn() {
  if (getToken()){
    window.location.reload()
  }
  const [email, setEmail] = useState('')
  //const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();
  const [
    emailValid, 
    setEmailValid
  ] = useState({ 
                email:true 
              })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (emailValid['email'] === false){
      alert('Please fill the email correctly')
      console.log('post request didnt proceed due to invalid data')
    }
    else {
      setIsLoading(true);
      try {
    const data = new FormData(event.currentTarget);
    const authData = {
      identifier: data.get('email'),
      password: data.get('password')
    }
    console.log(authData)
     const response = await fetch(`${API}/auth/local`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(authData),
    })
    console.log(response)
     const  resData = await response.json()
      console.log(resData)
        if (resData.jwt === undefined){
          alert('email or password is incorrect')
        }
        else {
          //navigate to dashboard page
          setToken(resData.jwt)
          console.log(getToken())
          console.log('navigate to dashboard')
          navigate("/dashboard", { replace: true });
          //setShowAlert(true)
          console.log(getToken())
        }
      
    

    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  } catch (error) {
    console.error(error);
  } 
  finally {
    setIsLoading(false);
  }
  }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              error={emailValid['email'] ? false : true}
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              onChange={(event) =>{event.preventDefault(); setEmail(event.target.value)}}
              autoFocus
            />
            <ValidateField email={email} setValid={setEmailValid} alreadyValid={emailValid}/>
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              InputProps={{
                endAdornment: 
                  <TogglePasswordVisibility 
                    setShowPassword={setShowPassword}
                    showPassword={showPassword}
                  />
              }}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {isLoading? <CircularProgress color="inherit" /> : "Sign In"}
            </Button>
            <Grid container>
              {
              /* 
                Forgot password functionality can be added.
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid> */
              }
              <Grid item>
                <Link href="/" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}