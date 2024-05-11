const express = require("express");
const router = express.Router();
const Issue = require("./models/issue");
const Book = require("./models/book");
const Student = require("./models/student");
const nodemailer = require("nodemailer");
const cron = require("node-cron");


const sendmailToAllUsers = async(emailObj) =>{
   const transporter =  nodemailer.createTransport({
        host : 'smtp.gmail.com',
        port : 587 , 
        secure : false,
        requireTLS  : true,
        auth : {
            user : 'prabhanshuranjan0702@gmail.com' ,
            pass : 'pxmutbilmmymlrdb' ,

        }
    });

    const mailOptions = {
        from : 'library issue' ,
        to : emailObj , 
        subject : 'Library book return',
        html : '<p> Library Book Due </p>'
    }

    transporter.sendMail(mailOptions,function(error,info){
        if(error){
            console.log(error);
        }
        else
        {
            console.log('Mail has been sent :- ',info.response);
        }
    });
}
const sendmailAllusers = () => {
    console.log("Server started ");
    try {
        cron.schedule('*/10 * * * * *', async function() {
            const currentDate = new Date();
            const issueData = await Issue.find({});

            if (issueData.length > 0) {
                const emails = [];

                for (const issue of issueData) {
                    const issuedDate = new Date(issue.createdAt);
                    const diffInDays = Math.round((currentDate - issuedDate) / (1000 * 60 * 60 * 24));

                    if (diffInDays > 10) {
                        const student = await Student.findById(issue.userId);
                        if (student) {
                            emails.push(student.email);
                        }
                    }
                }

                if (emails.length > 0) {
                    sendmailToAllUsers(emails);
                }
            }

            console.log("end");
        });
    } catch (error) {
        console.error(error);
    }
}

module.exports ={sendmailAllusers};