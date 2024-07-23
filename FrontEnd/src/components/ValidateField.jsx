import * as React from 'react';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import validator from 'validator';
import Typography from '@mui/material/Typography';
import isValidABN from 'is-valid-abn'
import removeChars from '../helper-functions/removeChars.js'
// TODO: getting Warning: "Cannot update a component (`SignUp`) while rendering a 
// different component (`ValidateField`)." Tried to fix it but couldnt. And site 
// is working fine. So ignoring this warning for now.

function updateValidFieldsState(alreadyValid, fieldName, setValid, value){
  if (alreadyValid[fieldName] === !value){
    const updatedValid = {...alreadyValid}
    updatedValid[fieldName] = value
    setValid(updatedValid)
}
}

const SpecialCharsSection = styled(({ className, ...props }) => (
  <Tooltip enterTouchDelay={700} placement="bottom" {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'black',
    maxWidth: 310,
    border: '1px solid #dadde9',
    display: 'block'
  },
}));


function ValidateField({ email, phone, abn, imgSize, imgFile,docSize, docFile,  password, confirmPasswords, setValid, alreadyValid }) {
  const style = {"color": "red", "paddingLeft": "2px" }
  const specialChars = "- # ! $ @ % ^ & * ( ) _ + | ~ = ` { } [ ] : \" ; ' < > ? , . /"
  if (typeof email !== 'undefined') {
    if (!validator.isEmail(email) && email.length !== 0) {
    updateValidFieldsState(alreadyValid, 'email', setValid, false)
      return (
        <Typography sx={style} variant="body2">Email Address is not valid</Typography>
      )
    }
    updateValidFieldsState(alreadyValid, 'email', setValid, true)
  } else if (typeof phone !== 'undefined') {
    // any space is going to be removed using this regex /\s/g
    let formattedPhone = removeChars(phone, /\s/g)
    
    if (!validator.isMobilePhone(formattedPhone) && phone.length !== 0 ) {
      updateValidFieldsState(alreadyValid, 'phone', setValid, false)
      return (
        <Typography sx={style} variant="body2">Telephone number is not valid</Typography>
      )
    }
    updateValidFieldsState(alreadyValid, 'phone', setValid, true)
  } else if (typeof abn !== 'undefined'){
    if (!isValidABN(abn) && abn.length !== 0) {
      updateValidFieldsState(alreadyValid, 'abn', setValid, false)
      return (
        <Typography sx={style} variant="body2">ABN number is not valid</Typography>
      )
    }
    updateValidFieldsState(alreadyValid, 'abn', setValid, true)
  } else if (typeof password !== 'undefined'){
    console.log('password is: ', password)
    if (!validator.isStrongPassword(password) && password.length !== 0){
      updateValidFieldsState(alreadyValid, 'password', setValid, false)
      return (
        <>
          <Typography 
            sx={style} 
            variant="body2"
          >
            Password must contain:
          </Typography>
          <Typography 
            component="ul"
          >
            <Typography 
              component="li"  
              variant="body2" 
              sx={{ 
                color: "red", 
                paddingLeft: "2px", 
                ...(password.length >= 8 && {color:"green"})
                }}  
            >
              minimum 8 characters
            </Typography>
            <Typography 
              component="li"  
              variant="body2" 
              sx={{
                color: "red", 
                paddingLeft: "2px", 
                ...( /[a-z]/.test(password) && {color:"green"})
              }} 
            >
              minimum 1 Lowercase character
            </Typography>
            <Typography 
              component="li" 
              variant="body2" 
              sx={{
                color: "red", 
                paddingLeft: "2px", 
                ...( /[A-Z]/.test(password) && {color:"green"})
              }} 
            >
              minimum 1 Uppercase character
            </Typography>
            <Typography 
              component="li" 
              variant="body2" 
              sx={{
                color: "red", 
                paddingLeft: "2px", 
                ...( /[0-9]/.test(password) && {color:"green"})
              }}
            >
              minimum 1 Number
            </Typography>
            <Typography 
              component="li" 
              variant="body2" 
              sx={{color: "red", 
              paddingLeft: "2px", 
              ...( /[-#!$@£%^&*()_+|~=`{}\[\]:";'<>?,.\/\\ ]/.test(password) && {color:"green"})
              }} 
            >
              minimum 1 Symbol    
            <SpecialCharsSection
            sx = {{display: 'inline'}}
              title={
                <React.Fragment>
                  <Typography variant='body2' color="inherit">Symbol includes following (including a space): <br/> {specialChars} </Typography>
                </React.Fragment>
              }
            >
              <IconButton 
                sx={{
                  color: "black", 
                  display: 'inline',
                  paddingLeft:1,
                  paddingBottom:0,
                  paddingTop:0,
                  ...( /[-#!$@£%^&*()_+|~=`{}\[\]:";'<>?,.\/\\ ]/.test(password) && {color:"black"})
                }} 
                aria-label="info button"
              >
                <HelpOutlineOutlinedIcon 
                  fontSize='small'
                  sx = {{display: 'inline'}}
                />
              </IconButton>
              </SpecialCharsSection>
              </Typography>
          </Typography>
        </>
      )
    }
    updateValidFieldsState(alreadyValid, 'password', setValid, true)
  } else if (typeof imgSize !== 'undefined') {
    // value size should smaller than or equal to 1048576 bit = 1MB
    console.log('imgsize: ', imgSize)
    if (imgSize > 1048576 && imgFile !== null){
      updateValidFieldsState(alreadyValid, 'profileImg', setValid, false)
      return (
        <Typography sx={style} variant="body2">Image size should not be grater than 1MB</Typography>
      )
    }
    updateValidFieldsState(alreadyValid, 'profileImg', setValid, true)
  } else if (typeof docSize !== 'undefined') {
    // value size should smaller than or equal to 1048576 bit = 1MB
    console.log('docsize: ', docSize)
    if (docSize > 1048576 && docFile !== null){
      updateValidFieldsState(alreadyValid, 'resumeDoc', setValid, false)
      return (
        <Typography sx={style} variant="body2">Document size should not be greater than 1MB</Typography>
      )
    }
    updateValidFieldsState(alreadyValid, 'resumeDoc', setValid, true)
  } else if (typeof confirmPasswords !== 'undefined'){
    if (confirmPasswords[0] !== confirmPasswords[1] && confirmPasswords[1].length > 0){
      updateValidFieldsState(alreadyValid, 'confirmPassword', setValid, false)
      return(
        <Typography sx={style} variant="body2">Passwords didn't matched</Typography>
      )
    }
    else if (confirmPasswords[1].length > 0) {
      updateValidFieldsState(alreadyValid, 'confirmPassword', setValid, true)
      return(
        <Typography 
          sx={{ 
            color: "green", 
            paddingLeft: "2px", 
            }}  
          variant="body2"
        >Passwords matched</Typography>
      )
    }
    else if (confirmPasswords[1].length === 0){
      updateValidFieldsState(alreadyValid, 'confirmPassword', setValid, true)
    }
  }
}

export default ValidateField
