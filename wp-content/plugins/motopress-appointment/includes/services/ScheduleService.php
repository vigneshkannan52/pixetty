<?php

namespace MotoPress\Appointment\Services;

use MotoPress\Appointment\Entities\Schedule;
use MotoPress\Appointment\Structures\TimePeriod;
use MotoPress\Appointment\Structures\TimePeriods;
use DateTime;

use const MotoPress\Appointment\ACTIVITY_WORK;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Builds working hours for separate dates or date periods.
 *
 * @since 1.2.2
 * @see TimeSlotService
 */
class ScheduleService {

	/**
	 * @since 1.2.2
	 * @var Schedule
	 */
	public $schedule = null;

	/**
	 * One or more allowed location ID.
	 *
	 * @since 1.2.2
	 * @var int|int[]
	 */
	public $locationId = 0;

	/**
	 * Timetable with filtered locations (only allowed locations) and activity
	 * (only working hours).
	 *
	 * @since 1.2.2
	 * @var [Day (0-6) => TimePeriods]
	 */
	public $workingHours = array();

	/**
	 * @since 1.2.2
	 * @var array ['Y-m-d' => TimePeriod[]]
	 * @see ScheduleService::addReservation()
	 */
	protected $reservations = array();

	/**
	 * @since 1.2.2
	 *
	 * @param Schedule $schedule
	 * @param int|int[] $locationId Optional. One or more allowed location ID.
	 *     0 by default (all allowed).
	 */
	public function __construct( $schedule, $locationId = 0 ) {
		$this->schedule     = $schedule;
		$this->locationId   = $locationId;
		$this->workingHours = static::buildWorkingHoursBySchedule( $schedule, $locationId );
	}

	/**
	 * @since 1.2.2
	 *
	 * @param DateTime|string $date
	 * @param TimePeriod|string $time The buffer time is preferred.
	 */
	public function addReservation( $date, $time ) {
		$dateStr = is_string( $date ) ? $date : mpa_format_date( $date, 'internal' );

		if ( ! ( $time instanceof TimePeriod ) ) {
			$time = new TimePeriod( $time );
		}

		$this->reservations[ $dateStr ][] = $time;
	}

	/**
	 * @since 1.2.2
	 *
	 * @param DateTime $fromDate
	 * @param DateTime $toDate
	 * @param bool $skipEmpty Optional. Skip empty days (days without periods).
	 *     True by default.
	 * @return array ['Y-m-d' => TimePeriods]
	 */
	public function getWorkingHoursForPeriod( $fromDate, $toDate, $skipEmpty = true ) {
		$startDate = clone $fromDate;
		$startDate->setTime( 0, 0 );

		$endDate = clone $toDate;
		$endDate->setTime( 0, 0 );

		$hours = array();

		for ( $date = clone $startDate; $date <= $endDate; $date->modify( '+1 day' ) ) {
			$periods = $this->getWorkingHoursForDate( $date );

			if ( ! $periods->isEmpty() || ! $skipEmpty ) {
				$dateStr           = mpa_format_date( $date, 'internal' );
				$hours[ $dateStr ] = $periods;
			}
		}

		return $hours;
	}

	/**
	 * @since 1.2.2
	 *
	 * @param DateTime $date
	 * @return TimePeriods
	 */
	public function getWorkingHoursForDate( $date ) {
		// Return nothing if the day is day off
		if ( $this->schedule->isDayOff( $date ) ) {
			return new TimePeriods(); // No periods
		}

		// Use custom working hours with higher priority than the timetable hours
		if ( $this->schedule->hasCustomWorkingHoursForDate( $date ) ) {
			// Use custom hours
			$hours = new TimePeriods( $this->schedule->getCustomWorkingHoursForDate( $date ) );

		} else {
			// No custom hours. Generate working hours from the timetable
			$day   = (int) $date->format( 'w' );
			$hours = clone $this->workingHours[ $day ];
		}

		// "Reset" the date, otherwise it'll be January 1 - always in the past,
		// which is bad for TimeSlotService and mpa_time_slots()
		$hours->setDate( $date );

		// Diff reservation periods
		$dateStr = mpa_format_date( $date, 'internal' );

		if ( array_key_exists( $dateStr, $this->reservations ) ) {
			foreach ( $this->reservations[ $dateStr ] as $reservationTime ) {
				$hours->diffPeriod( $reservationTime );
			}
		}

		return clone $hours;
	}

	/**
	 * @since 1.2.2
	 *
	 * @param Schedule $schedule
	 * @param int|int[] $locationId Optional. One or more allowed location ID.
	 *     0 by default (all allowed).
	 * @return static[] [Location ID => Instance object] - separate instance of
	 *     ScheduleService for each allowed location.
	 */
	public static function splitScheduleByLocation( $schedule, $locationId = 0 ) {
		if ( empty( $locationId ) ) {
			$locations = $schedule->getLocationIds();
		} else {
			$locations = (array) $locationId;
		}

		$services = array();

		foreach ( $locations as $locationId ) {
			$services[ $locationId ] = new static( $schedule, $locationId );
		}

		return $services;
	}

	/**
	 * @since 1.2.2
	 *
	 * @param Schedule $schedule
	 * @param int|int[] $locationId Optional. One or more allowed location ID.
	 *     0 by default (all allowed).
	 * @return [Day (0-6) => TimePeriods] - only working hours.
	 */
	public static function buildWorkingHoursBySchedule( $schedule, $locationId = 0 ) {
		// Leave only periods with working hours
		$timetable = static::filterActivity( $schedule->getTimetable() );

		// Leave only allowed locations
		$timetable = static::filterLocations( $timetable, $locationId );

		// Convert timetable items into TimePeriods
		$workingHours = static::pullPeriods( $timetable, 'TimePeriods' );

		// Replace string keys with indexes
		return array_values( $workingHours );
	}

	/**
	 * @since 1.2.2
	 *
	 * @param array $timetable [Day => Array of [..., string 'activity']]
	 * @param string $activity Optional. Allowed activity. Working hours by
	 *     default.
	 * @return array Timetable that only consists of periods of that activity.
	 */
	public static function filterActivity( $timetable, $activity = ACTIVITY_WORK ) {
		$newTimetable = array();

		foreach ( $timetable as $day => $dayTable ) {
			$newTimetable[ $day ] = array_filter(
				$dayTable,
				function ( $period ) use ( $activity ) {
					return $period['activity'] === $activity;
				}
			);
		}

		return $newTimetable;
	}

	/**
	 * @since 1.2.2
	 *
	 * @param array $timetable [Day => Array of [..., int 'location']]
	 * @param int|int[] $locations One or more allowed location ID.
	 * @return array Timetable that only consists of periods for locations from
	 *     <code>$locations</code>.
	 */
	public static function filterLocations( $timetable, $locations ) {
		if ( empty( $locations ) ) {
			return $timetable;
		}

		$allowedLocations = (array) $locations;
		$newTimetable     = array();

		foreach ( $timetable as $day => $dayTable ) {
			$newTimetable[ $day ] = array_filter(
				$dayTable,
				function ( $period ) use ( $allowedLocations ) {
					return in_array( $period['location'], $allowedLocations );
				}
			);
		}

		return $newTimetable;
	}

	/**
	 * @since 1.2.2
	 *
	 * @param array $timetable [Day => Array of [TimePeriod 'time_period', ...]]
	 * @param bool $mergePeriods Optional. Merge TimePeriod[] into single
	 *     object: TimePeriods. False by default.
	 * @return array [Day => TimePeriod[]] or [Day => TimePeriods] if
	 *     <code>$mergePeriods</code> is true.
	 */
	public static function pullPeriods( $timetable, $mergePeriods = false ) {
		$newTimetable = array();

		foreach ( $timetable as $day => $dayTable ) {
			$periods = wp_list_pluck( $dayTable, 'time_period' );

			if ( $mergePeriods ) {
				$newTimetable[ $day ] = new TimePeriods( $periods );
			} else {
				$newTimetable[ $day ] = $periods;
			}
		}

		return $newTimetable;
	}
}
