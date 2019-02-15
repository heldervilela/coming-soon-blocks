const path              = require( 'path' );
const autoprefixer      = require( 'autoprefixer' );
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const LiveReloadPlugin  = require( 'webpack-livereload-plugin' );

// Extract style.css for both editor and frontend styles.
const blocksCSSPlugin = new ExtractTextPlugin( {
	filename: 'blocks.style.bundle.css',
} );

// Extract editor.css styles.
const editBlocksCSSPlugin = new ExtractTextPlugin( {
	filename: 'blocks.editor.bundle.css',
} );

// Extract dashboard.scss styles.
const dashboardBlocksCSSPlugin = new ExtractTextPlugin( {
	filename: 'dashboard.bundle.css',
} );

// Extract toolbar.scss styles.
const globalBlocksCSSPlugin = new ExtractTextPlugin( {
	filename: 'global.bundle.css',
} );

// Extract frontend.scss  styles.
const frontendBlocksCSSPlugin = new ExtractTextPlugin( {
	filename: 'frontend.bundle.css',
} );

// Configuration for the ExtractTextPlugin — DRY rule.
const extractConfig = {
	use: [
		{ loader: 'raw-loader' },
		{
			loader: 'postcss-loader',
			options: {
				ident: 'postcss',
				plugins: [
					autoprefixer( {
						browsers: [
							'>1%',
							'last 4 versions',
							'Firefox ESR',
							'not ie < 11', // React doesn't support IE8 anyway
						],
						flexbox: 'no-2009',
					} ),
				],
			},
		},
		{
			loader: 'sass-loader',
			options: {
				data: '@import "'+path.resolve( __dirname, 'public/_styles/_common.scss' )+'";\n',
				outputStyle: process.env.NODE_ENV !== 'production' ? 'compressed' : 'compressed', //nested, uncompressed
			},
		},
	],
};

// Export configuration.
module.exports = {
	entry: {
		'blocks': path.resolve( __dirname, 'public/_scripts/block-editor/init.js' ),
		'dashboard': path.resolve( __dirname, 'public/_scripts/dashboard/init.js' ),
		'frontend': path.resolve( __dirname, 'public/_scripts/frontend/init.js' ),
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve( __dirname, 'public/dist' ),
	},
	stats: 'minimal',
	module: {
		rules: [
			{
				test: /\.(js|jsx|mjs)$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						cacheDirectory: true,
					},
				},
			},
			{
				test: /style\.s?css$/,
				exclude: /(node_modules|bower_components)/,
				use: blocksCSSPlugin.extract( extractConfig ),
			},
			{
				test: /editor\.s?css$/,
				exclude: /(node_modules|bower_components)/,
				use: editBlocksCSSPlugin.extract( extractConfig ),
			},
			{
				test: /dashboard\.s?css$/,
				exclude: /(node_modules|bower_components)/,
				use: dashboardBlocksCSSPlugin.extract( extractConfig ),
			},
			{
				test: /global\.s?css$/,
				exclude: /(node_modules|bower_components)/,
				use: globalBlocksCSSPlugin.extract( extractConfig ),
			},
			{
				test: /frontend\.s?css$/,
				exclude: /(node_modules|bower_components)/,
				use: frontendBlocksCSSPlugin.extract( extractConfig ),
			},
		],
	},
	// Add plugins.
	plugins: [
		blocksCSSPlugin,
		editBlocksCSSPlugin,
		dashboardBlocksCSSPlugin,
		globalBlocksCSSPlugin,
		frontendBlocksCSSPlugin,
		new LiveReloadPlugin( {
			ignore: /\.js$/,
		} ),
	],
	// stats: 'errors-only',
	// Add externals.
	externals: {
		react: 'React',
		'react-dom': 'ReactDOM',
		ga: 'ga', // Old Google Analytics.
		gtag: 'gtag', // New Google Analytics.
		jquery: 'jQuery', // import $ from 'jquery' // Use the WordPress version.
	},
};
