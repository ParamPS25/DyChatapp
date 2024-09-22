const express = require("express");
const multer = require("multer")
const path = require("path");
const {getRegister,postRegister,getLogin,getDashBoard,getLogout,postLogin,saveChat  } = require("../controllers/userControllers")

const {isLogin,isLogout} = require("../middlewares/auth")

const router = express();

// session
const session = require("express-session");
const {SESSION_SECRET} = process.env;
router.use(session({
    secret:SESSION_SECRET,
    resave: false, // Do not save session if unmodified
    saveUninitialized: false, // Do not create session until something is stored
}));


const storage = multer.diskStorage({
    destination : (req,file,cb)=>{
        cb(null,path.join(__dirname,"../public/images"))
    },
    filename : (req,file,cb)=>{
        const fname = `${Date.now()}-${file.originalname}`;
        cb(null,fname)
    }
});
const upload = multer({storage:storage});

router.get("/register",isLogout,getRegister)
router.post("/register",upload.single("pfpImage"),postRegister)
router.get("/login",isLogout,getLogin)
router.post("/login",postLogin)
router.get("/logout",isLogin,getLogout)
router.get("/dashboard",isLogin,getDashBoard)

router.post("/save-chat",saveChat)

//route handler that catches all unmatched routes and redirects them to the "/" login page here
router.get("*",async(req,res)=>{
    res.redirect("/login")
});

module.exports = router;

// so for GET
// for /login and /register -> user must be logged out -> else redirect to dashboard
// for /dashboard -> user must be login -> else redirect to login 
