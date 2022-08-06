const Sequelize = require('sequelize')
const { sequelize } = require('../database/db.js')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
	'activity',
	{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		activity: {
			type: Sequelize.STRING
		},
        createdAt: {
			type: Sequelize.DATE,
			defaultValue: Sequelize.NOW
		},
        
    },
    {
		timestamps: false
	}
)