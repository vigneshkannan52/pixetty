<?php
/**
 * @var \MotoPress\Appointment\Entities\Booking[] $bookings
 *
 * @since 1.18.0
 *
 */

if ( ! count( $bookings ) ) {
	return esc_html__( 'No booking has been made yet.', 'motopress-appointment' );
}
?>

<table class="mpa-account-bookings">
    <thead>
    <tr>
        <th><?php esc_html_e( 'Booking', 'motopress-appointment' ); ?></th>
        <th><?php esc_html_e( 'Status', 'motopress-appointment' ); ?></th>
        <th><?php esc_html_e( 'Time', 'motopress-appointment' ); ?></th>
        <th><?php esc_html_e( 'Total Price', 'motopress-appointment' ); ?></th>
        <th><?php esc_html_e( 'Total Paid', 'motopress-appointment' ); ?></th>
        <th><?php esc_html_e( 'Action', 'motopress-appointment' ); ?></th>
    </tr>
    </thead>
    <tbody>
	<?php foreach ( $bookings as $booking ):
		$bookingId = $booking->getId();
		$bookingStatus = $booking->getStatus();
		$bookingURL = mpapp()->shortcodes()->customerAccount()->getBookingURL( $bookingId );
		$bookingTotalPrice = $booking->getTotalPrice();
		$bookingTotalPaid = $booking->getPaidPrice();
		$reservations = $booking->getReservations(); ?>
        <tr>
            <td class="booking-number"
                data-title="<?php esc_html_e( 'Booking', 'motopress-appointment' ); ?>">
                <a href="<?php echo esc_url( $bookingURL ); ?>">
                    #<?php echo esc_html( $bookingId ); ?>
                </a>
            </td>
            <td class="booking-status"
                data-title="<?php esc_html_e( 'Status', 'motopress-appointment' ); ?>">
				<?php echo esc_html( $bookingStatus ); ?>
            </td>
            <td class="booking-time"
                data-title="<?php esc_html_e( 'Time', 'motopress-appointment' ); ?>">
				<?php foreach ( $reservations as $reservation ):
					$reservationDate = mpa_format_date( $reservation->getDate() );
					$reservationTime = $reservation->getServiceTime()->toString();
					?>
                    <div class="booking-reservation">
                        <span class="reservation-date"><?php echo esc_html( $reservationDate ); ?></span>
                        <span class="reservation-time"><?php echo esc_html( $reservationTime ); ?></span>
                    </div>
				<?php endforeach; ?>
            </td>
            <td class="booking-total-price"
                data-title="<?php esc_html_e( 'Total Price', 'motopress-appointment' ); ?>">
				<?php echo mpa_tmpl_price( $bookingTotalPrice ); ?>
            </td>
            <td class="booking-total-paid"
                data-title="<?php esc_html_e( 'Total Paid', 'motopress-appointment' ); ?>">
				<?php echo mpa_tmpl_price( $bookingTotalPaid, array( 'literal_free' => false ) ); ?>
            </td>
            <td class="booking-actions"
                data-title="<?php esc_html_e( 'Actions', 'motopress-appointment' ); ?>">
                <a href="<?php echo esc_url( $bookingURL ); ?>" class="action-view">
					<?php esc_html_e( 'View', 'motopress-appointment' ); ?>
                </a>
            </td>
        </tr>
	<?php endforeach; ?>
    </tbody>
</table>
