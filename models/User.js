const Sequelize = require('sequelize')
const { sequelize } = require('../database/db.js')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
	'user',
	{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: Sequelize.STRING
		},
		email: {
			type: Sequelize.STRING,
			unique: true
		},
		password: {
			type: Sequelize.STRING
		},
		surname: {
			type: Sequelize.STRING
		},
		second_surname: {
			type: Sequelize.STRING
		},
		actividad: {
			type: Sequelize.STRING
		},
		position: {
			type: Sequelize.STRING
		},
		telephone: {
			type: Sequelize.INTEGER
		},
		website: {
			type: Sequelize.STRING
		},
		employees: {
			type: Sequelize.INTEGER
		},
		products: {
			type: Sequelize.STRING
		},
		subsidary: {
			type: Sequelize.STRING
		},
		country: {
			type: Sequelize.STRING
		},
		city: {
			type: Sequelize.STRING
		},
		street: {
			type: Sequelize.STRING
		},
		buildingnumber: {
			type: Sequelize.STRING
		},
		zip: {
			type: Sequelize.INTEGER
		},
		billingname: {
			type: Sequelize.STRING
		},
		billingaddress: {
			type: Sequelize.STRING
		},
		vat: {
			type: Sequelize.STRING
		},
		othertax: {
			type: Sequelize.STRING
		},
		bankaccount: {
			type: Sequelize.STRING
		},
		category: {
			type: Sequelize.INTEGER
		},
		role: {
			type: Sequelize.INTEGER
		},
		createdAt: {
			type: Sequelize.DATE,
			defaultValue: Sequelize.NOW
		}
	},
	{
		timestamps: false
	}
)