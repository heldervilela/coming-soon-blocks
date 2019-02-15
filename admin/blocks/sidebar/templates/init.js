/**
 * WordPress dependencies
 */
const { compose }                                  = wp.compose;
const { withDispatch, withSelect }                 = wp.data;
const { Component, Fragment }                      = wp.element;
const { createBlock }                              = wp.blocks;
const { PluginSidebar, PluginSidebarMoreMenuItem } = wp.editPost;
const { registerPlugin }                           = wp.plugins;
const { __ }                                       = wp.i18n;
const {
	      Button,
      }                                            = wp.components;

/**
 * Internal dependencies
 */
import './editor.scss';

const mediaURL     = csblocks.baseURL;
const sidebar_name = "pixelthrone--comingsoonblocks-templates";
import available_blocks from '../../available-blocks.json' ;
import SVG_ICON from './media/add.svg'

/**
 * Icon
 */
function SidebarIcon() {
	return (
		<span className="layout--header--show-template-button">
			<SVG_ICON v="3" />
        </span>
	);
}

/**
 * Icon Components
 */
const MenuItem = () => (
	<PluginSidebarMoreMenuItem
		target={sidebar_name}
	>
		{__( 'Page Templates', '@@pkg.textdomain'  )}
	</PluginSidebarMoreMenuItem>
);

/**
 * Main Component
 */
const BlockThumbButton = ( { attr, action, index } ) => (
	<div className='template-thumb-button'>
		<img src={mediaURL + attr.thumb.img}/>
		<Button onClick={( event ) => {
			event.preventDefault();
			action( attr.name );
		}} isDefault>{__( 'Add Template', '@@pkg.textdomain'  )}</Button>
	</div>
);

/**
 * Main Component
 */
class TemplatesSidebar extends Component {
	constructor( { attributes } ) {
		super( ...arguments );

		this.addTemplate = this.addTemplate.bind( this );
	}

	addTemplate( blockName ) {

		const block = createBlock( blockName, {} );

		this.props.resetBlocks([]);
		this.props.insertBlock( block );
	}

	render() {
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
					className="teste"
					title={__( "Page Templates", '@@pkg.textdomain'  )}
				>
					<div data-component="sidebar--available-blocks">
						{
							Object.keys( available_blocks ).map( ( key, i ) => (
								<BlockThumbButton attr={available_blocks[key]}
								                  action={this.addTemplate} index={i}
								                  key={i}/>
							) )
						}
					</div>
				</PluginSidebar>

			</Fragment>
		)
	}
}

const ComponentWithDispatch = compose(
	withDispatch( dispatch => ({
		resetBlocks: dispatch( "core/editor" ).resetBlocks,
		insertBlock: dispatch( "core/editor" ).insertBlock,
	}) ),
	withSelect( select => ({
		getBlocks: select( "core/editor" ).getBlocks(),
	}) )
)( TemplatesSidebar );

registerPlugin( sidebar_name, {
	icon: <SidebarIcon/>,
	render: () => <ComponentWithDispatch/>,
} );

