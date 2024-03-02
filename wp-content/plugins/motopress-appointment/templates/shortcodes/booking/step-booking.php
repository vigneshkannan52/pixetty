<?php

/**
 * @since 1.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

?>
<div class="mpa-booking-step mpa-booking-step-booking mpa-hide">
	<p class="mpa-message">
		<?php esc_html_e( 'Making a reservation...', 'motopress-appointment' ); ?>
		<span class="mpa-preloader"></span>
	</p>

	<p class="mpa-actions mpa-hide">
		<?php echo mpa_tmpl_button( esc_html__( 'Back', 'motopress-appointment' ), array( 'class' => 'button button-secondary mpa-button-back' ) ); ?>
		<?php echo mpa_tmpl_button( esc_html__( 'Add New Reservation', 'motopress-appointment' ), array( 'class' => 'button button-primary mpa-button-reset' ) ); ?>
	</p>
</div>
