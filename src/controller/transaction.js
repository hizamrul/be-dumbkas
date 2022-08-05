const {user_tb, category, transaction} = require("../../models")

const db = require("../config/database")
const { QueryTypes } = require('sequelize')

exports.addTransaction = async (req, res) => {
    // Get User Id
    let id_user = req.user.id_user
    // Form Variable
    let type = req.body.type
    let nominal = req.body.nominal
    let categoryId = req.body.categoryId
    let description = req.body.description
    let date = req.body.date

    // Get Balance Info

    let userInfo = await user_tb.findOne({
        where:{
            id_user : id_user
        }
    })

    // Get Category Info
    let categoryInfo = await category.findOne({
        where:{
            id: categoryId
        }
    })

    // get Balance
    let userBalance = userInfo.balance
    let newBalance = 0

    // If Income = (Balance + nominal)
    if (type == "INCOME") {
        newBalance = userBalance + nominal
    }else{
        newBalance = userBalance - nominal
    }
    if (newBalance < 0) {
        res.status(400).send({
            status : "error",
            message: "nominal exceeds balance sheet"
        })
    }else{
        
        // Add To Database
        await transaction.create({
            id_user: id_user,
            type: type,
            nominal: nominal,
            categoryId : categoryId,
            description: description,
        })

        // Update Balance
        await user_tb.update({balance: newBalance}, {
            where:{
                id_user: req.user.id_user
            }
        })

        // Send Status
        res.status(200).send({
            status: "Success",
            message: "Data Added !",
            userInfo :{
                id_user: userInfo.id_user,
                balance: userInfo.balance

            },
            transInfo : {
                type: type,
                categoryId : categoryId,
                categoryInfo: {
                    categoryName: categoryInfo.category_name
                },
                description: description,
                newBalance: newBalance
            }
        })
    }

    
}

exports.viewTransaction = async (req, res) => {
    let userId = req.user.id_user
    let getTransaction = await db.sequelize.query(`SELECT * FROM transactions LEFT JOIN categories ON transactions.categoryId = categories.id WHERE id_user = '${userId}'`)
    console.log(getTransaction)
    if (getTransaction == null) {
        res.status(404).send({
            status: "Success",
            message: "Transaction is Empty"
        })
    } else {
        let userInfo = await user_tb.findOne({
            where:{
                id_user : userId
            }
        })
    
        // Get Category Info
                
        res.status(200).send({
            status : "Success",
            userInfo :{
                id_user: userInfo.id_user,
                balance: userInfo.balance

            },
            transInfo : getTransaction
            
        })
        
    }
}