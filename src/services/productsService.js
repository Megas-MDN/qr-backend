const Product = require('../models/Product');
const User = require('../models/User');
const mongoose = require('mongoose');

const handlerInventory = async ({ origin, destination, prodId }) => {
  try {
    const prod = await Product.findById(prodId);
    prod.origin = prod.destination;
    prod.destination = destination;
    const newLog = {
      origin,
      destination,
      date: new Date(),
    };
    prod.logs.push(newLog);
    await prod.save();

    const userOrigin = await User.findByIdAndUpdate(origin, {
      $pull: { inventory: prodId },
    });
    const userDestination = await User.findByIdAndUpdate(destination, {
      $push: { inventory: new mongoose.Types.ObjectId(prodId) },
    });
    await userOrigin.save();
    await userDestination.save();
    return { status: 200 };
  } catch (error) {
    console.log(error.message);
    console.log('Error ------- \n\n');
    return { status: 500 };
  }
};

module.exports = { handlerInventory };
