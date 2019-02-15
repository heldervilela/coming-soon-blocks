const { __ }        = wp.i18n;
const { Component, Fragment } = wp.element;
const {
	      Spinner,
      }             = wp.components;

import Flickity from 'react-flickity-component'


/**
 * Background Overlayer
 *
 * @since    1.0.0
 */
export const BlockBackgroundOverLayer = ( { attrs } ) => {
	return attrs.opacity !== 0 &&  (
		<div data-component="block-background-overlayer" style={{background: `${attrs.color}`, opacity: attrs.opacity / 100}}/>
	);
};


/**
 * Background Types
 *
 * @since    1.0.0
 */
const flickityOptions = {
	autoPlay: 5000,
	pageDots: false,
	prevNextButtons: false,
	draggable: false,
	wrapAround: true
};

export const BlockBackground = ( { background } ) => {
	const bgAttr = JSON.parse(background);
	let typeElement = '';

	switch ( bgAttr.type ) {
		case 'color':
			typeElement = bgAttr.color && (
				<div className="color-element" style={{backgroundColor: bgAttr.color}}></div>
			);
		break;

		// @todo Adicionar um component para lazy loading
		case 'image':
			typeElement = bgAttr.image.full && (
				<div className="image-element">
					<span style={{ backgroundImage: `url(${ bgAttr.image.full })` }}/>
					<span style={{ backgroundImage: `url(${ bgAttr.image.thumb })` }}><Spinner/></span>
				</div>
			);
		break;

		case 'gallery':
			typeElement = (
				<div className="gallery-element">
					<Flickity
						elementType={'div'}
						options={flickityOptions} // takes flickity options {}
						disableImagesLoaded={false} // default false
						reloadOnUpdate
					>
						{ bgAttr.gallery.map( ( {full, id} ) => {
							return (
									<span><img src={full}/></span>
							)}
						) }
					</Flickity>
				</div>
			);
		break;

		case 'video':
			typeElement = bgAttr.video.url && (
					<div className="video-element">
						<video playsinline autoPlay loop muted src={bgAttr.video.url} poster={bgAttr.image.full} />
					</div>
			);
		break;
	}

	return (
		<div data-component="block-background">
			{ typeElement }
		</div>
	);
};