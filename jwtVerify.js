module.exports = function verification(req,res,next){
    var token = req.query.token || req.body.token;
    console.log('asdakljfl real',token)
    if(token !== undefined){
        if(token.endsWith('=undefined')){
                token = token.slice(0,-10)
        }
    // console.log(token)
    }
    else{
        res.json('token is undefined!')
    }
    req.token = token;
    next()
}