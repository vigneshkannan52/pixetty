<?php

namespace MotoPress\Appointment\Services;

use MotoPress\Appointment\Entities\Service;
use MotoPress\Appointment\Structures\TimePeriod;
use MotoPress\Appointment\Structures\TimePeriods;
use DateTime;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Builds time slots for the Appointment Form.
 *
 * @since 1.2.1
 */
class TimeSlotService {

	/**
	 * @since 1.2.1
	 * @var Service
	 */
	public $service = null;

	/**
	 * @since 1.2.2
	 * @var int[]
	 */
	public $employeeIds = array();

	/**
	 * @since 1.2.2
	 * @var int[]
	 */
	public $locationIds = array();

	/**
	 * @since 1.2.2
	 * @var array [Employee ID => [Location ID => ScheduleService]]
	 */
	public $schedulers = array();

	/**
	 * @since 1.2.1
	 *
	 * @param Service $service
	 * @param array $args Optional.
	 *     @param int|int[] $args['employees'] One or more allowed employee ID.
	 *         Leave empty to allow all employees of the service.
	 *     @param int|int[] $args['locations'] One or more allowed location ID.
	 *         Leave empty to allow all locations.
	 */
	public function __construct( $service, $args = array() ) {
		$this->service = $service;

		$employees = ! empty( $args['employees'] ) ? (array) $args['employees'] : array();
		$locations = ! empty( $args['locations'] ) ? (array) $args['locations'] : array();

		// Don't allow employees that does not perform this service
		if ( ! empty( $employees ) ) {
			$employees = array_intersect( $employees, $service->getEmployeeIds() );
		} else {
			$employees = $service->getEmployeeIds();
		}

		// Create ScheduleService for each employee and location
		$this->addEmployees( $employees, $locations );
	}

	/**
	 * @since 1.2.1
	 *
	 * @param int[] $employees
	 * @param int|int[] $locations Optional. One or more allowed location ID.
	 *     0 by default (all allowed).
	 */
	public function addEmployees( $employees, $locations = 0 ) {
		foreach ( $employees as $employeeId ) {
			$this->addEmployee( $employeeId, $locations );
		}
	}

	/**
	 * @since 1.2.1
	 *
	 * @param int $employeeId
	 * @param int|int[] $locationId Optional. One or more allowed location ID.
	 *     0 by default (all allowed).
	 */
	public function addEmployee( $employeeId, $locationId = 0 ) {
		$schedule = mpapp()->repositories()->schedule()->findByEmployee( $employeeId );

		if ( is_null( $schedule ) ) {
			return;
		}

		$schedulers = ScheduleService::splitScheduleByLocation( $schedule, $locationId );

		if ( empty( $schedulers ) ) {
			return;
		}

		// Add new schedulers
		foreach ( $schedulers as $locationId => $scheduler ) {
			$this->schedulers[ $employeeId ][ $locationId ] = $scheduler;
		}

		// Merge new IDs
		$this->employeeIds[] = $employeeId;
		$this->locationIds   = array_merge( $this->locationIds, array_keys( $schedulers ) );

		// Remove duplicate IDs
		$this->employeeIds = mpa_array_unique_reset( $this->employeeIds );
		$this->locationIds = mpa_array_unique_reset( $this->locationIds );
	}

	/**
	 * @since 1.15.2
	 *
	 * @return array|int[]
	 */
	protected function getUnblockedTimeSlotsBookingIds() {
		$searchArgs = array(
			'fields'      => 'ids',
			'post_status' => mpapp()->postTypes()->booking()->statuses()->getUnblockedTimeSlotsStatuses(),
		);

		return mpapp()->repositories()->booking()->findAll( $searchArgs );
	}

	/**
	 * @since 1.2.1
	 *
	 * @param DateTime|string $fromDate
	 * @param DateTime|string $toDate
	 */
	public function blockPeriod( $fromDate, $toDate ) {
		$searchArgs = array(
			// Don't query by 'service_id' or 'location_id' here. Block time
			// slots of this employee in each schedule.
			'employee_id'         => $this->employeeIds,
			'from_date'           => $fromDate,
			'to_date'             => $toDate,
			// Exclude bookings which don't block slots (every unbooked booking)
			'post_parent__not_in' => $this->getUnblockedTimeSlotsBookingIds(),
		);

		$reservations = mpapp()->repositories()->reservation()->findAll( $searchArgs );

		// Block all periods of reservation
		foreach ( $reservations as $reservation ) {
			$employeeId = $reservation->getEmployeeId();

			if ( ! isset( $this->schedulers[ $employeeId ] ) ) {
				continue;
			}

			// Block this period for all locations
			foreach ( $this->schedulers[ $employeeId ] as $scheduler ) {
				$scheduler->addReservation( $reservation->getDate(), $reservation->getBufferTime() );
			}
		}
	}

	/**
	 * @since 1.4.0
	 *
	 * @param array $cartItems Array of [service_id, employee_id, location_id,
	 *      date, time].
	 */
	public function blockCartItems( $cartItems ) {
		foreach ( $cartItems as $cartItem ) {
			$employeeId = $cartItem['employee_id'];

			if ( ! isset( $this->schedulers[ $employeeId ] ) ) {
				continue;
			}

			$service = ( $cartItem['service_id'] === $this->service->getId() ) ? $this->service : mpa_get_service( $cartItem['service_id'] );

			if ( is_null( $service ) ) {
				continue;
			}

			$timePeriod = mpa_add_buffer_time( $cartItem['time'], $service );

			// Block this period for all locations
			foreach ( $this->schedulers[ $employeeId ] as $scheduler ) {
				$scheduler->addReservation( $cartItem['date'], $timePeriod );
			}
		}
	}

	/**
	 * @since 1.2.1
	 *
	 * @param DateTime|string $fromDate
	 * @param DateTime|string $toDate
	 * @param bool $sinceToday Optional. Limit the min date to the current date & time
	 *     + time before booking. True by default.
	 * @return array ['Y-m-d' => [Time period string => Array of [Employee ID, Location ID]]]
	 */
	public function getTimeSlotsForEntities( $fromDate, $toDate, $sinceToday = true ) {
		$fromDate = mpa_parse_date( $fromDate );
		$toDate   = mpa_parse_date( $toDate );

		if ( false === $fromDate || false === $toDate ) {
			return array();
		}

		// Find available time slots for each employee/location
		$slots = array();

		// For each employee
		foreach ( $this->schedulers as $employeeId => $schedulers ) {
			$slotsArgs = array(
				'since_today' => $sinceToday,
				'employee_id' => $employeeId,
			);

			// For each schedule
			foreach ( $schedulers as $locationId => $scheduler ) {
				$workingDays = $scheduler->getWorkingHoursForPeriod( $fromDate, $toDate );

				// For each day
				foreach ( $workingDays as $dateStr => $workingHours ) {
					$timeSlots = $this->getTimeSlotsForHours( $workingHours, $slotsArgs );

					// For each time slot
					foreach ( array_keys( $timeSlots ) as $timeStr ) {
						$slots[ $dateStr ][ $timeStr ][] = array( $employeeId, $locationId );
					} // For each time slot
				} // For each day
			} // For each schedule
		} // For each employee

		// Sort days in ascending order
		ksort( $slots );

		// Sort time periods in ascending order
		foreach ( $slots as &$daySlots ) {
			ksort( $daySlots );
		}

		unset( $daySlots );

		return $slots;
	}

	/**
	 * @since 1.2.1
	 *
	 * @param DateTime|string $fromDate
	 * @param DateTime|string $toDate
	 * @param array $args Optional.
	 *     @param bool $args['skip_empty']  Skip days without available slots. True
	 *                                      by default.
	 *     @param bool $args['since_today'] Limit the min date to the current date
	 *                                      & time + time before booking. True by
	 *                                      default.
	 * @return array ['Y-m-d' => [Time period string => Time period]]
	 *
	 * @todo Return empty days instead of [] when $skipEmpty=false and $fromDate=false or $toDate=false.
	 */
	public function getAvailableTimeSlotsForPeriod( $fromDate, $toDate, $args = array() ) {
		$fromDate = mpa_parse_date( $fromDate );
		$toDate   = mpa_parse_date( $toDate );

		if ( false === $fromDate || false === $toDate ) {
			return array();
		}

		// Add defaults
		$args += array(
			'skip_empty'  => true,
			'since_today' => true,
		);

		/**
		 * @var bool $skip_empty
		 * @var bool $since_today
		 */
		extract( $args );

		// Find available time slots
		$slots = array();

		for ( $date = clone $fromDate; $date <= $toDate; $date->modify( '+1 day' ) ) {
			$timeSlots = $this->getAvailableTimeSlotsForDate( $date, $since_today );

			if ( ! empty( $timeSlots ) || ! $skip_empty ) {
				$dateStr           = mpa_format_date( $date, 'internal' );
				$slots[ $dateStr ] = $timeSlots;
			}
		}

		return $slots;
	}

	/**
	 * @since 1.2.1
	 *
	 * @param DateTime $date
	 * @param bool $sinceToday Optional. Limit the min date to the current date
	 *     & time + time before booking. True by default.
	 * @return TimePeriod[] [Time period string => Time period]
	 */
	public function getAvailableTimeSlotsForDate( $date, $sinceToday = true ) {
		$timeSlots = array();

		foreach ( $this->schedulers as $employeeId => $schedulers ) {
			$slotsArgs = array(
				'since_today' => $sinceToday,
				'employee_id' => $employeeId,
			);

			foreach ( $schedulers as $scheduler ) {
				$workingHours = $scheduler->getWorkingHoursForDate( $date );
				$workingSlots = $this->getTimeSlotsForHours( $workingHours, $slotsArgs );

				$timeSlots += $workingSlots;
			}
		}

		return $timeSlots;
	}

	/**
	 * @since 1.15.2
	 * @return bool
	 */
	public function isAvailableTimeSlot( TimePeriod $timeSlot ) {
		$date               = $timeSlot->getStartTime();
		$time               = $timeSlot->toString( 'internal' );
		$availableTimeSlots = $this->getAvailableTimeSlotsForDate( $date, false );

		return array_key_exists( $time, $availableTimeSlots );
	}

	/**
	 * @since 1.2.1
	 *
	 * @param TimePeriod|TimePeriod[]|TimePeriods $workingHours
	 * @param array $args Optional.
	 *     @param bool $args['since_today'] Limit the min date to the current
	 *                                      date & time + time before booking.
	 *                                      True by default.
	 *     @param int  $args['employee_id'] ID for variations. 0 by default (no
	 *                                      variation).
	 * @return TimePeriod[] [Time period string => Time period]
	 */
	public function getTimeSlotsForHours( $workingHours, $args = array() ) {
		// Add defaults
		$args += array(
			'since_today' => true,
			'employee_id' => 0,
		);

		// Prepare args for mpa_time_slots()
		$slotsArgs = array(
			// Use duration from available variations
			'duration'      => $this->service->getDuration( $args['employee_id'] ),
			'buffer_before' => $this->service->getBufferTimeBefore(),
			'buffer_after'  => $this->service->getBufferTimeAfter(),
		);

		if ( $args['since_today'] ) {
			$minTime = new DateTime( 'now', wp_timezone() );
			$minTime->modify( "+{$this->service->getTimeBeforeBooking()} minutes" );

			$slotsArgs['min_time'] = $minTime;
		}

		return mpa_time_slots( $workingHours, $slotsArgs );
	}
}
