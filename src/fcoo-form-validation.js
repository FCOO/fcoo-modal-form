/****************************************************************************
	fcoo-validation.js,

	(c) 2018, FCOO

	https://github.com/FCOO/fcoo-modal-form
	https://github.com/FCOO

****************************************************************************/

(function ($, window/*, document, undefined*/) {
	"use strict";

	//Create fcoo-namespace
	window.fcoo = window.fcoo || {};
    var ns = window.fcoo.form = window.fcoo.form || {};



    /********************************************************************************
    messages = { validator#1: {da:"...", en:"..."}, validator#2: {da:"...", en:"..."},... }
    The different messages for default validators
    ********************************************************************************/
    var messages = {
            notEmpty: {
                da: "Feltet skal udfyldes",
                en: "The field is required"
            },
            integer: {
                da: "Skal være et heltal",
                en: "Must be an integer"
            },
            between: {
                da: "Skal være mellem %s og %s",
                en: "Must be between %s and %s"
            },
            lessThan: {
                da: {default: "Skal være mindre eller lig %s", notInclusive: "Skal være mindre end %s"},
                en: {default: "Must be less than or equal to %s", notInclusive: "Must be less than %s"}
            },
            greaterThan: {
                da: {default: "Skal være større eller lig %s", notInclusive: "Skal være større end %s"},
                en: {default: "Must be greater than or equal to %s", notInclusive: "Must be greater than %s"}
            },
            stringLength: {
                da: {default: "Ugyldig længde", less: "Skal være mindre end %s tegn", more: "Skal være længere end %s tegn", between: "Skal være mellem  %s og %s tegn lang"},
                en: {default: "Invalid length", less: "Must be less than %s characters", more: "Must be more than %s characters", between: "Must be between %s and %s characters long"},
            }
    };

/*
        between: {default: "Please enter a value between %s and %s", notInclusive: "Please enter a value between %s and %s strictly"}
callback: {default: "Please enter a valid value"}
choice: {default: "Please enter a valid value", less: "Please choose %s options at minimum", more: "Please choose %s options at maximum", between: "Please choose %s - %s options"}
color: {default: "Please enter a valid color"}
creditCard: {default: "Please enter a valid credit card number"}
date: {default: "Please enter a valid date", min: "Please enter a date after %s", max: "Please enter a date before %s", range: "Please enter a date in the range %s - %s"}
different: {default: "Please enter a different value"}
digits: {default: "Please enter only digits"}
emailAddress: {default: "Please enter a valid email address"}
file: {default: "Please choose a valid file"}
greaterThan: {default: "Please enter a value greater than or equal to %s", notInclusive: "Please enter a value greater than %s"}
identical: {default: "Please enter the same value"}
integer: {default: "Please enter a valid number"}
lessThan: {default: "Please enter a value less than or equal to %s", notInclusive: "Please enter a value less than %s"}
notEmpty: {default: "Please enter a value"}
numeric: {default: "Please enter a valid float number"}
promise: {default: "Please enter a valid value"}
regexp: {default: "Please enter a value matching the pattern"}
remote: {default: "Please enter a valid value"}
stringLength: {default: "Please enter a value with valid length", less: "Please enter less than %s characters", more: "Please enter more than %s characters", between: "Please enter value between %s and %s characters long"}
uri: {default: "Please enter a valid URI"}
*/

    //Add all messages as default message
    function addMessage(id, message){
        $.each(message, function(lang, text){
            window.FormValidation.I18n[lang] = window.FormValidation.I18n[lang] || {};
            window.FormValidation.I18n[lang][id] = $.type(text) == 'string' ? {default:text} : text;
        });
    }
    $.each(messages, addMessage );

    /*********************************************************
    fcoo.form.addValidation( id, validate, message )
    Create a validator:
        id: identifier
        validate: validate-funtion = function(validator, $field, options) {
            * @param {FormValidation.Base} validator The validator plugin instance
            * @param {jQuery} $field The jQuery object represents the field element
            * @param {Object} options The validator options
            * @returns {Boolean}
            //You can get the field value
            var value = $field.val();
            //Perform validating and return true if the field value is valid otherwise return false
        },
        message: standard bs-text options. Can include onClick and icons
    *********************************************************/
    ns.addValidation = function( id, validate, message ){
        window.FormValidation.Validator[id] = {validate: validate, message: message};
    };


}(jQuery, this, document));

