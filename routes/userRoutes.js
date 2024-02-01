const express=require("express");
const { getAllUsers, registerController, loginController } = require("../controllers/userControllers");

//router pbject
const router=express.Router();


//Get all users
router.get('/all-users',getAllUsers)

// create users
router.post('/register',registerController);

// login
router.post("/login",loginController);

module.exports=router;
