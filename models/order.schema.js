import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        products: {
            type: [
                {
                    productId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Product",
                        required: true
                    }
                }
            ],
            required: true
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        address: {
            type: String,
            required: true
        },

        phoneNumber: {
            trpe: Number,
            required: true
        },

        amount: {
            type: Number,
            required: true
        },

        coupon: String,
        transactionId: String,

        status: {
            type: String,
            enum: ["ORDERED", "SHIPPED", "DELIVERED", "CANCELLED"],
            DEFAULT: "ORDERED",
        }
        
    },

    // Time stamps
    {
        timestamps: true
    }
)

export default mongoose.model("Order", orderSchema)