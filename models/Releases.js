const { DataTypes } = require('sequelize')

const db = require('../db/conn')

const Company = require('../models/Company')

const Releases = db.define('Releases', {
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        required: true
    },
    debt: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true
    },
    credit: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true
    },
    valor: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true
    }
})

Releases.belongsTo(Company)
Company.hasMany(Releases)

module.exports = Releases

