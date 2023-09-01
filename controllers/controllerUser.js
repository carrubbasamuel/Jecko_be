const SchemaUser = require('../models/SchemaUser');
const bcrypt = require('bcrypt');
const { generateToken } = require('../middleware/middlewareJWT');




const signup = async (req, res) => {
  try {
    console.log(req.body);
    const existingUser = await SchemaUser.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).json({ message: 'User all ready exist' });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new SchemaUser({
      email: req.body.email,
      password: hashedPassword,
      username: req.body.username,
      name: req.body.name,
      surname: req.body.surname,
      phone: req.body.phone,
      birthdate: req.body.birthdate,
      avatar: req?.file?.path,
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
      return res.status(404).json({ message: 'Not valid email or password' });
    }

    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Not valid email or password' });
    }

    const token = generateToken({ email: user.email, _id: user._id });
    res.status(200).send(token);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore interno' });
  }
};


const profile = async (req, res) => {
  try {
    const user = await SchemaUser.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({ message: 'Not found!' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore interno' });
  }
};




module.exports = {
  signup,
  login,
  profile,
};
