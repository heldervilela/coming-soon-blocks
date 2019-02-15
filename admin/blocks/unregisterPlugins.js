const { unregisterPlugin, getPlugins } = wp.plugins;
const allowedPlugins = [
	'edit-post',
	'pixelthrone--comingsoonblocks-templates',
	'pixelthrone--comingsoonblocks-seo',
	'pixelthrone--comingsoonblocks-settings',
	'pixelthrone--comingsoonblocks-look-and-feel'
];

window.onload = function() {

	getPlugins().forEach(function(plugin) {
		if( allowedPlugins.indexOf( plugin.name ) === -1 ) {
			unregisterPlugin( plugin.name );
		}
	});

};

