//controller for user management
const { Student, Recruiter } = require('../model/credentials');
const { job } = require('../model/jobs');
const passport = require('passport');
const initializePassport = require('../middleware/passport');
const bcrypt = require('bcrypt');
//function to find user by name
async function findUserByName(name) {
    var result = await Student.findOne({ email: name });
    if (result == null) {
        result = await Recruiter.findOne({ pno: name })
    }
    return result;
}
//function to find user by user id
async function findUserByID(id) {
    var result = await Student.findById(id);
    if (result == null) {
        result = await Recruiter.findById(id)
    }
    return result;
}

initializePassport(passport, (search1 => findUserByName(search1)), (id => findUserByID(id)));

module.exports = {
    //create a buyer user
    createStudent: async (req, res) => {
        try {
            const student = new Student(req.body);
            //hash the password
            const hashedPassword = await bcrypt.hash(student.password, 10);
            //set the password to hashed password
            student.password = hashedPassword;
            //save the student
            student
                .save()
                .then((result) => {
                    res.render("signin", {
                        title: "Horizon",
                        alrt: "User Created Successfully",
                    });
                })
                .catch((err) => {
                    res.render("404", { title: "404 Error" });
                });
        }
        catch (err) {
            res.render("404", { title: "404 Error" });
        }
    },
    //create a farmer user
    createRecruiter: async (req, res) => {
        try {
            const selleruser = new Recruiter(req.body);
            //hash the password
            const hashedPassword = await bcrypt.hash(selleruser.password, 10);
            //set the password to hashed password
            selleruser.password = hashedPassword;
            //save the recruiter
            selleruser
                .save()
                .then((result) => {
                    res.render("signin", {
                        title: "Horizon",
                        alrt: "User Created Successfully",
                    });
                })
                .catch((err) => {
                    console.log(err);
                    res.render("404", { title: "404 Error" });
                });
        }
        catch (err) {
            res.render("404", { title: "404 Error" });
        }
    },
    //login user
    login: async (req, res) => {
        //check if user is recruiter or student and redirect to respective page 
        //by checking if req.user has company or not
        if (req.user.company == undefined) {
            res.render('buy', { user: req.user, title: req.user.name, jobs: await job.find({}), alrt: "" });
        }
        else {
            res.render('sell', { user: req.user, title: req.user.name, jobs: await job.find({}), alrt: "" });
        }
    }
}