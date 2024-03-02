<?php

namespace MotoPress\Appointment\Structures;

use DateTime;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Usage:
 *     <pre>new TimePeriod(string $period);</pre>
 *     <pre>new TimePeriod(DateTime|string $startTime, DateTime|string $endTime);</pre>
 * where $period is a string like '08:00 - 14:00'.
 *
 * @since 1.0
 */
class TimePeriod {

	/** @since 1.0 */
	const PERIOD_PATTERN = '/^%start_time% - %end_time%$/';

	/**
	 * @var DateTime
	 *
	 * @since 1.0
	 */
	public $startTime = null;

	/**
	 * @var DateTime
	 *
	 * @since 1.0
	 */
	public $endTime = null;

	/**
	 * See variants in the class description.
	 *
	 * @param DateTime|string $timeOrPeriod
	 * @param DateTime|string $endTime Optional. Null by default.
	 *
	 * @since 1.0
	 */
	public function __construct( $timeOrPeriod, $endTime = null ) {
		if ( is_null( $endTime ) ) {
			$this->parsePeriod( $timeOrPeriod );
		} else {
			$this->setStartTime( $timeOrPeriod );
			$this->setEndTime( $endTime );
		}
	}

	/**
	 * @param string $period
	 *
	 * @since 1.0
	 */
	protected function parsePeriod( $period ) {
		// Explode '08:00 - 14:00' into ['08:00', '14:00']
		$time = explode( ' - ', $period );

		$this->setStartTime( $time[0] );
		$this->setEndTime( $time[1] );
	}

	/**
	 * @param DateTime|string $startTime
	 *
	 * @since 1.0
	 */
	public function setStartTime( $startTime ) {
		$this->startTime = $this->makeDateTime( $startTime );
	}

	/**
	 * @param string|int $endTime
	 *
	 * @since 1.0
	 */
	public function setEndTime( $endTime ) {
		$this->endTime = $this->makeDateTime( $endTime );
	}

	/**
	 * @param DateTime|string $input
	 * @return DateTime
	 *
	 * @since 1.2.1
	 */
	protected function makeDateTime( $input ) {
		if ( is_string( $input ) ) {
			return mpa_parse_time( $input );
		} else {
			return clone $input;
		}
	}

	/**
	 * @param DateTime $date
	 *
	 * @since 1.0
	 */
	public function setDate( $date ) {
		$this->startTime->setDate( (int) $date->format( 'Y' ), (int) $date->format( 'm' ), (int) $date->format( 'd' ) );
		$this->endTime->setDate( (int) $date->format( 'Y' ), (int) $date->format( 'm' ), (int) $date->format( 'd' ) );
	}

	/**
	 * @since 1.13.0
	 */
	public function getStartTime(): DateTime {
		return clone $this->startTime;
	}

	/**
	 * @since 1.13.0
	 */
	public function getEndTime(): DateTime {
		return clone $this->endTime;
	}

	/**
	 * @since 1.13.0
	 */
	public function isInPeriod( DateTime $date ): bool {
		return $date >= $this->startTime && $date <= $this->endTime;
	}

	/**
	 * @param self $period
	 * @param 'datetime'|'time' $period Optional. 'datetime' by default.
	 * @return bool
	 *
	 * @since 1.2.1
	 * @since 1.13.0 added the <code>$compare</code> argument.
	 */
	public function intersectsWith( $period, $compare = 'datetime' ) {

		if ( 'time' == $compare ) {
			return mpa_format_time( $this->startTime, 'internal' ) < mpa_format_time( $period->getEndTime(), 'internal' )
				&& mpa_format_time( $this->endTime, 'internal' ) > mpa_format_time( $period->getStartTime(), 'internal' );
		} else {
			return $this->startTime < $period->getEndTime()
				&& $this->endTime > $period->getStartTime();
		}
	}

	/**
	 * @param self $period
	 * @return bool
	 *
	 * @since 1.2.1
	 */
	public function isSubperiodOf( $period ) {
		return $this->startTime >= $period->startTime
			&& $this->endTime <= $period->endTime;
	}

	/**
	 * @return bool
	 *
	 * @since 1.2.1
	 */
	public function isEmpty() {
		return $this->getDuration() <= 0;
	}

	/**
	 * @return int Duration time in minutes.
	 *
	 * @since 1.0
	 */
	public function getDuration() {
		return (int) ( abs( $this->endTime->getTimestamp() - $this->startTime->getTimestamp() ) / 60 );
	}

	/**
	 * @param int $startOffset Minutes offset for start time.
	 * @param int $endOffset Minutes offset for end time.
	 *
	 * @since 1.0
	 */
	public function expand( $startOffset, $endOffset ) {
		$this->startTime->setTimestamp( $this->startTime->getTimestamp() - $startOffset * 60 );
		$this->endTime->setTimestamp( $this->endTime->getTimestamp() + $endOffset * 60 );
	}

	/**
	 * @param self $period
	 *
	 * @since 1.2
	 */
	public function mergePeriod( $period ) {
		if ( mpa_date_diff( $this->startTime, $period->startTime ) < 0 ) {
			$this->startTime = clone $period->startTime;
		}

		if ( mpa_date_diff( $this->endTime, $period->endTime ) > 0 ) {
			$this->endTime = clone $period->endTime;
		}
	}

	/**
	 * @param self[] $periods
	 *
	 * @since 1.2
	 */
	public function mergePeriods( $periods ) {
		foreach ( $periods as $period ) {
			$this->mergePeriod( $period );
		}
	}

	/**
	 * @param self $period
	 *
	 * @since 1.2.1
	 */
	public function diffPeriod( $period ) {
		if ( $this->startTime < $period->startTime ) {
			if ( $period->startTime < $this->endTime ) {
				$this->setEndTime( $period->startTime );
			}
		} else {
			if ( $period->endTime > $this->startTime ) {
				$this->setStartTime( $period->endTime );
			}
		}
	}

	/**
	 * @param self $period
	 * @return self[]
	 *
	 * @since 1.2.1
	 */
	public function splitByPeriod( $period ) {
		$split = array();

		if ( $period->startTime->getTimestamp() - $this->startTime->getTimestamp() > 0 ) {
			$split[] = new self( $this->startTime, $period->startTime );
		}

		if ( $this->endTime->getTimestamp() - $period->endTime->getTimestamp() > 0 ) {
			$split[] = new self( $period->endTime, $this->endTime );
		}

		return $split;
	}

	/**
	 * @param string $format Optional. 'public', 'short', 'internal' or custom
	 *     time format. 'public' by default.
	 * @param string $glue Optional. ' - ' by default.
	 * @return string
	 *
	 * @since 1.0
	 */
	public function toString( $format = 'public', $glue = ' - ' ) {
		// Force glue ' - ' for internal values
		if ( 'internal' == $format ) {
			$glue = ' - ';
		}

		// mpa_format_time() does not support format 'short'
		$timeFormat = 'short' == $format ? 'public' : $format;
		$startTime  = mpa_format_time( $this->startTime, $timeFormat );
		$endTime    = mpa_format_time( $this->endTime, $timeFormat );

		if ( 'short' == $format && $startTime == $endTime ) {
			return $startTime;
		} else {
			return $startTime . $glue . $endTime;
		}
	}

	/**
	 * @return string
	 *
	 * @since 1.0
	 */
	public function __toString() {
		return $this->toString();
	}

	/**
	 * @since 1.0
	 */
	public function __clone() {
		$this->startTime = clone $this->startTime;
		$this->endTime   = clone $this->endTime;
	}

	/**
	 * @param string $period
	 * @return string|false Valid string or false.
	 *
	 * @since 1.0
	 */
	public static function validate( $period ) {
		$periodPattern = str_replace(
			array( '%start_time%', '%end_time%' ),
			mpa_validate_time_pattern(),
			static::PERIOD_PATTERN
		);

		if ( (bool) preg_match( $periodPattern, $period ) ) {
			return $period;
		} else {
			return false;
		}
	}

	/**
	 * @param string $period
	 * @return static|null
	 *
	 * @since 1.0
	 */
	public static function createFromPeriod( $period ) {
		$validPeriod = static::validate( $period );

		if ( false !== $validPeriod ) {
			return new static( $validPeriod );
		} else {
			return null;
		}
	}
}
