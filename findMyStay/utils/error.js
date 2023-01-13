class ExpressError extends Error{
    constructor(message,statusCode){
        super();
        this.messaage=message;
        this.statusCode=statusCode;
    }
}

module.exports=ExpressError;