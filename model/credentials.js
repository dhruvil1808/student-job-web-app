const mongoose = require("mongoose");
const schema = mongoose.Schema; //create a schema

//creating a schema for saving the data of different student
const userSchema1 = new schema(
    {
        student_image: {
            data: Buffer,
            contentType: String,
            required: false
        },
        name: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        pno: { type: String, required: true },
        dob: { type: String, required: true },

        aadhar: { type: String, required: false },
        school: { type: String, required: false },
        board: { type: String, required: false },
        state: { type: String, required: false },
        marks10: { type: String, required: false },
        marks12: { type: String, required: false },

        college: { type: String, required: false },
        branch: { type: String, required: false },
        year: { type: String, required: false },
        cgpa: { type: String, required: false },
        skills: { type: Array, required: false },
        experience: { type: Array, required: false },

        applied: {
            type: Array, required: false
        },
    },
    { timestamps: true }
);
//creating a schema for saving the data of different recruiter.
const userSchema2 = new schema( //creating a schema
    {
        recruiter_image: {
            data: Buffer,
            contentType: String,
            required: false
        },
        company: { type: String, required: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
        pno: { type: String, required: true },
        dob: { type: String, required: true },
        password: { type: String, required: true },

        address: { type: String, required: false },
        jobs: { type: Array, required: false },
    },
    { timestamps: true }
);
const Student = mongoose.model("student", userSchema1); //creating a model with schema
const Recruiter = mongoose.model("recruiter", userSchema2); //creating a model with schema
module.exports = { Student, Recruiter };
