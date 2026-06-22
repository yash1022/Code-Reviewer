export const errorHandler = (err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message;

    console.log(message);

    return res.status(statusCode).json(
        {
            success:false,
            message:message
        }
    )

    
    

}

export default errorHandler;