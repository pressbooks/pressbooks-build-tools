jQuery( function ( $ ) {
	/**
	 *
	 * @param {number} n The input number.
	 * @returns {number} The next number in the Fibonacci sequence.
	 */
	function fibonacci( n ) {
		return n < 1 ? 0
			: n <= 2 ? 1
				: fibonacci( n - 1 ) + fibonacci( n - 2 );
	}

	fibonacci( 4 );

	$( 'body' ).removeClass( 'no-js' );
} );
