import Joi from 'joi';

require('dotenv').config();

const envVarsSchema = Joi.object({
  TOKEN_EXPIRATION: Joi.string(),
  MONGODB_URL: Joi.string(),
  JWTSECRET: Joi.string(),
  EXPIRESIN: Joi.string(),  
})
  .unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  port: envVars.PORT,
  mongoURL: envVars.MONGODB_URL,
  jwtSecret: envVars.JWTSECRET,
  expiresIn: envVars.EXPIRESIN,
};

export default config;
