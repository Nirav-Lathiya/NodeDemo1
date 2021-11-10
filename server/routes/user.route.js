import express from 'express';
import validate from 'express-validation';
import userParams from '../params/user.params';
import user from '../beans/user';
import multer from 'multer';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./photos");
  },
  filename: (req, file, cb) => {
    cb(null, `${new Date().toDateString()}${file.originalname}`);
  }
})

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true)
    } else {
      cb(null, false)
    }
  },
  limits: {
    fileSize: 1000000,
  }
})

router.route('/getEmployee',).post(user.getEmployee);
router.route('/addEmployee',validate(userParams.addEmployee),upload.single('file')).post(user.addEmployee);
router.route('/updateEmployee/:id',validate(userParams.updateEmployee), upload.single('file')).put(user.updateEmployee);
router.route('/deleteEmployee',validate(userParams.deleteEmployee)).delete(user.deleteEmployee);

module.exports = router;
