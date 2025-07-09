import moongoose from "mongoose";

const conectDB =async()=>{
    try {
        const connection = await moongoose.connect(process.env.MONGO_URL)
        console.log(`MongoDB connected: ${connection.connection.host}`);
        
    } catch (error) {
        console.log(error.message);
        process.exit(1);
        
    }
}

export default conectDB