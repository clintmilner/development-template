(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

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





var underscoreMixin = function()
{
    _.mixin({
        compileTemplate: function( scope, template, model ){
            if ( typeof scope === "object" && typeof template === "string" && typeof model === "object" )
            {
                var currentTemplate = scope[ template ];
                if ( typeof currentTemplate === "function" )
                {
                    return currentTemplate( model );
                }
                else
                {
                    throw new Error( 'fetchTemplates must be called before compileTemplate' );
                }
            }
        },
        fetchTemplates: function( templates, hash, callback ){
            var compiled = {};
            if ( !hash ) { hash = ""; } else { hash = "?hash="+hash; }
            _.each( templates, function( url, name ){
                $.ajax({
                    url: url+hash,
                    success: function( template ){
                        compiled[ name ] = _.template( template.replace( /\r\n|\r\n\s|\r|\r\s|\n|\n\s|\s{2}/g, '') );
                    },
                    dataType: 'text'
                });
            });
            if ( typeof callback === "function" )
            {
                callback( compiled );
            }
            return compiled;
        },
        removeWhitespace: function( string ){
            return string.replace( /\r\n|\r\n\s|\r|\r\s|\n|\n\s|\s{2}/g, '');
        },
        fetchTemplate: function( templatePath, hash, callback ){
            if ( templatePath === undefined || typeof templatePath !== 'string' || templatePath.trim() === '' ) {
                throw new Error("Underscore Mixin: fetchTemplate() requires templatePath as a non-empty String.");
            }
            if ( hash === undefined ) { hash = ""; }
            if ( typeof callback !== 'function' ) { callback = function(){}; }
            $.ajax({
                url: templatePath+hash,
                success: function( template ){
                    callback( _.template( template.replace( /\r\n|\r\n\s|\r|\r\s|\n|\n\s|\s{2}/g, '') ) );
                },
                dataType: 'text'
            });
        }
    });

    // Underscore.js Template Rendering
    window.Template = function( path, hash )
    {
        this.isFetching = false;
        this.onReady = [];
        this.path = path;
        this.hash = hash;
        this._render = null;
    };
    window.Template.prototype.preload = function()
    {
        var self = this;
        if ( self._render === null )
        {
            _.fetchTemplate(
                self.path,
                self.hash,
                function( renderMethod )
                {
                    self._render = renderMethod;
                    for ( var i = 0, l = self.onReady.length; i < l; i++ )
                    {
                        self.onReady[i].call( self );
                    }
                    self.onReady.length = 0;
                }
            );
        }
        return self;
    };
    window.Template.prototype.render = function( data, callback )
    {
        var self = this;
        if ( self._render === null )
        {
            self.onReady.push(
                function(){
                    callback( self._render( data ) );
                }
            );

            if ( !self.isFetching )
            {
                self.isFetching = true;
                self.preload();
            }
        }
        else
        {
            callback( self._render( data ) );
        }
    };
}();

},{}]},{},[1])