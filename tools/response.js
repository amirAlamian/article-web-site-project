class Response {
    constructor(status, message, date) {
        this.status = status;
        this.message = message;
        this.modified_time = date;
    }
}


module.exports=Response;