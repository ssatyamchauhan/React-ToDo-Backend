var verifier = require('google-id-token-verifier');
const jwt = require('jsonwebtoken');
const config = require('./config')
var knex = require('knex')({client:'mysql',connection:config.key});
module.exports = function verification(req,res,next){
    var token = req.query.token || req.body.token || req.headers.Cookies;
        // console.log('first',token)
        if(token !== undefined){
            console.log('second',token)
            if(token.endsWith(' manual')){
                console.log('third',token)
                token = token.slice(0,-7)
                console.log('fourth',token)
                jwt.verify(token, config.key.secret, (err, decode) =>{
                    if(!err){      
                        console.log(req.userId)
                        req.userId = decode.user.id  
                        console.log(req.userId)
                        next()
                    }
                    else{
                        console.log(err)
                        res.json('invalid')
                    }
                })
            }
            else if(token.startsWith('key=')){
                token = token.slice(4,token.length)
                console.log('else if')
                console.log('hello token',token)
                jwt.verify(token, config.key.secret, (err, decode) =>{
                    if(!err){      
                        req.userId = decode.user.id  
                        req.email = decode.user.email
                        console.log(req.userId)
                        next()
                    }
                    else{
                        console.log(err)
                        res.json('invalid')
                    }
                })
                
            }
            else{
                var clientId = '673375738955-hio20gpguhrdlddbdl8a60da9de4qc9j.apps.googleusercontent.com';
                // console.log(token)
                verifier.verify(token, clientId, function (err, tokenInfo) {
                    // console.log(tokenInfo)
                    if (!err) {
                        console.log('===========================================')
                        knex.select('id').where('email', tokenInfo.email).from('user')
                        .then(data => {
                            if(data.length === 0){
                                knex('user').insert(
                                    {
                                        email:tokenInfo.email,
                                        password: null                                    }
                                )
                                .then((data) => {
                                    req.userId=data[0];
                                    next()
                                })
                                .catch(err => res.json('something went wrong'))
                            }
                            else{
                            // console.log(data)
                            console.log('this is the original data',data[0].id)
                            req.userId=data[0].id;
                            next()
                            }
                        })
                        .catch(err => console.log(err.message))
                    }
                    else{
                        console.log(err)
                        res.json('invalid token')
                    }
                  });
            }
        }
        else{
            res.json('undefined')
        }
}

// module.export = function googleVerify(req,res,next){


    



// }
