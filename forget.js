var nodemailer = require('nodemailer')

module.exports = function mailer(req,res,token,next){
    console.log(token)
    var transporter = nodemailer.createTransport({
	service:'gmail',
	auth:{
		user:"no.todo.reply@gmail.com",
		pass:"notodo@reply"
		}
});

    var mailOptions = {
        from:'no.todo.reply@gmail.com',
        to: req.body.email,
        subject:'forget Password',
        html: 'You are receiving this because you (or someone else) have requested the reset of the password         for your account.\n\n' +  
               'Please click on the following link, or paste this into your browser to complete the process:\n\n' +  
               'http://localhost:5000/reset?key=' + token + '\n\n' +  
               'If you did not request this, please ignore this email and your password will remain unchanged.\n'
    }

    transporter.sendMail(mailOptions,(err,result)=>{
        if(!err){res.send(result)}
        else{res.send(err);next()}
    })

}