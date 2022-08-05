// Init Sequelize
const Sequelize = require('sequelize')
const db = []

// Run Sequelize Variabel

const sequelize = new Sequelize("dumbkas", "root", "", {

	host: "localhost",
	dialect: "mysql",
	loggin: console.log,
	freeTableName: true,

	pool :{
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000,
	}
})

db.sequelize = sequelize

module.exports = db