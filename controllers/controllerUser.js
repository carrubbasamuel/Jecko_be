const SchemaUser = require('../models/SchemaUser');
const bcrypt = require('bcrypt');
const { generateToken } = require('../middleware/middlewareJWT');

const signup = async (req, res) => {
  try {
    const existingUser = await SchemaUser.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).json({ message: 'Utente già esistente' });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new SchemaUser({
      email: req.body.email,
      password: hashedPassword,
      username: req.body.username,
      name: req.body.name,
      surname: req.body.surname,
      birthdate: req.body.birthdate,
      avatar: req.body.avatar,
      motto: req.body.motto,
    });

    await newUser.save();
    res.status(201).json({ message: 'Utente creato' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore interno' });
  }
};



const login = async (req, res) => {
  try {
    const user = await SchemaUser.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Password errata' });
    }

    const token = generateToken({ email: user.email, _id: user._id });
    res.status(200).json({ message: 'Login effettuato', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore interno' });
  }
};

module.exports = {
  signup,
  login,
};
