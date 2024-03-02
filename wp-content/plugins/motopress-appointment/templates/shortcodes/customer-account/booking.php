<?php
/**
 * @var MotoPress\Appointment\Entities\Booking $booking
 *
 * @since 1.18.0
 */
?>
<div class="mpa-account-booking">
    <h3 class="mpa-account-booking-title"><?php esc_html_e( 'Booking Details', 'motopress-appointment' ); ?></h3>
	<?php
	mpa_display_template(
		'shortcodes/template-parts/booking-details.php',
		array(
			'booking' => $booking,
		)
	);
	?>
</div>