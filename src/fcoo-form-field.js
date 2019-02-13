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

