import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import user from '../models/user.model';
import jwt from 'jsonwebtoken';
import { jwtSecret, expiresIn } from '../../bin/www';


const authorize = async (req, res, next) => {
  try {
    let token;
    let error;
    if (req.headers.authorization) {
      if (
        typeof req.headers.authorization !== 'string' ||
        req.headers.authorization.indexOf('Bearer ') === -1
      ) {
        error = 'bad authorization';
      } else {
        token = req.headers.authorization.split(' ')[1];
      }
    } else {
      error = 'token not provided';
    }

    if (!token && error) {
      return next(new APIError(error, httpStatus.UNAUTHORIZED, true));
    }

    return jwt.verify(token, jwtSecret, async (err, decoded) => {
      if (err || !decoded || !decoded.userId) {
        return next(new APIError('bad token', httpStatus.UNAUTHORIZED, true));
      }
      const userObj = await user.findOne({ _id: decoded.userId });
      if (!userObj)
        return next(new APIError('user not found', httpStatus.NOT_FOUND, true));
      if (!userObj.activeSessions.includes(token))
        return next(
          new APIError(
            'Session expired. you have been logged out, please log in again!',
            httpStatus.UNAUTHORIZED,
            true
          )
        );

      req.user = userObj;
      return next();
    });
  } catch (err) {
    return next(
      new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true, err)
    );
  }
};

const registration = async (req, res, next) => {
  try {
    let { firstName, lastName, email, password } = req.body;
    let users = await user.findOne({ userName });
    if (users) {
      return next(
        new APIError('UserName already exists!!', httpStatus.BAD_REQUEST, true)
      );
    }
    await user.create({
      firstName,
      lastName,
      email,
      password
    });

   return next('user registered successfully')
  } catch (error) {
    return next(
      new APIError(error.message, httpStatus.INTERNAL_SERVER_ERROR, true)
    );
  }
};

const login = async(req, res, next) => {
   try {

    let loginData = await user.findOne({ email: req.body.email })
     if (!loginData) return next('user is not exist');
     let userDetails = await user.findOne({ email: req.body.email })
     let valid = await userDetails.matchPassword(req.body.password)
     if (!valid) return res.send("user auth failed")
     let userToken = jwt.sign({
       email: item.email,
       userId: item._id
     }, process.env.JWT_KEY, { expiresIn: '24h' });
     
     await await user.updateOne(
      { _id: userDetails._id },
      {
        $push: { token: { $each: [userToken], $slice: -5 } },
      }
    );
     return next({token:token, message:'user login successfully'})
   } catch (error) {
    return next(
      new APIError(error.message, httpStatus.INTERNAL_SERVER_ERROR, true)
    );
   }
}

module.exports = {
  registration,
  login,
  authorize,
};
