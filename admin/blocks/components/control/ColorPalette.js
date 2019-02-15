
const { __ }        = wp.i18n;
const { Component, Fragment } = wp.element;
const {
	      ColorPalette,
	      ColorIndicator
      }             = wp.components;

/**
 * Config
 */
import {pluginColorPalette} from "../../../../public/_scripts/block-editor/global-settings";

/**
 * Component
 *
 * @since    1.0.0
 */
const MyColorPalette = ( { label, colorValue, onChange } ) => {

	return (
		<div data-editor-component="color-palette-base-control">
			<label>{label} <ColorIndicator colorValue={colorValue}/></label>
			<ColorPalette
				colors={pluginColorPalette}
				value={colorValue}
				onChange={ onChange }
			/>
		</div>
	)

};

export default MyColorPalette;
