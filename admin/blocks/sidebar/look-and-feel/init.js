/**
 * WordPress dependencies
 */
const { __ }                                       = wp.i18n;
const { compose }                                  = wp.compose;
const { Component, Fragment }                      = wp.element;
const { withDispatch, withSelect }                 = wp.data;
const { PluginSidebar, PluginSidebarMoreMenuItem } = wp.editPost;
const { registerPlugin }                           = wp.plugins;
const { MediaUpload }                              = wp.editor;
const {
	      Button,
	      Spinner,
	      PanelBody,
	      PanelRow,
	      ToggleControl,
	      ColorPalette,
	      ColorIndicator,
      }                                            = wp.components;

/**
 * Internal dependencies
 */
import './editor.scss';
const sidebar_name = "pixelthrone--comingsoonblocks-look-and-feel";
import IsPremium from "../../components/control/IsPremium";
import {mergeSavedPostMetaOptions} from "../../../../public/_scripts/block-editor/utils/tools.js";
import SVG_ICON from './media/icon.svg'

/**
 * Config
 */
const LOOKANDFEEL_META        = csblocks.lookandfeel;
const SETTINGSSIDEBAR_OPTIONS = csblocks.settings;
import { pluginColorPalette } from '../../../../public/_scripts/block-editor/global-settings';

/**
 * Icon
 */
function SidebarIcon() {
	return (
		<SVG_ICON className="look-and-feel-button" v="2"/>
	);
}

/**
 * Icon Components
 */
const MenuItem = () => (
	<PluginSidebarMoreMenuItem target={sidebar_name}>
		{__( "LOOK AND FEEL", '@@pkg.textdomain'  )}
	</PluginSidebarMoreMenuItem>
);

/**
 * Main Component
 */
class TemplatesSidebar extends Component {
	constructor( props ) {
		super( props );

		this.state = mergeSavedPostMetaOptions( LOOKANDFEEL_META, {
			pluginBrand: false,
			favicon: { id: '', url: '' },
			unlock_button_color: '#282A2F',
			activeFont: '',
			typography: {}
		} );

		this.updatePost                   = this.updatePost.bind( this );
		this.showPasswordProtectedOptions = this.showPasswordProtectedOptions.bind( this );
	}

	/**
	 * Update icon
	 */
	updatePost() {
		const { editPost } = this.props;
		setTimeout( () => {
			editPost( { comingsoonblocks_lookandfeel: JSON.stringify( this.state ) } );
		}, 200 );
	};

	/**
	 * Show password protected options
	 */
	showPasswordProtectedOptions() {
		const { settingsSidebarOptions } = this.props;
		let _return;

		if( settingsSidebarOptions ) {
			return JSON.parse( settingsSidebarOptions ).passwordProtected;
		} else {
			return SETTINGSSIDEBAR_OPTIONS.passwordProtected;
		}
	};

	/**
	 * Render
	 */
	render() {
		const { isSaving } = this.props;
		const {
			      favicon,
			      pluginBrand,
			      unlock_button_color,
		      }            = this.state;

		return (
			<Fragment>
				{
					/**
					 * Menu
					 */
				}
				<MenuItem/>
				{
					/**
					 * Sidebar
					 */
				}
				<PluginSidebar
					name={sidebar_name}
					title={__( "LOOK AND FEEL", '@@pkg.textdomain'  )}
				>

					<div data-component="sidebar--settings-options" data-loading={isSaving ? 'true' : 'false'}>

						{isSaving && <Spinner/>}

						{
							// Icons
						}
						<PanelBody
							title={__( 'ICONS', '@@pkg.textdomain'  )}
							initialOpen={true}
						>
							<PanelRow className="">
								<label>{__( 'Favicon', '@@pkg.textdomain'  )}</label>
								<MediaUpload
									onSelect={( media ) => {
										const obj = { id: media.id, url: media.url };
										this.setState( ( prevState ) => ({ ...prevState, favicon: obj }) );
										this.updatePost()
									}}
									allowedTypes={['image']}
									value={favicon.id}
									render={( { open } ) => (
										<div data-editor-component="inspector-controls--image-uploader">
											{favicon.url &&
											<img onClick={open} src={favicon.url}/>}
											<span>
											<Button onClick={open}
											        isDefault>{favicon.id ? __( 'Replace icon', '@@pkg.textdomain'  ) : __( 'Add icon', '@@pkg.textdomain'  )}</Button>
											</span>
										</div>
									)}
								/>
							</PanelRow>
						</PanelBody>
						{
							// Password Protected
						}
						{this.showPasswordProtectedOptions() && (
							<PanelBody
								title={__( 'PASSWORD PROTECTED', '@@pkg.textdomain'  )}
								initialOpen={false}
							>
								<PanelRow className="">
									<IsPremium plan="starter">
										<div data-editor-component="color-palette-base-control">
											<label>{__( 'Button Background', '@@pkg.textdomain'  )} <ColorIndicator
												colorValue={unlock_button_color}/></label>
											<ColorPalette
												colors={pluginColorPalette}
												value={unlock_button_color}
												onChange={( value ) => this.setState( ( prevState ) => ({
													...prevState,
													unlock_button_color: value
												}), this.updatePost() )}
											/>
										</div>
									</IsPremium>
								</PanelRow>
							</PanelBody>
						)}
						{
							// Advanced
						}
						<PanelBody
							title={__( 'ADVANCED', '@@pkg.textdomain'  )}
							initialOpen={false}
						>
							<PanelRow className="">
								<ToggleControl
									label={__( 'Show Some Love', '@@pkg.textdomain'  )}
									help={__( 'Please help others learn about this free plugin by placing a small link in the footer. Thank you very much!', '@@pkg.textdomain'  )}
									checked={pluginBrand}
									onChange={( value ) => this.setState( ( prevState ) => ({
										...prevState,
										pluginBrand: value
									}), this.updatePost() )}
								/>
							</PanelRow>
						</PanelBody>

					</div>
				</PluginSidebar>

			</Fragment>
		)
	}
}

// Dispatch
const applyWithDispatch = withDispatch( ( dispatch ) => {
	const { editPost } = dispatch( 'core/editor' );
	return {
		editPost
	};
} );

// Select
const applyWithSelect = withSelect( ( select ) => {
	const { getEditedPostAttribute, isSavingPost } = select( 'core/editor' );

	return {
		settingsSidebarOptions: getEditedPostAttribute( 'comingsoonblocks_settings' ),
		isSaving: isSavingPost(),
	};
} );

const ComponentWithDispatch = compose( applyWithDispatch, applyWithSelect )( TemplatesSidebar );

// Add Plugin
registerPlugin( sidebar_name, {
	icon: <SidebarIcon/>,
	render: () => <ComponentWithDispatch/>,
} );
