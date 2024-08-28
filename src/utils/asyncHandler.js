// jaha bhi error wagire dene ka hoga waha ye wale function's ya utils k andar jo bhi function likhe hai ... us ko accordingly bulawa lena

const asyncHandler = (requestHandler)=>{
    return (req,res,next)=>{
        Promise
        .resolve(requestHandler(req,res,next))
        .catch((err)=> next(err))
    }
}

module.exports = asyncHandler        