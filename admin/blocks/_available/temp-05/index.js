/**
 * WordPress dependencies
 */
const { registerBlockType } = wp.blocks;

/**
 * Internal dependencies
 */
import './styles/style.scss';
import './styles/editor.scss';
import Edit from './edit';
import { name, title, icon, category, keywords } from './settings';

/**
 * Register
 */
registerBlockType( name, {
	title: title,
	icon: icon,
	keywords: keywords,
	category: category,

	// Extra
	supports: {
		align: ['full'],
	},

	/**
	 * Edit
	 */
	edit: Edit,

	/**
	 * Save
	 */
	save() {
		return null;
	}
} );

