<?php

namespace MotoPress\Appointment\DirectLinkActions\Pages;

use MotoPress\Appointment\PostTypes\Statuses\BookingStatuses;

/**
 * @since 1.15.0
 */
class BookingCancelledPage extends AbstractBookingPage {

	public function __construct() {
		parent::__construct();

		add_filter(
			"mpa_direct_link_action_page_pre_render_{$this->getPageSlug()}",
			array( $this, 'preventRenderContent' ),
			10,
			2
		);
	}

	public function preventRenderContent( $wpPost, $booking ) {

		if ( BookingStatuses::STATUS_CANCELLED !== $booking->getStatus() ) {
			$wpPost->post_content = __( 'Cancelation of your booking is not possible for some reason. Please contact the website administrator.', 'motopress-appointment' );
		}

		return $wpPost;
	}

	/**
	 * @return string
	 */
	protected function getPageSlug() {
		return 'booking-cancelled';
	}

	/**
	 * @return string
	 */
	protected function optionNameWithPageId() {
		return 'mpa_booking_cancelled_page';
	}

	/**
	 * @return string
	 */
	protected function defaultContent() {
		return esc_html__( 'Your appointment has been successfully canceled.', 'motopress-appointment' );
	}

	/**
	 * @return string
	 */
	protected function getTitle() {
		return esc_html__( 'Booking canceled', 'motopress-appointment' );
	}

	/**
	 * @return int
	 */
	protected function getPageId() {
		return mpapp()->settings()->getBookingCancelledPage();
	}
}
