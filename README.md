# fcoo-modal-form
>


## Description
Using [FCOO/jquery-bootstrap](https://github.com/FCOO/jquery-bootstrap) and [fcoo-form-validation](https://gitlab.com/FCOO/fcoo-form-validation) to create modal-forms with 
- validation using [FormValidation](https://formvalidation.io), and 
- input-mask using [RobinHerbots/Inputmask](https://github.com/RobinHerbots/Inputmask)


## Installation
### bower
`bower install https://github.com/FCOO/fcoo-modal-form.git --save`

## Demo
http://FCOO.github.io/fcoo-modal-form/demo/ 

## Usage

To add a validation to a field just add `validators:..` to the options for the field
To add an input-mask to a field just add `inputmask:..` to the options for the field

 `validators` can be a `string` with the name of the standard validator or a record with `{validatorId: options}` or an array of either

`inputmask` must be a options-record. See [RobinHerbots/Inputmask](https://github.com/RobinHerbots/Inputmask) for details.

### Example
To validate a field to be not empty and an integer between 0 and 10: 

    {
        id:'formId1', 
        type:'input',
        validators:['notEmpty', 'integer', {between: {min:0, max:10}}], 
        ...
    }

To have a input-mask for (American) phone number:

    {
        id:'formId2', 
        type:'input',
        inputmask:{"mask": "(999) 999-9999"}, 
        ...
    }


 
## Validation

### Standard validation
The following [Validators from FormValidation](https://formvalidation.io/guide/validators/) has been included 
- [`between`](https://formvalidation.io/guide/validators/between/)
- [`greaterThan`](https://formvalidation.io/guide/validators/greater-than/): `greaterThan: {value:Number, inclusive:Boolean}` 
- [`lessThan`](https://formvalidation.io/guide/validators/less-than/): `lessThan: {value:Number, inclusive:Boolean}` 
- [`integer`](https://formvalidation.io/guide/validators/integer/)
- [`notEmpty`](https://formvalidation.io/guide/validators/not-empty/)
- [`stringLength`](https://formvalidation.io/guide/validators/string-length/)



### User defined validator

To create your own validator and be able to use the full options of [jquery-bootstrap](https://github.com/FCOO/jquery-bootstrap) to create the error-message (ex. icons, links etc) add a validator using 

    window.fcoo.form.addValidation = function( id, validate, message )
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

#### Example (from demo)
    window.fcoo.addValidation(
        'must_be_red',
        function(validator, $field, options) { return $field.val() == 'red';},
        [{
            text: {
                da: 'Skal være "red"',
                en: 'Must be "red"'
            }
        },{
            text: 'info',
            onClick: function(){ alert('red som i rød'); }
        }]
    );

## Input-mask

### Standard input-mask

*** NOT READY ***

## FCOO Standard Fields (** NOT IMPLEMENTED **)  

A number of standard fields is defined in namespace `window.fcoo.form` using the method `field(id, type, options)` 

### Example
    [ 
        fcoo.form.field( "id1", "moment", {label:{da:"Dato", en:"Date"}}),
        {id:"id2", type:"select", ...},
        fcoo.form.field( "id3", "email", {label:"E-mail"}),
        ...
    }

### `type:"moment"`

### `type:"MANGLER"`


<!-- 
### options
| Id | Type | Default | Description |
| :--: | :--: | :-----: | --- |
| options1 | boolean | true | If <code>true</code> the ... |
| options2 | string | null | Contain the ... |

### Methods

    .methods1( arg1, arg2,...): Do something
    .methods2( arg1, arg2,...): Do something else

 -->

## Copyright and License
This plugin is licensed under the [MIT license](https://github.com/FCOO/fcoo-modal-form/LICENSE).

Copyright (c) 2019 [FCOO](https://github.com/FCOO)

## Contact information

Niels Holt nho@fcoo.dk
