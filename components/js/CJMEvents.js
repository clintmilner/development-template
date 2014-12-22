
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