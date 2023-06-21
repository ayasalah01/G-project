const bcrypt = require("bcrypt");
const session = require("express-session");
const randomstring = require("randomstring");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require('path');

const User = require("../models/userModel");
const ServiceProvider = require("../models/spModel");
const Services = require("../models/serviceModel");
const Chat = require("../models/chatModel");
const Pay = require("../models/payModel");
const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");
const sendMail = require("../utils/sendEmail");

// bycrpt password
const securePassword = (password)=>{
    try {
        const hashedPassword = bcrypt.hash(password,10);
        return hashedPassword;
    } catch (error) {
        console.log(error.message);
    }
}

// signup
const getSignup = (req,res,next) =>{
    try {
        res.render("clientSignup",{
            pageTitle:"Signup",
        })
    } catch (error) {
        console.log(error.message);
    }
}

const createNewUser = async(req,res,next)=>{
    try{       
        const hashPassword = await securePassword (req.body.password);
        const user = new User({
            username:req.body.username,
            email : req.body.email,
            phoneNumber: req.body.phoneNumber,
            password : hashPassword,
            is_admin: 0
        });
        const userData = await user.save();
        if(userData){
            sendMail.sendVerificationEmail(req.body.email,userData._id);
            res.render("signin",{pageTitle:"Signin",message:"your registration has been successfully Please verify your email"});
        }
        else{
            res.render("signin",{pageTitle:"Signin",message:"your registration has been failed"});
        }
    } 
    catch(err) {
        console.log(err.message)
    }
}
//verify your email
const verifyMail = async(req,res,next)=>{
    try {
        const updateinfo = await User.updateOne({_id:req.query.id},{$set:{is_varified:1 }});
        console.log(updateinfo);
        res.render("verifyEmail")
    } catch (error) {
        console.log(error.message);
    }
}
// login 
const getSignin =(req,res,next)=>{
    try {
            res.render("signin",{
                pageTitle:"Signin",
            })
    } catch (error) {
        console.log(error.message)
    }
}

const postSignin = async(req,res,next)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({email:email})
        console.log(userData.email);
        if(userData){
            const passwordMatch = await bcrypt.compare(password,userData.password);
            if (passwordMatch){
                if(userData.is_varified === 0){
                    res.render("signin",{pageTitle:"Signin",message:"please verify your Email"})
                }
                else{
                    req.session.user_id = userData._id
                    
                res.redirect("/HomeAfterlogin")
                }
            }
            else{
                res.render("signin",{pageTitle:"Signin",message:"email and password is incorrect"})
            }
        }
        else{
            res.render("signin",{pageTitle:"Signin",message:"email and password is incorrect"})
        }
    } catch (error) {
        console.log(error.message)
    }
}
// logout
const userlogout = (req,res,next)=>{
    try {
        if(req.session){

            req.session.destroy((error)=>{
                if(error){
                    console.log(error);
                }
            });
        }
        res.redirect("/")
    } catch (error) {
        console.log(error.message)
    }
}
//forget password
const getforget_Password = (req,res,next)=>{
    try {
        res.render('forgetPassword',{
            pageTitle:"ForgetPassword"
        });
    } catch (error) {
        console.log(error)
        
    }
    
}
const postforget_Password = async(req,res,next)=>{
    try {
        const email = req.body.email;
        const userData = await User.findOne({email:email});
        if(userData)
        {
            const randomString = randomstring.generate();
            const updatedData = await User.updateOne({email:email},{$set:{token:randomString}});
            sendMail.sendResetPasswordMail(userData.email,randomString);
            res.render('forgetPassword',{pageTitle:"ForgetPassword",message:"please check your email"})
        }
        else{
            res.render('forgetPassword',{pageTitle:"ForgtPassword",message:"user email is incorrect"})
        }
    } catch (error) {
        console.log(error.message)
    }
}
const getReset_Password = async(req,res,next)=>{
    try {
        const token = req.query.token;

        const tokenData = await User.findOne({token:token});
        if(tokenData){
            res.render("resetPassword",{pageTitle:"ResetPassword",user_id:tokenData._id});
        }
        else{
            res.render("404",{message:"token is invalid"});
        }
    } catch (error) {
        console.log(error.message);
    }
        
}
const postReset_Password = async(req,res,next)=>{
    try {
        const new_password = req.body.new_password;
        const user_id = req.body.user_id;
        const  hashedPassword = await securePassword(new_password);
        await User.updateOne({ _id:user_id},{$set:{ password:hashedPassword,token:""}});
        res.redirect("/signin")  
        
    } catch (error) {
        console.log(error)
    }
}
//user profile
const getUserProfile = async(req,res,next)=>{
    try {
        const userData = await User.findById({_id:req.session.user_id});
        res.render('clientProfile',{user:userData});
    } catch (error) {
        console.log(error.message)
    }
}
const editUserProfile = async(req,res,next)=>{
    try {
        
        const userData = await User.findById({_id:req.session.user_id})
        if(userData){
            res.render("setting",{user:userData})

        }
        else{
            res.redirect("/HomeAfterlogin")
        }
    } catch (error) {
        console.log(error.message)
    }
}

const updateProfile = async(req,res,next)=>{
    try {
        const userData = await User.findByIdAndUpdate({_id:req.body.user_id},{$set:{username:req.body.username,email:req.body.email,phoneNumber:req.body.phoneNumber}})
        res.redirect("/HomeAfterlogin")
    } catch (error) {
        console.log(error.message)
    }
}
const deleteUserAccount = async(req,res,next)=>{
    if(req.body.user_id === req.session.user_id)
    {
    try {
        const user = await User.findByIdAndDelete({_id:req.body.user_id});
        res.redirect("/")
    } catch (error) {
        console.log(error.message)
    }
}
}
// change password
const update_password = async(req,res,next)=>{
    try {
        const id = req.session.user_id;
        const old_password = req.body.old_password
        const new_password = req.body.new_password
        const userData = await User.findById({_id:id})
        
        if (userData) {
            const passwordMatch = await bcrypt.compare(old_password,userData.password)
            if (passwordMatch){
                console.log(new_password)
                const hashedPassword = await securePassword(new_password)
                await User.updateOne({_id:userData._id},{$set:{password:hashedPassword}});
                req.session.user_id = userData._id
                
                res.redirect("/HomeAfterlogin");
                
            }
            else{
                res.redirect("/setting",{message:"password is incorrect"});
            }
        }
        else{
            res.redirect("/setting",{message:"password is incorrect"});
        }
    } catch (error) {
        console.log(error)
    }
}
// const updatePassword = async(req,res,next)=>{
//     try {
//         //const user_id = req.session.user_id;
//         //const password = req.body.password;
//         const hashPassword = await securePassword (req.body.password);
//         User.findByIdAndUpdate({_id:req.body.user_id},{$set:{password:hashPassword}});
//         res.redirect("/HomeAfterlogin");
//     } catch (error) {
//         console.log(error.message);
//     }
// }
const getVerification = (req,res,next)=>
{
    try {
        res.render("verification",{pageTitle:"verification Email"});
    } 
    catch (error) {
        console.log(error.message);
    }
}
const sendVerificationLink = async (req,res,next)=>{
    try {
        const email = req.body.email;
        const userData = await User.findOne({email:email});
        console.log(userData.email)
        if(userData){
            sendMail.sendVerificationEmail(userData.email,userData._id);
            res.render("signin",{pageTitle:"Signin",message:"Reset verification Mail"});
        }
        else{
            res.render("verification",{pageTitle:"verification Email",message:"this mail is not exist"})
        }
    } 
    catch (error) {
        console.log(error.message);
    }
}
const getPayment = async(req,res,next)=>{
    try {
        // const service = req.body.service;
        // console.log(service);
        // const data = await Order.findOne({service:service})
        // //console.log(data);
        res.render("pay");
    } catch (error) {
        console.log(error.message);
    }
}
const postPayment = async(req,res,next)=>{
    try {
        const pay = new Pay({
            image:req.file.filename,
            //service:req.body.service,
            //price:req.body.price
        });
        const data = await pay.save();
        if(data){
            res.render('pay',{message:"payment process has been successfully "})
        }
        else{
            res.render('pay',{message:"payment process has been failed please try again "})
        }
    } catch (error) {
        console.log(error.message);
    }
}

// get serviceprovider profile for client
const get_SP_Profile = async(req,res,next)=>{
    try {
        const id = req.params.id
        const data = await ServiceProvider.findById({_id:id});
        console.log(data);
        res.render('edit',{user:data});
    } catch (error) {
        console.log(error)
    }
    
}
//chat dashborad
const Load_Chat = async(req,res,next)=>{
    try {
            const user = await User.findById({_id:req.session.user_id});
            const userData = await Services.findOne({category:"Hotel"});
            console.log(userData.serviceName);
            const data = await ServiceProvider.findOne({serviceName:userData.serviceName});
            console.log(data);
            res.render("clientChat",{
                user:user,
                users:data
            
        })
        
        
    } catch (error) {
        console.log(error.message);
    }
}
const loadChatDashboard = async(req,res,next)=>{
    try {
        const userData = await User.findById({_id:req.session.user_id});
        //const users = await ServiceProvider.find().populate("User_id").select("email")
        const users = await ServiceProvider.find()
        res.render("clientChat",{
            user:userData,
            users:users
            
        })
        console.log(users);
    } catch (error) {
        console.log(error.message);
    }
}

const saveChat = async(req,res,next)=>{
    try {
        const chat = new Chat({
            sender_id :req.body.sender_id,
            receiver_id:req.body.receiver_id,
            message:req.body.message
        })
        const newChat = await chat.save();
        res.status(200).send({success:true,msg:"chat inserted",data:newChat});
    } catch (error) {
        res.status(400).send({success:false,msg:error.message});
    }
}

const ChatDashboard = async(req,res,next)=>{
    try {
        const userData = await User.findById({_id:req.session.user_id});
        const users = await ServiceProvider.find()
        res.render("chat",{
            user:userData,
            users:users
            
        })
        console.log(users);
    } catch (error) {
        console.log(error.message);
    }
}
//cart 
// const addCart = async(req,res,next)=>{
//     try {
//         const offers = await Services.findOne({category:"Restaurant & Cafe"});
//         console.log(offers.offerTitle)
//         const cart = new Cart({
//             service:offers.offerTitle,
//             price:offers.price
//         })
//         const products = cart.save();
//         res.redirect("/hotel")
//     } catch (error) {
//         console.log(error)
//     }
// }
// const creatCart = async (req,res,next)=>{
//     try {
//         // if ("Hotel"){
//         //     const offers = await Services.findOne({category:"Hotel"});
//         //     const cart = new Cart({
//         //         service:offers.offerTitle,
//         //         price:offers.price
//         //     })
//         //     const products = await cart.save();
//         //     res.redirect("/hotel")
//         // }
//         // else 
//         if (" Cinema"){
//             const offers = await Services.findOne({category:"Cinema"});
//             console.log(offers);
//             const cart = new Cart({
//                 service:offers.offerTitle,
//                 price:offers.price
//             })
//             const products = await cart.save();
//             res.redirect("/cinema")
//         }
//         else if ("Bazaar"){
//             const offers = await Services.findOne({category:"Bazaar"});
//             const cart = new Cart({
//                 service:offers.offerTitle,
//                 price:offers.price
//             })
//             const products = await cart.save();
//             res.redirect("/bazzar")
//         }
//         else if ("Resort & Village"){
//             const offers = await Services.findOne({category:"Resort & Village"});
//             const cart = new Cart({
//                 service:offers.offerTitle,
//                 price:offers.price
//             })
//             const products = await cart.save();
//             res.redirect("/resort&village");
//         }
//         else if (" Natural Preserve"){
//             const offers = await Services.findOne({category:"Natural Preserve"});
//             const cart = new Cart({
//                 service:offers.offerTitle,
//                 price:offers.price
//             })
//             const products = await cart.save();
//             res.redirect("/naturalPreserve")
//         }
//         else if ("Tourism Company"){
//             const offers = await Services.findOne({category:"Tourism Company"});
//             const cart = new Cart({
//                 service:offers.offerTitle,
//                 price:offers.price
//             })
//             const products = await cart.save();
//             res.redirect("/tourismCompany")
//         }
//         else if ("Archaeological Site"){
//             const offers = await Services.findOne({category:"Archaeological Site"});
//             const cart = new Cart({
//                 service:offers.offerTitle,
//                 price:offers.price
//             })
//             const products = await cart.save();
//             res.redirect("/archaeologicalSite")
//         }
//         else if ("Restaurant & Cafe"){
//             const offers = await Services.findOne({category:"Restaurant & Cafe"});
//             console.log(offers)
//             const cart = new Cart({
//                 service:offers.offerTitle,
//                 price:offers.price
//             })
//             const products = await cart.save();
//             res.redirect("/restaurant&cafe")
//         }
//         else if ("Transportation Company"){
//             const offers = await Services.findOne({category:"Transportation Company"});
//             const cart = new Cart({
//                 service:offers.offerTitle,
//                 price:offers.price
//             })
//             const products = await cart.save();
//             res.redirect("/transportationCompany")
//         }
//         else{
//             console.log("category not exit")
//         }
        
//     } catch (error) {
//         console.log(error.message);
//     }
// }
const addToCart = async(req,res,next)=>{
    try {
        const data = await new Cart({
            service:req.body.service,
            amount :req.body.amount,
            price:req.body.price,
            category:req.body.category,
            userId:req.session.user_id,
            image:req.body.image

        })
        const cart = await data.save();
        console.log(cart);
        res.redirect("/cart");
    } catch (error) {
        console.log(error)
    }
}
const getCart = async(req,res,next)=>{
    try {
        const id = req.session.user_id
        console.log(id);
        const items = await Cart.find({userId:id})
        console.log(items)
        res.render("cart",{data:items});
    } catch (error) {
        console.log(error)
    }
}
const updateItem = async(req,res,next)=>{
    try {
        const id = req.body.cartId
        const item = await Cart.findByIdAndUpdate({_id:id},{amount:req.body.amount})
        res.redirect("/cart");
    } catch (error) {
        console.log(error)
    }
}
const deleteItem = async(req,res,next)=>{
    try {
        const id = req.body.cartId
        const item = await Cart.findByIdAndDelete({_id:id});
        res.redirect("/cart");
    } catch (error) {
        console.log(error)
    }
}
//order
const createOrder = async(req,res,next)=>{
    try {
        const order = await new Order({
            service:req.body.service,
            qauntity:req.body.qauntity,
            price:req.body.price,
            category:req.body.category,
            userId:req.session.user_id,
        })
        const data = await order.save();
        console.log(data.qauntity)
        res.render("order",{data:data});
    } 
    catch (error) {
        console.log(error)
    }
}
//search 
const getSearch = (req,res,next)=>
{
    try {
        res.render("search");
    } 
    catch (error) {
        console.log(error.message);
    }
}
const postSearch = async(req,res,next)=>{
    try {
        const service = req.body.service;
        console.log(service)
        const data = await Services.findOne({serviceName:service});
        console.log(data)
        res.render("resultSearch",{data:data});
        //res.render("/search",{data:data})
    } catch (error) {
        console.log(error)
    }
}


module.exports ={
    getSignup,
    createNewUser,
    verifyMail,
    getSignin,
    postSignin,
    userlogout,
    getforget_Password,
    postforget_Password,
    getReset_Password,
    postReset_Password,
    getUserProfile,
    editUserProfile,
    updateProfile,
    deleteUserAccount,
    update_password,
    getVerification,
    sendVerificationLink,
    getPayment,
    postPayment,
    loadChatDashboard,
    Load_Chat,
    saveChat,
    ChatDashboard,
    get_SP_Profile,
    getCart,
    addToCart,
    updateItem,
    deleteItem,
    createOrder,
    getSearch,
    postSearch
}