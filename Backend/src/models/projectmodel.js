import mongoose from "mongoose";


const projectSchema = new mongoose.Schema({
    Projectname:{
        type: String,
        required: true
    },
   
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    users:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
    
})
const  Project  =  mongoose.model("Project", projectSchema)

export default Project

