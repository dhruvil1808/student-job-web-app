//controller for user settings
const { Student, Recruiter } = require('../model/credentials');
const { job } = require('../model/jobs');
const bcrypt = require('bcrypt');
module.exports = {
    //render user settings page
    setting: async (req, res) => {
        try {
            const username = req.user.name;
            var result = await Student.findOne({ name: username });
            if (result == null) {
                result = await Recruiter.findOne({ name: username });
            }
            res.render("settings", { title: "Preferences", user: result });
        }
        catch (err) {
            res.render("404", { title: "404 Error" });
        }
    },
    //render reset password page
    reset: (req, res) => {
        res.render('reset.ejs', { title: 'Reset Password', alrt: '' });
    },
    //reset password
    resetPassword: async (req, res) => {
        try {
            const name = req.body.email;
            const birth = req.body.dob;
            const HashedPassword = await bcrypt.hash(req.body.password, 10);
            var result2;
            const result = await Student.findOneAndUpdate(
                { email: name, dob: birth },
                { password: HashedPassword }
            );
            if (result == null) {
                result2 = await Recruiter.findOneAndUpdate(
                    { aadhar: name, dob: birth },
                    { password: HashedPassword }
                );
            }
            if (result != null) {
                Student.password = res.password;
                res.render("signin", {
                    title: "Horozon",
                    alrt: "Password Reset",
                });
            }
            else if (result2 != null) {
                Recruiter.password = res.password;
                res.render("signin", {
                    title: "Horizon",
                    alrt: "Password Reset",
                });
            } else {
                res.render("signin", { title: "Horizon", alrt: "Password Reset" });
            }
        }
        catch (err) {
            res.render("404", { title: "404 Error" });
        }
    },
    //render update user details page
    resetDetails: async (req, res) => {
        try {
            const username = req.user.name;
            var result = await Student.findOne({ name: username });
            if (result == null) {
                result = await Recruiter.findOne({ name: username });
            }
            if (result != null) {
                res.render("reset-data", { title: "Reset Details", user: result });
            }
        }
        catch (err) {
            res.render("404", { title: "404 Error" });
        }
    },
    //update user details
    resetData: async (req, res) => {
        try {
            console.log(req.body);
            var alljobs = await job.find({}).sort({ createdAt: -1 });
            const username = req.params.username;
            var result = await Student.findOneAndUpdate(
                { name: username },
                {
                    name: req.body.name,
                    aadhar: req.body.aadhar,
                    dob: req.body.dob,
                    pno: req.body.pno,
                }
            );
            if (result == null) {
                result = await Recruiter.findOneAndUpdate(
                    { name: username },
                    {
                        name: req.body.name,
                        aadhar: req.body.aadhar,
                        dob: req.body.dob,
                        pno: req.body.pno,
                    }
                );
                if (result != null) {
                    Recruiter.email = res.email;
                    Recruiter.dob = res.dob;
                    Recruiter.pno = res.pno;
                    Recruiter.username = res.username;
                    res.render("home", {
                        jobs: alljobs,
                        title: "Horizon",
                        alrt: "Data Reset",
                    });
                } else {
                    res.render("home", { jobs: alljobs, title: "horizon", alrt: "No such User" });
                }

            }
            else {
                if (result != null) {
                    Student.email = res.email;
                    Student.dob = res.dob;
                    Student.pno = res.pno;
                    Student.username = res.username;
                    res.render("home", {
                        jobs: alljobs,
                        title: "Horizon",
                        alrt: "Data Reset",
                    });
                } else {
                    res.render("home", { jobs: alljobs, title: "Horizon", alrt: "No such User" });
                }
            }
        }
        catch (err) {
            res.render("404", { title: "404 Error" });
        }
    },
    //render delete user page
    delete: async (req, res) => {
        try {
            const username = req.user.name;
            res.render("delete", { title: "Delete Account", username: username });
        }
        catch (err) {
            res.render("404", { title: "404 Error" });
        }
    },
    //delete user
    deleteUser: async (req, res) => {
        try {
            const username = req.body.username;
            const pass = req.body.password;
            const HashedPassword = await bcrypt.hash(pass, 10);
            //finding the type of user
            var result = await Recruiter.findOneAndDelete({
                name: username,
                password: HashedPassword,
            });
            if (result == null) {
                result = await Student.findOneAndDelete({
                    name: username,
                    password: HashedPassword,
                });
                //if it is buyer user
                if (result != null) {
                    //delete all the bids of the user from job data
                    result.bids.forEach(async (x) => {
                        var temp = await job.findOne({ _id: x.job });
                        var res = [];
                        temp.bids.forEach((y) => {
                            if (y.buyer != username) {
                                res.push(y);
                            }
                        }
                        );
                        await job.findByIdAndUpdate(x.job, { bids: res });
                    });
                    var alljobs = await job.find({}).sort({ createdAt: -1 });
                    res.render('home.ejs', { jobs: alljobs, title: 'Horizon', alrt: 'User Deleted' });
                }
                else {
                    var alljobs = await job.find({}).sort({ createdAt: -1 });
                    res.render('home.ejs', { jobs: alljobs, title: 'Horizon', alrt: 'User not Deleted' });
                }
            }
            //if it is farmer user
            else {
                //delete all jobs of the farmer
                result.jobs.forEach(async (x) => {
                    await job.findByIdAndDelete(x._id);
                });
                if (result != null) {
                    var alljobs = await job.find({}).sort({ createdAt: -1 });
                    res.render('home.ejs', { jobs: alljobs, title: 'Horizon', alrt: 'User Deleted' });
                } else {
                    var alljobs = await job.find({}).sort({ createdAt: -1 });
                    res.render('home.ejs', { jobs: alljobs, title: 'Horizon', alrt: 'User not Deleted' });
                }
            }
        }
        catch (err) {
            res.render("404", { title: "404 Error" });
        }
    },
    //user logout
    logout: (req, res) => {
        req.logout(function (err) {
            if (err) { return next(err); }
            res.redirect('/login');
        });
    }
}