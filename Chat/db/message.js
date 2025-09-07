import mongoose from "mongoose"


const messageSchema = new mongoose.Schema({
    text:String,
    name: String,
    createdAT: {
        type: Date,
        default: Date.now,
    }
})


export default mongoose.model("Message",messageSchema);