const { MediaUpload } = wp.editor;

/**
 * Component
 *
 * @since    1.0.0
 */
export default ( { onSelect, allowedMediaTypes, imageAttrs, className } ) => {

	return (
		<MediaUpload
			onSelect={onSelect}
			allowedTypes={allowedMediaTypes}
			value={imageAttrs.id}
			render={( { open } ) => (
				<button data-editor-component="image-uploader" onClick={open} className={className}>
					<i className="dashicons dashicons-edit"></i>
					<img src={imageAttrs.url}/>
				</button>
			)}
		/>
	);
};
