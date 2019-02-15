/**
 * WordPress dependencies
 */
const { __ }                  = wp.i18n;
const { Component, Fragment } = wp.element;
const {
	      RichText,
	      InspectorControls,
	      PanelColorSettings,
      }                       = wp.editor;
const {
	      RangeControl,
	      PanelBody,
	      SelectControl,
      }                       = wp.components;

/**
 * Internal compoments
 */
import BrandUpload from '../../components/control/BrandUpload';
import SocialIcons from '../../components/SocialIcons';
import BackgroundOptions from '../../components/control/Background';
import TypographySelector, {loadGoogleFont} from "../../components/control/TypographySelector";
import IsPremium from "../../components/control/IsPremium";
import {BlockBackground, BlockBackgroundOverLayer} from "../../components/BlockBackground";
import OverlayerControl from "../../components/control/Overlayer";

/**
 * Config
 */
import {name, ALLOWED_MEDIA_TYPES} from './settings';
import {pluginColorPalette} from '../../../../public/_scripts/block-editor/global-settings';

/**
 * Block edit function
 */
class Edit extends Component {

	constructor( { attributes } ) {
		super( ...arguments );

		this.state = {
			overlay: {
				color: this.props.attributes.overlayColor,
				opacity: this.props.attributes.overlayOpacity,
			},
			bodyTypo: JSON.parse( this.props.attributes.bodyTypo ),
			titleTypo: JSON.parse( this.props.attributes.titleTypo ),
			subtitleTypo: JSON.parse( this.props.attributes.subtitleTypo )
		};

		loadGoogleFont( this.state.bodyTypo );
		loadGoogleFont( this.state.titleTypo );
		loadGoogleFont( this.state.subtitleTypo );

		this.editorCssStylePrint = this.editorCssStylePrint.bind( this );

	}

	/**
	 * Editor css font style print to dom
	 *
	 * @since    1.0.0
	 */
	editorCssStylePrint() {
		const { bodyTypo, titleTypo, subtitleTypo } = this.state;
		const { clientId }                          = this.props;
		const css                                   = ( _typo, _className ) => {
			let fontStyle  = 'normal';
			let fontweight = _typo.desktop.fontweight;

			if( fontweight.includes( 'italic' ) ) {
				fontweight = fontweight.replace( "italic", "" ); // Remove italic
				fontweight = fontweight ? fontweight : 'normal'; // Check if is empty
				fontStyle  = 'italic';
			}
			if( fontweight.includes( 'regular' ) ) {
				fontweight = 'normal';
			}

			return `div[data-block="${clientId}"] main .-${_className} {
						font-family: ${_typo.fontfamily};
						font-size: ${_typo.desktop.fontsize}px;
						font-weight: ${fontweight};
						font-style: ${fontStyle};
						line-height: ${_typo.desktop.lineheight}%;
						letter-spacing: ${_typo.desktop.letterspacing}px;
					}`;
		};

		return (
			<div id={`block-style--${clientId}`} dangerouslySetInnerHTML={{
				__html: `
				<style>
				${css( bodyTypo, 'body__typography' )}
				${css( titleTypo, 'title__typography' )}
				${css( subtitleTypo, 'subtitle__typography' )}
				</style>
				`
			}}/>
		);
	}

	/**
	 * Render
	 */
	render() {
		const { bodyTypo, titleTypo, subtitleTypo } = this.state;
		const {
			      attributes: {
				      titleText,
				      subTitleText,
				      descriptionText,
				      copyrightText,
				      logoID,
				      logoURL,
				      logoMaxWidth,
				      logoAlign,
				      textColor,
				      overlayColor,
				      overlayOpacity,
				      networks,
				      background
			      },
			      className,
			      setAttributes,
		      } = this.props;

		return (
			<Fragment>

				<InspectorControls>
					{
						/** Background */
					}
					<PanelBody
						title={__( 'BACKGROUND', '@@pkg.textdomain' )}
						initialOpen={true}
					>
						<OverlayerControl attrs={{ color: overlayColor, opacity: overlayOpacity }}
						                  updateAttribute={( _params ) => {
							                  this.setState( ( prevState ) => ({
								                  ...prevState,
								                  overlay: {
									                  color: _params.color,
									                  opacity: _params.opacity,
								                  }
							                  }) );
							                  setAttributes( { overlayColor: _params.color, overlayOpacity: _params.opacity } );
						                  }}/>

						<BackgroundOptions attributes={background}
						                   updateAttributes={( _param ) => {
							                   setAttributes( { background: _param } );
						                   }}/>

					</PanelBody>
					{
						/** Brand */
					}
					<PanelBody
						title={__( 'BRAND', '@@pkg.textdomain' )}
						initialOpen={false}
					>
						<RangeControl
							label={__( 'Max Logo Width (px)', '@@pkg.textdomain' )}
							value={logoMaxWidth}
							onChange={( value ) => setAttributes( { logoMaxWidth: value } )}
							min={30}
							max={500}
							step={5}
						/>

						<SelectControl
							label={__( 'Alignment:', '@@pkg.textdomain' )}
							value={logoAlign}
							onChange={( value ) => setAttributes( { logoAlign: value } )}
							options={[
								{ value: 'left', label: __( 'Left', '@@pkg.textdomain' ) },
								{ value: 'center', label: __( 'Center', '@@pkg.textdomain' ) },
								{ value: 'right', label: __( 'Right', '@@pkg.textdomain' ) },
							]}
						/>

					</PanelBody>
					{
						/** Typography */
					}
					<PanelColorSettings
						title={__( 'TYPOGRAPHY', '@@pkg.textdomain' )}
						initialOpen={false}
						colorSettings={[{
							value: textColor,
							colors: pluginColorPalette,
							onChange: ( value ) => setAttributes( { textColor: value } ),
							label: __( 'Text color', '@@pkg.textdomain' ),
						}]}
					>
						<label className="single-field-label">{__( 'Fonts', '@@pkg.textdomain' )}</label>
						<IsPremium>
							<TypographySelector title={__( 'Title', '@@pkg.textdomain' )}
							                    typography={titleTypo}
							                    updated={( newTypo ) => {
								                    this.setState( ( prevState ) => ({
									                    ...prevState,
									                    titleTypo: newTypo
								                    }) );
								                    setAttributes( { titleTypo: JSON.stringify( newTypo ) } );
							                    }}/>
							<TypographySelector title={__( 'Subtitle', '@@pkg.textdomain' )}
							                    typography={subtitleTypo}
							                    updated={( newTypo ) => {
								                    this.setState( ( prevState ) => ({
									                    ...prevState,
									                    subtitleTypo: newTypo
								                    }) );
								                    setAttributes( { subtitleTypo: JSON.stringify( newTypo ) } );
							                    }}/>
							<TypographySelector title={__( 'Body', '@@pkg.textdomain' )}
							                    typography={bodyTypo}
							                    updated={( newTypo ) => {
								                    this.setState( ( prevState ) => ({
									                    ...prevState,
									                    bodyTypo: newTypo
								                    }) );
								                    setAttributes( { bodyTypo: JSON.stringify( newTypo ) } );
							                    }}/>
						</IsPremium>

					</PanelColorSettings>
				</InspectorControls>
				{
					/**
					 * Markup
					 */
				}
				<main data-block={name} className={className}>

					<div className="content__container" style={{ color: textColor }}>

						<div className="brand__wrapper">
							<BrandUpload
								onSelect={( media ) => {
									setAttributes( {
										logoURL: media.url,
										logoID: media.id,
									} );
								}}
								allowedMediaTypes={ALLOWED_MEDIA_TYPES}
								logoAttrs={{ id: logoID, url: logoURL }}
								style={{ maxWidth: `${logoMaxWidth}px` }}
								align={logoAlign}
							/>
						</div>

						<div className="title__wrapper">
							<RichText
								tagName="h1"
								className="-title__typography"
								value={titleText}
								placeholder={__( 'Title', '@@pkg.textdomain' )}
								onChange={( value ) => setAttributes( { titleText: value } )}
							/>
						</div>

						<div className="subtitle__wrapper">
							<RichText
								tagName="h2"
								className="-subtitle__typography"
								value={subTitleText}
								placeholder={__( 'Subtitle', '@@pkg.textdomain' )}
								onChange={( value ) => setAttributes( { subTitleText: value } )}
							/>
						</div>

						<div className="description__wrapper -body__typography">
							<RichText
								tagName="p"
								value={descriptionText}
								placeholder={__( 'Description', '@@pkg.textdomain' )}
								onChange={( value ) => setAttributes( { descriptionText: value } )}
							/>
							<RichText
								tagName="p"
								value={copyrightText}
								className="copyright"
								placeholder={__( 'Copyright', '@@pkg.textdomain' )}
								onChange={( value ) => setAttributes( { copyrightText: value } )}
							/>
						</div>

						<div className="social__wrapper">
							<SocialIcons networks={networks}
							             setNetworks={( value ) => setAttributes( { networks: value } )}
							             position='top left'
							/>
						</div>
					</div>

					<BlockBackgroundOverLayer attrs={this.state.overlay}/>
					<BlockBackground background={background}/>

				</main>

				{
					/**
					 * CSS
					 */
				}
				{this.editorCssStylePrint()}

			</Fragment>
		);
	}
}

export default Edit;
