/**
 * This file runs the build process for local development,
 * as well as outputting files ready for production in separate Gulp tasks.
 *
 * It also takes the shared assets from the 'components' directory,
 * processes, and outputs to the correct (or both) build folders.
 *
 * Finally, this script employs an auto-reload script to my development faster.
 *
 * npm install --save-dev gulp-util gulp-browserify gulp-connect gulp-if gulp-uglify gulp-minify-html gulp-jsonminify gulp-concat gulp-minify-css gulp-imagemin imagemin-pngquant
 */


// Required modules
var gulp = require( 'gulp' ),
    gutil = require( 'gulp-util' ),
    browserify = require( 'gulp-browserify' ),
    connect = require( 'gulp-connect' ),
    gulpIf = require( 'gulp-if' ),
    uglify = require( 'gulp-uglify' ),
    minifyHtml = require( 'gulp-minify-html' ),
    minifyJson = require( 'gulp-jsonminify' ),
    minifyCss = require( 'gulp-minify-css' ),
    imagemin = require( 'gulp-imagemin' ),
    pngquant = require( 'imagemin-pngquant' ),
    concat = require( 'gulp-concat' );

// Variables
var build = {};
build.DEVELOPMENT = 'development';
build.PRODUCTION = 'production';

var env, htmlSources, cssSources, jsSources, vendorSources, jsonSources, imgSources, outputDir;

env = process.env.NODE_ENV || build.DEVELOPMENT;

if( env === build.DEVELOPMENT )
{
    outputDir = 'builds/' + build.DEVELOPMENT + '/';
}
else
{
    outputDir = 'builds/' + build.PRODUCTION + '/';
}

htmlSources = [ outputDir + '*.html' ];
cssSources = [ 'components/css/*.css' ];
jsSources = [ 'components/js/*.js' ];
vendorSources = [ 'components/js/vendor/*.js' ];
jsonSources = [ outputDir + 'js/*.json' ];
imgSources = [ 'components/img/*' ];


// Tasks
gulp.task( 'html', function(){
    gulp.src( 'builds/development/*.html' )
        .pipe( gulpIf( env === build.PRODUCTION, minifyHtml() ) )
        .pipe( gulpIf( env === build.PRODUCTION, gulp.dest( outputDir ) ) )
        .pipe( connect.reload() )
});
gulp.task( 'js', function(){
    gulp.src( jsSources )
        .pipe( concat( 'scripts.js' ) )
        .pipe( browserify() )
        .pipe( gulpIf( env === build.PRODUCTION, uglify() ))
        .pipe( gulp.dest( outputDir + 'js' ) )
        .pipe( connect.reload() )
});
gulp.task( 'vendor', function(){
    gulp.src( vendorSources )
        .pipe( gulp.dest( outputDir + 'js/vendor' ) )
        .pipe( connect.reload() )
});
gulp.task( 'json', function(){
    gulp.src( 'builds/development/js/*.json' )
        .pipe( gulpIf( env === build.PRODUCTION, minifyJson() ) )
        .pipe( gulpIf( env === build.PRODUCTION, gulp.dest( outputDir + 'js' ) ) )
        .pipe( connect.reload() )
});
gulp.task( 'css', function(){
    gulp.src( cssSources )
        .pipe( concat( 'styles.css' ) )
        .pipe( gulpIf( env === build.PRODUCTION, minifyCss(
            {
                keepBreaks: true
            }
        )))
        .pipe( gulp.dest( outputDir + 'css' ) )
        .pipe( connect.reload() )
});
gulp.task( 'img', function(){
    gulp.src( imgSources )
       .pipe( gulpIf( env === build.PRODUCTION, imagemin( {
           progressive: true,
           svgoPlugins: [ { removeViewBox: false } ],
           use: [ pngquant() ]
       } ) )
       .pipe( gulp.dest( outputDir + 'img' ) ) )
       .pipe( connect.reload() )
});


gulp.task( 'watch', function(){
    gulp.watch( 'builds/development/*.html', [ 'html' ] );
    gulp.watch( cssSources, [ 'css' ] );
    gulp.watch( 'builds/development/js/*.json', [ 'json' ] );
    gulp.watch( jsSources, [ 'js' ] );
    gulp.watch( vendorSources, [ 'vendor' ] );
    gulp.watch( imgSources, [ 'img' ] );
});

gulp.task( 'connect', function(){
    connect.server({
        root: outputDir,
        livereload: true
    })
});
gulp.task( 'default', [ 'html', 'css', 'js', 'json', 'vendor', 'img', 'connect', 'watch' ] );
