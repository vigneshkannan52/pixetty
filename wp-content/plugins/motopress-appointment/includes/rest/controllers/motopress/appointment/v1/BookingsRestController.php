<?php

namespace MotoPress\Appointment\REST\Controllers\Motopress\Appointment\V1;

use MotoPress\Appointment\Entities\Reservation;
use MotoPress\Appointment\Services\BookingService;
use MotoPress\Appointment\PostTypes\Statuses\BookingStatuses;
use MotoPress\Appointment\Utils\BookingUtils;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * @since 1.0
 */
class BookingsRestController extends AbstractRestController {

	/**
	 * @since 1.0
	 * @since 1.5.0 added the <code>/bookings/draft</code> route.
	 */
	public function register_routes() {

		// '/motopress/appointment/v1/bookings'
		register_rest_route(
			$this->getNamespace(),
			'/bookings',
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'createBooking' ),
				'permission_callback' => '__return_true',
				'args'                => array(
					'payment_details' => array(
						'type'       => 'object',
						'properties' => array(),
					),
					'order'           => array(
						'default' => array(),
					),
				),
			)
		);

		// '/motopress/appointment/v1/bookings/draft'
		register_rest_route(
			$this->getNamespace(),
			'/bookings/draft',
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'createDrafts' ),
				'permission_callback' => '__return_true',
				'args'                => array(
					'payment_details' => array(
						'type'       => 'object',
						'properties' => array(),
					),
				),
			)
		);

		// '/motopress/appointment/v1/bookings/reservations'
		register_rest_route(
			$this->getNamespace(),
			'/bookings/reservations',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'getReservations' ),
				'permission_callback' => '__return_true',
				'args'                => array(
					'service_id' => array(
						'default'           => array(),
						'sanitize_callback' => 'mpa_rest_sanitize_ids',
					),
					'from_date'  => array(
						'default'           => '',
						'sanitize_callback' => 'mpa_rest_sanitize_date_string',
					),
					'to_date'    => array(
						'default'           => '',
						'sanitize_callback' => 'mpa_rest_sanitize_date_string',
					),
				),
			)
		);
	}

	/**
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response|WP_Error
	 *
	 * @since 1.0
	 */
	public function createBooking( $request ) {

		$order = $request->get_params();

		$booking = null;

		if ( isset( $order['payment_details']['booking_id'] ) ) {

			$booking = mpapp()->repositories()->booking()->findById( $order['payment_details']['booking_id'] );
		}

		$bookingFailedMessage = esc_html__( 'Sorry! Failed to make a reservation at the moment.', 'motopress-appointment' );

		// prevent processing of already processed bookings
		if ( $booking && BookingStatuses::STATUS_CONFIRMED === $booking->getStatus() ) {
			return mpa_rest_failure_error( $bookingFailedMessage );
		}

		$bookingService = new BookingService();
		$booking        = $bookingService->createBooking( $order );

		if ( is_wp_error( $booking ) ) {
			return $booking;
		}

		if ( ! BookingUtils::isStillAvailableTimeSlots( $booking ) ) {
			$errorMessage = esc_html__( 'Sorry, the selected time slot is already booked.', 'motopress-appointment' );

			return mpa_rest_failure_error( $errorMessage );
		}

		mpapp()->repositories()->booking()->saveBooking( $booking );

		if ( ! $booking->getId() ) {
			return mpa_rest_failure_error( $bookingFailedMessage );
		}

		// Handle payment?
		if ( mpapp()->settings()->isPaymentsEnabled() ) {

			// Process payment
			$paymentDetails = array( 'booking' => $booking );

			if ( isset( $order['payment_details'] ) ) {
				$paymentDetails += $order['payment_details'];
			}

			$payment = $booking->getExpectingPayment();

			if ( ! $payment ) {
				return mpa_rest_failure_error( $bookingFailedMessage );
			}

			try {

				$payment->getGateway()->processPayment( $payment, $paymentDetails );

			} catch ( \Throwable $e ) {

				return new WP_Error( esc_html( $e->getMessage() ) );
			}
		}

		if ( mpapp()->settings()->getConfirmationMode() !== 'manual' ) {
			$message = esc_html__( "You've successfully made a booking. Thank you!", 'motopress-appointment' );
		} else {
			$message = esc_html__( 'Your reservation request has been received and is waiting for our confirmation. Thank you!', 'motopress-appointment' );
		}

		return rest_ensure_response( array( 'message' => $message ) );
	}

	/**
	 * @since 1.5.0
	 *
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response|WP_Error
	 */
	public function createDrafts( $request ) {

		$isPaymentsEnabled = mpapp()->settings()->isPaymentsEnabled();
		$drafts            = mpa_draft_booking( array( 'payment' => $isPaymentsEnabled ) );

		$order                                  = $request->get_params();
		$order['payment_details']['booking_id'] = $drafts['booking_id'];

		$bookingService = new BookingService();
		$booking        = $bookingService->createBooking( $order );

		if ( is_wp_error( $booking ) ) {
			return $booking;
		}

		if ( $isPaymentsEnabled ) {
			$booking->expectPayment( $drafts['payment_id'] );
		}

		$booking->setStatus( 'auto-draft' );

		if ( ! BookingUtils::isStillAvailableTimeSlots( $booking ) ) {
			$errorMessage = esc_html__( 'Sorry, the selected time slot is already booked.', 'motopress-appointment' );

			return mpa_rest_failure_error( $errorMessage );
		}

		mpapp()->repositories()->booking()->saveBooking( $booking );

		// If the booking will abandoned, we need unblocking reserved time slot.
		// Therefore we are adding actions of auto delete expired draft bookings.
		\MotoPress\Appointment\Crons\DeleteDraftBookingsCron::schedule();

		/**
		 * todo: response param $response[payment_id] need only for backward compatibility with a mpa-woocommerce addon v1.0.0
		 */
		$response = array(
			'booking_id' => $drafts['booking_id'],
			'payment_id' => $drafts['payment_id'],
		);

		return rest_ensure_response( $response );
	}

	/**
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response|WP_Error
	 *
	 * @since 1.0
	 */
	public function getReservations( $request ) {

		$serviceId = $request->get_param( 'service_id' );
		$fromDate  = $request->get_param( 'from_date' );
		$toDate    = $request->get_param( 'to_date' );

		// "Get all reservations" is not supported in the current version
		if ( empty( $serviceId ) ) {
			return mpa_rest_request_error( esc_html__( 'Invalid parameter: service ID is not set.', 'motopress-appointment' ) );
		} elseif ( empty( $fromDate ) || empty( $toDate ) ) {
			return mpa_rest_request_error( esc_html__( 'Invalid parameter: date range is not set.', 'motopress-appointment' ) );
		}

		// Find reservations
		$args = array(
			'from_date' => $fromDate,
			'to_date'   => $toDate,
		);

		$reservations = mpapp()->repositories()->reservation()->findAllByService( $serviceId, $args );
		$reservations = array_map( array( $this, 'mapReservation' ), $reservations );

		return rest_ensure_response( $reservations );
	}

	/**
	 * @param Reservation $reservation
	 * @return array
	 *
	 * @access protected
	 *
	 * @since 1.0
	 */
	public function mapReservation( $reservation ) {

		$entityData = array(
			'id'            => $reservation->getId(),
			'bookingId'     => $reservation->getBookingId(),
			'price'         => $reservation->getPrice(),
			'discount'      => $reservation->getDiscount(),
			'totalPrice'    => $reservation->getTotalPrice(),
			'depositAmount' => $reservation->getDepositAmount(),
			'date'          => mpa_format_date( $reservation->getDate(), 'internal' ),
			'serviceTime'   => $reservation->getServiceTime()->toString( 'internal' ),
			'bufferTime'    => $reservation->getBufferTime()->toString( 'internal' ),
			'serviceId'     => $reservation->getServiceId(),
			'employeeId'    => $reservation->getEmployeeId(),
			'locationId'    => $reservation->getLocationId(),
			'capacity'      => $reservation->getCapacity(),
		);

		return $entityData;
	}
}
