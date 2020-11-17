const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json');
const crypto = require('crypto');

const generateToken = (params = {}) => {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 600,
  });
};

module.exports = {
  async Auth(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user)
      return res.status(404).json({ error: 'Usuário não encontrado!' });

    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword)
      return res.status(401).json({ error: 'Senha incorreta!' });

    return res.send({ user, token: generateToken({ id: user.id }) });
  },

  async ChangePassword(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user)
      return res.status(404).json({ error: 'Usuário não encontrado!' });
    else{
      user.password = password
      user.save()
      user.push()
    }
  },

  async ForgotPassword(req, res) {
    const { email } = req.body;

    try {
      const user = await User.findOne({ where: { email } });

      if (!user) return res.status(400).send({ error: 'User not found' });

      const cryptoToken = crypto.randomBytes(20).toString('hex');

      const now = new Date();
      now.setHours(now.getHours() + 1);
      console.log(cryptoToken, now);

      await User.findByIdAndUpdate(user.id, {
        $set: {
          passwordResetToken: cryptoToken,
          passwordResetExpires: now,
        },
      });
    } catch (err) {
      res
        .status(400)
        .send({ error: 'Erro na alteração de senha, tente novamente' });
    }
  },

  async createValid(req, res) {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (user) {
      return res.status(404).send('Usuário já existe!');
    }
    if (!user) {
      return res.send(false);
    } else {
      res.send('ok');
    }
  },

  async Valid(req, res) {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (user) {
      res.send('ok');
    }
    if (!user) {
      return res.send(false);
    }
  },

  async Store(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      const hash = bcrypt.hashSync(password, 10);
      const newUser = await User.create({ email, password: hash });
      return res.send({
        user: newUser,
        token: generateToken({ id: newUser.id }),
      });
    } else {
      return res.status(400).json({ error: 'Usuário já existe!' });
    }
  },
};
