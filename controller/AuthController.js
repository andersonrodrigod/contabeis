const User = require('../models/User')

const bcrypt = require('bcryptjs')


module.exports = class AuthController {
    static async login(req, res) {
        res.render('auth/login')
    }

    static async loginPost(req, res) {
        const {username, password} = req.body

        const user = await User.findOne({where: {username: username}})

        if (!user) {
            req.flash('message', 'Usuário não encontrado')
            return res.render('auth/login')
        }

        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) {
            req.flash('message', 'Senha inválida')
            return res.render('auth/login')
        }

        req.session.userid = user.id

        req.flash('message', 'Autenticação realizado com sucesso!')

        req.session.save(() => {
            res.redirect('/companies/dashboard')
        })

    }

    static async register(req, res) {
        res.render('auth/register')
    }
    
    static async registerPost(req, res) {
        const {name, username, email, password, confirmpassword} = req.body

        if (password != confirmpassword) {
            req.flash('message', 'As senhas não conferem')
            return res.render('auth/register')
        }

        const checkEmailExists = await User.findOne({where: {email: email}})

        if (checkEmailExists){
            req.flash('message', 'O e-mail ja está em uso')
            return res.render('auth/register')
        }

        const checkUserExists = await User.findOne({where: {username: username}})

        if (checkUserExists) {
            req.flash('message', 'O usuário já esta em uso')
            return res.render('auth/register')
        }

        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        const user = {
            name,
            username,
            email,
            password: hashedPassword
        }

        try {
            const createdUser = await User.create(user)
            req.session.userid = createdUser.id
            req.flash('message', 'Cadastro realizado com sucesso')
            req.session.save(() => {
                res.redirect('/companies/dashboard')   
            })
            return 
        } catch(err) {
            console.log(err)
        }
    }
    
    static async logout(req, res) {
        req.session.destroy()
    }
} 


