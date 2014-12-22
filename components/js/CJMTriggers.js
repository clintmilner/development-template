
// Action-Model Event Binders
$( document.body )
    // ================ FILTERS ==================
    .on( 'model-action', function( e, data, trigger )
    {
        if( e !== undefined ){ e.preventDefault(); }
    }
);
