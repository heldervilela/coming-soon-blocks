/**
 * Load Plugins.
 */
const gulp    = require( 'gulp' );
const del     = require( 'del' );
const replace = require( 'gulp-replace-task' );
const zip     = require( 'gulp-zip' );
const copy    = require( 'gulp-copy' );
const cache   = require( 'gulp-cache' );
const wpPot   = require( 'gulp-wp-pot' );

// General.
const pkg     = require( './package.json' );
const project = pkg.name;
const title   = pkg.title;

// Build.
const buildZipDestination   = './__build/';
const buildFiles            = [
	'./**',
	'!./__build',
	'!./__build/**',
	'!./admin/**/*.js',
	'!./admin/**/styles',
	'!./admin/dashboard/*.js',
	'!./admin/dashboard/styles/',
	'!./admin/blocks/*.js',
	'!./admin/blocks/styles/*',
	'!./frontend/**/*.js',
	'!./frontend/styles/',
	'!./frontend/scripts',
	'!./public/_scripts',
	'!./public/_styles',
	'!node_modules/**',
	'!jarvis.sh',
	'!*.json',
	'!*.map',
	'!*.xml',
	'!gulpfile.js',
	'!*.sublime-project',
	'!*.sublime-workspace',
	'!*.sublime-gulp.cache',
	'!*.log',
	'!*.DS_Store',
	'!*.gitignore',
	'!TODO',
	'!*.git',
	'!*.ftppass',
	'!*.DS_Store',
	'!sftp.json',
	'!yarn.lock',
	'!*.md',
	'!package.lock'
];
const cleanFiles            = [
	'./__build/' + project + '/', './__build/' + project + ' 2/',
	'./__build/' + project + '.zip'
];
const buildDestination      = './__build/' + project + '/';
const buildDestinationFiles = './__build/' + project + '/**/*';

// Release.
const removeProductionFiles = [
	'./__build/' + project + '/_bin/',
	'./__build/' + project + '/node_modules/',
	'./__build/' + project + '/.babelrc',
	'./__build/' + project + '/.gitignore',
	'./__build/' + project + '/gulpfile.js',
	'./__build/' + project + '/package.json',
	'./__build/' + project + '/package-lock.json',
	'./__build/' + project + '/postcss.config.js',
	'./__build/' + project + '/webpack.config.js',
	'./__build/' + project + '/yarn.lock',
	'./__build/' + project + '/yarn-error.log',
	'./__build/' + project + '/public/_scripts',
	'./__build/' + project + '/public/_styles',
];
const removeStyleFiles = [
	'./__build/' + project + '/admin/**/styles/',
	'./__build/' + project + '/frontend/**/*.scss',
];

// Translation.
const text_domain       = '@@pkg.textdomain';
const destFile          = project + '.pot';
const packageName       = pkg.title;
const bugReport         = pkg.author_uri;
const lastTranslator    = pkg.author;
const team              = pkg.team;
const translatePath     = './__build/coming-soon-blocks/languages/';
const translatableFiles = ['./__build/coming-soon-blocks/**/*.php', '!./__build/coming-soon-blocks/lib/freemius/*'];

/**
 * Tasks.
 */
gulp.task( 'clearCache', function( done ) {
	cache.clearAll();
	done();
} );

gulp.task( 'clean', function( done ) {
	return del( cleanFiles );
	done();
} );

gulp.task( 'removeProductionFiles', function( done ) {
	return del( removeProductionFiles );
	done();
} );

gulp.task( 'copy', function( done ) {
	return gulp.src( buildFiles )
		.pipe( copy( buildDestination ) );
	done();
} );

gulp.task( 'removeStyleFiles', function( done ) {
	return del( removeStyleFiles );
	done();
} );

gulp.task( 'updateVersion', function( done ) {
	return gulp.src( './*.php' )

		.pipe( replace( {
			patterns: [
				{
					match: /(\d+\.+\d+\.+\d)/,
					replacement: pkg.version
				},
			],
			usePrefix: false
		} ) )
		.pipe( gulp.dest( './' ) );
	done();
} );

gulp.task( 'variables', function( done ) {
	return gulp.src( buildDestinationFiles )
		.pipe( replace( {
			patterns: [
				{
					match: 'pkg.package',
					replacement: project
				},
				{
					match: 'pkg.name',
					replacement: project
				},
				{
					match: 'pkg.title',
					replacement: pkg.title
				},
				{
					match: 'pkg.version',
					replacement: pkg.version
				},
				{
					match: 'pkg.author',
					replacement: pkg.author
				},
				{
					match: 'pkg.author_uri',
					replacement: pkg.author_uri
				},
				{
					match: 'pkg.license',
					replacement: pkg.license
				},
				{
					match: 'pkg.copyright',
					replacement: pkg.copyright
				},
				{
					match: 'pkg.textdomain',
					replacement: pkg.name
				},
				{
					match: 'pkg.description',
					replacement: pkg.description
				},
				{
					match: 'pkg.tested_up_to',
					replacement: pkg.tested_up_to
				}
			]
		} ) )
		.pipe( gulp.dest( buildDestination ) );
	done();
} );

gulp.task( 'translate', function( done ) {
	gulp.src( translatableFiles )
		.pipe( wpPot( {
			domain: text_domain,
			destFile: destFile,
			package: project,
			bugReport: bugReport,
			team: team,
			lastTranslator: lastTranslator
		} ) )
		.pipe( gulp.dest( translatePath + destFile ) );
	done();
} );

gulp.task( 'zip', function( done ) {
	return gulp.src( buildDestination + '/**', { base: '__build' } )
		.pipe( zip( project + '.zip' ) )
		.pipe( gulp.dest( buildZipDestination ) );
	done();
} );
