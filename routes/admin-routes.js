const express = require("express");
const authMiddleware = require("../middleware/auth-middleware");
const adminMiddleware = require("../middleware/admin-middleware")
const router = express.Router();

// two middleware
// 1. check user is authenticated or not
// 2. Check User has admin rights or not
router.get('/welcome', authMiddleware, adminMiddleware, (req,res)=>{
    res.json({
        message: 'Welcome to the admin page'
    })
})

module.exports = router;