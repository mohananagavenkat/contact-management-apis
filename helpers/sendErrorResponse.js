module.exports = (res,status,error) => {
    return res.status(status).json({
        status:false,
        error:error
    });
}