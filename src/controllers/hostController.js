const User = require('../models/User');

const getProducts = async (req, res, _next) => {
  try {
    const host = req.payload;
    const prods = await User.findById(host._id, {
      inventory: true,
      _id: false,
    }).populate('inventory', {}, null, { sort: { updatedAt: -1 } });

    return res.status(200).send(prods);
  } catch (error) {
    console.log(error.message);
    return res.status(200).send({
      inventory: [],
    });
  }
};

const getAllHost = async (req, res, next) => {
  try {
    const payload = req.payload;
    const allHosts = await User.find(
      { role: 'host', _id: { $ne: payload._id } },
      '-password -role -inventory -__v'
    );
    return res.status(200).send(allHosts);
  } catch (error) {
    return next({ status: 500, message: error.message });
  }
};

module.exports = { getProducts, getAllHost };
