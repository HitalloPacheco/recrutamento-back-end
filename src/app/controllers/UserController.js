const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');

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
      return res.status(404).send({ error: 'Usuário não encontrado!' });

    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword)
      return res.status(401).send({ error: 'Senha incorreta!' });

    return res.send({ user, token: generateToken({ id: user.id }) });
  },

  async ChangePassword(req, res) {
    const { email, token, password } = req.body;

    try {
      const user = await User.findOne({ where: { email } });

      if (!user)
        return res.status(400).send({ error: 'Usuário não encontrado!' });

      if (token !== user.reset_token)
        return res.status(400).send({ error: 'Token inválido' });

      const now = new Date();

      if (now > user.token_expires)
        return res
          .status(400)
          .send({ error: 'Token expirado, gere um novo token!' });

      const hash = bcrypt.hashSync(password, 10);
      user.password = hash;

      await user.save();
      res.send();
    } catch (err) {
      console.log(err);
      res.status(400).send({
        error: 'Não foi possível resetar sua senha, tente novamente!',
      });
    }
  },

  async ForgotPassword(req, res) {
    const { email } = req.body;

    try {
      const user = await User.findOne({ where: { email } });

      if (!user)
        return res.status(400).send({ error: 'Usuário não encontrado!' });

      const cryptoToken = crypto.randomBytes(20).toString('hex');

      const now = new Date();
      now.setHours(now.getHours() + 1);

      user.reset_token = cryptoToken;
      user.token_expires = now;

      await user.save();

      mailer.sendMail(
        {
          to: email,
          from: 'hitallopacheco@hotmail.com',
          html: `<p>Você esqueceu sua senha? Aqui está seu código de recuperação: ${cryptoToken}</p>`,
        },
        err => {
          if (err)
            return res
              .status(400)
              .send({ error: 'Não foi possivel enviar o email' });

          return res.send();
        }
      );
    } catch (err) {
      console.log(err);
      res
        .status(400)
        .send({ error: 'Erro na alteração de senha, tente novamente' });
    }
  },

  async verifyUser(req, res) {
    const { email } = req.body;

    try {
      const user = await User.findOne({ where: { email } });

      if (user)
        return res.status(400).send({ error: 'Usuário já cadastrado!' });

      const cryptoToken = crypto.randomBytes(20).toString('hex');

      const now = new Date();
      now.setHours(now.getHours() + 1);

      mailer.sendMail(
        {
          to: email,
          from: 'hitallopacheco@hotmail.com',
          html: `<p>Você esqueceu sua senha? Aqui está seu código de recuperação: ${cryptoToken}</p>`,
        },
        err => {
          if (err)
            return res
              .status(400)
              .send({ error: 'Não foi possivel enviar o email' });
        }
      );
      return res.json({ cryptoToken, now });
    } catch (err) {
      console.log(err);
      res
        .status(400)
        .send({ error: 'Erro na alteração de senha, tente novamente' });
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
