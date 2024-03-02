<?php
/**
 * @var MotoPress\Appointment\Entities\Booking $booking
 *
 * @since 1.18.0
 */
$bookingId     = $booking->getId();
$bookingStatus = $booking->getStatus();
$customerName  = $booking->getCustomerName();
$customerEmail = $booking->getCustomerEmail();
$customerPhone = $booking->getCustomerPhone();

$reservations      = $booking->getReservations();
$bookingTotalPrice = $booking->getTotalPrice();
$bookingTotalPaid  = $booking->getPaidPrice();
?>
<div class="mpa-booking-details-section booking-info">
	<div class="mpa-booking-details">
		<div class="booking-id">
			<span class="label"><?php esc_html_e( 'Booking', 'motopress-appointment' ); ?>: </span>
			<span class="value">#<?php echo esc_html( $bookingId ); ?></span>
		</div>
		<div class="booking-status <?php echo esc_attr( $bookingStatus ); ?>">
			<span class="label"><?php esc_html_e( 'Status', 'motopress-appointment' ); ?>: </span>
			<span class="value"><?php echo esc_html( $bookingStatus ); ?></span>
		</div>
		<div class="booking-total-price">
			<span class="label"><?php esc_html_e( 'Total Price', 'motopress-appointment' ); ?>: </span>
			<span class="value"><?php echo mpa_tmpl_price( $bookingTotalPrice ); ?></span>
		</div>
		<div class="booking-total-paid">
			<span class="label"><?php esc_html_e( 'Total Paid', 'motopress-appointment' ); ?>: </span>
			<span class="value"><?php echo mpa_tmpl_price( $bookingTotalPaid, array( 'literal_free' => false ) ); ?></span>
		</div>
	</div>
</div>
<div class="mpa-booking-details-section booking-customer">
	<div class="mpa-booking-details">
		<div class="booking-customer-name">
            <span class="label">
                <?php esc_html_e( 'Name', 'motopress-appointment' ); ?>:
            </span>
			<span class="value">
                <?php echo esc_html( $customerName ); ?>
            </span>
		</div>
		<div class="booking-customer-email">
            <span class="label">
                <?php esc_html_e( 'Email', 'motopress-appointment' ); ?>:
            </span>
			<span class="value">
                <a href="mailto:<?php echo sanitize_email( $customerEmail ); ?>">
                    <?php echo sanitize_email( $customerEmail ); ?>
                </a>
            </span>
		</div>
		<div class="booking-customer-phone">
			<span class="label"><?php esc_html_e( 'Phone', 'motopress-appointment' ); ?>: </span>
			<span class="value">
                <a href="tel:<?php echo esc_attr( $customerPhone ); ?>">
                    <?php echo esc_html( $customerPhone ) ?>
                </a>
            </span>
		</div>
	</div>
</div>
<div class="mpa-booking-details-section booking-reservations">
	<div class="reservations">
		<?php if ( count( $reservations ) ) : ?>
			<?php foreach ( $reservations as $reservation ):
				$reservationTitle = get_the_title( $reservation->getServiceId() );
				$reservationDate = mpa_format_date( $reservation->getDate() );
				$reservationTime = $reservation->getServiceTime()->toString();
				?>
				<div class="reservation">
					<div class="reservation-details">
						<div class="reservation-title">
							<span class="label"><?php esc_html_e( 'Service', 'motopress-appointment' ); ?>: </span>
							<span class="value"><?php echo esc_html( $reservationTitle ); ?></span>
						</div>
						<div class="reservation-date">
							<span class="label"><?php esc_html_e( 'Date', 'motopress-appointment' ); ?>: </span>
							<span class="value"><?php echo esc_html( $reservationDate ); ?></span>
						</div>
						<div class="reservation-time">
							<span class="label"><?php esc_html_e( 'Time', 'motopress-appointment' ); ?>: </span>
							<span class="value"><?php echo esc_html( $reservationTime ); ?></span>
						</div>
					</div>
				</div>
			<?php endforeach; ?>
		<?php endif; ?>
	</div>
</div>