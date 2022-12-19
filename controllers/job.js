//controller for job management
const { Student, Recruiter } = require('../model/credentials');
const { job } = require('../model/jobs');
module.exports = {
    //upload new job
    postJob: (req, res) => {
        //convert string to array
        const postjob = new job(req.body);
        postjob.recruiterName = req.user.name;
        postjob
            .save()
            .then(async (result) => {
                //get all the jobs posted by recruiter and update the recruiter model with new job
                alljobs = await job.find({ recruiterName: req.user.name }).sort({ createdAt: -1 });
                await Recruiter.findOneAndUpdate({ name: req.user.name }, { $push: { jobs: postjob._id } });
                res.render("sell", { title: req.user.name, jobs: alljobs, alrt: "job Posted Successfully" });
            }
            )
            .catch(() => {
                res.render("404", { title: "404 Error" });
            }
            );
    },
    //apply job
    applyJob: async (req, res) => {
        try {
            const id = req.params.id;
            const name = req.user.name;
            const applicant = req.body.applicant;
            if (name === "applicants") {
                res.redirect("/applicants/" + id);
            }
            else {
                var obj = await job.findOne({ _id: id });
                var temp;
                //check if already applied
                for (var i = 0; i < obj.applicants.length; i++) {
                    //if applicants contains the name of student
                    if (obj.applicants[i].student === name) {
                        //already applied
                        temp = 1;
                        break;
                    }
                }
                //get the student by name
                var result = await Student.findOne({ name: name });
                //if the student has not already applied
                if (result != null && temp != 1) {
                    //make a new object to push in applicants array
                    var x = {
                        student: result.name,
                        studentid: result._id,
                    };
                    //push the object in applicants array
                    var result2 = await job.findByIdAndUpdate(id, { $push: { applicants: x } });
                    //push the job id in student model
                    var x = {
                        job: result2._id,
                    };
                    var result = await Student.findOneAndUpdate({ name: name }, {
                        $push: {
                            applicants: x
                        }
                    });
                    //if the applicants push is successful
                    if (result2 != null) {
                        alljobs = await job.find({}).sort({ name: -1 });
                        res.render("buy", { jobs: alljobs, title: name, alrt: "Applied Successfully" });
                    }
                    //if the applicants push is not successful
                    else {
                        alljobs = await job.find({}).sort({ name: -1 });
                        res.render("buy", { jobs: alljobs, title: name, alrt: "Applied Unsuccessful" });
                    }
                }
                else {
                    //if the student has already applied
                    if (temp == 1) {
                        alljobs = await job.find({}).sort({ name: -1 });
                        res.render("buy", { jobs: alljobs, title: name, alrt: "Already Applied" });
                    }
                    //if the student is not found
                    else {
                        alljobs = await job.find({}).sort({ name: -1 });
                        res.render("buy", { jobs: alljobs, title: name, alrt: "Application Failed" });
                    }
                }
            }
        }
        catch (err) {
            res.render("404", { title: "404 Error" });
        }
    },
    //view jobs available with filters for applyer
    applySearch: async (req, res) => {
        try {
            const { search } = req.query;
            const name = req.user.name;
            //find the jobs with the search query
            alljobs = await job.find({ $or: [{ role: search }, { location: search }, { recruiterName: search }, { salary: search }, { vacancies: search }, { category: search }, { startDate: search }, { duration: search }] }).sort({ createdAt: -1 });
            if (alljobs != null) {
                res.render("buy", { jobs: alljobs, title: name, alrt: "" });
            }
            //if no jobs found for the search query
            else {
                res.render("buy", { jobs: alljobs, title: name, alrt: "No results" });
            }
        }
        catch (err) {
            res.render("404", { title: "404 Error" });
        }
    },
    //view jobs available with filters for seller
    postSearch: async (req, res) => {
        try {
            const { search } = req.query;
            const sellername = req.user.name;
            //find the jobs with the search query
            alljobs = await job.find({ $or: [{ role: search }, { location: search }, { recruiterName: search }, { salary: search }, { vacancies: search }, { category: search }, { startDate: search }, { duration: search }] }).sort({ createdAt: -1 });
            if (alljobs != null) {
                res.render("sell", { jobs: alljobs, title: sellername, alrt: "" });
            }
            //if no jobs found for the search query
            else {
                res.render("sell", { jobs: alljobs, title: sellername, alrt: "No results" });
            }
        }
        catch (err) {
            res.render("404", { title: "404 Error" });
        }
    },
    //view all jobs available for all users 
    jobs: async (req, res) => {
        try {
            const id = req.params.id;
            const result = await job.findById(id);
            //if the job is found and has applicants
            if (result != null && result.applicants.length > 0) {
                var obj = result.applicants.sort();
                obj = obj.reverse();
                if (obj != [] && obj != null) {
                    res.render("jobs", { applicants: obj, job: result, title: "Jobs", alrt: "" });
                }
            }
            //if the job is found but has no applicants
            else {
                obj = [{ length: 0 }];
                res.render("jobs", { applicants: obj, job: result, title: "Jobs", alrt: "No Applicants" });
            }
        }
        //if the job is not found
        catch (err) {
            res.render("404", { title: "404 Error" });
        }
    },
    //view all jobs available for the applyer
    jobsForApplier: async (req, res) => {
        try {
            const id = req.params.id;
            const name = req.user.name;
            //find the job by id
            const result = await job.findById(id);
            //if the job is found and has applicants
            if (result != null && result.applicants.length > 0) {
                var obj = result.applicants.sort(function (a, b) { return a.amount - b.amount });
                obj = obj.reverse();
                if (obj != [] && obj != null) {
                    res.render("jobs", { applicants: obj, job: result, title: "Applicants", alrt: "" });
                }
            }
            //if the job is found but has no applicants
            else {
                obj = [{ length: 0 }];
                res.render("jobs", { applicants: obj, job: result, title: "Applicants", alrt: "No applicants" });
            }
        }
        catch (err) {
            res.render("404", { title: "404 Error" });
        }
    },
    //view all jobs available for the seller
    jobsForRecruiter: async (req, res) => {
        try {
            const id = req.params.id;
            const name = req.user.name;
            const result = await job.findById(id);
            //if the job is found and has applicants
            if (result != null && result.applicants.length > 0) {
                var obj = result.applicants.sort(function (a, b) { return a.amount - b.amount });
                obj = obj.reverse();
                if (obj != [] && obj != null) {
                    res.render("jobs", { applicants: obj, job: result, title: name, alrt: "" });
                }
            }
            //if the job is found but has no applicants
            else {
                obj = [{ length: 0 }];
                res.render("jobs", { applicants: obj, job: result, title: name, alrt: "No applicants" });
            }
        }
        catch (err) {
            res.render("404", { title: "404 Error" });
        }
    },
}