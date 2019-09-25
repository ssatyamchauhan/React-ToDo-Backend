This is the backend code of web app React-ToDo, by using express library of node.

## Description
First of all this is the backend part of React-Todo. All you need to do first go to repository and setup the React-Todo-front-end part. At the end You need to come here and setup backend. 
Hey, In this I have implemented an api in which i have performed CRUD operation by using express library of nodejs.
Express is a perfect choice for a server when it comes to create and exposing api(REST full API) to communicate as a client with your server application.

## Changes
You need a file name .env<br>
Where you enter your credentials<br>
```
secret = your secret will here
host = localhost
user = username of mysql-server
password = password of mysql-server
database = database name
```
In jwtVerify at line 43 you need to enter your google client id. <br>

And in sms.js you need to fill auth section through which email will send to other users.

## Requirements
if you are a linux user:<br>
All you need to installed node, mysql and git in your system. <br>
To install node run command ```sudo apt-get install nodejs```<br>
Tod install mysql run command ```sudo apt-get install mysql-server```<br>
To install git run command ```sudo apt-get install git```<br>
And it is done.<br>
Now Run the following command : <br>
```
git clone https://github.com/ssatyamchauhan/React-ToDo-Backend.git
cd /yourprojectdirectory
npm install 
nodemon
```

