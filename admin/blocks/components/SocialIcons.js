const { __ }        = wp.i18n;
const { Component } = wp.element;
const {
	      IconButton,
	      MenuItem,
	      Dropdown,
	      SelectControl
      }             = wp.components;

import {socialIconsArray} from '../../../public/_scripts/block-editor/global-settings';
import { isEmpty } from "../../../public/_scripts/block-editor/utils/tools.js";

/**
 * Component
 *
 * @since    1.0.0
 */
class SocialIcons extends Component {
	constructor( { attributes } ) {
		super( ...arguments );

		this.update     = this.update.bind( this );
		this.addIcon    = this.addIcon.bind( this );
		this.removeIcon = this.removeIcon.bind( this );

		const networks = JSON.parse( this.props.networks );
		let NetworksArray = [];

		networks.filter((value) => {
			if( value ) {
				NetworksArray.push(value);
			}
		});

		this.state = {
			networks: NetworksArray
		};
	}

	/**
	 * Update icon
	 */
	update( index, value, type ) {
		let networks_clone = this.state.networks;
		if( type === 'icon' ) {
			networks_clone[index].icon = value;
		} else {
			networks_clone[index].url = value;
		}
		this.setState( ( prevState ) => ({ networks: networks_clone }) );
		this.props.setNetworks( JSON.stringify( networks_clone ) );
	}

	/**
	 * Add icon
	 */
	addIcon( event ) {
		event.preventDefault();

		let networks_clone = this.state.networks;

		networks_clone.push( {
			url: 'https://',
			icon: ''
		} );

		this.setState( ( prevState ) => ({ networks: networks_clone }) );
	}

	/**
	 * Remove icon
	 */
	removeIcon( event ) {
		event.preventDefault();
		const index        = event.currentTarget.dataset.index;
		let networks_clone = [];

		this.state.networks.filter((value, i) => {
			if( Number(index) !== Number(i) ) {
				networks_clone.push(value);
			}
		});

		this.setState( ( prevState ) => ({ networks: networks_clone }) );
		this.props.setNetworks( JSON.stringify( networks_clone ) );
	}

	/**
	 * View
	 */
	render() {
		const { networks } = this.state;
		const { position } = this.props;

		return (
			<div data-component="social-icons">
				{
					networks &&
					networks.map( ( { url, icon }, i ) => {
						return (
							<Dropdown
								key={i}
								className="editor-block-social-icons-menu__control"
								contentClassName="editor-block-social-icons-menu__content"
								position={position}
								renderToggle={( { isOpen, onToggle } ) => (
									<a href="#" onClick={onToggle}
									   className={`-icon -${icon ? icon : 'empty'} -isOpen--${isOpen}`}>
										{
											icon ?
												<i className={`socicon-${icon}`}></i> :
												<i className="dashicons dashicons-edit"></i>
										}
									</a>
								)}
								renderContent={() => (
									<div>
										<SelectControl
											label={__( 'Network', '@@pkg.textdomain' )}
											value={icon}
											onChange={( icon ) => this.update( i, icon, 'icon' )}
											options={socialIconsArray}
										/>

										<label className="components-base-control__label"
										>{__( 'Link', '@@pkg.textdomain'  )}</label>
										<input className="components-text-control__input"
										       type="text"
										       defaultValue={url}
										       placeholder='https://'
										       onBlur={( event ) => this.update( i, event.currentTarget.value, 'url' )}
										/>

										<div className="editor-block-settings-menu__separator"></div>

										<MenuItem
											className="editor-block-settings-menu__control"
											data-index={i}
											onClick={this.removeIcon}
											icon="trash"
										>
											{__( 'Remove', '@@pkg.textdomain'  )}
										</MenuItem>
									</div>
								)}
							/>
						);
					} )
				}
				<IconButton
					icon="plus"
					label={__( 'Add Network', '@@pkg.textdomain'  )}
					onClick={this.addIcon}
					data-empty={isEmpty(networks)}
				/>
			</div>
		)
	}
}

export default SocialIcons;
