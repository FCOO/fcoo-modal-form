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
