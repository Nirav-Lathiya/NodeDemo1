import express from 'express';
import validate from 'express-validation';
import userParams from '../params/user.params';
import auth from '../beans/auth';

const router = express.Router();

router
  .route('/registration')
  .post(validate(userParams.registration),limitorForSendOTP, auth.registration);

router
  .route('/login')
  .post(validate(userParams.login), auth.login);



module.exports = router;
