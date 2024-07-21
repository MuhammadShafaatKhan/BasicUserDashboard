import validator from 'validator';
import Typography from '@mui/material/Typography';
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
function ValidateField({ email, phone, imgSize, imgFile,  password, setValid, alreadyValid }) {
  const style = {"color": "red", "paddingLeft": "2px" }
  if (typeof email !== 'undefined') {
    if (!validator.isEmail(email) && email.length !== 0) {
    updateValidFieldsState(alreadyValid, 'email', setValid, false)
      return (
        <Typography sx={style} variant="body2">Email Address is not valid</Typography>
      )
    }
    updateValidFieldsState(alreadyValid, 'email', setValid, true)
  } else if (typeof phone !== 'undefined') {
    // any space is going to be removed using this regex replace(/\s/g, '')
    let formattedPhone = phone.replace(/\s/g, '')
    
    if (!validator.isMobilePhone(formattedPhone) && phone.length !== 0 ) {
      updateValidFieldsState(alreadyValid, 'phone', setValid, false)
      return (
        <Typography sx={style} variant="body2">Telephone number is not valid</Typography>
      )
    }
    updateValidFieldsState(alreadyValid, 'phone', setValid, true)
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
        <Typography sx={style} variant="body2">Image size should be smaller than 1MB</Typography>
      )
    }
    updateValidFieldsState(alreadyValid, 'profileImg', setValid, true)
  }
}

export default ValidateField
