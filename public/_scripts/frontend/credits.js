const _credits = {
	author: 'Coming Soon Blocks',
	authorUrl: '🤘 https://pixelthrone.com',
	color: {
		color1: '#474B53',
		color2: '#FFFFFF',
		color3: '#474B53',
		bg: '#ffc400',
	},
};

console.log(
	"%c// made by %c— " + _credits.author + " —%c " + _credits.authorUrl,
	"padding:8px 5px; color:" + _credits.color.color1 + "; line-height:20px;",
	"padding:8px 15px; color:" + _credits.color.color2 + "; background-color:" + _credits.color.bg + "; line-height:20px;",
	"padding:8px 5px; color:" + _credits.color.color3 + "; line-height:20px;"
);

