// import joi validation
const Joi = require("joi")
// import bcrypt
const bcrypt = require("bcrypt")
//import jsonwebtoken
const jwt = require("jsonwebtoken")
const {user_tb} = require("../../models")

function rand_num(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}
// Component
// Register
exports.register = async (req, res) => {
    // Generate ID
    let idUser = rand_num(10000000,90000000)
    let firstName = req.body.firstName
    let lastName = req.body.lastName
    let email = req.body.email
    let userName = req.body.userName
    let balance = 0

    // Form Validate
    const schema = Joi.object({
        firstName: Joi.string().min(3).required(),
        lastName: Joi.string().min(3).required(),
        userName: Joi.string().min(3).required(),
        email: Joi.string().email().min(6).required(),
        password: Joi.string().min(6).required(),
      })
      // do validation and get error object from schema.validate
    const { error } = schema.validate(req.body)
      // if error exist send validation error message
    if (error)
    // Send Error
    return res.status(400).send({
        error: {
        message: error.details[0].message,
        },
    })
    // Start Register Function
    try {
        
        // Check User Exist by Email
        const checkEMailExist = await user_tb.findOne({
            where:{
                email: email,
            }
        })
        // Check User By Username
        const checkUserNAmeExist = await user_tb.findOne({
            where:{
                userName: userName,
            }
        })
        // If Exist
        if ( checkUserNAmeExist !== null || checkEMailExist !== null ) {
            return res.status(400).send({
                    messagae: "Username or Email Already Exist !"
            })
        }else{
            const salt = await bcrypt.genSalt(10)
            // we hash password from request with salt
            const hashedPassword = await bcrypt.hash(req.body.password, salt)
            let saveDataUser = {
                id_user: idUser,
                firstName: firstName,
                lastName: lastName,
                email: email,
                userName: userName,
                password: hashedPassword,
                balance: balance
            }
            await user_tb.create(saveDataUser)
            const token = jwt.sign({
                id_user: idUser
            }, process.env.TOKEN_KEY)
            res.status(201).send({
				status: "Success",
				message: "User Has Been Added To Database",
				data: {
					id_user: idUser ,
					userName: userName,
					email: email,
					token: token
				}
			})
        }
        
    } catch (error) {
		console.log(e)
		res.status(400).send({
			status: "Gagal",
			message: "BAD REQUEST(400) : Something Error",
		})
    }
}


// Login 
exports.login = async (req, res) => {

    // our validation schema here
    const schema = Joi.object({
        email: Joi.string().email().min(6).required(),
        password: Joi.string().min(6).required(),
    })

    // do validation and get error object from schema.validate
    const { error } = schema.validate(req.body)

    let email_user = req.body.email
    let password = req.body.password

    console.log(email_user)

    // Checking Email Exist
    // Check User Exist by Email
    const checkEmailExist = await user_tb.findOne({
        where:{
            email : email_user
        }
    })

    // Check Email and Password Combination
    const checkCombination = await user_tb.findOne({
        where:{
            email : email_user
        }
    })
    // Password Validation
    const isValid = await bcrypt.compare(password, checkCombination.password)
    // If Valid
    if (!isValid) {
        return res.status(400).send({
          status: "failed",
          message: "credential is invalid",
        })
      }

    // User Check
    if (checkEmailExist == null ) {
        res.status(404).send({
            message: "Email Not Found !"
        })
    }else if(checkCombination == null) {
        res.status(400).send({
            message: "Wrong Password and Email Combination !"
        })
    }else{
        // Generate Token
        const token = jwt.sign({
            id_user: checkCombination.id_user
        },  process.env.TOKEN_KEY)
        // Send Status
        res.status(200).send({
            message: "Welcome !",
            userData: {
                id_user : checkCombination.id_user,
                userName: checkCombination.userName,
                balance : checkCombination.balance,
                token : token
            }
        })
    }
    

}