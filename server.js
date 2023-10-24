const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const bodyParser = require('body-parser')

const app = express();

app.use(cors({
    origin:[
       '*'
    ],
    credentials:true,
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


mongoose.pluralize(null)

dotenv.config({ path: './config.env' });


const port = process.env.PORT;
const db = process.env.DB;

mongoose.connect(db).then(() => {
    console.log('database is connected');
}).catch(() => {
    console.log('database base not connected');
})


const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
})

const bookNow = mongoose.Schema({
    from: {
        type: String,
        required: true,
    },
    whereTo: {
        type: String,
        required: true,
    },
    howMany: {
        type: String,
        required: true,
    },
    arrivals: {
        type: String,
        required: true,
    },
    leaving: {
        type: String,
        required: true,
    }
})

const contactMsg = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    }
})



const allData = mongoose.model('login', schema)
const booknow = mongoose.model('bookings', bookNow)
const contactmsg = mongoose.model('clientMessage', contactMsg)



app.post('/register', async (req, res) => {


    try {
        console.log('here')

        console.log(req.body)

        const { name, email, password } = req.body;

        const emailCheck = await allData.findOne({ email: email });

        if (emailCheck) {
            return res.status(409).send('user already exist');
        }
        const userData = new allData({
            name, email, password
        })
        const user = await userData.save();
        console.log('registraction successfull, login to procees');
        res.send('registraction successfull, login to procees')

    } catch (error) {
        console.log(error)
    }


})

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body)

        const loginCheck = await allData.findOne({ email: email })

        if (!loginCheck) return res.status(404).json({ message: 'user not found' });
        if (password == loginCheck.password) {
            console.log(loginCheck._id)
            res
            .status(200)
            .json({ name: loginCheck.name, message: "Login successfully" })

        } else {
            res.status(404).json({ message: "password incorrect,try again" });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "internal server error,try again later" });
    }

})


app.post('/bookNow', async (req, res) => {
    try {
        const { from, whereTo, howMany, arrivals, leaving } = req.body;

        const bookNowData = new booknow({
            from, whereTo, howMany, arrivals, leaving
        })

        const save = await bookNowData.save();
        if (save) {
            console.log('booked');
            res.status(200).send('Your pre-booking is done,our team contact you soon')
        } else {
            console.log('not booked');
            res.status(500).send('try again')
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('try again')
    }
})

app.post('/contactMsg',async(req,res)=>{
    try {
        console.log(req.body);
        const {name,email,message} = req.body;
        const contactMessage = new contactmsg({
            name,email,message
        })

        const save = await contactMessage.save();

        if(save){
            console.log('message sent')
            res.send("we got your message, you'll get our response soon")
        }else{
            console.log('message not sent');
            res.send('some problem happen,try again later');
        }

    } catch (error) {
        console.log(error);
        res.send('try again');
    }
})







app.listen(4004, () => {
    console.log('Port is listening');
})










