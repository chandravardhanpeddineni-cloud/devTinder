

const userAuthMiddleWare = (req, res, next) => {
    console.log("User authentication middleware executed");
    const token = 'abc13';
    const isUserAuthorized = token === 'abc123';
    if(token !== 'abc123') {
        return res.status(401).send("Unauthorized access");
    }
    else{
        next();
    }
}
module.exports = {
    adminAuthMiddleware,
    userAuthMiddleWare
}