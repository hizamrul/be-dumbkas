const {user_tb} = require("../../models")

exports.getUserInfo = async (req, res) => {
    let id_user = req.user.id_user

    // Get User Info

    let userInfo = await user_tb.findOne({
        where: {
            id_user: id_user
        }
    })

    res.status(200).send({
        message: "Success",
        userData: {
            id_user : userInfo.id_user,
            email: userInfo.email,
            userName: userInfo.userName,
            balance: userInfo.balance
        }
    })


}