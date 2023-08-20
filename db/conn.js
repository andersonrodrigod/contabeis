const { Sequelize } = require('sequelize')



const sequelize = new Sequelize('contabeis', 'root', 'rs721500', {
  host: 'localhost',
  dialect: 'mysql'
})




try {
    sequelize.authenticate()
    console.log('Conectamos ao banco de dados')
} catch(err) {
    console.log(err)
}

module.exports = sequelize