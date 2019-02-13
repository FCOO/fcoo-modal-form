/****************************************************************************
	fcoo-form-field.js,

	(c) 2019, FCOO

	https://github.com/FCOO/fcoo-modal-form
	https://github.com/FCOO

****************************************************************************/

(function ($, window/*, document, undefined*/) {
	"use strict";

	//Create fcoo-namespace
	window.fcoo = window.fcoo || {};
    var ns = window.fcoo.form = window.fcoo.form || {};



    /*********************************************************
    fcoo.form.field( id, type, options )
    Return the options for a FCOO Standard Field:
        id: identifier
        type: The name of the field type
        options: Both general options for the field (label etc.9 and special options for the specific field-type
    *********************************************************/
    ns.field = function( id, type, options ){
        var result = $.extend(true, options || {});
        result.id = id;


        return result;
    };


}(jQuery, this, document));


;
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


;
/****************************************************************************
	jquery-bootstrap-form.js,

    Extend $.BsModalForm.prototype with version of methods used for formValidation
****************************************************************************/

(function ($, window/*, document, undefined*/) {
	"use strict";

    //Extend $.BsModalForm.prototype
    $.extend($.BsModalForm.prototype, {
        /*******************************************************
        _addOnSubmit
        *******************************************************/
        _addOnSubmit: function( onSubmitFunc ){
            this.$form.on('success.form.fv', onSubmitFunc );
        },

        /*******************************************************
        _addValidation
        *******************************************************/
        _addValidation: function(){
            //Create the formValidation
            this.$form.formValidation({
                framework: 'bootstrap4',
                autoFocus: false,
                excluded : ':disabled',
                button: {}, //Using modal button instead
                icon  : {}, //No icon used
                //live: String — Live validating mode. Can be one of three values:
                //live: 'enabled', // default	The plugin validates fields as soon as they are changed
                //live: 'disabled', // Disable the live validating. The error messages are only shown after the form is submitted
                live: 'submitted', // The live validating is enabled after the form is submitted
                locale: window.i18next.language,
                verbose: false,
                addOns: {i18n: true}
            });

            this.formValidation = this.$form.data('formValidation');
            this.formValidation.setLocale(window.i18next.language);
            var _this = this;

            //Add event to change language
            window.i18next.on('languageChanged', function() {
                //Bug fix to get updated locale-option to i18n
                _this.$form.data('fv.addon.i18n.options', _this.formValidation.options),

                _this.formValidation
                    .setLocale(window.i18next.language)
                    .resetForm();
            });

            //Add event to update message as bsOptions ({text,icon,link,...}
            this.$form.on('added.field.fv', $.proxy( this.updateBsMessage, this) );

            //Add events
            this.$form.on('success.form.fv', $.proxy( this.onSubmit, this ));
            this.$form.on('err.form.fv',     $.proxy( this.onError,  this )); //Not used at the moment

            this.$form.on('status.field.fv', $.proxy( this.onFieldStatus,  this ));
            this.$form.on('err.field.fv',    $.proxy( this.onFieldError,  this )); //Not used at the moment
        },

        /*******************************************************
        _resetValidation
        *******************************************************/
        _resetValidation: function(){
            this.formValidation.resetForm(false);
        },

        /*******************************************************
        _addInputValidation
        *******************************************************/
        _addInputValidation: function( bsModalInput ){
            //Set onChange
            bsModalInput.getElement().on('change', $.proxy( bsModalInput.onChange, bsModalInput ));


            if (bsModalInput.options.validators){
                var validatorList = $.isArray(bsModalInput.options.validators) ?
                                    bsModalInput.options.validators :
                                    $.type(bsModalInput.options.validators) == 'string' ?
                                    bsModalInput.options.validators.split(' ') :
                                    [bsModalInput.options.validators],
                    validators = {};

                $.each( validatorList, function( index, validator ){
                    //validator = string or {validatorId#1: options1, validatorId#2: options2,...}
                    if ($.type(validator) == 'string')
                        validators[validator] = {};
                    else
                        $.each( validator, function( id, options ){ validators[id] = options; });
                });

                this.formValidation.addField( bsModalInput.options.id, {'validators': validators} );
            }
        },

        /*******************************************************
        _resetInputValidation
        *******************************************************/
        _resetInputValidation: function( bsModalInput ){
            this.formValidation.resetField(bsModalInput.options.id);
        },

        /*******************************************************
        _enableInputValidation
        *******************************************************/
        _enableInputValidation: function( bsModalInput, enabled ){
            bsModalInput.getFormGroup().toggleClass('fv-do-not-validate', !enabled);
        },


        /*******************************************************
        updateBsMessage(e, data)
        Using i18n to dynamic translate message set by window.fcoo.validation.add(...)
        *******************************************************/
        updateBsMessage: function( event, data ){
            $.each( data.options.validators, function( validator ){
                var $messageElement = data.element.parents('.form-group').find('small[data-fv-validator="'+validator+'"]'),
                    fixedMessage = window.FormValidation.Validator[validator].message;

                if (fixedMessage)
                    $messageElement
                        .empty()
                        ._bsAddHtml(fixedMessage);

            });
        },

        /*******************************************************
        onSubmit = called when the form is valid and submitted
        *******************************************************/
        onSubmit: function( event/*, data*/ ){
            this.options.onSubmit ? this.options.onSubmit( this.getValues() ) : null;
            this.$bsModal.modal('hide');

            event.preventDefault();
            return false;
        },

        /*******************************************************
        onFieldStatus = called when a field change its status
        *******************************************************/
        onFieldStatus: function(/* event, data */){
            var isValid = this.formValidation.isValid() === false;
            this.$submitButton.toggleClass('disabled', isValid);
            this.$form.parents('.modal-content').toggleClass('modal-has-warning', isValid);
        },

        /*******************************************************
        onFieldError = called when a field is invalid
        *******************************************************/
        onFieldError: function(/* event, data */){
            //NOT USED AT THE MOMENT
        },

        /*******************************************************
        onError = called when the form is invalid
        *******************************************************/
        onError: function(/* event, data */){
            //NOT USED AT THE MOMENT
        }
    });
}(jQuery, this, document));
