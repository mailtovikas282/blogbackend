const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');

//get all users
exports.getAllUsers= async (req,res)=>{
    try{
        const user = await userModel.find({});
        return res.status(200).send({
            userCount:(await user).length,
            success:true,
            message:"Successfully got all Users",
            user
        })
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).send({
            success : false,
            message : "Error in getting all Users",
            error
        })
    }
};

//create user register user
exports.registerController= async (req,res) => {
        try{
            const {username,email,password}=req.body
            //validation 

            if(!username || !password || !email)
            {
                return res.status(400).send({
                    success :false,
                    message:"Please fill all details"
                })
            }

            //existing user
            const existingUser = await userModel.findOne({email});
            if(existingUser)
            {
                return res.status(401).send({
                    success:false,
                    message:"User already exists"
                })
            }

            //encryption of password
            const hashPassword = await bcrypt.hash(password,10);


            //save user
            const user=new userModel({username,email,password :hashPassword});
            await user.save();
            return res.status(200).send({
                success:true,
                message:"New User Created",
                user
            })
        }
        catch (error){
            console.log(error)
            return res.send(500).send({
                success:false,
                message:"Error in registering Callback",
                error
            })

        }
};

//login
exports.loginController= async (req,res)=>{
    try{
        const {email,password} = req.body;
        // validation 
        if(!email || !password)
        {
            return res.status(500).send({
                success:false,
                message: "Both email and password required"
            })
        }

        // if user doesn't exists
        const user = await userModel.findOne({email});
        console.log(user);
        if(!user)
        {
            return res.status(501).send({
                success:false,
                message:"User doesn't exists"
            })
        }
        const isMatch =await bcrypt.compare(password,user.password);
        if(!isMatch)
        {
            return res.status(501).send({
                success:false,
                message:"Invalid Username or Password"
            });
        }

        return res.status(200).send({
            success:true,
            message :"Login Succesfully!!",
            user
        })

    }
    catch(error)
    {
        console.log(error);
        return res.status(501).send({
                success:false,
                message:"Error in Login Callback",
                error
        })
    }
};
