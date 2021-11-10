import Joi from 'joi';

const userParams = {
  registration: {
    body: {
      firstName : Joi.string().required(),
      lastName : Joi.string().required(),
      email : Joi.string().required(),
      password : Joi.string().required(),
    },
  },

  login: {
    body: {
      email: Joi.string().required(),
      password : Joi.string().required(),
    },
  },

  addEmployee:{
    body:{
      firstName : Joi.string().required(),
      lastName : Joi.string().required(),
      email : Joi.string().required(),
      password : Joi.string().required(),
    }
  },
  
  updateEmployee: { 
    params: {
      id: Joi.string().hex().required(),
    },
    body : {
      startDate : Joi.string(),
      endDate : Joi.string(),
    }
  },

  deleteEmployee : {
    params: {
      id: Joi.string().hex().required(),
    },
  }
};
export default userParams;
