const { MediaUpload } = wp.editor;

/**
 * Component
 *
 * @since    1.0.0
 */
export default ( { onSelect, allowedMediaTypes, logoAttrs, style, align, className, logoWithMask } ) => {

	if( logoWithMask ) {
		style = {
			...style,
			width: style.maxWidth,
			height: style.maxWidth,
			backgroundImage: `url('${logoAttrs.url}')`,
		};
	}

	return (
		<MediaUpload
			onSelect={onSelect}
			allowedTypes={allowedMediaTypes}
			value={logoAttrs.id}
			render={( { open } ) => (
				<button data-editor-component="brand-uploader" onClick={open} className={`-${align}-align ${className}`}>
					<i className="dashicons dashicons-edit"></i>
					{ ! logoWithMask ? <img style={style} src={logoAttrs.url}/> : <span style={style} className="image-add-mask"></span>}
				</button>
			)}
		/>
	);
};
