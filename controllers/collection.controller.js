import Collection from '../models/collection.schema';
import asyncHandler from '../services/asyncHandler';
import customError from '../utils/customError';

export const createCollection = asyncHandler(async (req, res) => {
    // Take a name
    const {name} = req.body;

    // Send a error if name not found
    if(!name){
        throw new customError("Collection name is required", 400);
    }

    // Add to database
    const collection = await Collection.create({
        name
    })

    // Send a success response
    res.status(200).json({
        success: true,
        message: "Collection created success",
        collection

    })
})