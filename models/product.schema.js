import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            maxlength: [40, "Maximum 40 charactors are allowed"],
            required: [true, "Product name is required"],
            trim: true

        }
    },

    // Timestamps
    {
        timestamps: true
    }
)
export default mongoose.model("Product", productSchema)