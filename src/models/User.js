const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  userName: {
    required: true,
    type: String,
  },
  role: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  adress: {
    type: {
      logradouro: String,
      complemento: String,
      bairro: String,
      localidade: String,
      uf: String,
      cep: String,
    },
    default: {},
  },
  email: { type: String, required: true, unique: true },
  inventory: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    default: [],
  },
});

const User = mongoose.model('User', schema);
module.exports = User;
