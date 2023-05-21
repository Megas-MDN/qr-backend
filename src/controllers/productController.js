const Product = require('../models/Product');
const User = require('../models/User');

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return next({ status: 400, message: 'Id not send' });

    const product = await Product.findOne({ hash: id }, '-__v')
      .populate('origin', '-_id -role -password -inventory -__v')
      .populate('destination', '-role -password -inventory -__v');
    return res.status(200).send(product);
  } catch (error) {
    return next({ status: 500, message: error.message });
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { hash, name, description } = req.body;
    const host = req.payload;
    if (!hash || !name || !description)
      return next({ status: 400, message: 'Missin fields!' });
    const product = await Product.create({
      hash,
      name,
      description,
      origin: host._id,
      destination: host._id,
      logs: [
        {
          origin: host._id,
          destination: host._id,
          date: new Date(),
        },
      ],
    });
    await User.findByIdAndUpdate(
      { _id: host._id },
      {
        $push: { inventory: product._id },
      }
    );
    return res.status(201).send(product);
  } catch (error) {
    return next({ status: 500, message: error.message });
  }
};

const removeProduct = async (req, res, next) => {
  try {
    const { id, userId } = req.params;
    payload = req.payload;
    if (payload._id !== userId) return res.status(401).send();

    const userOrigin = await User.findByIdAndUpdate(userId, {
      $pull: { inventory: id },
    });
    await userOrigin.save();
    await Product.findByIdAndDelete(id);

    return res.status(200).send({ message: `Product deleted!` });
  } catch (error) {
    return next({ status: 500, message: error.message });
  }
};

module.exports = { getProductById, createProduct, removeProduct };
