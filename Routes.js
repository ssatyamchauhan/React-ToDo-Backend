const db = require('dotenv').config()
const jwtVerify = require('./jwtVerify')
// console.log(db)
// const cookie = require('cookie')
module.exports = (endpoints, knex, jwt) => {
    endpoints.get('/get', jwtVerify, (req, res)=>{
        jwt.verify(req.token, process.env.secret, function(err, decoded) {
          if(!err){
            var userId = decoded.id
            knex
            .select("*")
            .from('todo')
            .where('userId', userId)
            .then(data => {return res.json(data)})
            .catch(err => console.log(err.message))
          }
          else{console.log(err);res.json('token is not valid')}
        });
    })
    endpoints.post('/newData', jwtVerify, (req, res)=>{
      var data = {done:req.body.done, text:req.body.text};
      jwt.verify(req.token, process.env.secret, (err, decode)=>{
        if(!err){
          data["userId"] = decode.id;
          knex('todo')
          .insert(data)
          .then(() => {
                knex('todo')
                .where('todo.userId', data.userId)
                .then(data => res.send(data))
                .catch(err => console.log(err.message))
          })
          .catch((err) => console.log(err.message))
        }
        else{
          console.log(err);res.json('token is not valid')
        }
      })    
    })  
    endpoints.put('/edit/:id', jwtVerify, (req, res)=>{
      // var id = parseInt(req.params.id)+1;
      console.log('original', req.params.id)
      jwt.verify(req.token, process.env.secret, function(err,decode){
          if(!err){
            var userId = decode.id
            knex('todo')
              .where('todo.id', req.params.id)
              .update({"text":req.body.text})
              .then(() => {
                  knex('todo')
                    .where('todo.userId', userId)
                    .then((data) =>{res.send(data)})
                    .catch((err)=>{console.log(err.message)})
            })
            .catch((err)=>{console.log(err.message)
              
              })
          }
          else{
            res.json('token is not valid')
          }
      })  
      
    })
    endpoints.put('/done/:id', jwtVerify, (req, res) =>{
      console.log(req.params.id)
      jwt.verify(req.token, process.env.secret, (err, decode) =>{
        if(!err){
          var userId = decode.id
          knex('todo')
            .where("todo.id", req.params.id)
            .andWhere('todo.userId', userId)
            .update({done:req.body.done})
          .then(() => {
              knex('todo')
                .where('todo.userId', userId)
                .then(data => {res.send(data)})
                .catch(err => console.log(err.message))
          })
          .catch((err) => console.log(err.message))
        }
        else{
          res.json('token is not valid')
        }
      })
      
    })
    endpoints.delete('/delete/:id', jwtVerify, (req, res) =>{
      jwt.verify(req.token, process.env.secret, (err, decode) =>{
        if(!err){
          var userId = decode.id;
          console.log('jwt verified')
          knex('todo')
            .where('todo.id', req.params.id)
            .del()
          .then(() => {
              knex('todo')
              .where('todo.userId', userId)
              .then((data) => res.send(data))
              .catch(err => console.log(err.message))
          })
          .catch(err => console.log(err))
        }
        else{
          res.json('token is not valid')
        }
    })
  })
    endpoints.post('/signup', (req, res)=>{
      knex('user').insert(req.body)
      .then(() => res.json('signup successfully!'))
      .catch((err) => console.log('this data is already exists!'))

    })
    endpoints.get('/logout', jwtVerify, (req, res)=>{
      res.clearCookie(req.token);
      res.json('logged out successfully!')
    })

    endpoints.post('/login', (req, res)=>{
      console.log('this is ', req.body)
      knex('user')
        .where("user.email", req.body.email)
        .andWhere("user.password", req.body.password)
      .then((data) => {
        if(data.length>0){
            jwt.sign(JSON.stringify(data[0]), process.env.secret, function(err, token) {
            if(!err){
                  res.send(token)
            }
            else{console.log(err)}
       });
      }
      else{
        res.json('data is not exists!')
      }
    })
      .catch((err) => console.log(err.message))
    })
}
