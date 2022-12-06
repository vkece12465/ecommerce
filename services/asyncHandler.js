// Higher Order function
const asyncHandler = (fn) => async (req, res, next) => {
    try {
    await fn(req, res, next)
    } catch (err) {
        res.status(err.code || 4000).json({
            success: true,
            message: err.message
        })
    }
}

export default asyncHandler


// Another way of basic async code
/* function asyncHandler(fn){
    return async function(req, res, next){
        try {
            await fn(req, res, next)
        } catch (err) {
            res.status(err.code || 4000).json({
                success: true,
                message: err.message
            })
        }
    }
}
export default asyncHandler */
