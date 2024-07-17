import validator from 'validator';
import Typography from '@mui/material/Typography';

function ValidateField({email}){
    if (!validator.isEmail(email) && email.length !== 0){
            return(
              <Typography sx={{color:'red', paddingLeft:'2px'}} variant="body2">Email is not valid</Typography>
            )
          }
  }
  
  export default ValidateField
  