import mongoose from 'mongoose';

const  collectionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide a category Name"],
            maxlength: [40, "Maximum 40 charactors are allowed"],
            trim: true
        }
    },

    // Time stamps
    {
        timestamps: true
    }
)

export default mongoose.model("Collection", collectionSchema)