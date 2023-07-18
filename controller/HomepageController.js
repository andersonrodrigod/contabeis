


module.exports = class HomepageController {
    static async showHome(req, res) {
        res.render('homepage/home')
    }
}