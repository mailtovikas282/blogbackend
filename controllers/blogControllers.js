const mongoose = require('mongoose');
const blogModel = require ('../models/blogModel');
const userModel =require('../models/userModel');


//Get all blogs
exports.getAllBlogsController= async (req,res)=>{
    try{
        const blogs = await blogModel.find({}).populate("user");
        if(!blogs)
        {
            return res.status(200).send({
                success:false,
                message:"No blogs Found"
            })
        }

        return res.status(200).send({
            blogCount:blogs.length,
            success:true,
            message:"All Blogs List",
            blogs
        })

    }
    catch(error)
    {
        console.log(error)
        return res.status(501).send({
            success:false,
            message:"Error while getting Blogs"
        })
    }
}


//create blog
exports.createBlogController= async (req,res)=>{
    try{
         const {title,description,image,user} =req.body;
        //  console.log(title,user);
         if(!title || !description || !image || !user)
         {
            return res.status(501).send({
                success:false,
                message:"Please Provide All fields"
            })
         }
         
         const existingUser =await userModel.findById(user);
         if(!existingUser)
         {
            return res.status(404).send({
                success:false,
                message:"Unable to find user"
            })
         }

         const newBlog =await blogModel({title,description,image,user});
         const session =await mongoose.startSession();
         session.startTransaction();
         await newBlog.save({session});
        //  console.log(existingUser , existingUser.blogs);
         existingUser.blogs.push(newBlog);
         await existingUser.save({session});
         await session.commitTransaction();

         await newBlog.save();
         return res.status(200).send({
            success:true,
            message:"Successfully Created blog",
            newBlog,
         });
    }
    catch(error)
    {
        console.log(error);
        return res.status(501).send({
            success:false,
            message:"Error while creating Blog"
        })
    }
}

//update blogs
exports.updateBlogController= async (req,res)=>{
    try{
            const {id}=req.params;
            const {title,description,image}=req.body;
            const blog=await blogModel.findByIdAndUpdate(id,{...req.body},{new:true});
            return res.status(200).send({
                success:true,
                message:"Blog Updated",
                blog
            })
        }
    catch(error)
    {
        console.log(error)
        return res.status(501).send({
            success:false,
            message:"Error while Updating Blog"
        })
    }
}

//single blog
exports.getBlogByIdController= async(req,res)=>{
    try{
          const {id}=req.params;
          const blog = await blogModel.findById(id);
          if(!blog)
          {
            return res.status(500).send({
                success:false,
                message:"Blog not Found",
            })
          }

          return res.status(200).send({
            success:true,
            message:"Blog Found",
            blog
        })
    }
    catch(error)
    {
        console.log(error)
        return res.status(501).send({
            success:false,
            message:"Error while getting single Blog"
        })
    }
    
}


//delete blog
exports.deleteBlogController= async (req,res)=>{
      try{
        const {id}=req.params;
        const blog = await blogModel.findOneAndDelete(id).populate("user");
        await blog.user.blogs.pull(blog);
        await blog.user.save();

        return res.status(200).send({
            success:true,
            message:"Blog Deleted"
        })
    }
      catch(error)
      {
          console.log(error)
          return res.status(501).send({
              success:false,
              message:"Error while Deleting single Blog"
          })
      }
}

//get user blogs
exports.userBlogController =async(req,res)=>{
    try{
       const userBlog = await userModel.findById(req.params.id).populate("blogs");
       if(!userBlog){
        return res.status(404).send({
            success:false,
            message:"Blogs not found with this id",
        })
       }

       return res.status(200).send({
        success:true,
        message:"Successfully got Blogs",
        userBlog,
       })
    }
    catch(error)
    {
        console.log(error)
          return res.status(501).send({
              success:false,
              message:"Error while getting Blog of user"
          })
    }
} 