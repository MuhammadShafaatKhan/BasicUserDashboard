// Reference: https://github.com/mui/material-ui/tree/v5.16.4/docs/data/material/getting-started/templates/sign-up
//  todo: move same block of code in grid to a function
import * as React from 'react';
import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import TogglePasswordVisibility from '../components/TogglePasswordVisibility'
import ValidateField from '../components/ValidateField';
import { MuiTelInput } from 'mui-tel-input'
import { MuiFileInput } from 'mui-file-input'
import intlTelInput from 'intl-tel-input';
import removeChars from '../helper-functions/removeChars.js'
import axios from 'axios';
import { API } from "../constants.js";
import { setToken} from "../helper-functions/authToken.js"
import { useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();


export default function SignUp() {
  const [email, setEmail] = useState('')
  const [telNum, setTelNum] = useState('')
  const [abn, setAbn] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  // TODO: check this fields validity dynamicly instead of hardcoded
  const [
    fieldsValid, 
    setFieldsValid
  ] = useState({
                email:true,
                phone:true,
                password:true, 
                profileImg:true,
                resumeDoc:true,
                abn: true,
                confirmPassword: true
              })
  const [imgFile, setImgFile] = useState(null)
  const [imgSize, setImgSize] = useState(0)
  const [docFile, setDocFile] = useState(null)
  const [docSize, setDocSize] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const handleDocFileChange = (newFile) => {
    setDocFile(newFile)
  }
  const handleImgFileChange = (newFile) => {
    setImgFile(newFile)
  }
  // TODO: Make consistent naming to have both fileAttribute, fieldAttribute as same name.
  // Means change profileImg to profilePic (profilePic is strapi attribute name) and
  //resumeDoc to resume (resume is strapi attribute name)
  async function postMediaData(data, response, fileAttribute, fieldAttribute){
    const mediaData = new FormData(); 
    mediaData.append('files',  data.get(fileAttribute))
    mediaData.append('ref', 'plugin::users-permissions.user')
    mediaData.append('refId', response.data.user.id)
    mediaData.append('field', fieldAttribute)
    await fetch(`${API}/upload`, {
      method: 'post',
      headers: { Authorization: `BEARER ${response.data.jwt}` },
      body: mediaData
    })
    .then(res => {
      console.log('res: ', res);
    })
    .catch(err => {
      console.log('err: ', err);
    });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    // TODO: Pass better alert notification
    let allFieldsValid = true
    for (const field in fieldsValid) {
      if (fieldsValid[field] === false){
        alert('Please fill the data correctly')
        console.log('post request didnt proceed due to invalid data')
        allFieldsValid = false
        break;
      }
    }
    if (allFieldsValid) {
      console.log('post request proceeded')
    console.log('ec', event.currentTarget)

    const data = new FormData(event.currentTarget); 
    console.log('ec2', event.currentTarget)
    console.log('data: ', data)
    for (const pair of data.entries()) {
      console.log(pair[0], pair[1]);
    }
    // if telephone number only contains area code then dont submit the number
    const countryData = intlTelInput.getCountryData();
    const countryCodes = countryData.map((country) => "+"+country.dialCode)
    if (countryCodes.includes(data.get('telNum')))
      data.delete('telNum')
    // remove all chars other than numbers from abn number
    let formattedABN = removeChars(data.get('abn'), /[^0-9]/g)
    if (formattedABN.length !== 0)
      data.set('abn', formattedABN)
    // remove all chars other than numbers and '+' from telephone number
    if (data.get('telNum') !== null){
      let formattedTel = removeChars(data.get('telNum'), /[^0-9+]/g)
      if (formattedTel.length !== 0)
        data.set('telNum', formattedTel)
    }
    // if optional elements are empty in formdata then delete them from formdata
    // Note: Array.from method must be used when deleting an entry of form data while
    // looping, otherwise entries will not be deleted properly
    // Reference: https://stackoverflow.com/a/57127112/16185710
    for (const pair of Array.from(data.entries())) {
      if (pair[1].length === 0)
        data.delete(pair[0])
      // removing empty file object from data
      if (pair[1].name?.length === 0 && pair[1].size === 0)
        data.delete(pair[0])
    }
    for (const pair of data.entries()) {
      console.log(pair[0], pair[1]);
    }
    console.log('ec2', event.currentTarget)
    setIsLoading(true);
    try {
       await axios.post(`${API}/auth/local/register`,
       {
        "username": data.get('email'),
        "email": data.get('email'),
        "password": data.get('password'),
        "firstName": data.get('firstName'),
        "lastName": data.get('lastName'),
        "phoneNumber": data.get('telNum'),
        "AbnNumber": data.get('abn')
       }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(async function (response) {
      console.log(response)
      setToken(response.data.jwt)
    if (data.get('profileImg') !== null){
      await postMediaData(data, response, 'profileImg', 'profilePic')
    }
    if (data.get('resumeDoc') !== null){
      await postMediaData(data, response, 'resumeDoc', 'resume')
    }
    console.log('here')

    navigate("/dashboard", { replace: true });
    })
    .catch(function (error) {
      console.log('e', error);
    });
    
  } catch (error) {
    console.error(error);
  } finally {
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
            marginTop: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form"  onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  error={fieldsValid['email'] ? false : true}
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={(event) =>{event.preventDefault(); setEmail(event.target.value)}}
                />
                <ValidateField email={email} setValid={setFieldsValid} alreadyValid={fieldsValid}/>
              </Grid>
              <Grid item xs={12}>
                <MuiTelInput 
                  fullWidth 
                  error={fieldsValid['phone'] ? false : true}
                  autoComplete="tel"
                  id='telNum' 
                  label='Telephone number (Optional)' 
                  name="telNum" 
                  defaultCountry="AU" 
                  value={telNum} 
                  onChange={(event) =>{ setTelNum(event)}}
                />
                <ValidateField phone={telNum} setValid={setFieldsValid} alreadyValid={fieldsValid}/>
              </Grid>
              <Grid item xs={12}>
              <TextField
                  fullWidth
                  error={fieldsValid['abn'] ? false : true}
                  id="abn"
                  label="ABN number (Optional)"
                  name="abn"
                  onChange={(event) =>{event.preventDefault(); setAbn(event.target.value)}}
                />
                <ValidateField abn={abn} setValid={setFieldsValid} alreadyValid={fieldsValid}/>
              </Grid>
              <Grid item xs={12}>
                <MuiFileInput 
                  value={imgFile} 
                  fullWidth
                  error={fieldsValid['profileImg'] ? false : true}
                  label="Profile Picture (Optional)"
                  id="profileImg"
                  name="profileImg"
                  placeholder="Upload Profile Picture (Optional)"
                  helperText="Max size: 1MB"
                  InputProps={{inputProps: { accept: 'image/*' }, startAdornment: <AttachFileIcon />}}
                  getSizeText={(value) =>{
                    let img = value;
                    if (img){
                      if (img.size)
                        setImgSize(img.size)
                    }
                  }}
                  onChange={handleImgFileChange} 
                  clearIconButtonProps={{
                    title: "Remove",
                    children: <CloseIcon fontSize="small" />,
                  }}
                />
                
                <ValidateField imgSize={imgSize} imgFile={imgFile} setValid={setFieldsValid} alreadyValid={fieldsValid}/>
              </Grid>
              <Grid item xs={12}>
                <MuiFileInput 
                  value={docFile} 
                  fullWidth
                  error={fieldsValid['resumeDoc'] ? false : true}
                  label="Resume (Optional)"
                  id="resumeDoc"
                  name="resumeDoc"
                  placeholder="Upload Resume (Optional)"
                  helperText="Max size: 1MB"
                  InputProps={{inputProps: { accept: '.doc, .docx, .pdf' }, startAdornment: <AttachFileIcon />}}
                  getSizeText={(value) =>{
                    let doc = value;
                    if (doc){
                      if (doc.size)
                        setDocSize(doc.size)
                    }
                  }}
                  onChange={handleDocFileChange} 
                  clearIconButtonProps={{
                    title: "Remove",
                    children: <CloseIcon fontSize="small" />,
                  }}
                />
                <ValidateField docSize={docSize} docFile={docFile} setValid={setFieldsValid} alreadyValid={fieldsValid}/>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  error={fieldsValid['password'] ? false : true}
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="off"
                  value={password}
                  InputProps={{
                    endAdornment: 
                      <TogglePasswordVisibility 
                        setShowPassword={setShowPassword}
                        showPassword={showPassword}
                      />
                  }}
                  onChange={(event) =>{event.preventDefault(); setPassword(event.target.value)}}
                />
                <ValidateField password={password} setValid={setFieldsValid} alreadyValid={fieldsValid}/>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  error={fieldsValid['confirmPassword'] ? false : true}
                  name="confirm-password"
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirm-password"
                  autoComplete="off"
                  value={confirmPassword}
                  InputProps={{
                    endAdornment: 
                      <TogglePasswordVisibility 
                        setShowPassword={setShowConfirmPassword}
                        showPassword={showConfirmPassword}
                      />
                  }}
                  onChange={(event) =>{event.preventDefault(); setConfirmPassword(event.target.value)}}
                />
                <ValidateField confirmPasswords={[password, confirmPassword]} setValid={setFieldsValid} alreadyValid={fieldsValid}/>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
             {isLoading? <CircularProgress color="inherit" /> : "Sign Up"}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/sign-in" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}