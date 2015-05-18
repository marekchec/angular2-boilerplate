var del                 = require( 'del' );
var gulp                = require( 'gulp' );
var gulpLoadPlugins     = require( 'gulp-load-plugins' );
var path                = require( 'path' );
var plugins             = gulpLoadPlugins( {
    pattern: ['gulp-*', 'gulp.*'],
    replaceString: /\bgulp[\-.]/
});
var vinylPaths          = require( 'vinyl-paths' );

/**
 * Paths
 */
var basePaths = {
    sources:    'sources',
    dest:       'dest'
};

var paths = {
    styles: {
        sources:    path.join( basePaths.sources, '**/*.scss'),
        dest:   	path.join( basePaths.dest, 'styles' )
    },
    scripts: {
        sources:    path.join( basePaths.sources, '**/*.ts' ),
        dest:       path.join( basePaths.dest, 'scripts' )  
    },
    templates: {
        sources:    path.join( basePaths.sources, '**/templates/**/*.html' ),
        dest:       path.join( basePaths.dest, 'templates/' )
    }  
};


/**
 * Helper methods
 */
var onError = function( error ) {  
    plugins.util.beep();
    console.log( error );
};


/**
 * Compile Typescript-files to javascript
 */
gulp.task( 'scripts', function() {
    return gulp.src( paths.scripts.sources )        
        .pipe( plugins.plumber( onError ))
        .pipe( plugins.tsc( { target: 'ES5' } ))
   	    .pipe( gulp.dest( paths.scripts.dest ));
});


/**
 * Compile scss files to css
 */
gulp.task( 'styles', function () {
    return gulp.src( paths.styles.sources )
        .pipe( plugins.plumber( onError ))
        .pipe( plugins.sass() )
        .pipe( gulp.dest( paths.styles.dest ));
});


/**
 * Concat tasks 
 */
gulp.task( 'concat:css', function() {
    return gulp.src( path.join( paths.styles.dest, '**/*.css' ))
        .pipe( plugins.concat( 'app.css' ))
        .pipe( gulp.dest( basePaths.dest ));
});

gulp.task( 'concat:js', function() {
    return gulp.src( path.join( paths.scripts.dest, '**/*.js' ))
        .pipe( plugins.concat( 'app.js' ))
        .pipe( gulp.dest( basePaths.dest ));
});


/**
 * Clean tasks 
 */
gulp.task( 'clean:css', function( callback ) {
     del( [ paths.styles.dest ], callback );
});

gulp.task( 'clean:js', function( callback ) {
    del( [ paths.scripts.dest ], callback );
});

gulp.task( 'clean:dest', function( callback ) {
    del( [ basePaths.dest ], callback );
});


/**
 * Copy tasks 
 */
 gulp.task( 'copy:index', function() {
     return gulp.src( path.join( basePaths.sources, 'index.html' ) )
        .pipe( gulp.dest( basePaths.dest ) );
 });
 
 gulp.task( 'copy:templates', function() {
     return gulp.src( paths.templates.sources )
        .pipe( plugins.flatten() )
        .pipe( gulp.dest( paths.templates.dest ) );
 });
 
 
/**
* File Watcher
*/
gulp.task( 'watch', function() {
    plugins.watch( paths.scripts.sources, 
        gulp.series( 'scripts', 'concat:js', 'clean:js' )
    );
    
    plugins.watch( paths.styles.sources, 
        gulp.series( 'styles', 'concat:css', 'clean:css' )
    );
    
    plugins.watch( paths.templates.sources,
        gulp.parallel( 'copy:templates' )
    );
});
 

/**
 * Default task
 */
gulp.task( 'default', gulp.series(
    'styles',
    'concat:css',
    'clean:css',
    'scripts', 
    'concat:js', 
    'clean:js', 
    'copy:index',
    'copy:templates'   
));