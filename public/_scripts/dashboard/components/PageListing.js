import { Fragment, Component } from 'react'
import unescape from 'lodash/unescape';
const { __ } = wp.i18n;
const apiFetch = wp.apiFetch;
const {
	      IconButton,
	      ToggleControl,
	      DropdownMenu,
	      Tooltip,
	      Button,
	      Spinner,
      }                       = wp.components;

/**
 * Config
 */
import { DATA } from '../settings.js';
import AdminUIStatus from "../utils/AdminUIStatus";

/**
 * Page
 *
 * @since    1.1.0
 */
class PageRow extends Component {

	constructor(props) {
		super(props);

		this.state = {
			loading: false
		};
	}

	/**
	 * Render
	 */
	render() {
		const { thePost, activePage, changePageStatus, removePage } = this.props;
		const {loading} = this.state;

		const post = thePost;
		const active = (post.id === activePage);

		return (
			<div className="page__wrapper" data-active={active} data-loading={loading}>
				{loading && <Spinner/>}

				<div className="status__column">
					<Tooltip text={ active ? __( 'Active Page', '@@pkg.textdomain' ) : __( 'Deactivate Page', '@@pkg.textdomain' ) }>
						<ToggleControl
							checked={ active }
							onChange={ (value) => changePageStatus(value, post.id) }
						/>
					</Tooltip>
				</div>
				<div className="actions__column">
					<IconButton icon="edit" href={unescape(post.edit_link)} className="edit-button" label={__( 'Edit', '@@pkg.textdomain' )} />
					<DropdownMenu
						icon="trash"
						label="Remove Page"
						className="remove-button"
						controls={ [
							{
								title: __( 'Are you sure?', '@@pkg.textdomain' ),
								icon: 'trash',
								onClick: () => {
									removePage(post.id);
									this.setState( {loading:true });
								}
							},
						] }
					/>
				</div>
				<div className="title__column">
					<Button isLink href={unescape(post.edit_link)}>
						{ post.title === '' ? __( '(no title)', '@@pkg.textdomain' ) : post.title }
						<sub>
							{ post.status === 'draft' && __( '— Draft', '@@pkg.textdomain' )}
						</sub>
					</Button>
				</div>
				<div className="date__column">{post.date}</div>
			</div>
		);
	}
}


/**
 * Empty List
 *
 * @since    1.1.0
 */
const EmptyList = () => (
	<div className="empty-list__wrapper">
		<h4>{__( 'No pages found, add your first.', '@@pkg.textdomain' )}</h4>
	</div>
);

/**
 * Main Component
 *
 * @since    1.1.0
 */
class PagesList extends Component {

	constructor(props) {
		super(props);
		this.state = {
			active_page: Number( DATA.selected_page ),
			all_pages: DATA.all_pages
		};
	}

	/**
	 * Change page status
	 */
	handleChangePageStatus = (_value, _id) => {
		const active_page = ( _id === this.state.active_page ) ? null : _id;
		this.setState((state, props) => ({ ...state, active_page: active_page }) );

		// Update Status
		const args = {
			path: `/v1/coming-soon-blocks/update-post/${_id}`,
			method: 'POST',
			data: {id: _id}
		};
		AdminUIStatus( !! active_page );
		// @todo Validate error responses and show notices.
		apiFetch( args ).then( response => {
			// console.log( "...", response );
		} );
	};

	/**
	 * Remove page
	 */
	handleRemovePage = (_id) => {
		const {all_pages} = this.state;
		const newPages = _.reject(all_pages, (page) => {
			return page.id === _id;
		});

		// Remove
		apiFetch( { path: `/wp/v2/coming-soon-blocks/${_id}?force=true`, method: 'DELETE' } ).then( posts => {
			this.setState((state, props) => ({ ...state, all_pages: newPages }) );
		} );
	};

	/**
	 * Render
	 */
	render() {
		const { active_page, all_pages } = this.state;

		return (
			<div data-component="pages-list">
				{ all_pages.length ? all_pages.map( post => <PageRow key={post.id}
				                                  changePageStatus={this.handleChangePageStatus}
				                                  removePage={this.handleRemovePage}
				                                  activePage={active_page}
				                                  thePost={post}/> )
					:  <EmptyList/>
				}
			</div>
		);
	}
}

export default PagesList;
