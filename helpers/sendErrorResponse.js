module.exports = (res,status,error,data) => {
    const finalResponse = {};
    if(typeof error === "object"){
        error = error.message;
    }
    if (data != undefined && data != null && data ){
        finalResponse["data"] = data;
    }
    finalResponse["status"] = false;
    finalResponse["error"] = error;
    return res.status(status).json(finalResponse);
}