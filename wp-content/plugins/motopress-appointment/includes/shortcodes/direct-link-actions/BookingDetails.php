<?php

namespace MotoPress\Appointment\Shortcodes\DirectLinkActions;

class BookingDetails extends AbstractDirectLinkEntityShortcode {

	protected function name() {
		return 'booking_details';
	}

	public function getLabel() {
		return esc_html__( 'Booking Details', 'motopress-appointment' );
	}

	/**
	 * @param \MotoPress\Appointment\Entities\Booking $booking
	 *
	 * @return string
	 */
	protected function getContent( $booking ): string {
		return mpa_render_template(
			'shortcodes/direct-link-actions/booking-details.php',
			array(
				'booking' => $booking,
			)
		);
	}
}