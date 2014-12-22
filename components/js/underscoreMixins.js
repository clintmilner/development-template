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
