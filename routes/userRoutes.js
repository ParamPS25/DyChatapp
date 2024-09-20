const express = require("express");
const multer = require("multer")
const path = require("path");
const {getRegister,postRegister} = require("../controllers/userController")

const router = express();

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

router.get("/register",getRegister)
router.post("/register",upload.single("pfpImage"),postRegister)

module.exports = router;