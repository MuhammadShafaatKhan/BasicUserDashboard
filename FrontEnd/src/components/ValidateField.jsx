import validator from 'validator';
import Typography from '@mui/material/Typography';
// TODO: Use isStrongPassword validator to validate password

function ValidateField({ email, phone }) {
  if (email) {
    if (!validator.isEmail(email) && email.length !== 0) {
      return (
        <Typography sx={{ color: 'red', paddingLeft: '2px' }} variant="body2">Email Address is not valid</Typography>
      )
    }
  } else if (phone) {
    // any space is going to be removed using this regex replace(/\s/g, '')
    let formattedPhone = phone.replace(/\s/g, '')
    if (!validator.isMobilePhone(formattedPhone) ) {
      return (
        <Typography sx={{ color: 'red', paddingLeft: '2px' }} variant="body2">Telephone number is not valid</Typography>
      )
    }
  }
}

export default ValidateField
