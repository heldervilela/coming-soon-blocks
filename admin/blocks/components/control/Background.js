/**
 * WordPress dependencies
 */
const { __ }                  = wp.i18n;
const { Component, Fragment } = wp.element;
const { MediaUpload }         = wp.editor;
const {
	      IconButton,
	      ColorPalette,
	      ColorIndicator
      }                       = wp.components;

/**
 * Internal dependencies
 */
import IsPremium from "../../components/control/IsPremium";
import { isEmpty } from "../../../../public/_scripts/block-editor/utils/tools.js";

/**
 * Config
 */
import {pluginColorPalette} from '../../../../public/_scripts/block-editor/global-settings';

/**
 * Component
 *
 * @since    1.0.0
 */
class BackgroundOptions extends Component {

	constructor( { attributes } ) {
		super( ...arguments );

		this.state = JSON.parse( this.props.attributes );

		this.uploadBgImage   = this.uploadBgImage.bind( this );
		this.uploadBgGallery = this.uploadBgGallery.bind( this );
		this.uploadBgVideo   = this.uploadBgVideo.bind( this );
		this.uploadBgColor   = this.uploadBgColor.bind( this );
		this.updateTab       = this.updateTab.bind( this );
	}

	/**
	 * Upload Single Image
	 */
	uploadBgImage( media ) {
		const { updateAttributes } = this.props;
		let NewState               = this.state;

		NewState.image = {
			id: media.id,
			full: media.sizes.full.url,
			thumb: media.sizes.medium.url,
		};

		this.setState( NewState );
		updateAttributes( JSON.stringify( NewState ) );
	}

	/**
	 * Upload Gallery
	 */
	uploadBgGallery( images ) {
		const { updateAttributes } = this.props;
		let NewState               = this.state;

		const newGallery = images.map( ( media ) => {
			return {
				id: media.id,
				full: media.sizes.full.url,
				thumb: media.sizes.medium.url,
			};
		} );

		NewState.gallery = newGallery;

		this.setState( NewState );
		updateAttributes( JSON.stringify( NewState ) );
	}

	/**
	 * Upload Video
	 */
	uploadBgVideo( media ) {
		const { updateAttributes } = this.props;
		let NewState               = this.state;

		NewState.video = {
			id: media.id,
			url: media.url,
			filename: media.filename,
		};

		this.setState( NewState );
		updateAttributes( JSON.stringify( NewState ) );
	}

	/**
	 * Upload color
	 */
	uploadBgColor( _color ) {
		const { updateAttributes } = this.props;
		let NewState               = this.state;
		NewState.color             = _color;

		this.setState( NewState );
		updateAttributes( JSON.stringify( NewState ) );
	}

	/**
	 * Update tab
	 */
	updateTab( _tab ) {
		const { updateAttributes } = this.props;
		let NewState               = this.state;
		NewState.type              = _tab;

		this.setState( NewState );
		updateAttributes( JSON.stringify( NewState ) );
	}

	/**
	 * View
	 */
	render() {
		const {
			      gallery,
			      color,
			      type,
			      image,
			      video,
		      } = this.state;

		const galleryIDs = gallery.length ? gallery.map( ( { id } ) => id ) : false;

		return (
			<div data-editor-component="background">
				<label>{__( 'Background Type', '@@pkg.textdomain' )}</label>
				{/* Menu */}
				<div className="tabs-menu">
					<IconButton
						icon="admin-customizer"
						label={__( 'Solid Color', '@@pkg.textdomain' )}
						data-active={type === 'color' ? 'true' : ''}
						onClick={( value ) => this.updateTab( 'color' )}
					/>

					<IconButton
						icon="format-image"
						label={__( 'Image', '@@pkg.textdomain' )}
						data-active={type === 'image' ? 'true' : ''}
						onClick={( value ) => this.updateTab( 'image' )}
					/>

					<IconButton
						icon="format-gallery"
						label={__( 'Gallery', '@@pkg.textdomain' )}
						data-active={type === 'gallery' ? 'true' : ''}
						onClick={( value ) => this.updateTab( 'gallery' )}
					/>

					<IconButton
						icon="format-video"
						label={__( 'Video', '@@pkg.textdomain' )}
						data-active={type === 'video' ? 'true' : ''}
						onClick={( value ) => this.updateTab( 'video' )}
					/>
				</div>
				{/* Content */}
				<div className="tabs-content">
					{
						/**
						 * Single Image
						 */
						type === 'color' && (
							<Fragment>
								<label className='single-field-label'>{__( 'Color', '@@pkg.textdomain' )} <ColorIndicator
									colorValue={color}/></label>
								<ColorPalette
									colors={pluginColorPalette}
									value={color}
									onChange={this.uploadBgColor}
								/>
							</Fragment>
						)
					}

					{
						/**
						 * Single Image
						 */
						type === 'image' && (
							<MediaUpload
								onSelect={this.uploadBgImage}
								allowedTypes={['image']}
								value={image.id}
								render={( { open } ) => (
									<Fragment>
										<label className="single-field-label">{__( 'Image', '@@pkg.textdomain' )}</label>
										{
											// With Image
											! isEmpty(image) && image.id !== '' ? (
												<Fragment>
													<IconButton
														data-editor-component="panel-uploader-placeholder"
														data-mode="replace"
														icon="edit"
														label={__( 'Change Image', '@@pkg.textdomain' )}
														onClick={open}
													>
														<img src={image.thumb}/>
													</IconButton>
												</Fragment>
											) : null
										}
										{
											// Without image
											isEmpty(image) || image.id === '' ? (
												<IconButton
													data-editor-component="panel-uploader-placeholder"
													data-mode="upload"
													icon="upload"
													label={__( 'Upload Image', '@@pkg.textdomain' )}
													onClick={open}
												/>
											) : null
										}
									</Fragment>
								)}
							/>
						)
					}

					{
						/**
						 * Gallery
						 */
						type === 'gallery' && (
							<IsPremium>
							<MediaUpload
								onSelect={this.uploadBgGallery}
								multiple
								gallery
								allowedTypes={['image']}
								value={galleryIDs}
								render={( { open } ) => (
									<Fragment>
										<label className="single-field-label">{__( 'Gallery', '@@pkg.textdomain' )}</label>
										{
											// With images
											galleryIDs.length ? (
												<IconButton
													data-editor-component="panel-uploader-placeholder"
													data-mode="replace"
													icon="edit"
													label={__( 'Change Gallery', '@@pkg.textdomain' )}
													onClick={open}
												>
													<div data-count={gallery.length}>
														{gallery.map( ( { thumb, id } ) => {
																return (
																	<span>
																<img src={thumb}/>
															</span>
																)
															}
														)}
													</div>
												</IconButton>
											) : null
										}
										{
											// Without images
											! galleryIDs.length ? (
												<IconButton
													data-editor-component="panel-uploader-placeholder"
													data-mode="upload"
													icon="upload"
													label={__( 'Upload Image', '@@pkg.textdomain' )}
													onClick={open}
												/>
											) : null
										}
									</Fragment>
								)}
							/>
							</IsPremium>
						)
					}

					{
						/**
						 * Video
						 */
						type === 'video' && (
							<IsPremium>
								<MediaUpload
									onSelect={this.uploadBgVideo}
									allowedTypes={['video/mp4', 'video/ogg', 'video/webm']}
									value={video.length ? video.id : ''}
									render={( { open } ) => (
										<Fragment>
											<label
												className="single-field-label">{__( 'Video' )} {video.id && `(${video.filename})`}</label>
											{
												// With video
												video.id && (
													<IconButton
														data-editor-component="panel-uploader-placeholder"
														data-mode="replace"
														icon="edit"
														label={__( 'Change Video', '@@pkg.textdomain' )}
														onClick={open}
													>
														<video muted src={video.url}/>
													</IconButton>
												)
											}
											{
												// Without video
												!video.id && (
													<IconButton
														data-editor-component="panel-uploader-placeholder"
														data-mode="upload"
														icon="upload"
														label={__( 'Upload Video', '@@pkg.textdomain' )}
														onClick={open}
													/>
												)
											}
										</Fragment>
									)}
								/>
								<br/>
								<MediaUpload
									onSelect={this.uploadBgImage}
									allowedTypes={['image']}
									value={image.id}
									render={( { open } ) => (
										<Fragment>
											<label className="single-field-label">{__( 'Poster', '@@pkg.textdomain' )}</label>
											{
												// With Image
												!isEmpty(image) && image.id !== '' ? (
													<IconButton
														data-editor-component="panel-uploader-placeholder"
														data-mode="replace"
														icon="edit"
														label={__( 'Change Image', '@@pkg.textdomain' )}
														onClick={open}
													>
														<img src={image.thumb}/>
													</IconButton>
												) : null
											}
											{
												// Without image
												isEmpty(image) || image.id === '' ? (
													<IconButton
														data-editor-component="panel-uploader-placeholder"
														data-mode="upload"
														icon="upload"
														label={__( 'Upload Image', '@@pkg.textdomain' )}
														onClick={open}
													/>
												) : null
											}
										</Fragment>
									)}
								/>
								<p data-editor-component="help-notice">{__( 'Specifies an image to be shown while the video is downloading, or until the user hits the play button.', '@@pkg.textdomain' )}</p>
							</IsPremium>
						)
					}

				</div>

			</div>
		)
	}
}

export default BackgroundOptions;
