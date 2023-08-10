const User = require('../models/User')
const Company = require('../models/Company')
const Releases = require('../models/Releases')
const _ = require('lodash')

function formatarData(data) {
    const dataObj = new Date(data);
    const dia = dataObj.getDate().toString().padStart(2, '0');
    const mes = (dataObj.getMonth() + 1).toString().padStart(2, '0');
    const ano = dataObj.getFullYear().toString();
    return `${dia}/${mes}/${ano}`;
}


module.exports = class ReleasesController {
    static async allReleases(req, res) {
        const id = req.params.id
        const companyName = await Company.findOne({where: {id: id}, raw: true})

        const company = await Company.findOne({
            where: {
                id: id
            },
            include: Releases,
            plain: true
        }) 

        const releases = company.Releases.map((result) => {
            return {
                ...result.dataValues,
                date: formatarData(result.dataValues.date),
            }
        })

        const valoresCreditAndDebit = company.Releases.reduce((acc, release) => {
            const { debt, credit, valor} = release.dataValues
            if (!acc.credit[credit]) {
                acc.credit[credit] = []
            }
            
            if (!acc.debt[debt]) {
                acc.debt[debt] = []
            }
            
            acc.credit[credit].push(valor)
            acc.debt[debt].push(valor)
            
            return acc;
        },{
            credit: {},
            debt: {},
        }
        )

        const valoresCredit = Object.entries(valoresCreditAndDebit.credit).map(([credit, valores]) => {
            const valoresNumeros = valores.map((valor) => parseFloat(valor));
            const totalValores = valoresNumeros.reduce((acc, valor) => acc + valor, 0);
            return {
              conta: credit, // Nome da conta
              tipo: 'crédito', // Especificação de crédito ou débito
              valores: totalValores,
            };
          });
          
          const valoresDebit = Object.entries(valoresCreditAndDebit.debt).map(([debt, valores]) => {
            const valoresNumeros = valores.map((valor) => parseFloat(valor));
            const totalValores = valoresNumeros.reduce((acc, valor) => acc + valor, 0);
            return {
              conta: debt, // Nome da conta
              tipo: 'débito', // Especificação de crédito ou débito
              valores: totalValores,
            };
          });

        const allAccounts = valoresCredit.concat(valoresDebit)

        const totalCredit = valoresCredit.reduce((acc, valor) => acc + valor.valores, 0);
        const totalDebit = valoresDebit.reduce((acc, valor) => acc + valor.valores, 0);

        console.log(id)

        res.render('releases/allreleases', { id, releases, companyName, allAccounts, totalCredit, totalDebit })
    }

    static async addReleases(req, res) {
        const id = req.params.id
        console.log(id)
        res.render('releases/addreleases' , {id})
    }

    static async addReleasespost(req, res) {
        const CompanyId = req.body.CompanyId;
        
        const { date, debt, credit, valor, description } = req.body

        if (!date) {
            req.flash('message', 'Preencha o campo da data')
            res.render('releases/addreleases', { id: CompanyId })
            return
        }

        if(date.length !== 10) {
            req.flash('message', 'Digite uma data válida')
            res.render('releases/addreleases', { id: CompanyId })
            return
        }

        if(!debt) {
            req.flash('message', 'Digite a conta que será debitada!')
            res.render('releases/addreleases', { id: CompanyId })
            return
        }

        if(!credit) {
            req.flash('message', 'Digite a conta que será creditada!')
            res.render('releases/addreleases', { id: CompanyId })
            return
        }

        if(!valor) {
            req.flash('message', 'Digite p valor do lançamento')
            res.render('releases/addreleases', { id: CompanyId })
            return
        }

        if(!description) {
            req.flash('message', 'Digite uma descrição para o histórico do lançamento')
            res.render('releases/addreleases', { id: CompanyId })
            return
        }

        const release = {
            CompanyId,
            date,
            debt: debt.toUpperCase(),
            credit: credit.toUpperCase(),
            valor,
            description: description.toUpperCase()
        }
        
        try {
            await Releases.create(release)
            console.log(release)
            req.flash('message', 'Lançamento adicionado com sucesso!');
            res.render('releases/addreleases', { id: CompanyId })
            
        } catch (err) {
            console.log(err)
            res.redirect('releases/addreleases', { id: CompanyId })
            
        }
        
    }
}