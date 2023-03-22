<?php
/**
 * Critical CSS Invalidator
 *
 * Reset critical CSS when existing critical css values are stale.
 */
namespace Automattic\Jetpack_Boost\Lib\Critical_CSS;

use Automattic\Jetpack_Boost\Modules\Optimizations\Cloud_CSS\Cloud_CSS;
use Automattic\Jetpack_Boost\Modules\Optimizations\Cloud_CSS\Cloud_CSS_Followup;

class Critical_CSS_Invalidator {
	/**
	 * Register hooks.
	 */
	public static function init() {
		add_action( 'jetpack_boost_deactivate', array( __CLASS__, 'clear_data' ) );
		add_action( 'handle_environment_change', array( __CLASS__, 'handle_clear_cache' ) );
	}

	/**
	 * Clear Critical CSS data.
	 */
	public static function clear_data() {
		// Mass invalidate all cached values.
		// ^^ Not true anymore. Mass invalidate __some__ cached values.
		$storage = new Critical_CSS_Storage();
		$storage->clear();
		$state = new Critical_CSS_State();
		$state->clear();
		Cloud_CSS_Followup::unschedule();
	}

	/**
	 * Clear cached data and trigger side effects.
	 */
	public static function handle_clear_cache( $is_major_change ) {
		if ( $is_major_change ) {
			self::clear_data();

			$cloud_css = new Cloud_CSS();
			$cloud_css->regenerate_cloud_css();
			Cloud_CSS_Followup::schedule();
		}
	}

}
