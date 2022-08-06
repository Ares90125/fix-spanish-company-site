const Sequelize = require('sequelize')
const { sequelize } = require('../database/db.js')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
	'doc',
	{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		docname: {
			type: Sequelize.STRING
		},
		userId: {
			type: Sequelize.INTEGER,
			unique: true
		},
		author: {
			type: Sequelize.STRING
		},
		createdAt: {
			type: Sequelize.DATE,
			defaultValue: Sequelize.NOW
		},
		affects: {
			type: Sequelize.STRING
		},
		dockeyword: {
			type: Sequelize.STRING
		},
		creation_date: {
			type: Sequelize.STRING
		},
		description: {
			type: Sequelize.STRING
		},
		information: {
			type: Sequelize.STRING
		},
		status: {
			type: Sequelize.STRING
		},
		priority: {
			type: Sequelize.STRING
		},
		inspected: {
			type: Sequelize.INTEGER
		},
		inprocess: {
			type: Sequelize.INTEGER
		},
		urgent: {
			type: Sequelize.STRING
		},
		category: {
			type: Sequelize.INTEGER
		}
	},
	{
		timestamps: false
	}
)