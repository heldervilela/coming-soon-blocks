/**
 * WordPress dependencies
 */
const { __ }                                       = wp.i18n;
const { compose }                                  = wp.compose;
const { Component, Fragment }                      = wp.element;
const { withDispatch, withSelect }                 = wp.data;
const { PluginSidebar, PluginSidebarMoreMenuItem } = wp.editPost;
const { registerPlugin }                           = wp.plugins;
const {
	      TextControl,
	      TextareaControl,
	      Spinner,
	      PanelBody,
	      PanelRow,
	      ToggleControl,
	      DateTimePicker,
	      Button,
	      Dropdown
      }                                            = wp.components;

/**
 * Internal dependencies
 */
import './editor.scss';

const SAVED_SETTINGS_META = csblocks.settings;
const TIME_FORMAT = csblocks.time_format;
const sidebar_name = "pixelthrone--comingsoonblocks-settings";
import SVG_ICON from './media/icon.svg'
import IsPremium from '../../components/control/IsPremium.js'
import AdminUIStatus from '../../../../public/_scripts/dashboard/utils/AdminUIStatus.js'
import {mergeSavedPostMetaOptions} from "../../../../public/_scripts/block-editor/utils/tools.js";

/**
 * Icon
 */
function SidebarIcon() {
	return (
		<SVG_ICON className="settings-button" v="1"/>
	);
}

/**
 * Icon Components
 */
const MenuItem = () => (
	<PluginSidebarMoreMenuItem target={sidebar_name}>
		{__( "SETTINGS", '@@pkg.textdomain'  )}
	</PluginSidebarMoreMenuItem>
);

/**
 * Main Component
 */
class TemplatesSidebar extends Component {
	constructor( props ) {
		super( props );

		this.state = mergeSavedPostMetaOptions( SAVED_SETTINGS_META, {
			status: false,
			schedule: '',
			scheduleStartDate: '',
			scheduleEndDate: '',
			loginBypass: false,
			passwordProtected: false,
			password: '',
			googleAnalytics: '',
			othersAnalytics: '',
			CSSCode: '',
			JSCode: '',
			redirectMode: false,
			cookieNotice: false,
			redirectUrl: 'http://'
		} );

		this.updatePost = this.updatePost.bind( this );
	}

	/**
	 * Update icon
	 */
	updatePost() {
		const { editPost } = this.props;

		setTimeout( () => {
			AdminUIStatus( this.state.status );
			editPost( { comingsoonblocks_settings: JSON.stringify( this.state ) } );
		}, 200 );

	};

	/**
	 * Render
	 */
	render() {
		let passwordField                          = 'password';
		const { isSaving, openLookAndFeelSidebar } = this.props;
		const {
			    status,
			    schedule,
			    scheduleStartDate,
			    scheduleEndDate,
			    googleAnalytics,
			    othersAnalytics,
			    loginBypass,
			    passwordProtected,
			    password,
			    CSSCode,
			    JSCode,
			    redirectMode,
			    redirectUrl,
			    cookieNotice
		    }                                      = this.state;

		const is12HourTime = /a(?!\\)/i.test(
			TIME_FORMAT
				.toLowerCase() // Test only the lower case a
				.replace( /\\\\/g, '' ) // Replace "//" with empty strings
				.split( '' ).reverse().join( '' ) // Reverse the string and test for "a" not followed by a slash
		);

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
					title={__( "SETTINGS", '@@pkg.textdomain'  )}
				>

					<div data-component="sidebar--settings-options" data-loading={isSaving ? 'true' : 'false'}>

						{isSaving && <Spinner/>}

						{
							// General
						}
						<PanelBody
							title={__( 'GENERAL', '@@pkg.textdomain'  )}
							initialOpen={true}
						>
							<PanelRow className="">
								<ToggleControl
									label={__( 'Enable coming soon', '@@pkg.textdomain', '@@pkg.textdomain' )}
									help={__( 'By activating this option this page will appear to all the website visitors.', '@@pkg.textdomain'  )}
									checked={status}
									onChange={( value ) => this.setState( ( prevState ) => ({ status: value }), this.updatePost() )}
								/>
								{
									// Show if status is true
									status && (
										<IsPremium plan="starter">
										<ToggleControl
											label={__( 'Schedule Publish', '@@pkg.textdomain'  )}
											help={__( 'By activating this option it is possible to set a date to show or hide the page.', '@@pkg.textdomain'  )}
											checked={schedule}
											onChange={( value ) => this.setState( ( prevState ) => ({ schedule: value }), this.updatePost() )}
										/>
										</IsPremium>
									)
								}
								{
									// Show if schedule is true
									schedule && (
										<IsPremium plan="starter">
										<Fragment>
											<Dropdown
												className="editor-component--field-date-time-picker"
												contentClassName="editor-component--dropdown-date-time-picker"
												position="bottom right"
												renderToggle={ ( { isOpen, onToggle } ) => (
													<div>
														<label>{__('Start:', '@@pkg.textdomain' )}</label>
														<Button isLink onClick={ onToggle } aria-expanded={ isOpen }>
															{scheduleStartDate ? scheduleStartDate : __('Set date', '@@pkg.textdomain' )}
														</Button>
														{ scheduleStartDate && (<Button isDefault isSmall onClick={( value ) => this.setState( ( prevState ) => ({ scheduleStartDate: '' }), this.updatePost() )}>✖</Button> )}
													</div>
												) }
												renderContent={ () => (
													<DateTimePicker
														is12Hour={ is12HourTime }
														currentDate={scheduleStartDate}
														onChange={( value ) => this.setState( ( prevState ) => ({ scheduleStartDate: value }), this.updatePost() )}
													/>
												) }
											/>
											<Dropdown
												className="editor-component--field-date-time-picker"
												contentClassName="editor-component--dropdown-date-time-picker"
												position="bottom right"
												renderToggle={ ( { isOpen, onToggle } ) => (
													<div>
														<label>{__('End:', '@@pkg.textdomain' )}</label>
														<Button isLink onClick={ onToggle } aria-expanded={ isOpen }>
															{scheduleEndDate ? scheduleEndDate : __('Set date', '@@pkg.textdomain' )}
														</Button>
														{ scheduleEndDate && (<Button isDefault isSmall onClick={( value ) => this.setState( ( prevState ) => ({ scheduleEndDate: '' }), this.updatePost() )}>✖</Button> )}
													</div>
												) }
												renderContent={ () => (
													<DateTimePicker
														is12Hour={ is12HourTime }
														currentDate={scheduleEndDate}
														onChange={( value ) => this.setState( ( prevState ) => ({ scheduleEndDate: value }), this.updatePost() )}
													/>
												) }
											/>
										</Fragment>
										</IsPremium>
									)
								}
							</PanelRow>
						</PanelBody>
						{
							// Access
						}
						<PanelBody
							title={__( 'ACCESS', '@@pkg.textdomain'  )}
							initialOpen={false}
						>
							<PanelRow className="">
								<ToggleControl
									label={__( 'Show normal website to logged in users?', '@@pkg.textdomain'  )}
									help={__( 'Enable this option if you want logged in users to view the website normally while visitors see the maintenance page.', '@@pkg.textdomain'  )}
									checked={loginBypass}
									onChange={( value ) => this.setState( ( prevState ) => ({
										...prevState,
										loginBypass: value
									}), this.updatePost() )}
								/>

								<ToggleControl
									label={__( 'Redirect Mode', '@@pkg.textdomain'  )}
									help={__( 'Enable this option if you want to move your visitors to a new page. We will define the header as "301 Moved Permanently"', '@@pkg.textdomain'  )}
									checked={redirectMode}
									onChange={( value ) => this.setState( ( prevState ) => ({
										...prevState,
										redirectMode: value
									}), this.updatePost() )}
								/>

								{
									// Show if redirect mode is active
									redirectMode && (
										<TextControl
											label={__( 'Redirect Url', '@@pkg.textdomain'  )}
											value={redirectUrl}
											onChange={( value ) => this.setState( ( prevState ) => ({
												...prevState,
												redirectUrl: value
											}), this.updatePost() )}
										/>
									)
								}
								{
									// Hide if redirect mode is active
									!redirectMode && (
										<IsPremium plan="starter">
											<ToggleControl
												label={__( 'Password Protected', '@@pkg.textdomain'  )}
												help={__( 'Protected with a password you choose. Only those with the password can view the site.', '@@pkg.textdomain'  )}
												checked={passwordProtected}
												onChange={( value ) => this.setState( ( prevState ) => ({
													...prevState,
													passwordProtected: value
												}), this.updatePost() )}
											/>
											{
												// Show if password protected mode is active
												passwordProtected && (
													<Fragment>
														<TextControl
															label={__( 'Password', '@@pkg.textdomain'  )}
															value={password}
															onChange={( value ) => this.setState( ( prevState ) => ({
																...prevState,
																password: value
															}), this.updatePost() )}

															onFocus={( value ) => passwordField = 'text'}
															onblur={( value ) => passwordField = 'password'}
														/>
														<p onClick={openLookAndFeelSidebar}
														   data-editor-component="notice"
														   data-notice="warning">{__( 'To change the element colors see the sidebar "Look & Feel"', '@@pkg.textdomain'  )}</p>
													</Fragment>
												)
											}
										</IsPremium>
									)
								}
							</PanelRow>
						</PanelBody>
						{
							// Cookie Notice
						}
						<PanelBody
							title={__( 'COOKIE NOTICE', '@@pkg.textdomain'  )}
							initialOpen={false}
						>
							<PanelRow className="">
								<ToggleControl
									label={__( 'Enable Cookie Notice', '@@pkg.textdomain'  )}
									help={__( 'By activating this option a small notice will appear notifying the visitor that the site uses cookies.', '@@pkg.textdomain'  )}
									checked={cookieNotice}
									onChange={( value ) => this.setState( ( prevState ) => ({ cookieNotice: value }), this.updatePost() )}
								/>
							</PanelRow>
						</PanelBody>
						{
							// Custom CSS & JS
						}
						<PanelBody
							title={__( 'CUSTOM CSS & JS', '@@pkg.textdomain'  )}
							initialOpen={false}
						>
							<PanelRow className="">

								<TextControl
									label={__( 'Google Analytics Tracking ID', '@@pkg.textdomain'  )}
									value={googleAnalytics}
									onChange={( value ) => this.setState( ( prevState ) => ({
										...prevState,
										googleAnalytics: value
									}), this.updatePost() )}
								/>

								<IsPremium>
									<TextareaControl
										label={__( 'Tracking Pixel & 3rd Party Analytics Code', '@@pkg.textdomain'  )}
										help={__( 'Copy&paste the complete code, including the opening and closing <script> tags.', '@@pkg.textdomain'  )}
										value={othersAnalytics}
										onChange={( value ) => this.setState( ( prevState ) => ({
											...prevState,
											othersAnalytics: value
										}), this.updatePost() )}
									/>
								</IsPremium>

								<IsPremium>
									<TextareaControl
										label={__( 'JS', '@@pkg.textdomain'  )}
										rows="6"
										help={__( 'Copy&paste the complete code, including the opening and closing <script> tags.', '@@pkg.textdomain'  )}
										value={JSCode}
										onChange={( value ) => this.setState( ( prevState ) => ({
											...prevState,
											JSCode: value
										}), this.updatePost() )}
									/>
								</IsPremium>

								<IsPremium>
									<TextareaControl
										label={__( 'CSS', '@@pkg.textdomain'  )}
										rows="6"
										value={CSSCode}
										onChange={( value ) => this.setState( ( prevState ) => ({
											...prevState,
											CSSCode: value
										}), this.updatePost() )}
									/>
								</IsPremium>

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
	const { editPost }               = dispatch( 'core/editor' );
	const { togglePinnedPluginItem } = dispatch( 'core/edit-post' );

	return {
		editPost,
		openLookAndFeelSidebar() {
			// togglePinnedPluginItem( 'pixelthrone--comingsoonblocks-look-and-feel' );
		},
	};
} );

// Select
const applyWithSelect = withSelect( ( select ) => {
	const { isSavingPost } = select( 'core/editor' );

	return {
		isSaving: isSavingPost(),
	};
} );

const ComponentWithDispatch = compose( applyWithDispatch, applyWithSelect )( TemplatesSidebar );

// Add Plugin
registerPlugin( sidebar_name, {
	icon: <SidebarIcon/>,
	render: () => <ComponentWithDispatch/>,
} );
