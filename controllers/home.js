//controler for home page
const { job } = require('../model/jobs');
module.exports = {
    //render home page with all job info
    index: async (req, res) => {
        try {
            alljobs = await job.find({}).sort({ createdAt: -1 });
            res.render('home.ejs', { jobs: alljobs, title: 'Horizon', alrt: '' });
        }
        catch (err) {
            res.render("404", { title: "404 Error" });
        }
    },
    //render signup page according to user type
    signup: (req, res) => {
        var val = req.params.value;
        if (val == 1) {
            res.render('signup_recruiter.ejs', { title: 'Create Recruiter account', alrt: '', value: val });
        }
        else if (val == 2) {
            res.render('signup_student.ejs', { title: 'Create Student account', alrt: '', value: val });
        }
    },
    //render signin page
    signin: (req, res) => {
        res.render('signin.ejs', { title: 'Sign In', alrt: '' });
    },
    //render about page
    about: (req, res) => {
        res.render('about.ejs', { title: 'About', alrt: '' });
    },
    //view jobs available with filters on the home page
    search: async (req, res) => {
        try {
            const { search } = req.query;
            //find the jobs with the search query
            alljobs = await job.find({ $or: [{ role: search }, { location: search }, { recruiterName: search }, { salary: search }, { vacancies: search }, { category: search }, { startDate: search }, { duration: search }] }).sort({ createdAt: -1 });
            res.render('home.ejs', { jobs: alljobs, title: 'Horizon', alrt: '' });
        }
        catch (err) {
            res.render("404", { title: "404 Error" });
        }
    },
}