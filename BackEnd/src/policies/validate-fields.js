'use strict';
var validator = require('validator');
// .default is required in below import
// Reference: https://stackoverflow.com/a/33705077/16185710
const isValidABN = require('is-valid-abn').default;
// TODO: need to write policy for /api/upload endpoint as well
/**
 * `validate-fields` policy
 */

module.exports = (policyContext, config, { strapi }) => {
    strapi.log.info('In validate-fields policy.');
    const body = policyContext.request.body
    console.log('request body: ', body)
    // console.log(policyContext)
    for (const [key, value] of Object.entries(body)) {
      if (key === 'username' || key === 'email'){
        if (!validator.isEmail(value)) {
          strapi.log.error('email is invalid');
          return false
        }
      }
      else if (key === 'phoneNumber'){
        // phoneNumber is optional, so it can be null as well.
        if ( value !== null){
          if (!validator.isMobilePhone(value) ){
            strapi.log.error('phone number is invalid');
            return false
          }
        }
      }
      else if (key === 'AbnNumber'){
        // AbnNumber is optional, so it can be null as well.
        if ( value !== null){
          if (!isValidABN(value) ) {
            strapi.log.error('Abn number is invalid');
            return false
          }
        }
      }
      else if (key === 'password'){
        if (!validator.isStrongPassword(value)) {
          strapi.log.error('password is not strong enough');
          return false
        }
      }
      }
    if (body.username !== body.email){
      strapi.log.error('email and username should be same');
      return false
    }
    

    return true;
};
