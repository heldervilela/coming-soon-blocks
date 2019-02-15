const { getBlockTypes, unregisterBlockType } = wp.blocks;
import myBlocks from './available-blocks.json' ;

let allowedBlocks = myBlocks.map( block => block.name );
	// allowedBlocks.push( 'core/paragraph' );

document.addEventListener("DOMContentLoaded", () => {

	getBlockTypes().forEach( function( blockType ) {
		if( allowedBlocks.indexOf( blockType.name ) === -1 ) {
			unregisterBlockType( blockType.name );
		}
	} );

}, false);

