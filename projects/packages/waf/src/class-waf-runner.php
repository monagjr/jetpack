<?php
/**
 * Entrypoint for actually executing the WAF.
 *
 * @package automattic/jetpack-waf
 */

namespace Automattic\Jetpack\Waf;

/**
 * Executes the WAF.
 */
class Waf_Runner {

	const WAF_RULES_VERSION   = '1.0.0';
	const MODE_OPTION_NAME    = 'jetpack_waf_mode';
	const RULES_FILE          = __DIR__ . '/../rules/rules.php';
	const VERSION_OPTION_NAME = 'jetpack_waf_rules_version';

	/**
	 * Set the mode definition if it has not been set.
	 *
	 * @return void
	 */
	public static function define_mode() {
		if ( ! defined( 'JETPACK_WAF_MODE' ) ) {
			$mode_option = get_option( self::MODE_OPTION_NAME );
			define( 'JETPACK_WAF_MODE', $mode_option );
		}
	}

	/**
	 * Did the WAF run yet or not?
	 *
	 * @return bool
	 */
	public static function did_run() {
		return defined( 'JETPACK_WAF_RUN' );
	}

	/**
	 * Determines if the passed $option is one of the allowed WAF operation modes.
	 *
	 * @param  string $option The mode option.
	 * @return bool
	 */
	public static function is_allowed_mode( $option ) {
		$allowed_modes = array(
			'normal',
			'silent',
		);

		return in_array( $option, $allowed_modes, true );
	}

	/**
	 * Determines if the WAF module is enabled on the site.
	 *
	 * @return bool
	 */
	public static function is_enabled() {
		if ( class_exists( 'Jetpack' ) ) {
			return \Jetpack::is_module_active( 'firewall' );
		}

		return true;
	}

	/**
	 * Runs the WAF and potentially stops the request if a problem is found.
	 *
	 * @return void
	 */
	public static function run() {
		// Make double-sure we are only running once.
		if ( self::did_run() ) {
			return;
		}

		// if ABSPATH is defined, then WordPress has already been instantiated,
		// and we're running as a plugin (meh). Otherwise, we're running via something
		// like PHP's prepend_file setting (yay!).
		define( 'JETPACK_WAF_RUN', defined( 'ABSPATH' ) ? 'plugin' : 'preload' );

		// if the WAF is being run before a command line script, don't try to execute rules (there's no request).
		if ( PHP_SAPI === 'cli' ) {
			return;
		}

		// if something terrible happens during the WAF running, we don't want to interfere with the rest of the site,
		// so we intercept errors ONLY while the WAF is running, then we remove our handler after the WAF finishes.
		$display_errors = ini_get( 'display_errors' );
		// phpcs:ignore
		ini_set( 'display_errors', 'Off' );
		// phpcs:ignore
		set_error_handler( array( self::class, 'errorHandler' ) );

		try {

			// phpcs:ignore
			$waf = new Waf_Runtime( new Waf_Transforms(), new Waf_Operators() );

			// execute waf rules.
			// phpcs:ignore
			include self::RULES_FILE;
		} catch ( \Exception $err ) { // phpcs:ignore
			// Intentionally doing nothing.
		}

		// remove the custom error handler, so we don't interfere with the site.
		restore_error_handler();
		// phpcs:ignore
		ini_set( 'display_errors', $display_errors );
	}

	/**
	 * Error handler to be used while the WAF is being executed.
	 *
	 * @param int    $code The error code.
	 * @param string $message The error message.
	 * @param string $file File with the error.
	 * @param string $line Line of the error.
	 * @return void
	 */
	public static function errorHandler( $code, $message, $file, $line ) { // phpcs:ignore
		// Intentionally doing nothing for now.
	}

	/**
	 * Initializes the WP filesystem.
	 *
	 * @return void
	 * @throws \Exception If filesystem is unavailable.
	 */
	protected static function initialize_filesystem() {
		if ( ! function_exists( '\\WP_Filesystem' ) ) {
			require_once ABSPATH . 'wp-admin/includes/file.php';
		}

		if ( ! \WP_Filesystem() ) {
			throw new \Exception( 'No filesystem available.' );
		}
	}

	/**
	 * Activates the WAF by generating the rules script and setting the version
	 *
	 * @return void
	 */
	public static function activate() {
		self::define_mode();
		if ( ! self::is_allowed_mode( JETPACK_WAF_MODE ) ) {
			return;
		}
		$version = get_option( self::VERSION_OPTION_NAME );
		if ( ! $version ) {
			add_option( self::VERSION_OPTION_NAME, self::WAF_RULES_VERSION );
		}
		self::generate_rules();
	}

	/**
	 * Updates the rule set if rules version has changed
	 *
	 * @return void
	 */
	public static function update_rules_if_changed() {
		self::define_mode();
		if ( ! self::is_allowed_mode( JETPACK_WAF_MODE ) ) {
			return;
		}
		$version = get_option( self::VERSION_OPTION_NAME );
		if ( self::WAF_RULES_VERSION !== $version ) {
			update_option( self::VERSION_OPTION_NAME, self::WAF_RULES_VERSION );
			self::generate_rules();
		}
	}

	/**
	 * Generates the rules.php script
	 *
	 * @throws \Exception If filesystem is not available.
	 * @throws \Exception If file writing fails.
	 * @return void
	 */
	public static function generate_rules() {
		global $wp_filesystem;

		self::initialize_filesystem();

		// Ensure that the folder exists.
		if ( ! $wp_filesystem->is_dir( dirname( self::RULES_FILE ) ) ) {
			$wp_filesystem->mkdir( dirname( self::RULES_FILE ) );
		}
		if ( ! $wp_filesystem->put_contents( self::RULES_FILE, "<?php\n" ) ) {
			throw new \Exception( 'Failed writing to: ' . self::RULES_FILE );
		}
	}
}
