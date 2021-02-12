const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email) => {
    const msg = {
        to: email, 
        from: 'adnan.hebibovic@gmail.com', 
        subject: 'Thanks for joining in!',
        text: 'Welcome to the task-manager, please let me know how you get along!',
      }
    
    sgMail
    .send(msg)
    .then(() => {
        console.log('Welcome email sent')
    })
    .catch((error) => {
        console.error(error)
    })
}

const sendCancelationEmail = (email) => {
    const msg = {
        to: email, 
        from: 'adnan.hebibovic@gmail.com', 
        subject: 'Sorry to see you go',
        text: 'Goodbye, I hope to see you some time soon!',
      }
    
    sgMail
    .send(msg)
    .then(() => {
        console.log('Welcome email sent')
    })
    .catch((error) => {
        console.error(error)
    })
} 

module.exports = {
    sendWelcomeEmail: sendWelcomeEmail,
    sendCancelationEmail: sendCancelationEmail    
}

