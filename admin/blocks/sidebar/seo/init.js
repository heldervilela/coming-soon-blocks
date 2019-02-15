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
	      TextControl,
	      TextareaControl,
	      Spinner,
	      PanelBody,
	      PanelRow,
	      ToggleControl,
	      Tooltip
      }                                            = wp.components;

/**
 * Internal dependencies
 */
import './editor.scss';

const SAVED_SEO_META = csblocks.seo;
const sidebar_name        = "pixelthrone--comingsoonblocks-seo";
import SVG_ICON from './media/icon.svg'
import {mergeSavedPostMetaOptions} from "../../../../public/_scripts/block-editor/utils/tools.js";

/**
 * Icon
 */
function SidebarIcon() {
	return (
		<SVG_ICON className="seo-button" v="1"/>
	);
}

/**
 * Icon Components
 */
const MenuItem = () => (
	<PluginSidebarMoreMenuItem target={sidebar_name}>
		{__( "SEO", '@@pkg.textdomain'  )}
	</PluginSidebarMoreMenuItem>
);

/**
 * Main Component
 */
class TemplatesSidebar extends Component {
	constructor( props ) {
		super( props );

		this.state = mergeSavedPostMetaOptions( SAVED_SEO_META, {
			title: '',
			description: '',
			keywords: '',
			author: '',
			copyright: '',
			facebook: {
				title: '',
				description: '',
				cover: { id: '', url: '' },
			},
			twitter: {
				title: '',
				description: '',
				cover: { id: '', url: '' },
			},
			serviceUnavailable: false,
			noCache: false
		} );

		this.updatePost = this.updatePost.bind( this );
	}

	/**
	 * Update icon
	 */
	updatePost() {
		const { editPost } = this.props;
		setTimeout( () => {
			editPost( { comingsoonblocks_seo: JSON.stringify( this.state ) } );
		}, 200 );
	};

	render() {
		const { isSaving } = this.props;
		const {
			      title,
			      description,
			      keywords,
			      author,
			      copyright,
			      facebook,
			      twitter,
			      serviceUnavailable,
			      noCache,
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
					title={__( "SEO", '@@pkg.textdomain'  )}
				>

					<div data-component="sidebar--seo-options" data-loading={isSaving ? 'true' : 'false'}>

						{
							isSaving && <Spinner/>
						}

						<PanelBody
							title={__( 'SEARCH ENGINES', '@@pkg.textdomain'  )}
							initialOpen={true}
						>
							<PanelRow className="">
								<TextControl
									label={__( 'Page Title', '@@pkg.textdomain'  )}
									value={title}
									onChange={( value ) => this.setState( ( prevState ) => ({
										...prevState,
										title: value
									}), this.updatePost() )}
								/>

								<TextareaControl
									label={__( 'Meta Description', '@@pkg.textdomain'  )}
									value={description}
									onChange={( value ) => this.setState( ( prevState ) => ({
										...prevState,
										description: value
									}), this.updatePost() )}
								/>

								<TextControl
									label={__( 'keywords', '@@pkg.textdomain'  )}
									help={__( 'eg: SEO, search engine optimisation, optimization', '@@pkg.textdomain' )}
									value={keywords}
									onChange={( value ) => this.setState( ( prevState ) => ({
										...prevState,
										keywords: value
									}), this.updatePost() )}
								/>

								<TextControl
									label={__( 'Author', '@@pkg.textdomain'  )}
									help={__( 'eg: SEO, search engine optimisation, optimization', '@@pkg.textdomain' )}
									value={author}
									onChange={( value ) => this.setState( ( prevState ) => ({
										...prevState,
										author: value
									}), this.updatePost() )}
								/>

								<TextControl
									label={__( 'Copyright', '@@pkg.textdomain' )}
									help={__( 'eg: SEO, search engine optimisation, optimization', '@@pkg.textdomain' )}
									value={copyright}
									onChange={( value ) => this.setState( ( prevState ) => ({
										...prevState,
										copyright: value
									}), this.updatePost() )}
								/>

								<ToggleControl
									label={__( 'Temporarily Pause Search Engines', '@@pkg.textdomain' )}
									help={__( 'If your site is already indexed and you\'re just taking it down for a while, enable this option. It temporarily discourages search engines from crawling the site by telling them it\'s under construction by sending a 503 Service Unavailable response.', '@@pkg.textdomain' )}
									checked={serviceUnavailable}
									onChange={( value ) => this.setState( ( prevState ) => ({
										...prevState,
										serviceUnavailable: value
									}), this.updatePost() )}
								/>

								<ToggleControl
									label={__( 'Send no-cache Headers', '@@pkg.textdomain' )}
									help={__( 'If you don\'t want the coming soon page\'s preview to be cached by Facebook and other social media enable this option. Once you switch to the normal site social media preview (visible when sharing the site\'s link) will immediately be refreshed.', '@@pkg.textdomain' )}
									checked={noCache}
									onChange={( value ) => this.setState( ( prevState ) => ({
										...prevState,
										noCache: value
									}), this.updatePost() )}
								/>
							</PanelRow>
						</PanelBody>
						{
							// Facebook
						}
						<PanelBody
							title={__( 'FACEBOOK', '@@pkg.textdomain' )}
							initialOpen={false}
						>
							<PanelRow>
								<TextControl
									label={__( 'Facebook Title', '@@pkg.textdomain' )}
									value={facebook.title}
									onChange={( value ) => this.setState( ( prevState ) => ({
										...prevState,
										facebook: { ...prevState.facebook, title: value }
									}), this.updatePost() )}
								/>
								<TextareaControl
									label={__( 'Facebook Description', '@@pkg.textdomain' )}
									value={facebook.description}
									onChange={( value ) => this.setState( ( prevState ) => ({
										...prevState,
										facebook: { ...prevState.facebook, description: value }
									}), this.updatePost() )}
								/>
								<label>{__( 'Facebook Cover Image', '@@pkg.textdomain' )}</label>
								<p>
									<small>The recommended size is 1024 by 512 pixels.</small>
								</p>

								<MediaUpload
									onSelect={( media ) => {
										const obj = { id: media.id, url: media.url };
										this.setState( ( prevState ) => ({
											...prevState,
											facebook: { ...prevState.facebook, cover: obj }
										}), this.updatePost() );
										this.updatePost()
									}}
									allowedTypes={['image']}
									value={facebook.cover.id}
									render={( { open } ) => (
										<div data-editor-component="inspector-controls--image-uploader">
											{facebook.cover.url &&
											<img onClick={open} src={facebook.cover.url}/>}
											<Button onClick={open}
											        isDefault>{facebook.cover.id ? __( 'Replace image', '@@pkg.textdomain' ) : __( 'Add image', '@@pkg.textdomain' )}</Button>
										</div>
									)}
								/>
							</PanelRow>
						</PanelBody>
						{
							// Twitter
						}
						<PanelBody
							title={__( 'TWITTER', '@@pkg.textdomain' )}
							initialOpen={false}
						>
							<PanelRow>
								<TextControl
									label={__( 'Twitter Title', '@@pkg.textdomain' )}
									value={twitter.title}
									onChange={( value ) => this.setState( ( prevState ) => ({
										...prevState,
										twitter: { ...prevState.twitter, title: value }
									}), this.updatePost() )}
								/>
								<TextareaControl
									label={__( 'Twitter Description', '@@pkg.textdomain' )}
									value={twitter.description}
									onChange={( value ) => this.setState( ( prevState ) => ({
										...prevState,
										twitter: { ...prevState.twitter, description: value }
									}), this.updatePost() )}
								/>
								<label>{__( 'Twitter Cover Image', '@@pkg.textdomain' )}</label>
								<p>
									<small>The recommended size is 1200 by 630 pixels.</small>
								</p>
								<MediaUpload
									onSelect={( media ) => {
										const obj = { id: media.id, url: media.url };
										this.setState( ( prevState ) => ({
											...prevState,
											twitter: { ...prevState.twitter, cover: obj }
										}), this.updatePost() );
										this.updatePost()
									}}
									allowedTypes={['image']}
									value={twitter.cover.id}
									render={( { open } ) => (
										<div data-editor-component="inspector-controls--image-uploader">
											{twitter.cover.url &&
											<img onClick={open} src={twitter.cover.url}/>}
											<Button onClick={open}
											        isDefault>{twitter.cover.id ? __( 'Replace image', '@@pkg.textdomain' ) : __( 'Add image', '@@pkg.textdomain' )}</Button>
										</div>
									)}
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
	const { getPostType }                                            = select( 'core' );
	const { getCurrentPostId, getEditedPostAttribute, isSavingPost } = select( 'core/editor' );

	return {
		currentPostId: getCurrentPostId(),
		postType: getPostType( getEditedPostAttribute( 'type' ) ),
		isSaving: isSavingPost(), // forceIsSaving
	};
} );

const ComponentWithDispatch = compose( applyWithDispatch, applyWithSelect )( TemplatesSidebar );

// Add Plugin
registerPlugin( sidebar_name, {
	icon: <SidebarIcon/>,
	render: () => <ComponentWithDispatch/>,
} );
