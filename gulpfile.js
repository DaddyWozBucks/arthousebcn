var gulp = require('gulp');
var bowerSrc = require('gulp-bower-src');
var inject = require('gulp-inject');
var filter = require('gulp-filter');
var gutil       = require('gulp-util'),
   sass        = require('gulp-sass'),
   csso        = require('gulp-csso'),
   uglify      = require('gulp-uglify'),
   jade        = require('gulp-jade'),
   concat      = require('gulp-concat'),
   livereload  = require('gulp-livereload'), // Livereload plugin needed: https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei
   tinylr      = require('tiny-lr'),
   express     = require('express'),
   app         = express(),
   marked      = require('marked'), // For :markdown filter in jade
   path        = require('path'),
   server      = tinylr(),
   es = require('event-stream'),
   series = require('stream-series'),
   mainBowerFiles = require('main-bower-files'),
   angularFilesort = require('gulp-angular-filesort');

   gulp.task('bowercomp', function() {
       return gulp.src(mainBowerFiles(/* options */), { base: './bower_components' })
           .pipe( gulp.dest('dist/bower_components'))
   });

// --- Basic Tasks ---
gulp.task('css', function() {
 return gulp.src('src/assets/stylesheets/*.scss')
   .pipe(
     sass( {
       includePaths: ['src/assets/stylesheets'],
       errLogToConsole: true
     } ) )
   .pipe( csso() )
   .pipe( gulp.dest('dist/assets/stylesheets/') )
   .pipe( livereload( server ));
});

// gulp.task('bower', function () {
// 	bowerSrc()
// 		.pipe(gulp.dest('dist/bower_components'));
// });
gulp.task('js', function() {
 return gulp.src('src/assets/js/*.js')
   .pipe( gulp.dest('dist/assets/scripts/'))
   .pipe( livereload( server ));
});
gulp.task('bower', function() {
 return gulp.src(mainBowerFiles(), { base: './bower_components' })
   .pipe( gulp.dest('dist/bower_components/'))
   .pipe( livereload( server ));
});
gulp.task('images', function() {
 return gulp.src('src/assets/images/*.*')
   .pipe( gulp.dest('dist/assets/images/'))

});
gulp.task('fonts', function() {
 return gulp.src('src/assets/fonts/*.*')
   .pipe( gulp.dest('dist/assets/fonts/'))

});
gulp.task('data', function() {
return gulp.src('src/assets/data/*.*')
  .pipe( gulp.dest('dist/assets/data/'))

});

gulp.task('index', function() {
 return gulp.src('./index.jade')
   .pipe(jade({
     pretty: true
   }))
   .pipe(gulp.dest('dist/'))
   .pipe( livereload( server ));
});
gulp.task('templates', function() {
 return gulp.src('src/templates/*.jade')
   .pipe(jade({
     pretty: true
   }))
   .pipe(gulp.dest('dist/templates'))
   .pipe( livereload( server ));
});
gulp.task('bowersrc', function () {
	bowerSrc()
		.pipe(gulp.dest('dist/'));
});
// gulp.task('debug', function () {
// 	return gulp.src('./src/assets/js/*.js')
// 		.pipe(stripDebug())
// 		.pipe(gulp.dest('dist'));
// });
// gulp.task('injectBower', function () {
//   var target = gulp.src('./dist/index.html');
//
//   // It's not necessary to read the files (will speed up things), we're only after their paths:
//   var sources = gulp.src(mainBowerFiles(/* options */), { base: './bower_components' });
//
//   return target.pipe(inject(sources))
//     .pipe(gulp.dest('./dist'));
// })
gulp.task('inject', function () {
  // var target = gulp.src('./dist/index.html');
  // var bower = , )
  // // It's not necessary to read the files (will speed up things), we're only after their paths:
  // var sources = gulp.src(['./src/**/*.js', (mainBowerFiles(/* options */)], {read: false}, { base: './bower_components' });
  //, { base: './bower_components' }
  // return target.pipe(inject(sources))
  //   .pipe(gulp.dest('./dist'));
  var bowerStream = gulp.src(mainBowerFiles(),{ base: './bower_components' })
    // .pipe(concat('.js'))
    .pipe(gulp.dest('./bower_components'));

  // Concatenate AND minify app sources
  var cssStream = gulp.src(['./dist/assets/stylesheets/*.css'], {read: false})
    .pipe(gulp.dest('./assets/stylesheets'));

  var jsStream = gulp.src('./src/assets/js/*.js').pipe(angularFilesort())
    // .pipe(concat('app.js'))
    // .pipe(uglify())
    .pipe(gulp.dest('./assets/scripts'));

  var appStream = es.merge(jsStream, cssStream);

  gulp.src('./dist/index.html')
    .pipe(inject(series(bowerStream, appStream)))
    .pipe(gulp.dest('./dist'));
})


gulp.task('express', function() {
 app.use(express.static(path.resolve('./dist')));
 app.listen(1337);
 gutil.log('Listening on port: 1337');
});



gulp.task('watch', function () {
 server.listen(35729, function (err) {
   if (err) {
     return console.log(err);
   }

   gulp.watch('src/assets/stylesheets/*.scss',['css']);

   gulp.watch('src/assets/js/*.js',['js']);

   gulp.watch('src/assets/images/*.*',['images']);

   gulp.watch('src/templates/*.jade',['templates']);

   gulp.watch('index.jade',['index', 'inject']);

 });
});

// Default Task
gulp.task('default', ['js','css','templates','fonts', 'data','images', 'bower', 'index','inject','express','watch']);
