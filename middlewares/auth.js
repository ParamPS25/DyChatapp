// login user -> access dashboard and not showing login but not register
// logout user -> can acess login and register but not dashboard

const isLogin = async(req,res,next)=>{
    try{
        if(req.session.storeUser){
           // just to check if user is login while hitting logout
           return next();
        }
        else{
            return res.redirect("/login")          // if not redirecting it to login
        }
    }
    catch(err){
        res.json({error:err.message})
    }
}

const isLogout = async(req,res,next)=>{
    try{
        if(req.session.storeUser){
            return res.redirect("/dashboard")      //if user is still login and hit /register it should not be as already login
        }
     return next();    // if user is logout => can register or login 
    }
    catch(err){
        res.json({error:err.message})
    }
}

module.exports = {
    isLogin,
    isLogout,
}

//isLogin: Checks if the user is logged in. If not, it redirects to the login page. If the user is logged in, it calls next() to proceed to the next middleware or route handler.
//isLogout: Checks if the user is logged in. If so, it redirects to the dashboard. If the user is not logged in, it calls next() to proceed to the next middleware or route handler.

//err solved:
//Added return before res.redirect() and next() to ensure that the function exits after sending a response or calling next(). This prevents multiple responses for a single request