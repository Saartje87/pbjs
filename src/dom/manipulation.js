var tableInnerHTMLbuggie = false;

try {

	doc.createElement('table').innerHTML = '<tr></tr>';
} catch (e) {

	tableInnerHTMLbuggie = true;
}

PB.overwrite(PB.dom, {

	/**
	 * Append element to self
	 */
	append: function ( element ) {

		if( (element = Dom.get(element)) === null ) {

			return null;
		}

		this.node.appendChild( element.node );

		return this;
	},

	/**
	 * Append self to target element
	 */
	appendTo: function ( target ) {

		if( (target = Dom.get(target)) === null ) {

			return null;
		}

		target.append( this );

		return this;
	},

	/**
	 * Insert self before target element
	 */
	insertBefore: function ( target ) {

		if( (target = Dom.get(target)) === null ) {

			return null;
		}

		target.node.parentNode.insertBefore( this.node, target.node );

		return this;
	},

	/**
	 * Insert self after target element
	 */
	insertAfter: function ( target ) {

		if( (target = Dom.get(target)) === null ) {

			return null;
		}

		var next = target.next();

		if( next === null ) {

			target.parent().node.appendChild( this.node );
		} else {

			target.parent().node.insertBefore( this.node, next.node );
		}

		return this;
	},

	insertFirst: function ( target ) {

		if( (target = Dom.get(target)) === null ) {

			return null;
		}

		if( target.first() === null ) {

			target.append( this );
		} else {

			this.insertBefore( target.first() );
		}

		return this;
	},

	replace: function ( target ) {

		if( (target = Dom.get(target)) === null ) {

			return null;
		}

		this.insertBefore( target );

		target.remove();

		return this;
	},

	clone: function ( deep ) {

		var clone = this.node.cloneNode( deep ),
			childs = clone.getElementsByTagName('*'),
			length = childs,
			i = 0;

		clone.removeAttribute('id');
		clone.removeAttribute('__PBJS_ID__');

		for ( ; i < length; i++) {

			childs[i].removeAttribute('id');
			childs[i].removeAttribute('__PBJS_ID__');
		}

		this._flagged_ = true;

		return Dom.get(clone);
	},

	remove: function () {

		var node = this.node,
			pbid = node.__PBJS_ID__;
		
		// Stop morph if needed, do not trigger callback etc
		if( this.get('__morph') ) {
			
			this.stop(false, false);
		}
		
		// Purge all attached events
		_Event.purge( pbid );
		
		// Only do removeChild when element has a parentNode
		if( node.parentNode ) {

			node.parentNode.removeChild( node );
		}
		
		// Clear storage
		this.node = this.storage = node = null;
		
		// Clear cache
		delete PB.cache[pbid];
	},

	empty: function () {

		this.html('');

		return this;
	},

	/**
	 * @todo script tags with src tag set should be appended to document
	 */
	html: function ( html, evalScripts ) {

		if( html === undefined ) {

			return this.node.innerHTML;
		}

		// IE <= 9 table innerHTML issue
		if( tableInnerHTMLbuggie ) {

			if( /^<(tbody|tr)>/i.test( html ) ) {

				var table = Dom.create('<table>'+html+'</table>');

				this.html('');

				(table.first().nodeName === 'TBODY' ? table.first() : table)
					.childs().invoke('appendTo', this);

				return this;
			}
			if ( /^<(td)>/i.test( html ) ) {

				var table = Dom.create('<table><tr>'+html+'</tr></table>');

				this.html('');

				table.find('td').invoke('appendTo', this);

				return this;
			}
			if( /(TBODY|TR|TD|TH)/.test(this.nodeName) ) {

				this.childs().invoke('remove');

				return this;
			}
		}

		this.node.innerHTML = html;
		
		// 
		if( evalScripts ) {

			// Replace script tags in html string and executes the contents of the
			// script tag
			html = html.replace(/<script(?:\ssrc="(.*?)")*[^>]*>([\s\S]*?)<\/script>/ig, function ( match, src, text ) {
				
				if( src ) {
					
					// Add external tag
				} else if( text ) {
					
					PB.exec( text );	
				}

				return '';
			});
		}

		return this;
	},

	// Should this replace content of this.node? or just add..
	text: function ( str ) {

		var node = this.node;

		if( str === undefined ) {

			// clean this up
			return node.text || node.textContent || node.innerText || node.innerHTML || '';
		}

		this.empty();

		node.appendChild( doc.createTextNode( str ) );

		return this;
	}
});

