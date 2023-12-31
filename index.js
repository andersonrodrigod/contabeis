const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')
const handlebarsHelpers = require('handlebars-helpers')()
const handlebars = require('handlebars')


Object.keys(handlebarsHelpers).forEach(helperName => {
    handlebars.registerHelper(helperName, handlebarsHelpers[helperName]);
});


const app = express()


const conn = require('./db/conn')

const Company = require('./models/Company')
const User = require('./models/User')




const companiesRoutes = require('./routes/companies')
const authRoutes = require('./routes/authRoutes')
const homePage = require('./routes/homePage')
const releasesroutes = require('./routes/releases')


//const CompanyController = require('./controller/CompanyController')
const CompanyController = require('./controller/CompanyController')


app.engine('handlebars', exphbs.engine())
app.set("view engine", "handlebars")

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

app.use(
    session({
        name: "session",
        secret: "nosso_secret",
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: function() {},
            path: require('path').join(require('os').tmpdir(), 'sessions')
        }),
        cookie: {
            secure: false,
            httpOnly: true,
        },
    })
)

app.use(flash())

app.use(express.static("public"));

app.use((req, res, next,) => {
    if (req.session.userid) {
        res.locals.session = req.session
    } 
    
    next()
})

app.use('/companies', companiesRoutes)
app.use('/', authRoutes)
app.use('/releases', releasesroutes)

app.get('/', homePage)



conn
    //.sync({force: true})// >>> sempre que for usar esse comando prestar atenção pois pode apagar todos os dados geralmente é usado pra for
    .sync()
    .then(() => {
        app.listen(80)    
    })
    .catch((err) => console.log(err))