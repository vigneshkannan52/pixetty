<?php

declare(strict_types=1);

namespace MotoPress\Appointment\Utils;

use MotoPress\Appointment\Entities\Booking;
use MotoPress\Appointment\Entities\Reservation;
use MotoPress\Appointment\Services\TimeSlotService;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class BookingUtils {


	/**
	 * @since 1.15.2
	 * @protected
	 *
	 * @param array $args get_posts() search parameters
	 *
	 * @return array
	 */
	public static function excludeBookingReservationsHandler( $args ) {

		global $excludeBooking;

		if ( isset( $args['post_parent__not_in'] ) &&
			! is_array( $args ) ) {
			return $args;
		}

		$args['post_parent__not_in'][] = $excludeBooking->getId();

		remove_filter( '', array( __CLASS__, 'excludeBookingReservationsHandler' ) );

		return $args;
	}

	/**
	 * @since 1.15.2
	 *
	 * @return void
	 */
	protected static function excludeCurrentBookingReservations( Booking $booking ) {
		global $excludeBooking;
		$excludeBooking = $booking;

		$postType = mpapp()->postTypes()->reservation()->getPostType();
		add_filter(
			"{$postType}_repository_get_posts_query_args",
			array(
				__CLASS__,
				'excludeBookingReservationsHandler',
			)
		);
	}

	/**
	 * @since 1.15.2
	 *
	 * @return bool
	 */
	protected static function isStillAvailableTimeSlot( Reservation $reservation ) {
		$service = mpa_get_service( $reservation->getServiceId() );
		$date    = $reservation->getDate();

		$args = array(
			'employees' => array( $reservation->getEmployeeId() ),
			'locations' => array( $reservation->getLocationId() ),
		);

		$timeSlotService = new TimeSlotService( $service, $args );

		// Block reserved periods
		$timeSlotService->blockPeriod( $date, $date );

		return $timeSlotService->isAvailableTimeSlot( $reservation->getServiceTime() );
	}

	/**
	 * @since 1.15.2
	 *
	 * @return bool
	 */
	public static function isStillAvailableTimeSlots( Booking $booking ) {
		self::excludeCurrentBookingReservations( $booking );

		$reservations = $booking->getReservations();

		foreach ( $reservations as $reservation ) {
			if ( ! self::isStillAvailableTimeSlot( $reservation ) ) {
				return false;
			}
		}

		return true;
	}
}
