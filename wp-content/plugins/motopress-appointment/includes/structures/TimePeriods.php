<?php

namespace MotoPress\Appointment\Structures;

use DateTime;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Wrapper for an array of TimePeriod.
 *
 * @since 1.2.1
 */
class TimePeriods {

	/**
	 * @var TimePeriod[]
	 *
	 * @since 1.2.1
	 */
	public $periods = array();

	/**
	 * @param TimePeriod[]|string[] $periods Optional.
	 *
	 * @since 1.2.1
	 */
	public function __construct( $periods = array() ) {
		if ( ! empty( $periods ) ) {
			$this->mergePeriods( $periods ); // Clone periods
		}
	}

	/**
	 * @param DateTime $date
	 *
	 * @since 1.2.1
	 */
	public function setDate( $date ) {
		foreach ( $this->periods as $period ) {
			$period->setDate( $date );
		}
	}

	/**
	 * @return bool
	 *
	 * @since 1.2.1
	 */
	public function isEmpty() {
		foreach ( $this->periods as $period ) {
			if ( ! $period->isEmpty() ) {
				return false;
			}
		}

		return true;
	}

	/**
	 * @param TimePeriod|string $period
	 * @return bool
	 *
	 * @since 1.2.1
	 */
	public function hasPeriod( $period ) {
		if ( ! is_string( $period ) ) {
			$period = (string) $period;
		}

		foreach ( $this->periods as $existingPeriod ) {
			$periodString = (string) $existingPeriod;

			if ( $periodString === $period ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * @param TimePeriod|string $period
	 *
	 * @since 1.2.1
	 */
	public function mergePeriod( $period ) {
		if ( is_string( $period ) ) {
			$period = new TimePeriod( $period );
		}

		// Search intersection with one of the existing periods
		$intersection = null;

		foreach ( $this->periods as $existingPeriod ) {
			if ( $existingPeriod->intersectsWith( $period ) ) {
				$intersection = clone $existingPeriod;
				$intersection->mergePeriod( $period );

				break;
			}
		}

		if ( is_null( $intersection ) ) {
			// No intersection found; add new period
			$this->periods[] = clone $period;

		} else {
			// Remove intersections with other periods
			$this->diffPeriod( $intersection );

			// Add new period
			$this->periods[] = $intersection;
		}
	}

	/**
	 * @param TimePeriod[]|string[]|TimePeriods $periods
	 *
	 * @since 1.2.1
	 */
	public function mergePeriods( $periods ) {
		if ( is_object( $periods ) ) {
			$periods = $periods->periods;
		}

		array_walk( $periods, array( $this, 'mergePeriod' ) );
	}

	/**
	 * @param TimePeriod $period
	 *
	 * @since 1.2.1
	 */
	public function diffPeriod( $period ) {
		foreach ( $this->periods as $index => &$existingPeriod ) {
			if ( ! $existingPeriod->intersectsWith( $period ) ) {
				continue;

			} elseif ( $existingPeriod->isSubperiodOf( $period ) ) {
				// Remove the whole period
				array_splice( $this->periods, $index, 1 );

			} elseif ( $period->isSubperiodOf( $existingPeriod ) ) {
				// Split to parts and replace the existing period
				$subperiods = $existingPeriod->splitByPeriod( $period );
				array_splice( $this->periods, $index, 1, $subperiods );

			} else {
				// Diff periods: remove time of the $period from
				// the $existingPeriod
				$existingPeriod->diffPeriod( $period );
			}
		}

		unset( $existingPeriod );
	}

	/**
	 * @return TimePeriod[]
	 *
	 * @since 1.2.1
	 */
	public function clonePeriods() {
		return mpa_array_clone( $this->periods );
	}

	/**
	 * @since 1.2.1
	 */
	public function __clone() {
		foreach ( $this->periods as &$period ) {
			$period = clone $period;
		}

		unset( $period );
	}
}
