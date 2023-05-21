const User = require('../models/User');
const bcrypt = require('bcrypt');
const { genToken, validateToken } = require('../middlewares/token');

const goRegister = async (req, res, next) => {
  try {
    const { userName, role, password, email, adress } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      userName,
      adress,
      role,
      password: hash,
      email,
    });
    const token = genToken({
      expires: '8h',
      payload: { userName, role, email, _id: newUser._id },
    });
    return res.status(201).json({ token });
  } catch (error) {
    return next({ status: 500, message: error.message });
  }
};

const goLogin = async (req, res, next) => {
  try {
    const { password, email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return next({ status: 401, message: 'Email or Password invalid' });
    const pass = await bcrypt.compare(password, user.password);
    if (!pass)
      return next({ status: 401, message: 'Email or Password invalid' });

    const token = genToken({
      expires: '8h',
      payload: {
        userName: user.userName,
        role: user.role,
        email: user.email,
        _id: user._id,
      },
    });
    return res.status(200).json({ token });
  } catch (error) {
    return next({ status: 500, message: error.message });
  }
};

const getRole = (req, res) =>
  res.status(200).json({
    role: req.payload.role,
    _id: req.payload._id,
    userName: req.payload.userName,
  });

module.exports = { goRegister, goLogin, getRole };
