import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: [true, "Please provide a coupon code"], 
        },
        discount: {
            type: Number,
            default: 0
        },
        
            active: {
                type: Boolean,
                default: true
            }
        
    },

    // Timestapms
    {
        timestamps: true
    }
)

export default mongoose.model("Coupon", couponSchema)