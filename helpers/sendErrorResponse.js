module.exports = (res,status,error) => {
    if(typeof error === "object"){
        error = error.message;
    }
    return res.status(status).json({
        status:false,
        error:error
    });
}