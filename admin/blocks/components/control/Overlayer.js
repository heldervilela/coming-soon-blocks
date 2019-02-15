const { __ }        = wp.i18n;
const { Component, Fragment } = wp.element;
const {
	      RangeControl
      }             = wp.components;

/**
 * Internal compoments
 */
import MyColorPalette from './ColorPalette';

/**
 * Component
 *
 * @since    1.0.0
 */
class OverlayerControl extends Component {
	constructor( { attributes } ) {
		super( ...arguments );

		const attrs = (typeof this.props.attrs === 'string' || this.props.attrs instanceof String ) ? JSON.parse( this.props.attrs ) : this.props.attrs;

		this.state = attrs;
		this.update     = this.update.bind( this );
	}

	/**
	 * Update
	 */
	update( _param, _value ) {

		this.setState( ( prevState ) => ({ ...prevState, typography: newState }) );

		let newState = this.state;
		newState[_param] = _value;

		this.setState((prevState) => newState );
		this.props.updateAttribute(newState);
	}

	/**
	 * View
	 */
	render() {
		const { color, opacity } = this.state;

		return (
			<Fragment>
				<MyColorPalette label={ __( 'Overlayer color', '@@pkg.textdomain') }
				                colorValue={ color }
				                onChange={ ( value ) => this.update('color', value) }
				/>
				<RangeControl
					label={ __( 'Overlayer Opacity', '@@pkg.textdomain'  ) }
					value={ opacity }
					onChange={  ( value ) => this.update('opacity', value) }
					min={ 0 }
					max={ 100 }
					step={ 5 }
				/>
			</Fragment>
		)
	}
}

export default OverlayerControl;