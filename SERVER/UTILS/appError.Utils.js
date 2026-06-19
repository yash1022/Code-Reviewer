class AppError extends Error{
    constructor(message = "Something went wrong", statusCode) {
        super(message);
        this.statusCode = statusCode;

    }
}

export {AppError}