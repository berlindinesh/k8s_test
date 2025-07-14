import mongoose from "mongoose";
// import bcrypt from 'bcryptjs'

const employeeSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
        },
    dob:{
        type:String,
        required:true
    },
    img:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true
    },
    department:{
        type:String,
        required:true
    },
    Emp_ID:{
        type:String,
        required:true
    }
        
})

const Employee = mongoose.model("Employee", employeeSchema)

export default Employee