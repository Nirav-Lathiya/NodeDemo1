import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import emp from '../models/emp';

const getEmployee = async(req,res, next) => {
  try {
    let empdata = await emp.find({});
    next(empdata);
  } catch (error) {
    return next(
      new APIError(error.message, httpStatus.INTERNAL_SERVER_ERROR, true)
    );
  }
}

const addEmployee = async (req, res, next) => {

  try {
    let { firstName, lastName, email, admin } = req.body
    let items;
    if (req.file) {
      items = {
        firstName,
        lastName,
        email,
        file: req.file,
      }
    } else {
      items = {
        firstName,
        lastName,
        email,
      }
    }

    let empData = await emp.create(items);
    let empDetail = await emp.findById(empData._id).populate('author', 'firstName lastName')
    next(empDetail);
  } catch (error) {
    return next(
      new APIError(error.message, httpStatus.INTERNAL_SERVER_ERROR, true)
    );
  }

}

const updateEmployee = async (req, res) => {
  try {
    let id = mongoose.Types.ObjectId(req.params.id);
    let item = { ...req.body, admin: req.user._id }

    if (req.file) {
      item = {
        ...item,
        file: req.file.filename
      }
    }
    await emp.updateOne(id, item).populate('admin', 'firstName lastName')
    return next('employee updated successfully')
  } catch (error) {
    return next(
      new APIError(error.message, httpStatus.INTERNAL_SERVER_ERROR, true)
    );
}
}

const deleteEmployee = async (req, res, next) => {
  try {
    await emp.deleteOne({ _id: req.params.id });

    return next('employee delete successfully');
  } catch (error) {
    return next(
      new APIError(error.message, httpStatus.INTERNAL_SERVER_ERROR, true)
    );
  }
}

const changePassword = async (req, res) => {
  try {

    let id = req.user._id
    let { oldPassword, newPassword, confPassword } = req.body
    let userData = await user.findById(id)
    const validPassword = await user.matchPassword(oldPassword)
    if (!validPassword) {
      return next("old password doesn't match.");
    }
    if (oldPassword === newPassword) {
      return next("old password and new password can not be same");
    }
    if (newPassword === confPassword) {
      userData.password = newPassword
      await userData.save()
      return next("Password Change Successfully")
    } else {
      return res.send({ message: "invalid password." })
    }
  } catch (error) {
    return next(
      new APIError(error.message, httpStatus.INTERNAL_SERVER_ERROR, true)
    );
  }
}

module.exports = {
  addEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
  changePassword
};
