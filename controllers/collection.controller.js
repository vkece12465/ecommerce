import Collection from '../models/collection.schema';
import asyncHandler from '../services/asyncHandler';
import customError from '../utils/customError';


/***********************
 * @CONTROLLER create a Controller
 * @Route http://localhost:4000/api/Controller
 * @Description created for new controller
 * @Parameter name, email, password
 * @Returns User Object
 ***********************/
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

// Update Collection
export const updateCollection = asyncHandler(async (req, res) => {
    // Exist value
    const {id: collectionId} = req.params

    // New value to be update
    const {name} = req.body

    // if No name throw error
    if(!name){
        throw new customError("Collection name is required", 400)
    }

    // Update collection by Id
    let updateCollection = await Collection.findByIdAndUpdate(
        collectionId,
        {name},
        {
            new: true,
            runValidators: true
        }
    )

    // If no collection throw new error
    if(!updateCollection){
        throw new customError("Collection is not found", 400)
    }

    // Send success message
    res.status(200).json({
        success: true,
        message: "Collection updated",
        updateCollection
    })
});

// Delete a collection
export const deleteCollection = asyncHandler(async (req, res) => {
    // Take id from front end
    const {id: collectionId} = req.params;

    // Check Id based on database and delete
    const collectionDelete = await Collection.findByIdAndDelete(collectionId);

    // Thow error peacefully
    if(!collectionDelete){
        throw new customError("Collection not found", 400)
    }

    /* Simple line code to remove
    collectionDelete.remove()
     */

    // Send response for success
    res.status(200).json({
        success: true,
        message: "Collection deleted Succefulle",

    })
})

// Collect all the collections
export const getAllCollections = asyncHandler(async (req,res) => {
    // find by collections
    const collections = await Collection.find()

    // Send a error if not found
    if(!collections){
        throw new customError("Collections not found",400)
    }
    
    // Send success response
    res.status(200).json({
        success: true,
        message: "Collections found",
        collections
    })

})