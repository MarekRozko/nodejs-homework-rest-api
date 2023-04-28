const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const fs = require("fs/promises");
const path = require("path");
const Jimp = require("jimp");
const { uuid } = require('uuidv4');

const { contrlWrapper } = require("../utils");
const { User } = require("../models/user");

const { HttpError, sendEmail} = require("../helpers");

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
    const verificationToken = uuid();
    const result = await User.create({...req.body, password: hashPassword, avatarURL, verificationToken});

    const verifyEmail = {
        to: email,
        subject: "Verify email", 
        html: `<a target="_blank" href="http://localhost:3000/api/user/verify/${verificationToken}">Click verify email</a>`
    }
    
    await sendEmail(verifyEmail);

    res.status(201).json({
        user: {
            email: result.email,
            subscription: result.subscription,
        }
    })
}

const verify = async (req, res) => {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
        throw HttpError(404, "User not found");
    }
    await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: "" })
    
    res.status(201).json({
       message: "Verification successful"
    })
}

const resendVerifyEmail = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(404, "Email not found");
    }
    if (user.verify) {
        throw HttpError(400, "Email alredy verify");
    }
    const verifyEmail = {
        to: email,
        subject: "Verify email", 
        html: `<a target="_blank" href="http://localhost:3000/api/user/verify/${user.verificationToken}">Click verify email</a>`
    }
    
    await sendEmail(verifyEmail);

    res.json({
        message: "Email resend success"
    })
}

const login = async(req, res) => {
    const { email, password} = req.body;
    const user = await User.findOne({email});
    if(!user) {
        throw HttpError(401, "Email or password is wrong");
    }
     if(!user.verify) {
        throw HttpError(401, "Email not verify");
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
    verify: contrlWrapper(verify),
    resendVerifyEmail: contrlWrapper(resendVerifyEmail),
    login: contrlWrapper(login),
    getCurrent: contrlWrapper(getCurrent),
    logout: contrlWrapper(logout),
    updateAvatar: contrlWrapper(updateAvatar),
}