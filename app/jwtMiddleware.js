var jwt = require('jsonwebtoken');
var config = require('.././config');
function verifyToken(req, res, next) {
    console.log(req.params);
    console.log(req.headers);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization,authorization");
    if(req.url=='/login'  || req.url=='/register' || req.url=='/countryList'  ){
        console.log('next');
        req.userId = '';
        next();
    }else {
        var token = req.params['authKey'];//req.params['authorization'];//req.headers['authorization'];
        if (!token)
            return res.status(403).send({auth: false, message: 'No token provided.', 'body': []});
             //next();
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err)
                return res.status(500).send({auth: false, message: 'Failed to authenticate token.', 'body': []});
            // if everything good, save to request for use in other routes
            req.userId = decoded.id;
            next();
        });
    }
}
module.exports = verifyToken;
