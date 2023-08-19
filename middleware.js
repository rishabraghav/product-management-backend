const checkRole = (role) => (req, res, next) => {

    const userRole = req.user?.role; 
    
    if (userRole === role) {
        next(); 
    } else {
        res.status(403).send({ error: "Access denied" }); 
    }
};

module.exports = { checkRole };
