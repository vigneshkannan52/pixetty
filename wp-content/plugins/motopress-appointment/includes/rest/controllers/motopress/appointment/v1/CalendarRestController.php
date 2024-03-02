<?php

namespace MotoPress\Appointment\REST\Controllers\Motopress\Appointment\V1;

use MotoPress\Appointment\Services\TimeSlotService;

use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * @since 1.2.1
 */
class CalendarRestController extends AbstractRestController {

	/**
	 * @since 1.2.1
	 */
	public function register_routes() {
		// '/motopress/appointment/v1/calendar/time'
		register_rest_route(
			$this->getNamespace(),
			'/calendar/time',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'getTimeSlots' ),
				'permission_callback' => '__return_true',
				'args'                => array(
					// service_id, from_date and to_date are required
					'service_id'  => array(
						// Required
						'default'           => 0,
						'sanitize_callback' => 'mpa_rest_sanitize_id',
					),
					'employees'   => array(
						'default'           => array(),
						'sanitize_callback' => 'mpa_rest_sanitize_ids',
					),
					'locations'   => array(
						'default'           => array(),
						'sanitize_callback' => 'mpa_rest_sanitize_ids',
					),
					'from_date'   => array(
						// Required
						'default'           => '',
						'sanitize_callback' => 'mpa_rest_sanitize_date_string',
					),
					'to_date'     => array(
						// Required
						'default'           => '',
						'sanitize_callback' => 'mpa_rest_sanitize_date_string',
					),
					'format'      => array(
						'default'           => 'compact',
						'sanitize_callback' => 'sanitize_text_field',
					),
					'exclude'     => array(
						// Optional. Items to exclude in the format of the cart items.
						'default'           => array(),
						'sanitize_callback' => 'mpa_rest_sanitize_cart_items',
					),
					'skip_empty'  => array(
						// Only if format='compact'
						'default'           => true,
						'sanitize_callback' => 'mpa_rest_sanitize_bool',
					),
					'since_today' => array(
						'default'           => true,
						'sanitize_callback' => 'mpa_rest_sanitize_bool',
					),
				),
			)
		);
	}

	/**
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response|WP_Error
	 *
	 * @since 1.2.1
	 */
	public function getTimeSlots( $request ) {
		$serviceId  = $request->get_param( 'service_id' );
		$employees  = $request->get_param( 'employees' );
		$locations  = $request->get_param( 'locations' );
		$fromDate   = $request->get_param( 'from_date' );
		$toDate     = $request->get_param( 'to_date' );
		$format     = $request->get_param( 'format' );
		$exclude    = $request->get_param( 'exclude' );
		$skipEmpty  = $request->get_param( 'skip_empty' );
		$sinceToday = $request->get_param( 'since_today' );

		// Check required fields
		if ( ! $serviceId ) {
			return mpa_rest_request_error( esc_html__( 'Invalid parameter: service ID is not set.', 'motopress-appointment' ) );
		} elseif ( ! $fromDate || ! $toDate ) {
			return mpa_rest_request_error( esc_html__( 'Invalid parameter: date range is not set.', 'motopress-appointment' ) );
		}

		$service = mpa_get_service( $serviceId );

		if ( is_null( $service ) ) {
			// Translators: %d: Service ID.
			return mpa_rest_request_error( sprintf( esc_html__( 'Invalid request: services not found.', 'motopress-appointment' ), $serviceId ) );
		}

		$timeSlotService = new TimeSlotService(
			$service,
			array(
				'employees' => $employees,
				'locations' => $locations,
			)
		);

		// Block reserved periods
		$timeSlotService->blockPeriod( $fromDate, $toDate );

		// Block cart items
		$timeSlotService->blockCartItems( $exclude );

		// Build time slots
		switch ( $format ) {
			case 'full':
				// ['Y-m-d' => [Time period string => Array of [Employee ID, Location ID]]]
				$timeSlots = $timeSlotService->getTimeSlotsForEntities( $fromDate, $toDate, $sinceToday );
				break;

			case 'compact':
			default:
				$slotsArgs = array(
					'skip_empty'  => $skipEmpty,
					'since_today' => $sinceToday,
				);

				// ['Y-m-d' => [Time period string => Time period]]
				$timeSlots = $timeSlotService->getAvailableTimeSlotsForPeriod( $fromDate, $toDate, $slotsArgs );

				// ['Y-m-d' => [Time period string]]
				$timeSlots = array_map(
					function ( $daySlots ) {
						return array_keys( $daySlots ); },
					$timeSlots
				);
				break;
		}

		return rest_ensure_response( $timeSlots );
	}
}
