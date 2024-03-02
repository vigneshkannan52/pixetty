<?php

namespace MotoPress\Appointment\Shortcodes\DirectLinkActions;

class BookingCancellationLink extends AbstractDirectLinkEntityShortcode {

	protected function name() {
		return 'booking_cancellation_link';
	}

	public function getLabel() {
		return esc_html__( 'Booking cancelation link', 'motopress-appointment' );
	}

	protected function getContent( $entity ) {
		$cancellationURL = mpapp()->directLinkActions()->getBookingCancellationAction()->getActionURL( $entity );

		return '<p><a href="' . $cancellationURL . '" class="button">' . esc_html__( 'Cancel Booking', 'motopress-appointment' ) . '</a></p>';
	}
}
