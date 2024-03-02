<?php

namespace MotoPress\Appointment\DirectLinkActions\Pages;

use MotoPress\Appointment\DirectLinkActions\Helpers\BookingHelper;
use MotoPress\Appointment\PostTypes\Statuses\BookingStatuses;

/**
 * @since 1.15.0
 */
class BookingCancellationPage extends AbstractBookingPage {

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

		if ( BookingStatuses::STATUS_CANCELLED === $booking->getStatus() ) {
			$wpPost->post_content = __( 'Booking is already canceled.', 'motopress-appointment' );

			return $wpPost;
		}

		if ( ! BookingHelper::isCanBeCancelled( $booking ) ) {
			$wpPost->post_content = __( 'Cancelation of your booking is not possible for some reason. Please contact the website administrator.', 'motopress-appointment' );

			return $wpPost;
		}

		return $wpPost;
	}

	/**
	 * @return string
	 */
	protected function getPageSlug() {
		return 'booking-cancellation';
	}

	/**
	 * @return string
	 */
	protected function optionNameWithPageId() {
		return 'mpa_booking_cancellation_page';
	}

	/**
	 * @return string
	 */
	protected function getTitle() {
		return esc_html__( 'Booking Cancelation', 'motopress-appointment' );
	}

	/**
	 * @return string
	 */
	protected function mustContent() {
		return mpapp()->shortcodes()->directLinkBookingCancellationLink()->getRawShortcode();
	}

	/**
	 * @return string
	 */
	protected function defaultContent() {
		return mpapp()->shortcodes()->directLinkBookingDetails()->getRawShortcode() .
			mpapp()->shortcodes()->directLinkBookingCancellationLink()->getRawShortcode();
	}

	/**
	 * @return int
	 */
	protected function getPageId() {
		return mpapp()->settings()->getBookingCancellationPage();
	}
}
