const { DataTypes } = require('sequelize')

const db = require('../db/conn')

const User = require('../models/User')

const Company = db.define('Company', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    }
})

Company.belongsTo(User)
User.hasMany(Company)

module.exports = Company