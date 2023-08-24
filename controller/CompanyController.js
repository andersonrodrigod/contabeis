const User = require('../models/User')
const Company = require('../models/Company')
const Releases = require('../models/Releases')

module.exports = class CompanyController {
    static async allCompanies(req, res) {  
        try {
            const userId = req.session.userid

            if (!userId) {
                return res.redirect('/login'); 
            } else {
                
            }
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
        } catch (err) {
            console.log(err)
        }
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
            req.flash('message', 'Empresa adicionada com sucesso')
        
            req.session.save(() => {
                res.redirect('/companies/all')
            })
        } catch (err) {
            console.log('aconteceu um erro', err)
        }
    } 

    static async companyEdit(req, res) {
        const id = req.params.id

        const company = await Company.findOne({where: {id: id}, raw: true})
        
        console.log(company)
        res.render('companies/edit', { company } )
    }

    static async companyEditPost(req, res) {
        const id = req.body.id

        const company = {
            title: req.body.title
        }

        try {
            Company.update(company, {where: {id: id}})
            req.flash('message', 'Nome da empresa atualizado com sucesso!')
            req.session.save(() => {
                res.redirect('/companies/all')
            })
        } catch (err) {
            console.log(err)
        }
    }

    static async companyRemove(req, res) {
        const id = req.params.id

        const company = await Company.findOne({where: {id: id}, raw: true})

        console.log(id, company)

        res.render('companies/remove', {company})
        
    }

    static async companyRemovePost(req, res) {
        const id = req.body.id

        Company.destroy({where: {id: id}})
        req.flash('message', 'Empresa removida com Sucesso')

        req.session.save(() => {
            res.redirect('/companies/all')
        })
    }

    static async company(req, res) {
        const id = req.params.id
        const company = await Company.findOne({where: {id: id}, raw: true})
        res.render('companies/company', {company})
    }

    

    
}