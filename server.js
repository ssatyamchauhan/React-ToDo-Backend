var express = require('express')
var app = express()
const jwt = require('jsonwebtoken');
const config = require('./config')

var cors = require('cors')
app.use(cors())



var knex = require('knex')({client:'mysql',connection:config.key});

knex.schema.hasTable('todo').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('todo', function(t) {
        t.increments('id').primary();
        t.integer('userId').notNullable();
        t.string('text').notNullable()
        t.boolean('done');
      });
    }
});

knex.schema.hasTable('user').then(function(exists) {
  if (!exists) {
    return knex.schema.createTable('user', function(t) {
      t.increments('id').primary();
      t.string('email').unique().notNullable();
      t.string('password').notNullable();
    });
  }
});



app.use(express.json())
 app.use((req, res, next) => {
 	res.header("Access-Control-Allow-Origin", "*");
 	res.header("Access-Control-Allow-Methods","GET,PUT,POST,DELETE")
 	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
 	next();
   });


var endpoints = express.Router();
app.use('/',endpoints);
require('./Routes')(endpoints,knex,jwt)

  
app.listen(2000,()=>{
	console.log('You app is listening on Port',2000)
})
