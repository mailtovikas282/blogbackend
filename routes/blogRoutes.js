const express =require('express');
const f = require('../client/node_modules')
const { deleteBlogController,
        getBlogByIdController, 
        updateBlogController, 
        createBlogController, 
        getAllBlogsController, 
        userBlogController} = require('../controllers/blogControllers');


const router=express.Router();


//routes

//get blogs 
router.get('/all-blog',getAllBlogsController);

//Post create blogs 
router.post('/create-blog',createBlogController);

//Put || update blog
router.put('/update-blog/:id',updateBlogController);

//get single blog details 
router.get('/get-blog/:id',getBlogByIdController);

//delete || deleteblog
router.delete('/delete-blog/:id',deleteBlogController);

//Get user blog
router.get('/user-blog/:id',userBlogController)

module.exports=router;
