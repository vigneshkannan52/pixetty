<?php

namespace MotoPress\Appointment\Metaboxes\Booking;

use MotoPress\Appointment\Metaboxes\SubmitMetabox;
use MotoPress\Appointment\Utils\BookingUtils;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * @since 1.15.2
 */
class BookingStatusMetabox extends SubmitMetabox {

	protected function addActions() {
		parent::addActions();
		add_action( 'admin_notices', array( $this, 'adminErrorNotice' ) );
	}

	public function adminErrorNotice() {

		global $post;

		$errorMessage = __( "Can't update a status of this booking because the time is already booked.", 'motopress-appointment' );

		if ( false !== ( $msg = get_transient( "{$post->ID}_timeslot_error_notice" ) ) && $msg ) {
			delete_transient( "{$post->ID}_timeslot_error_notice" );

			printf( '<div class="notice notice-error is-dismissible"><p>%s</p></div>', esc_html( $errorMessage ) );
		}
	}

	protected function setNoticeTimeSlotError() {
		global $post;

		set_transient( "{$post->ID}_timeslot_error_notice", true );
	}

	protected function canSave( int $postId, \WP_Post $post ): bool {
		$canSave = parent::canSave( $postId, $post );

		$values = $this->parseValues( $postId, $post );

		if ( ! isset( $values['post_status'] ) ) {
			return true;
		}

		$booking = mpapp()->repositories()->booking()->findById( $postId );

		if ( ! $booking ) {
			return true;
		}

		$unblockedTimeSlotsStatuses = mpapp()->postTypes()->booking()->statuses()->getUnblockedTimeSlotsStatuses();

		// if current booking has a time-slot conflict which any bookings,
		// prevent updating post status and show error notice
		if ( ! in_array( $values['post_status'], $unblockedTimeSlotsStatuses ) &&
			! BookingUtils::isStillAvailableTimeSlots( $booking )
		) {
			$canSave = false;
			$this->setNoticeTimeSlotError();
		}

		return $canSave;
	}
}
