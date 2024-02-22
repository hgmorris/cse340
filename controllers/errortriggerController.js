// Route that triggers a 500 error
const errortriggerController = {};

errortriggerController.throwError = async (req, res, next) => {
    try {
        // Simulating an error
        throw new Error("Server Error");
    } catch (error) {
        // Forwarding a custom error object to the next error handling middleware
        // This includes both the status code and the original error message
        next({ status: 500, message: error.message });
    }
};

module.exports = errortriggerController;

