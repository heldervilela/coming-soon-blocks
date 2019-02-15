import {Component} from 'react';
import unescape from 'lodash/unescape';

const { __ }      = wp.i18n;
const { Button, } = wp.components;

/**
 * Config
 */
import {DATA} from './settings.js';

/**
 * Utility Editor and Frontend Styles
 */
import '../../_styles/dashboard/dashboard.scss';
import '../../_styles/dashboard/global.scss';

/**
 * My Components
 */
import PageListing from "./components/PageListing";

/**
 * Component
 *
 * @since    1.2.0
 */
class Dashboard extends Component {
	render() {
		return (
			<div className="wrap">
				<div className="page-header__wrapper">
					<h1 className="wp-heading-inline">{__( 'Coming Soon', '@@pkg.textdomain' )}</h1>
				</div>
				<PageListing/>
				<div className="page-actions__wrapper">
					<Button isLarge href={unescape( DATA.new_post_link )}>
						{__( 'CREATE A NEW PAGE', '@@pkg.textdomain' )}
					</Button>
				</div>
			</div>
		);
	}
}

// Document Ready
// Render
ReactDOM.render(
	<Dashboard/>,
	document.getElementById( "coming-soon-blocks--dashboard" )
);
