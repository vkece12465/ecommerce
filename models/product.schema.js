import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            maxlength: [60, "Product name maximum 60 charactors are allowed"],
            required: [true, "Product name is required"],
            trim: true

        },
        
        price: {
            type: Number,
            required: [true, "Please provide product price"],
            maxlength: [5, "Price should not go 5 digits"]
        },
        description: {
            type: String,
            // wysiwyg text editor for feature usages
        },
        photos: [
            {
                secure_url: {
                    type: String,
                    required: true
                }
            }
        ],
        stocks: {
            type: Number,
            default: 0
        },
        sold: {
            type: Number,
            default: 0
        },
        collectionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Collection"
        }
        
    },

    // Timestamps
    {
        timestamps: true
    }
)
export default mongoose.model("Product", productSchema)