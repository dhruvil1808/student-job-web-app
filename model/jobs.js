const mongoose = require("mongoose");
const schema = mongoose.Schema;

//creating a schema for saving data for each crop posted by farmer
const jobSchema = new schema(
    {
        recruiterName: { type: String, required: true },
        company: { type: String, required: true },
        category: { type: String, required: true },//internship full time etc.
        role: { type: String, required: true },
        description: { type: String, required: true },
        skills: { type: Array, required: true },
        experience: { type: String, required: true },
        salary: { type: String, required: true },
        startDate: { type: String, required: true },
        location: { type: String, required: true },
        duration: { type: String, required: true },
        vacancies: { type: String, required: true },// how many vacancies
        applicants: [{
            //student who applied for the job
            student: { type: String, required: false },
            studentid: { type: Array, required: false },
        }]
    },
    { timestamps: true }
);
const job = mongoose.model("job", jobSchema); //creating a model with schema
module.exports = { job };