const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateLoginInput(data) {
    let errors = {};
// Convert empty fields to an empty string so we can use validator functions
    data.Username = !isEmpty(data.Username) ? data.Username : "";
    data.Password = !isEmpty(data.Password) ? data.Password : "";

// Email checks
    if (Validator.isEmpty(data.Username)) {
        errors.Username = "Username field is required";
    }
// Password checks
    if (Validator.isEmpty(data.Password)) {
        errors.Password = "Password field is required";
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
};