var nodemailer = require('nodemailer')

module.exports.mailer= (email,message)=>{
    
    var transporter = nodemailer.createTransport({
	service:'gmail',
	auth:{
		user:"gmail_id",
		pass:"password"
		}
});

    var mailOptions = {
        from:'no.todo.reply@gmail.com',
        to: email,
        subject:'Verification mail',
        html: message
    }

    transporter.sendMail(mailOptions,(err,result)=>{
        if(!err){console.log(result)}
        else{console.log('Your mail has sent successfully!')}
    })

}
