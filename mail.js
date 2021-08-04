const nodemailer = require("nodemailer")
const mailgun = require('nodemailer-mailgun-transport');

const auth = {
    auth: {
        api_key: '2ac960bf130efcdbf2b5c25a307d4180-64574a68-8b888813',
        domain: 'sandbox3bef5e8772694977912e5c7e138eb0e0.mailgun.org'
    }
}

const transporter = nodemailer.createTransport(mailgun(auth))

const mailOption = {
    from: 'musshaidari@gmail.com',
    to: 'mhaidarpoor@gmail.com',
    subject: "testing",
    text: 'testing sending email'
}

transporter.sendMail(mailOption, (err, data) => {
    if(err){
        console.log(err)
    } else {
        console.log('email sent')
    }
})


// let transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'musshaidari@gmail.com',
//         pass: 'P#zw0rz2020'
//     }
// });

// let mailOption = {
//     from: 'musshaidari@gmail.com',
//     to: 'mhaidarpoor@gmail.com',
//     subject: "testing",
//     text: 'testing sending email'
// }
