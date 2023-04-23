const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const fs = require("fs/promises");
const path = require("path");
const Jimp = require("jimp");

const { contrlWrapper } = require("../utils");
const { User } = require("../models/user");

const { HttpError } = require("../helpers");

const { SECRET_KEY } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async(req, res)=> {
    const { email, password } = req.body;
    const user = await User.findOne({ email});
    
    if(user) {
        throw HttpError(409, "Email in use");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);

    const result = await User.create({...req.body, password: hashPassword, avatarURL});

    
    res.status(201).json({
        user: {
            email: result.email,
            subscription: result.subscription,
        }
    })
}

const login = async(req, res) => {
    const { email, password} = req.body;
    const user = await User.findOne({email});
    if(!user) {
        throw HttpError(401, "Email or password is wrong");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);

    if(!passwordCompare) {
        throw HttpError(401, "Email or password is wrong");
    }

    const payload = {
        contactId: user._id,
    }

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token });

    res.json({
        token,
        user: {
            email: email,
            subscription: user.subscription,
        }
    })
}

const getCurrent = async (req, res) => {
    const {email, subscription} = req.user;

    res.json({
        user: {
            email,
            subscription,
       }
    })
}

const logout = async(req, res)=> {
    const {_id} = req.user;
    await User.findByIdAndUpdate(_id, {token: ""});

    res.json({
        message: "Logout success"
    })
}


const updateAvatar = async (req, res) => {
    const { path: tempUpload, filename } = req.file;
    
    await Jimp.read(`temp/${filename}`)
    .then((avatar) => {
      avatar.resize(250, 250).write(`temp/${filename}`);
    })
    .catch((err) => {
      console.error(err);
    });

     const {_id} = req.user;
     const avatarName = `${_id}_${filename}`;
     const resultUpload = path.join(avatarsDir, avatarName);
     await fs.rename(tempUpload, resultUpload);
     const avatarURL = path.join("avatars", avatarName);
     await User.findByIdAndUpdate(_id, {avatarURL});

     res.json({avatarURL});
}


module.exports = {
    register: contrlWrapper(register),
    login: contrlWrapper(login),
    getCurrent: contrlWrapper(getCurrent),
    logout: contrlWrapper(logout),
    updateAvatar: contrlWrapper(updateAvatar),
}