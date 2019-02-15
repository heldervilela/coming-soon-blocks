import React, {Component} from 'react';
import {FontManager } from 'font-picker';
const { Spinner } = wp.components;

function _classCallCheck( instance, Constructor ) {
	if( !(instance instanceof Constructor) ) {
		throw new TypeError( "Cannot call a class as a function" );
	}
}

function _defineProperties( target, props ) {
	for( var i = 0; i < props.length; i++ ) {
		var descriptor          = props[i];
		descriptor.enumerable   = descriptor.enumerable || false;
		descriptor.configurable = true;
		if( "value" in descriptor ) descriptor.writable = true;
		Object.defineProperty( target, descriptor.key, descriptor );
	}
}

function _createClass( Constructor, protoProps, staticProps ) {
	if( protoProps ) _defineProperties( Constructor.prototype, protoProps );
	if( staticProps ) _defineProperties( Constructor, staticProps );
	return Constructor;
}

function _inherits( subClass, superClass ) {
	if( typeof superClass !== "function" && superClass !== null ) {
		throw new TypeError( "Super expression must either be null or a function" );
	}

	subClass.prototype = Object.create( superClass && superClass.prototype, {
		constructor: {
			value: subClass,
			writable: true,
			configurable: true
		}
	} );
	if( superClass ) _setPrototypeOf( subClass, superClass );
}

function _getPrototypeOf( o ) {
	_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf( o ) {
		return o.__proto__ || Object.getPrototypeOf( o );
	};
	return _getPrototypeOf( o );
}

function _setPrototypeOf( o, p ) {
	_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf( o, p ) {
		o.__proto__ = p;
		return o;
	};

	return _setPrototypeOf( o, p );
}

function _assertThisInitialized( self ) {
	if( self === void 0 ) {
		throw new ReferenceError( "this hasn't been initialised - super() hasn't been called" );
	}

	return self;
}

function _possibleConstructorReturn( self, call ) {
	if( call && (typeof call === "object" || typeof call === "function") ) {
		return call;
	}

	return _assertThisInitialized( self );
}

/**
 * React interface for the font picker
 * @prop {string} apiKey (required) - Google API key
 * @prop {string} activeFont - Font that should be selected in the font picker and applied to the
 * text (default: 'Open Sans'). Must be stored in component state, and be updated using an onChange
 * listener. See README.md for an example.
 * @prop {Object} options - Object with additional (optional) parameters:
 *   @prop {string} name - If you have multiple font pickers on your site, you need to give them
 *   unique names (which may only consist of letters and digits). These names must also be appended
 *   to the font picker's ID and the .apply-font class name.
 *   Example: If { name: 'main' }, use #font-picker-main and .apply-font-main
 *   @prop {string[]} families - If only specific fonts shall appear in the list, specify their
 *   names in an array
 *   @prop {string[]} categories - Array of font categories
 *   Possible values: 'sans-serif', 'serif', 'display', 'handwriting', 'monospace' (default: all
 *   categories)
 *   @prop {string[]} variants - Array of variants which the fonts must include and which will be
 *   downloaded; the first variant in the array will become the default variant (and will be used
 *   in the font picker and the .apply-font class)
 *   Example: ['regular', 'italic', '700', '700italic'] (default: ['regular'])
 *   @prop {number} limit - Maximum number of fonts to be displayed in the list (the least popular
 *   fonts will be omitted; default: 100)
 *   @prop {string} sort - Sorting attribute for the font list
 *   Possible values: 'alphabetical' (default), 'popularity'
 * @prop {function} onChange - Function which is executed whenever the user changes the active font
 * and its stylesheet finishes downloading
 */

var FontPicker =
	    /*#__PURE__*/
	    function( _Component ) {
		    _inherits( FontPicker, _Component );

		    function FontPicker( props ) {
			    var _this;

			    _classCallCheck( this, FontPicker );

			    _this       = _possibleConstructorReturn( this, _getPrototypeOf( FontPicker ).call( this, props ) );
			    _this.state = {
				    activeFont: _this.props.activeFont,
				    errorText: '',
				    expanded: false,
				    loadingStatus: 'loading' // possible values: 'loading', 'finished', 'error'

			    }; // Determine selector suffix from font picker's name

			    if( _this.props.options && _this.props.options.name ) {
				    _this.pickerSuffix = "-".concat( _this.props.options.name );
			    } else {
				    _this.pickerSuffix = '';
			    } // initialize FontManager object and generate the font list

			    _this.fontManager = new FontManager( _this.props.apiKey, _this.props.activeFont, _this.props.options );

			    _this.fontManager.init().then( function() {
				    // font list has finished loading

				    _this.setState( {
					    errorText: '',
					    loadingStatus: 'finished'
				    } );
			    } ).catch( function( err ) {
				    // error while loading font list
				    _this.setState( {
					    errorText: 'Error trying to fetch the list of available fonts',
					    loadingStatus: 'error'
				    } );

				    console.error( _this.state.errorText );
				    console.error( err );
			    } ); // function bindings

			    _this.setActiveFont  = _this.setActiveFont.bind( _assertThisInitialized( _assertThisInitialized( _this ) ) );
			    _this.onClose        = _this.onClose.bind( _assertThisInitialized( _assertThisInitialized( _this ) ) );
			    _this.onScroll       = _this.onScroll.bind( _assertThisInitialized( _assertThisInitialized( _this ) ) );
			    _this.toggleExpanded = _this.toggleExpanded.bind( _assertThisInitialized( _assertThisInitialized( _this ) ) );
			    return _this;
		    }

		    /**
		     * After every component update, check whether the activeFont prop has changed. If so, change the
		     * font in the fontManager as well
		     */


		    _createClass( FontPicker, [{
			    key: "componentDidUpdate",
			    value: function componentDidUpdate() {
				    if( this.state.activeFont !== this.props.activeFont ) {
					    this.setActiveFont( this.props.activeFont );
				    }
			    }
			    /**
			     * EventListener for closing the font picker when clicking anywhere outside it
			     */

		    }, {
			    key: "onClose",
			    value: function onClose( e ) {
				    var targetElement = e.target; // clicked element

				    do {
					    if( targetElement === document.getElementById( 'font-picker' ) ) {
						    // click inside font picker
						    return;
					    } // move up the DOM

					    targetElement = targetElement.parentNode;
				    } while( targetElement ); // click outside font picker

				    this.toggleExpanded();
			    }
			    /**
			     * Download the font previews for all visible font entries and the five after them
			     */

		    }, {
			    key: "onScroll",
			    value: function onScroll( e ) {
				    var elementHeight = e.target.scrollHeight / this.fontManager.fonts.length;
				    var downloadIndex = Math.ceil( (e.target.scrollTop + e.target.clientHeight) / elementHeight );
				    this.fontManager.downloadPreviews( downloadIndex + 5 );
			    }
			    /**
			     * Set the font with the given font list index as the active one
			     */

		    }, {
			    key: "setActiveFont",
			    value: function setActiveFont( fontFamily ) {
				    var activeFontIndex = this.fontManager.setActiveFont( fontFamily );

				    if( activeFontIndex === -1 ) {
					    // error trying to change font
					    this.setState( {
						    activeFont: fontFamily,
						    errorText: "Cannot update activeFont: The font \"".concat( fontFamily, "\" is not in the font list" ),
						    loadingStatus: 'error'
					    } );
					    console.error( this.state.errorText );
				    } else {
					    // font change successful
					    this.setState( {
						    activeFont: fontFamily,
						    errorText: '',
						    loadingStatus: 'finished'
					    } );
				    }
			    }
			    /**
			     * Expand/collapse the picker's font list
			     */

		    }, {
			    key: "toggleExpanded",
			    value: function toggleExpanded() {
				    if( this.state.expanded ) {
					    this.setState( {
						    expanded: false
					    } );
					    document.removeEventListener( 'click', this.onClose );
				    } else {
					    this.setState( {
						    expanded: true
					    } );
					    document.addEventListener( 'click', this.onClose );
				    }
			    }
		    }, {
			    key: "render",
			    value: function render() {
				    var _this2 = this;

				    // generate <ul> with font list; fetch font previews on scroll
				    var fontList;

				    fontList = React.createElement( "ul", {
					    className: this.state.expanded ? 'expanded' : '',
					    onScroll: this.onScroll
				    }, this.fontManager.fonts.map( function( font ) {
					    var isActive = font.family === _this2.state.activeFont;
					    var fontId   = font.family.replace( /\s+/g, '-' ).toLowerCase();
					    return React.createElement( "li", {
						    key: font.family
					    }, React.createElement( "button", {
						    type: "button",
						    className: "font-".concat( fontId ).concat( _this2.pickerSuffix, " " ).concat( isActive ? 'active-font' : '' ),
						    onClick: function onClick() {
							    _this2.props.onChange( font );
						    },
						    onKeyPress: function onKeyPress() {
							    _this2.props.onChange( font );
						    }
					    }, font.family ) );
				    } ) );

				    return (
					    <div id="font-picker">
						    { this.state.loadingStatus === 'loading'  && <Spinner/>}
						    {fontList}
					    </div>
				    );

			    }
		    }] );

		    return FontPicker;
	    }( Component );

export default FontPicker;
//# sourceMappingURL=FontPicker.es.js.map
