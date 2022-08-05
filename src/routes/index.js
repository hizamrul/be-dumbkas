const express = require("express")
const router = express.Router()

// Middleware
const {auth} = require("../middleware/auth")
// Components
const {register, login} = require("../controller/auth")
const { getUserInfo } = require("../controller/user")
const { addTransaction, viewTransaction } = require("../controller/transaction")
const { addCategory, viewCategory } = require("../controller/category")

// Routing

// Auth
router.post("/register", register)
router.post("/login", login)

// User 
router.get("/user-info", auth, getUserInfo)

// Transaction
router.post("/add-transaction", auth, addTransaction)
router.get("/view-transaction", auth, viewTransaction)

// Category
router.get("/view-category", viewCategory)
router.post("/add-category", addCategory)





module.exports = router