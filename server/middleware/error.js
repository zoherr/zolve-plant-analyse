const error = async (err, req, res, next) => {
    const status = 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({
        success: false,
        message: message
    });
}
export default error;
