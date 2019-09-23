const db = require('dotenv').config()
const jwtVerify = require('./jwtVerify')
const forget = require('./forget')

module.exports = (endpoints, knex, jwt) => {
    endpoints.get('/get', jwtVerify, (req, res)=>{
            var userId = req.userId
            console.log(userId)
            knex
            .select("*")
            .from('todo')
            .where('userId', userId)
            .then(data => {return res.json(data)})
            .catch(err => console.log(err.message))
    })
    endpoints.post('/newData', jwtVerify, (req, res)=>{
      var data = {done:req.body.done, text:req.body.text};
          data["userId"] = req.userId;
          console.log(data)
          knex('todo')
          .insert(data)
          .then(() => {
                knex('todo')
                .where('todo.userId', data.userId)
                .then(data => res.send(data))
                .catch(err => console.log(err.message))
          })
          .catch((err) => console.log(err.message))
      })  
    endpoints.put('/edit/:id', jwtVerify, (req, res)=>{
      // var id = parseInt(req.params.id)+1;
      console.log('original', req.params.id)
            var userId = req.userId;
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
      
    })
    endpoints.put('/done/:id', jwtVerify, (req, res) =>{
      // console.log(req.params.id)

          var userId = req.userId;
          knex('todo')
            .where("todo.id", req.params.id)
            .andWhere('todo.userId', userId)
            .update({done:req.body.done})
          .then(() => {
            console.log('then')
              knex('todo')
                .where('todo.userId', userId)
                .then(data => {res.send(data)})
                .catch(err => console.log(err.message))
          })
          .catch((err) => console.log(err.message))
      
    })
    endpoints.delete('/delete/:id', jwtVerify, (req, res) =>{
          var userId = req.userId;
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
  })
    endpoints.post('/signup', (req, res)=>{
      console.log('this is request body',req.body)
      knex('user').insert(req.body)
      .then(() => res.json('signup successfully!'))
      .catch((err) => res.json('Error'))
    })

  
    endpoints.post('/login', (req,resp)=>{
      // console.log('this is ', req.body)
      knex('user')
        .where("user.email", req.body.email)
        .andWhere("user.password", req.body.password)
      .then((data) => {
        if(data.length>0){
            jwt.sign({user:data[0]}, process.env.secret, {expiresIn: '5m'}, function(err, token) {
            if(!err){
                return resp.send(token+' '+'manual')
            }
            else{
              console.log('here is the error',err)
            }
       });
      }
      else{
        resp.json('data is not exists!')
      }
    })
      .catch((err) => console.log(err.message))
    })
    endpoints.post('/googleSign', (req,res) => {
        if(req.body.id_token){
          return res.send(req.body.id_token)
        }      
        else{
          res.json('data does not exists')
        }
    })

    endpoints.get('/logout', jwtVerify, (req, res)=>{
      res.clearCookie(req.token);
      res.json('logged out successfully!')
    })

    endpoints.post('/forget',(req,res) => {
      console.log('forget is called')
      console.log(req.body)
        knex('user').where('user.email',req.body.email)
        .then(data => {
          console.log(data)
          if(data.length === 1){
              jwt.sign({user:data[0]}, process.env.secret, {expiresIn: '5m'}, function(err, token) {
                if(!err){
                  console.log(token)
                  forget(req,res,token)
                }
                else{
                  console.log('here is the error',err)
                }
              })
                
          }
          else{
            console.log('else')
            res.json('You are not a existence user!')
          }
        })
    })

    endpoints.post('/reset', jwtVerify , (req,res) =>{
      console.log('it is in process.......')
      var userId = req.userId;
      knex('user').where('user.id',userId).update({password:req.body.password})
      .then(data => res.json(data))
      .catch(err => res.json(err))
      
    })

    endpoints.post('/profile', jwtVerify , (req,res) => {
      console.log('this is profile endpoints')
      var userId=req.userId
      console.log(req.picture, 'here it is ',userId)
      knex('user').where('user.id',userId)
      .then(data => {console.log(data);res.send({name:'satyam',email:data[0].email,image:req.picture})})
      .catch(err => res.send(err))
    })
}
