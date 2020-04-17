const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data) {
    let errors = {};

    data.FirstName = !isEmpty(data.FirstName) ? data.FirstName : "";
    data.LastName = !isEmpty(data.LastName) ? data.LastName : "";
    data.Username = !isEmpty(data.Username) ? data.Username : "";
    data.Email = !isEmpty(data.Email) ? data.Email : "";
    data.PasswordOne = !isEmpty(data.PasswordOne) ? data.PasswordOne : "";
    data.PasswordTwo = !isEmpty(data.PasswordTwo) ? data.PasswordTwo : "";

    if (Validator.isEmpty(data.FirstName)) {
        errors.FirstName = "FirstName field is required";
    }

    if (Validator.isEmpty(data.LastName)) {
        errors.LastName = "LastName field is required";
    }

    if (Validator.isEmpty(data.Username)) {
        errors.Username = "Username field is required";
    }

    if (Validator.isEmpty(data.Email)) {
        errors.Email = "Email field is required";
    }
    if (!Validator.isEmail(data.Email)) {
        errors.Email = "Email is invalid";
    }

    if (Validator.isEmpty(data.PasswordOne)) {
        errors.PasswordOne = "Password field is required";
    }
    if (Validator.isEmpty(data.PasswordTwo)) {
        errors.PasswordOne = "Confirm password field is required";
    }
    if (!Validator.isLength(data.PasswordOne, { min: 6, max: 30 })) {
        errors.PasswordOne = "Password must be at least 6 characters";
    }
    if (!Validator.equals(data.PasswordOne, data.PasswordTwo)) {
        errors.PasswordTwo = "Passwords must match";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };

};