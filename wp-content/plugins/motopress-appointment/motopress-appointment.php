<?php
/*
 * Plugin Name: Appointment Booking
 * Plugin URI: https://motopress.com/products/appointment-booking/
 * Description: MotoPress Appointment Booking makes it easy for time and service-based businesses to accept bookings and appointments online.
 * Version: 1.21.0
 * Requires at least: 5.3
 * Requires PHP: 7.0
 * Author: MotoPress
 * Author URI: https://motopress.com/
 * License: GPLv2 or later
 * Text Domain: motopress-appointment
 * Domain Path: /languages
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! defined( 'MotoPress\Appointment\VERSION' ) ) {

	define( 'MotoPress\Appointment\VERSION', '1.21.0' );
	define( 'MotoPress\Appointment\PLUGIN_FILE', __FILE__ );

	require 'includes/defines.php';
	require 'includes/functions.php';
	require 'includes/autoloader.php';

	$mpaPlugin = mpapp();

	register_activation_hook( __FILE__, array( $mpaPlugin, 'activate' ) );
	register_deactivation_hook( __FILE__, array( $mpaPlugin, 'deactivate' ) );
}
