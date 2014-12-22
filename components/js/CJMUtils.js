
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




