const User = require('../models/User')
const Company = require('../models/Company')

module.exports = class CompanyController {
    static async allCompanies(req, res) {  
        const userId = req.session.userid
        
        const user = await User.findOne({
            where: {
                id: userId,

            },
            include: Company,
            plain: true,
        })

        if (!user) {
            res.redirect('/login')
        }
        // não sei pq mas a tabela msm sendo nomeada de company no banco de dados fica em plural
        const companies =  user.Companies.map((result) => result.dataValues)

        console.log(companies)


        res.render('companies/all', { companies })
    }
    static async dashboard(req, res) {
        res.render('companies/dashboard')
    }

    static async createCompany(req, res) {
        res.render('companies/create')
    }

    static async createCompanySave(req, res) {
        const company = {
            title: req.body.title,
            UserId: req.session.userid
        }

        try {
            await Company.create(company)
            console.log(company)
            req.flash('message', 'Empresa adicionada com sucesso')
        
            req.session.save(() => {
                res.redirect('/')
            })
        } catch (err) {
            console.log('aconteceu um erro', err)
        }
    } 

    
}