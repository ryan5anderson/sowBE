const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI)
        console.log(`Connected to MongoDB database: ${mongoose.connection.name}`)
        console.log(`MongoDB URI: ${process.env.DATABASE_URI.split('@')[1]}`) // Show cluster info without credentials
    } catch (err) {
        console.log(err)
    }
}

module.exports = connectDB