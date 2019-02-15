const { Component }   = wp.element;
const { TextControl } = wp.components;

/**
 * Component
 *
 * @since    1.0.0
 */
class PasswordInput extends Component {
	constructor( { attributes } ) {
		super( ...arguments );

		this.state = {
			type: 'password'
		};
	}

	/**
	 * View
	 */
	render() {
		const { type } = this.state;

		return (
			<TextControl
				type={type}
				onFocus={( value ) => this.setState( ( prevState ) => ({ ...prevState, type: 'text' }) )}
				onblur={( value ) => this.setState( ( prevState ) => ({ ...prevState, type: 'password' }) )}
				{...this.props}
			/>
		)
	}
}

export default PasswordInput;