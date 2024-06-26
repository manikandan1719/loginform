﻿$(document).ready(function () {
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    $('#firstName').val(getUrlParameter('Username'));
    $('#lastName').val(getUrlParameter('LastName'));
    var gender = getUrlParameter('Gender');
    if (gender === 'male') {
        $('#male').prop('checked', true);
    } else if (gender === 'female') {
        $('#female').prop('checked', true);
    }
    $('#email').val(getUrlParameter('useremail'));
    $('#age').val(getUrlParameter('Age'));
    $('#phonenumber').val(getUrlParameter('PhoneNumber'));
    $('#regpass').val(getUrlParameter('UserPassword'));

    $('#phonenumber').on('input', function () {
        $(this).val($(this).val().replace(/\D/, ''));
    });

    $(document).on('click', '#Btn', function () {
        register();
    });

    $(document).on('click', '#two', function () {
        window.location.href = window.location.origin + "/Login/index";
    });

    function register() {
        var LoginDetails = {
            FirstName: $('#firstName').val(),
            LastName: $('#lastName').val(),
            Email: $('#email').val(),
            Gender: $('input[name="gender"]:checked').val(),
            Age: $('#age').val(),
            Phonenumber: $('#phonenumber').val(),
            RegPassword: $('#regpass').val()
        };

        var validationErrors = validateLoginDetails(LoginDetails);

        if (validationErrors.length > 0) {
            displayValidationErrors(validationErrors);
            return;
        }

        var data = JSON.stringify(LoginDetails);
        console.log(data);
        var url = "/CreateAcc/signup";
        AjaxPost(url, data);
    }

    function validateLoginDetails(details) {
        var errors = [];

        if (!details.FirstName) {
            errors.push({ field: 'fnameError', message: "Firstname is required." });
        }
        if (!details.LastName) {
            errors.push({ field: 'LnameError', message: "Lastname is required." });
        }
        if (!details.Gender) {
            errors.push({ field: 'genderError', message: "Gender is required." });
        }
        if (!details.Email) {
            errors.push({ field: 'emailError', message: "Email is required." });
        } else if (!isValidEmail(details.Email)) {
            errors.push({ field: 'emailError', message: "Email is not valid." });
        }
        if (!details.Age) {
            errors.push({ field: 'ageError', message: "Age is required." });
        }
        if (!details.Phonenumber) {
            errors.push({ field: 'phError', message: "Number is required." });
        }
        if (!details.RegPassword) {
            errors.push({ field: 'passwordError', message: "Password is required." });
        } else if (details.RegPassword.length < 8) {
            errors.push({ field: 'passwordError', message: "Password must be at least 8 characters." });
        }

        return errors;
    }

    function isValidEmail(Email) {
        var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailPattern.test(Email);
    }

    function displayValidationErrors(errors) {
        $('.error').text('');

        errors.forEach(function (error) {
            $('#' + error.field).text(error.message);
        });
    }

    function AjaxPost(url, data) {
        $.ajax({
            type: "POST",
            url: url,
            contentType: "application/json",
            data: data,
            success: function (response) {
                console.log("Data sent successfully");
                if (response === "User already exists") {
                    alert("User already exists. Please sign in.");
                    window.location.href = "/Login/index";
                } else if (response === "User inserted successfully.") {
                    alert("Verification Sent to Your Email!!");
                    window.location.href = "/Login/index";
                } else {
                    alert("Unexpected response: " + response);
                }
            },
            error: function (error) {
                console.error("Error in data submission", error);
                alert("An error occurred. Please try again.");
            }
        });
    }
});
