/****************************************************************************
	fcoo-modal-form.js,

	(c) 2018, FCOO

	https://github.com/FCOO/fcoo-modal-form
	https://github.com/FCOO

****************************************************************************/

(function ($, window, document, undefined) {
	"use strict";

	//Create fcoo-namespace
	window.fcoo = window.fcoo || {};

    /********************************************************************************
    messages = { validator#1: {da:"...", en:"..."}, validator#2: {da:"...", en:"..."},... }
    The different messages for default validators
    ********************************************************************************/
    var messages = {
            notEmpty: {
                da: "Feltet skal udfyldes",
                en: "The field is required"
            },

    }


FormValidation.Validator.MYvalidatorName = {
        /**
         * @param {FormValidation.Base} validator The validator plugin instance
         * @param {jQuery} $field The jQuery object represents the field element
         * @param {Object} options The validator options
         * @returns {Boolean}
         */
        validate: function(validator, $field, options) {
            // You can get the field value
            // var value = $field.val();
            //
            // Perform validating
            // ...
            //
            // return true if the field value is valid
            // otherwise return false
return $field.val() == 'red';
        },

        message: {
            da: 'Skal være "red"',
            en: 'Must be "red"'
        }


    };



    /*****************************************************************
    ******************************************************************
    Extend $.BsModalForm.prototype with version of methods
    used for formValidation
    ******************************************************************
    ******************************************************************/
	$.extend($.BsModalForm.prototype, {

        /*******************************************************
        _addOnSubmit
        *******************************************************/
        _addOnSubmit: function( onSubmitFunc ){
//HER            this.$form.on('submit', onSubmitFunc ); //TODO Skal denne her bibeholdes???????????
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

                verbose: false,
            });

            this.formValidation = this.$form.data('formValidation');

            //Add event to translate
            this.$form.on('added.field.fv', $.proxy( this.translateMessage, this) );

            //Add events
            this.$form.on('success.form.fv', $.proxy( this.onSubmit, this ));
            this.$form.on('err.form.fv',     $.proxy( this.onError,  this )); //Not used at the moment

            this.$form.on('status.field.fv',    $.proxy( this.onFieldStatus,  this ));
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
                var validators = {};

                //this.options.validators = {validator#1: {...}, validator#2: {...},...}
                if ($.isPlainObject(bsModalInput.options.validators))
                    validators = bsModalInput.options.validators;
                else {
                    //this.options.validators = string or array of string/{id, options}
                    var validatorList = $.type(bsModalInput.options.validators) == 'string' ? bsModalInput.options.validators.split(' ') : bsModalInput.options.validators;
                    $.each( validatorList, function( index, validator ){
                        if ($.type(validator) == 'string'){
                            validators[validator] = {};
                            //Use message from FormValidation.Validator is exists
                            if (FormValidation.Validator[validator] && FormValidation.Validator[validator].message)
                                validators[validator].message = FormValidation.Validator[validator].message;
                        }
                        else
                            validators[validator.id] = validator.options;
                    });
                }
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
        translateMessage(e, data) - using i18n to dynaamic translate message
        *******************************************************/
        translateMessage: function( event, data ){
            $.each( data.options.validators, function( validator, validatorOptions ){
                var $messageElement = data.element.parents('.form-group').find('small[data-fv-validator="'+validator+'"]'),
                    message = validatorOptions.message || messages[validator];
                $messageElement.i18n(message);
                validatorOptions.message = null;
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
        onFieldStatus: function( /*event, data*/ ){
            this.$submitButton.toggleClass(
                'disabled',
                this.formValidation.isValid() == false
            );
        },

        /*******************************************************
        onFieldError = called when a field is invalid - NOT USED AT THE MOMENT
        *******************************************************/
        onFieldError: function( /*event, data*/ ){
        },

        /*******************************************************
        onError = called when the form is invalid - NOT USED AT THE MOMENT
        *******************************************************/
        onError: function( /*event, data*/ ){
        }
    });
}(jQuery, this, document));

/*
$(function() {
    $('#formTest').formValidation({
        framework: 'bootstrap4',
        autoFocus: false,
button: {
    // The submit buttons selector
    selector: '[type="submit"]:not([formnovalidate])', //TODO i modal: Select button outside form

    // The disabled class
    disabled: ''


},

   icon: {
//HER          valid: 'fa fa-check',
//HER          invalid: 'fa fa-times',
//HER          validating: 'fa fa-refresh',
//       feedback: '', //'_form-control-feedback'
            //      valid: 'fa fa-check',
            //      invalid: 'fa fa-times',
            //      validating: 'fa fa-refresh',
            //      feedback: 'form-control-feedback' <-
    },

//live: String — Live validating mode. Can be one of three values:

//live: 'enabled', // default	The plugin validates fields as soon as they are changed
//live: 'disabled', // Disable the live validating. The error messages are only shown after the form is submitted
live: 'submitted', // The live validating is enabled after the form is submitted


verbose: false,
//err: {
//    clazz: 'HER_form-control-feedback',
//},


        fields: {
            NIELS_ER_SMART: {
                validators: {
                    notEmpty: {
                        message: 'NIELS_ER_SMART is required'
                    }
                }
            },
            NIELS_ER_SMART3: {
                validators: {
                    notEmpty: {
                        message: 'NIELS_ER_SMART3 is required'
                    }
                }
            },
            TEST_SELECT: {
                validators: {
                    notEmpty: {
                        message: 'The %s is required'
                    }
                }
            },
            TEST_NAME: {
                validators: {
                    notEmpty: {
                        message: 'The %s is required'
                    },
                    stringLength: {
                        min: 6,
                        max: 30,
                        message: 'The name must be more than %s and less than %s characters long'
                    },
                    regexp: {
                        regexp: /^[a-zA-Z0-9_]+$/,
                        message: 'The name can only consist of alphabetical, number and underscore'
                    }
                }
            },
            TEST_DATE: {
                validators: {
                    notEmpty: {
                        message: 'The date is required'
                    },
                    numeric: {
                        message: 'The date must be a number'
                    }
                }
            },
            TEST_DATE2: {
                validators: {
                    notEmpty: {
                        message: 'The date2 is required'
                    },
                    numeric: {
                        message: 'The date2 must be a number'
                    }
                }
            }

        }
    })
});


*/