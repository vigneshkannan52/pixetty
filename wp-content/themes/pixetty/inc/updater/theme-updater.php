<?php
/**
 * Easy Digital Downloads Theme Updater
 *
 * @package WordPress
 * @subpackage Pixetty
 * @since Pixetty 1.0.0
 */
// Includes the files needed for the theme updater
if ( ! class_exists( 'Pixetty_EDD_Updater_Admin' ) ) {
	include( dirname( __FILE__ ) . '/theme-updater-admin.php' );
}
$pixetty_info           = wp_get_theme( get_template() );
$pixetty_name           = $pixetty_info->get( 'Name' );
$pixetty_slug           = get_template();
$pixetty_version        = $pixetty_info->get( 'Version' );
$pixetty_author         = $pixetty_info->get( 'Author' );
$pixetty_remote_api_url = $pixetty_info->get( 'AuthorURI' );
// Loads the updater classes
$pixetty_updater = new Pixetty_EDD_Updater_Admin(

// Config settings
	$pixetty_config = array(
		'remote_api_url' => $pixetty_remote_api_url, // Site where EDD is hosted
		'item_name'      => $pixetty_name, // Name of theme
		'theme_slug'     => $pixetty_slug, // Theme slug
		'version'        => $pixetty_version, // The current version of this theme
		'author'         => $pixetty_author, // The author of this theme
		'download_id'    => '', // Optional, used for generating a license renewal link
		'renew_url'      => '', // Optional, allows for a custom license renewal link
		'beta'           => false, // Optional, set to true to opt into beta versions
	),

	// Strings
	$pixetty_strings = array(
		'theme-license'             => esc_html__( 'Theme License', 'pixetty' ),
		'enter-key'                 => esc_html__( 'Enter your theme license key.', 'pixetty' ),
		'license-key'               => esc_html__( 'License Key', 'pixetty' ),
		'license-action'            => esc_html__( 'License Action', 'pixetty' ),
		'deactivate-license'        => esc_html__( 'Deactivate License', 'pixetty' ),
		'activate-license'          => esc_html__( 'Activate License', 'pixetty' ),
		'status-unknown'            => esc_html__( 'License status is unknown.', 'pixetty' ),
		'renew'                     => esc_html__( 'Renew?', 'pixetty' ),
		'unlimited'                 => esc_html__( 'unlimited', 'pixetty' ),
		'license-key-is-active'     => esc_html__( 'License key is active.', 'pixetty' ),
		'expires%s'                 => esc_html__( 'Expires %s.', 'pixetty' ),
		'expires-never'             => esc_html__( 'Lifetime License.', 'pixetty' ),
		'%1$s/%2$-sites'            => esc_html__( 'You have %1$s / %2$s sites activated.', 'pixetty' ),
		'license-key-expired-%s'    => esc_html__( 'License key expired %s.', 'pixetty' ),
		'license-key-expired'       => esc_html__( 'License key has expired.', 'pixetty' ),
		'license-keys-do-not-match' => esc_html__( 'License keys do not match.', 'pixetty' ),
		'license-is-inactive'       => esc_html__( 'License is inactive.', 'pixetty' ),
		'license-key-is-disabled'   => esc_html__( 'License key is disabled.', 'pixetty' ),
		'site-is-inactive'          => esc_html__( 'Site is inactive.', 'pixetty' ),
		'license-status-unknown'    => esc_html__( 'License status is unknown.', 'pixetty' ),
		'update-notice'             => esc_html__( "Updating this theme will lose any customizations you have made. 'Cancel' to stop, 'OK' to update.", 'pixetty' ),
		'update-available'          => wp_kses(__( '<strong>%1$s %2$s</strong> is available. <a href="%3$s" class="thickbox" title="%4s">Check out what\'s new</a> or <a href="%5$s" %6$s>update now</a>.', 'pixetty' ), array( 'strong' => array(), 'a' => array( 'class' => array(),'href' => array(),'title' => array() ) )),
	)

);
