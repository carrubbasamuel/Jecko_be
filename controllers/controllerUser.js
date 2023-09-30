const SchemaUser = require('../models/SchemaUser');
const bcrypt = require('bcrypt');
const { generateToken } = require('../middleware/middlewareJWT');
const SchemaMessage = require('../models/SchemaMessage');
const SchemaEvent = require('../models/SchemaEvent');
const { welcomeEmail } = require("../middleware/middlewareNodemailer");




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
      city: req.body.city,
      birthdate: req.body.birthdate,
      avatar: req?.file?.path,
      motto: req.body.motto,
    });

    welcomeEmail(newUser.email);
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

    const token = generateToken({ email: user.email, _id: user._id, username: user.username });
    res.status(200).send(token);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore interno' });
  }
};




const profile = async (req, res) => {
  try {
    const user = await SchemaUser.findOne({ _id: req.user._id })
      .select('-_id username name surname birthdate avatar  games createdGames motto city')
    if (!user) {
      return res.status(404).json({ message: 'Not found!' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore interno' });
  }
};

const usersProfile = async (req, res) => {
  try {
    const user = await SchemaUser.findOne({ _id: req.params.id })
      .select('-_id username name surname birthdate avatar  games createdGames motto city')
    if (!user) {
      return res.status(404).json({ message: 'Not found!' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore interno' });
  }
}

const editUser = async (req, res) => {
  try {
    const userId = req.user._id; 

    const updatedUser = await SchemaUser.findOneAndUpdate(
      { _id: userId },
      { $set: req.body },
      { new: true } 
    ).select('-_id username name surname birthdate avatar  games createdGames motto city')

    if (!updatedUser) {
      return res.status(404).json({ message: 'Utente non trovato!' });
    }

    
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore interno' });
  }
}


const editAvatar = async (req, res) => {
  try {
    const userId = req.user._id; 

    const updatedUser = await SchemaUser.findOneAndUpdate(
      { _id: userId },
      { $set: { avatar: req.file.path } },
      { new: true } 
    ).select('-_id username name surname birthdate avatar  games createdGames motto city')

    if (!updatedUser) {
      return res.status(404).json({ message: 'Utente non trovato!' });
    }

    
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore interno' });
  }
}

const deleteUser = async (req, res) => {
  try {
    await SchemaMessage.deleteMany({ sender: req.user._id });
    await SchemaEvent.deleteMany({ creator: req.user._id });
    const user = await SchemaUser.deleteOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }
    res.status(200).json({ message: 'Utente cancellato' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore interno' });
  }
}


module.exports = {
  signup,
  login,
  profile,
  usersProfile,
  editUser,
  editAvatar,
  deleteUser,
};
