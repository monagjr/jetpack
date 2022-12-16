<?php
/**
 * Class used to manage backwards-compatibility of the package
 *
 * @package automattic/jetpack-waf
 */

namespace Automattic\Jetpack\Waf;

/**
 * Defines methods for ensuring backwards compatibility.
 */
class Waf_Compatibility {

	/**
	 * Add compatibilty hooks
	 *
	 * @since 0.8.0
	 *
	 * @return void
	 */
	public static function add_compatibility_hooks() {
		add_filter( 'default_option_' . Waf_Runner::AUTOMATIC_RULES_ENABLED_OPTION_NAME, __CLASS__ . '::default_option_waf_automatic_rules', 10, 3 );
	}

	/**
	 * Provides a default value for sites that installed the WAF
	 * before the automatic rules option was introduced.
	 *
	 * @since 0.8.0
	 *
	 * @param mixed  $default         The default value to return if the option does not exist in the database.
	 * @param string $option          Option name.
	 * @param bool   $passed_default  Was get_option() passed a default value.
	 *
	 * @return mixed The default value to return if the option does not exist in the database.
	 */
	public static function default_option_waf_automatic_rules( $default, $option, $passed_default ) {
		// Allow get_option() to override this default value
		if ( $passed_default ) {
			return $default;
		}

		return self::get_default_automatic_rules_option();
	}

	/**
	 * If the option is not available, use the WAF module status
	 * to determine whether or not to run automatic rules
	 */
	public static function get_default_automatic_rules_option() {
		return Waf_Runner::is_enabled();
	}

}
