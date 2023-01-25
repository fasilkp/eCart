import sentOTP from "../actions/sentOTP.js";
import UserModel from "../models/userModel.js"
import bcrypt from 'bcryptjs'
var salt = bcrypt.genSaltSync(10);

export function getUserLogin(req, res) {
    res.render("user/login", {error:false});
}
export function getUserSignup(req, res) {
    res.render("user/signup", { error: false });
}
export function getVerifyEmail(req, res) {
    res.render("user/emailVerify", { error: false });
}
export function getForgotPassword(req, res) {
    res.render("user/forgotPassword");
}
export function getForgotPassVerify(req, res) {
    res.render("user/forgotPassVerify");
}
export function getChanegPassword(req, res) {
    res.render("user/changePassword");
}
export function getEditProfile(req, res) {
    res.render("user/editProfile");
}

export async function userSignup(req, res) {
    const { name, email, password } = req.body;
    if (email == "" || name == "" || password == "") {
        return res.render("user/signup", {
            error: true,
            message: "all fields must be filled",
        });
    }
    const user = await UserModel.findOne({email});
    if(user){
        return res.render("user/signup", {
            error: true,
            message: "User Already exists please Login",
        });
    }
    const otp = Math.floor(Math.random() * 1000000);
    sentOTP(req.body.email, otp)
        .then(() => {
            req.session.otp = otp;
            return res.render("user/emailVerify", { error:false, user: req.body });
        })
        .catch((err) => {
            return res.render("user/signup", {
                error: true,
                message: "Email sent Failed", 
            });
        });
}
export async function resendOTP(req, res) {
    const { name, email, password } = req.body;
    if (email == "" || name == "" || password == "") {
        return res.render("user/signup", {
            error: true,
            message: "all fields must be filled",
        });
    }
    const otp = Math.floor(Math.random() * 1000000);
    sentOTP(req.body.email, otp)
        .then(() => {
            req.session.otp = otp;
            return res.render("user/emailVerify", { error:false, user: req.body });
        })
        .catch((err) => {
            return res.render("user/signup", {
                error: true,
                message: "Email sent Failed", 
            });
        });
}
export function verifyEmail(req, res) {
    const { name, email, password, otp } = req.body;
    if (otp == req.session.otp) {
        var hashPassword = bcrypt.hashSync(password, salt);
        const user = new UserModel({ name, email, password: hashPassword});
        user.save((err, data) => {
            if (err) {
                return res.render("user/emailVerify", {
                    error: true,
                    message: "user create failed",
                    user:req.body
                });
            }
            req.session.user={
                id:data._id,
                name:data.name
            }
        });
        
        return res.redirect("/")
    }else{
        return res.render("user/emailVerify", {
            error: true,
            message: "Invalid OTP",
            user:req.body
        });
    }
}

export async function userLogin(req, res){
    const { email, password } = req.body;
    if (email == "" || password == "") {
        return res.render("user/login", {
            error: true,
            message: "all fields must be filled",
        });
    }
    const user = await UserModel.findOne({email});
    if(!user){
        return res.render("user/login", {
            error: true,
            message: "No user found",
        });
    }
    if(user.ban){
        return res.render("user/login", {
            error: true,
            message: "You are banned",
        });
    }
    if(bcrypt.compareSync(password, user.password)){
        return res.redirect("/")
    }else{
        return res.render("user/login",{
            error:true,
            message:"invalid email or password" 
        })
    }
}