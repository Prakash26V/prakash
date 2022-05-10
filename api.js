const express = require('express')
// const bcrypt = require('bcrypt')
// const multer = require('multer')
// login with google
// var GoogleStrategy = require('passport-google-oauth20').Strategy;


const router = express.Router()
//require store
const Inventory = require('./storeschema/schema')
const picture = require('./storeschema/banner')


const Verma = require('./model')
const jwt = require('jsonwebtoken');

// multer S
const multer = require('multer');
const req = require('express/lib/request');
const Api = require('twilio/lib/rest/Api');
// const Verma = require('./model')




const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        cb(null, './uploads/');
    },

    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }

});
const uploads = multer({ storage: storage });



// admin signup
router.post('/signup', uploads.single('productImage'), async (req, res) => {
    console.log(req.file);
    // })
    // router.post('/signup', async (req, res) => {
    try {
        let data = req.body;

        if (!data.phone) {
            res.send("mobile number is req");
        }
        if (data.phone.length !== 10) {
            res.send("mobile is not valid");
            return;
        }
        // const salt = await bcrypt.genSalt(10);
        // const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const NewVerma = new Verma({
            photo: 'http://localhost:3000/uploads/' + req.file.filename,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            phone: req.body.phone,
            gender: req.body.gender,
            email: req.body.email,
            social: req.body.social,
            // hashedPassword: hashedPassword,
            dateOfBirth: req.body.dateOfBirth

        })
        // const result = await NewStudent.save();
        // res.send(result)
        const result = await NewVerma.save();
        console.log("sdfvbnm", result)
        res.send({ ststus: 200, message: "success", "result": result })

    }
    catch (err) {
        console.log('----------------', err)
        res.send({ status: 400, message: err, });
    }

});

// login api
router.post('/login', async (req, res) => {
    try {
        const user = await Verma.findOne({ phone: req.body.phone }); 

        if (!user) return res.send("Invalid login");
        
        const token = jwt.sign({ _id: user._id }, process.env.SECRET_TOKEN);
        user.token.push(token)
        const users= await user.save();
        console.log("qwertyu",token);
        res.header('auth-token', token).send({ status: 200, message: 'success', user: users })
    } catch (err) {
        res.status(400).json({ message: err })
    }
})

// view my profile by id  Api
router.get('/profile', async (req, res) => {
    try {
        let id = req.query.id;
        const user = await Verma.findById(id);
        if (!user) return res.send("Invalid user");

        const token = jwt.sign({ _id: user._id }, process.env.SECRET_TOKEN);

        res.header('auth-token', token).send({ user: user, token: token })
    } catch (err) {
        res.status(400).json({ message:err })
    }
})

// update my profile
// router.patch('/update', uploads.single('productImage'), async (req, res) => {
//     //console.log('rrrrr', req.body)
//     const updatedData = req.body;
//     try {
//         if (req.file) {
//             // console.log(req.file)
//             updatedData.photo = 'http://localhost:3000/uploads/' + req.file.filename
//         }

//         const token = req.headers.token;
//         const data = jwt.verify(token, 'qwertyui')
//         // console.log(data._id)
//         const id = (data._id)


//         const options = { new: true };


//         const result = await Verma.findByIdAndUpdate(id, updatedData, options)

//         res.send({ status: 200, message: "success", result })
//         // res.redirect("/");
//     }
//     catch (error) {
//         res.status(400).json({ status: 400, message: "provide me valid token" })
//     }
// })

router.patch("/:id/update", uploads.single('productImage'), async (req, res) => {
    try {
        const user = Verma.findById(req.params.id)
        const updatedUser = await Verma.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
                photo: 'http://localhost:3000/uploads/' + req.file.filename,
            },
            { new: true }
        );
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json(err);
    }
});


// Get order API
router.post('/getorder', async (req, res) => {
    try {
        let id = req.body.id;
        const user = await Verma.find(id);
        if (!user) return res.send("Invalid Order");

        const token = jwt.sign({ _id: user._id }, process.env.SECRET_TOKEN);

        res.header('auth-token', token).send({ status: 200, user: user, token: token })
    } catch (err) {
        res.status(400).json({ ststus: 404, message: err })
    }
})


// api for delete
router.delete('/:id',async(req,res)=>{
    try{
        const user = await Verma.deleteOne({_id:req.params.id})
    console.log(req.params)
    res.status(200).json({status:200,message:'success',user})
    }catch{
        res.status(400).json({message: err })
    }
})

// Social login  API
// router.post('/Social', (req, res) =>
//     new GoogleStrategy({

//         clientID: 90310826569 - lucflq7v409nqf554bg3v27f10hnmdrc.apps.googleusercontent.com,
//         clientSecret: GOCSPX - ASYynpikJ_HRpVXvDD4V1352aXki,
//         callbackURL: "http://www.example.com/auth/google/callback"
//     },
//         function (accessToken, refreshToken, profile, cb) {
//             User.findOrCreate({ googleId: profile.id }, function (err, user) {
//                 return cb(err, user);

//             });
//             res.send({ ststus: 200, message: "success", "result": result })
//         }
//     ));








// Banner api
router.post("/banner", uploads.single('productImage'), async (req, res) => {
    // console.log(req.file);
    if (req.file.filename) {
        // console.log(req.file)
        try {
            const A = new picture({
                photo: 'http://localhost:3000/uploads/' + req.file.filename,
                title: req.body.title,
                type: req.body.type,
                priority: req.body.priority
            });
            const users = await A.save();
            res.status(200).json
                ({ status: 200, "message": "Success", "result": users, picture });
        } catch (err) {
            res.status(404).json({ status: 404, message: err });
            console.log(err);
        }
    }
    else {
        res.send('Not allowed p')
    }
})

// api getbanner
// router.get('/getbanner', async (req, res) => {
//     try {
//         let id = req.body.id;
//         const topbanner = await picture.find(id);
//         // console.log('----------.........', topbanner)
//         const itemCategory = await Inventory.find(id);
//         // console.log('----------........',topbanner, itemCategory)
//         // if (!user) return res.send();
//         let obj = {
//             banners: topbanner,
//             category: itemCategory
//         };

//         // const token = jwt.sign({ _id: user._id }, process.env.SECRET_TOKEN);
//         res.header().send({ status: 200, message: 'success', user:obj})
//     } catch (err) {
//         res.status(400).json({ status: 400, message: err })
//     }
// })

router.get('/getbanner', async (req, res) => {
    try {
        let id = req.body.id;
        const topbanner = await picture.find(id);
        const itemCategory = await Inventory.find(id);
        let obj = {
            banners: topbanner,
            category: itemCategory
        };
        res.send({ status: 200, message: 'success !', user: obj })
    } catch (err) {
        res.status(400).json({ status: 400, message: err })
    }
})










// api store
router.post("/store/addProduct", uploads.single('productImage'), async (req, res) => {
    // console.log(req.file);
    if (req.body.selectServiceType) {
        try {
            const inventory = new Inventory({
                photo: 'http://localhost:3000/uploads/' + req.file.filename,
                itemCategory: req.body.itemCategory,
                itemName: req.body.itemName,
                itemDescription: req.body.itemDescription,
                itemPrice: req.body.itemPrice,
                unitQuantity: req.body.unitQuantity,
                unitType: req.body.unitType,
                etaDelieveryTime: req.body.etaDelieveryTime,
                itemsIn: req.body.itemsIn,
                selectServiceType: req.body.selectServiceType,
            });

            const users = await inventory.save();
            res.status(200).json
                ({ "status": 200, "message": "Success", "result": users });
        } catch (err) {
            res.status(404).json({ status: 404, message: err });
            console.log(err);
        }

    }
    else {
        res.send('Not allowed p')
    }
})

// API for Order
// router.post('/message', (req, res) => {
//     res.status(200).json({status:200, message: "Order Confirmend" })
//     res.status(200).json({status:200, message: "Order Packed" })
//     res.status(200).json({status:200, message: "Out for Delivery" })
//     res.status(200).json({status:200, message: "Order Delivered" })``

// })

// logout API
router.get("/:id/logout", async (req, res) => {
    try {
        let checkUser = await Verma.findOne({ _id: req.params.id });
        console.log("asdfgh", checkUser)
        if (!checkUser) {
            console.log("Invalid User Id");
            return res.status(501).send("Invalid Token");
        }
        let result = await Verma.findByIdAndUpdate(
            { _id: req.params.id },
            { $set: { token: "", } },
            { new: true }
        );
        console.log("Logout successfully", result);
        return res.status(200).send("User Logout");
    } catch (error) {
        console.log("Error is=========>", error);
        return res.status(500).send("Internal server");
    
    }
    });



    module.exports = router;