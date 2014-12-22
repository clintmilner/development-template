(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var CJMUtils = function()
{
    // Event Delegation
    $( document.body )
        .on( 'click', '*[data-model][data-action]', function( e )
        {
            var Irene = $( this ),
                data = Irene.data(),
                eventTypes = data.events ? data.events : 'click',
                regExp = new RegExp('(^|\\s)' + e.type + '(\\s|$)');

            if ( regExp.test( eventTypes ) )
            {
                Irene.trigger( data.action + '-' + data.model, [ data, e ] );
            }
        }
    );

}();






var CJMEvents = ( function()
{
    var $html = $( 'html' );

    return {
        init: function()
        { 
            $html.removeClass( 'no-js' ).addClass( 'js' );
            console.log( 'init called' );
        }
    };
})();

// Action-Model Event Binders
$( document.body )
    // ================ FILTERS ==================
    .on( 'model-action', function( e, data, trigger )
    {
        if( e !== undefined ){ e.preventDefault(); }
    }
);

},{}]},{},[1])