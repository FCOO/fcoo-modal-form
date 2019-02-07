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
            da: 'Skal være red',
            en: 'Must be red'
        }


    };


    var formId = 0,
        inputId = 0;


    var defaultOptions = {
            content: '',
            show      : false,
            closeText : {da:'Annullér', en:'Cancel'},
            submitIcon: 'fa-i-ok', //or original 'fa-check',
            submitText: {da:'Ok', en:'Ok'},
            buttons   : [], //Extra button between
            static    : true, //Only close modal-form on (X)
        };


    //BsModalinput = internal object representing an input-element in the form
    function _BsModalInput( options, modalForm ){
        this.options = options;
        this.modalForm = modalForm;
        this.options.userId = this.options.id;
        this.options.id = 'bsInputId' + inputId++;
    }


    _BsModalInput.prototype = {
        /*******************************************************
        getElement
        *******************************************************/
        getElement: function(){
            this.$element = this.$element || this.modalForm.$form.find( '#'+ this.options.id );
            return this.$element;
        },

        /*******************************************************
        getFormGroup
        *******************************************************/
        getFormGroup: function(){
            this.$formGroup = this.$formGroup || this.getElement().parents('.form-group').first();
            return this.$formGroup;
        },

        /*******************************************************
        setValue: function(value, validate){
        *******************************************************/
        setValue: function(value, validate){
            var $elem = this.getElement();
            switch (this.options.type || 'input'){
                case 'input'    : $elem.val( value );                   break;
                case 'select'   : $elem.val( value ).trigger('change'); break;
                case 'checkbox' : $elem.prop('checked', !!value );      break;
                //TODO case 'selectlist': ... break;
                //TODO case 'radio': ... break;
            }
            this.onChange();
            return validate ? this.validate() : this;
        },

        /*******************************************************
        getResetValue: function(){
        *******************************************************/
        getResetValue: function(){
            var result = null;
            switch (this.options.type || 'input'){
                case 'input'    : result = '';       break;
                case 'select'   : result = -1;       break;
                case 'checkbox' : result = false;    break;
                //TODO case 'selectlist': result = ... break;
                //TODO case 'radio': result = ... break;
            }
            return result;
        },

        /*******************************************************
        resetValue
        *******************************************************/
        resetValue: function( onlyResetValidation ){
            this.modalForm.formValidation.resetField(this.options.id);
            if (!onlyResetValidation)
                return this.setValue( this.getResetValue() );
        },

        /*******************************************************
        getValue: function(){
        *******************************************************/
        getValue: function(){
            var $elem = this.getElement(),
                result;
            switch (this.options.type || 'input'){
                case 'input'    : result = $elem.val();               break;
                case 'select'   : result = $elem.val();               break;
                case 'checkbox' : result = !!$elem.prop('checked');   break;
                //TODO case 'selectlist': ... break;
                //TODO case 'radio': ... break;
            }
            return result || this.getResetValue();
        },

        /*******************************************************
        addValidation - Add the validations - TODO
        *******************************************************/
        addValidation: function(){
            //Set onChange
            this.getElement().on('change', $.proxy( this.onChange, this ));


            if (this.options.validators){
                var validators = {};

                //this.options.validators = {validator#1: {...}, validator#2: {...},...}
                if ($.isPlainObject(this.options.validators))
                    validators = this.options.validators;
                else {
                    //this.options.validators = string or array of string/{id, options}
                    var validatorList = $.type(this.options.validators) == 'string' ? this.options.validators.split(' ') : this.options.validators;
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
                this.modalForm.formValidation.addField( this.options.id, {'validators': validators} );
            }
        },

        /*******************************************************
        validate
        *******************************************************/
        validate: function(){
            this.modalForm.formValidation.validateField( this.options.id );
            return this;
        },

        /*******************************************************
        onChange
        *******************************************************/
        onChange: function(){
            this.modalForm.showOrHide( this );
        },


        /*******************************************************
        showOrHide
        Show or hide the input if any of the id:value in options.showWhen or hideWhen exists
        *******************************************************/
        showOrHide: function( values ){
            if (this.options.showWhen || this.options.hideWhen){
                var show = !this.options.showWhen; //If showWhen is given default is false = not show
                $.each( this.options.hideWhen || {}, function( userId, value ){
                    if (values[userId] == value)
                        show = false;
                });
                $.each( this.options.showWhen || {}, function( userId, value ){
                    if (values[userId] == value)
                        show = true;
                });

                //Reset the validation if the filed is hidden
                if (!show){
                    this.getElement().prop('disabled', false);
                    this.resetValue( true );
                }

                this.getFormGroup().toggleClass('fv-do-not-validate', !show);
                this.getElement().prop('disabled', !show);
            }
            return this;
        },
    }; //End of BsModalInput.prototype


    /************************************************************************
    BsModalForm( options )
    options:
        content: json-object with full content
        onSubmit : function( values )
    ************************************************************************/
    function OLDBsModalForm( options ){
        var _this = this;
        this.options = $.extend(true, {}, defaultOptions, options );



        this.options.id = this.options.id || 'bsModalFormId' + formId++;

        //this.input = simple object with all input-elements. Also convert element-id to unique id for input-element
        this.inputs = {};

        var types = ['input', 'select', 'selectlist', 'checkbox', 'radio', 'table'];
        function setId( dummy, obj ){
            if ($.isPlainObject(obj) && (obj.type !== undefined) && (types.indexOf(obj.type) >= 0) && obj.id)
//HER                _this.inputs[obj.id] = new BsModalInput( obj, _this );
                _this.inputs[obj.id] = new $.BsModalInput( obj, _this );
            else
                if ($.isPlainObject(obj) || ($.type(obj) == 'array'))
                    $.each( obj, setId );
        }
        setId( 'dummy', this.options.content);

        //Create a hidden submit-button to be placed inside the form
        var $hiddenSubmitButton = $('<button type="submit" style="display:none"/>');

        //Add submit-button
        this.options.buttons.push({
            icon     : this.options.submitIcon,
            text     : this.options.submitText,
            className: 'primary min-width',
            focus    : true,
            onClick  : function(){ $hiddenSubmitButton.trigger('click'); }
        });

        this.options.show = false; //Only show using method edit(...)


        //Special version for forms with tabs
        if (this.options.content.type == 'tabs'){
            var $bsTabs =   $.bsTabs(this.options.content, true);

            //Create the form and move content inside the form
            $bsTabs._$contents.detach();
            this.$form =
                $('<form/>')
                    .append( $bsTabs._$contents );

            //Create the tabs-modal
            this.options.content = this.$form;
            this.$bsModal = $bsTabs.asModal( this.options );

        }
        else {

            //Create the form
            this.$form =
                $('<form/>')
                    ._bsAppendContent( this.options.content, this.options.contentContext, true );

            //Create the modal
            this.options.content = this.$form;
            this.$bsModal = $.bsModal( this.options );
        }

        //Append the hidden submit-button the the form
        this.$form.append( $hiddenSubmitButton );

        //Get the button used to submit the form
        var bsModalDialog = this.$bsModal.data('bsModalDialog'),
            $buttons = bsModalDialog.bsModal.$buttons;

        this.$submitButton = $buttons[$buttons.length-1];

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

        //Add the validations
        this._eachInput( function( input ){
console.log(2,input);
            input.addValidation();
        });

        //Add events
        this.$form.on('success.form.fv', $.proxy( this.onSubmit, this ));
        this.$form.on(    'err.form.fv', $.proxy( this.onError,  this )); //Not used at the moment

        this.$form.on('status.field.fv', $.proxy( this.onFieldStatus, this ));
        this.$form.on(   'err.field.fv', $.proxy( this.onFieldError,  this )); //Not used at the moment

        return this;
    }


    /*******************************************************
    Export to jQuery
    *******************************************************/
//HER    $.BsModalForm = BsModalForm;
//HER    $.bsModalForm = function( options ){
//HER        return new $.BsModalForm( options );
//HER    };

    /*******************************************************
    Extend the prototype
    *******************************************************/
//HER	$.BsModalForm.prototype = {
	$.extend($.BsModalForm.prototype, {

        /*******************************************************
        _addOnSubmit (*)
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
        _resetInputValidation (*)
        *******************************************************/
        _resetInputValidation: function( bsModalInput ){
            this.formValidation.resetField(bsModalInput.options.id);
        },

        /*******************************************************
        _enableInputValidation (*)
        *******************************************************/
        _enableInputValidation: function( bsModalInput, enabled ){
            bsModalInput.getFormGroup().toggleClass('fv-do-not-validate', !enabled);
        },








//HER        /*******************************************************
//HER        edit
//HER        *******************************************************/
//HER        edit: function( values, tabIndexOrId ){
//HER            this.$bsModal.show();
//HER
//HER            if (tabIndexOrId !== undefined)
//HER                this.$bsModal.bsSelectTab(tabIndexOrId);
//HER
//HER            this.setValues( values, false, true );
//HER
//HER            //Reset validation
//HER            this.$bsModal.find(':disabled').prop('disabled', false );
//HER            this.formValidation.resetForm(false);
//HER
//HER            this.showOrHide( null );
//HER
//HER        },

//HER        /*******************************************************
//HER        _eachInput
//HER        *******************************************************/
//HER        _eachInput: function( func ){
//HER            $.each( this.inputs, function( id, input ){
//HER                func( input );
//HER            });
//HER        },

//HER        /*******************************************************
//HER        setValue
//HER        *******************************************************/
//HER        setValue: function(id, value){
//HER            return this.inputs[id] ? this.inputs[id].setValue( value ) : null;
//HER        },

//HER        /*******************************************************
//HER        setValues
//HER        *******************************************************/
//HER        setValues: function(values, validate, restUndefined){
//HER            this._eachInput( function( input ){
//HER                var value = values[input.options.userId];
//HER                if ( value != undefined)
//HER                    input.setValue(value, validate);
//HER                else
//HER                    if (restUndefined)
//HER                        input.resetValue();
//HER            });
//HER        },

//HER        /*******************************************************
//HER        getValue
//HER        *******************************************************/
//HER        getValue: function(id){
//HER            return this.inputs[id] ? this.inputs[id].getValue() : null;
//HER        },

//HER        /*******************************************************
//HER        getValues
//HER        *******************************************************/
//HER        getValues: function(){
//HER            var result = {};
//HER            this._eachInput( function( input ){ result[input.options.userId] = input.getValue(); });
//HER            return result;
//HER        },


//HER        /*******************************************************
//HER        showOrHide - call showOrHide for all inputs except excludeInput
//HER        *******************************************************/
//HER        showOrHide: function( excludeInput ){
//HER            var values = this.getValues();
//HER            this._eachInput( function( input ){
//HER                if (input !== excludeInput)
//HER                    input.showOrHide( values );
//HER            });
//HER        },


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