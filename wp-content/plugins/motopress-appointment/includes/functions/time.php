<?php

use MotoPress\Appointment\Entities\Service;
use MotoPress\Appointment\Structures\TimePeriod;
use MotoPress\Appointment\Structures\TimePeriods;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * @param int $minutes
 * @param string $format Optional. 'public', 'internal' ('H:i') or custom time
 *     format. 'public' by default.
 * @return string
 *
 * @since 1.0
 */
function mpa_format_minutes( $minutes, $format = 'public' ) {
	$minutes %= 1440; // Stay in range 00:00 - 23:59

	$hours   = (int) ( $minutes / 60 );
	$minutes = $minutes % 60;

	$date = mpa_today();
	$date->setTime( $hours, $minutes );

	return mpa_format_time( $date, $format );
}

/**
 * @param int $minutes
 * @return string Duration time in format '30m', '1h' or '1h 30m'.
 *
 * @since 1.0
 */
function mpa_minutes_to_duration( $minutes ) {
	$days    = (int) ( $minutes / 60 / 24 );
	$hours   = (int) ( $minutes / 60 - $days * 24 );
	$minutes = $minutes % 60;

	$durations = array();

	if ( 0 != $days ) {
		// Translators: %d: The amount of days.
		$durations[] = sprintf( esc_html_x( '%dd', 'Duration (days)', 'motopress-appointment' ), $days );
	}

	if ( 0 != $hours ) {
		// Translators: %d: The amount of hours.
		$durations[] = sprintf( esc_html_x( '%dh', 'Duration (hours)', 'motopress-appointment' ), $hours );
	}

	if ( 0 != $minutes || empty( $durations ) ) {
		// Translators: %d: The amount of minutes.
		$durations[] = sprintf( esc_html_x( '%dm', 'Duration (minutes)', 'motopress-appointment' ), $minutes );
	}

	$duration = implode( ' ', $durations );

	return $duration;
}

/**
 * Convert something like '08:20' into 500.
 *
 * @param string $timeString Time in format 'H:i' ('XX:XX'; the function will
 *     not check if the format is OK).
 * @return int
 *
 * @since 1.0
 */
function mpa_parse_to_minutes( $timeString ) {
	$time = explode( ':', $timeString ); // ['08', '20']

	$hours   = (int) $time[0];   // 8
	$minutes = (int) $time[1]; // 20

	$offset = $hours * 60 + $minutes; // 500

	return $offset;
}

/**
 * @param DateTime $time
 * @param string $format Optional. 'public', 'internal' ('H:i') or custom time
 *     format. 'public' by default.
 * @return string
 *
 * @since 1.0
 */
function mpa_format_time( $time, $format = 'public' ) {

	if ( 'internal' == $format ) {
		return $time->format( 'H:i' );
	} elseif ( 'public' == $format ) {
		return $time->format( mpa_time_format() );
	} else {
		return $time->format( $format );
	}
}

/**
 * @param string|DateTime $time Only the internal format is acceptable as a
 *     string: 'H:i'.
 * @param mixed $default Optional. False by default (same return value as in the
 *     DateTime::createFromFormat()).
 * @return DateTime|mixed
 *
 * @since 1.0
 * @since 1.2.1 the argument <code>$time</code> accepts DateTime object.
 */
function mpa_parse_time( $time, $default = false ) {
	if ( is_string( $time ) ) {
		$time = DateTime::createFromFormat( 'H:i', $time, wp_timezone() );
	}

	// Reset current date
	if ( false !== $time ) {
		$time->setDate( mpa_current_year(), 1, 1 );
	} else {
		$time = $default;
	}

	return $time;
}

/**
 * @param string $timeString Only the internal format is acceptable - 'H:i'.
 * @return string|false Valid string or false.
 *
 * @since 1.0
 */
function mpa_validate_time( $timeString ) {
	$timeString = trim( $timeString );

	$timePattern = mpa_validate_time_pattern();
	$isValid     = (bool) preg_match( "/^{$timePattern}$/", $timeString );

	if ( $isValid ) {
		return $timeString;
	} else {
		return false;
	}
}

/**
 * @return string Validation pattern for internal time format ('H:i').
 *
 * @since 1.0
 */
function mpa_validate_time_pattern() {
	return '\\d{2}:\\d{2}';
}

/**
 * Public time format, set in Settings > General.
 *
 * @return string
 *
 * @since 1.0
 */
function mpa_time_format() {
	return mpapp()->settings()->getTimeFormat();
}

/**
 * @param int $min Optional. 0 by default.
 * @param int $max Optional. 1439 by default (the latest time (in minutes): 23:59).
 * @return array [Amount of minutes => Duration string]
 *
 * @since 1.0
 */
function mpa_time_durations( $min = 0, $max = 1439 ) {
	return mpa_time_stamps(
		array(
			'map_function' => 'mpa_minutes_to_duration',
			'min'          => $min,
			'max'          => $max,
		)
	);
}

/**
 * @param array $args Optional.
 *     @param int $args['time_step'] Time step from the settings by default.
 *     @param string $args['map_function'] mpa_format_minutes() by default.
 *     @param int $args['min'] 0 by default.
 *     @param int $args['max'] 1439 by default (the latest time (in minutes): 23:59).
 * @return array [Amount of minutes => Time stamp]. By default the time stamp is
 *     a formatted minutes value - the string like '08:30'.
 *
 * @since 1.0
 */
function mpa_time_stamps( $args = array() ) {
	$timeStep    = isset( $args['time_step'] ) ? $args['time_step'] : mpa_time_step();
	$mapFunction = isset( $args['map_function'] ) ? $args['map_function'] : 'mpa_format_minutes';

	// Stay in range 00:00 - 23:59
	$min = isset( $args['min'] ) ? max( 0, $args['min'] ) : 0;
	$max = isset( $args['max'] ) ? $args['max'] : 1439;

	// Ceil the min value to the nearest full step
	mpa_ceil_to_step( $min, $timeStep );

	// Return nothing with incorrect limits
	if ( $min > $max ) {
		return array();
	}

	// Build stamps
	$times  = range( $min, $max, $timeStep );
	$labels = array_map( $mapFunction, $times );

	$timeStamps = array_combine( $times, $labels );

	return $timeStamps;
}

/**
 * @param DateTime $time
 * @return int Timestamp in minutes.
 *
 * @since 1.2.1
 */
function mpa_timestamp_minutes( $time ) {
	$timestampMinutes = ( $time->getTimestamp() + $time->getOffset() ) / 60;

	return (int) $timestampMinutes;
}

/**
 * @param TimePeriod|TimePeriod[]|TimePeriods $time
 * @param array $args
 *     @param int      $args['duration']      Required. Service duration (minutes).
 *     @param int      $args['time_step']     Optional. Length of the time slot step.
 *                                            Time step from the settings by default.
 *     @param int      $args['buffer_before'] Optional. Buffer time before the service
 *                                            (in minutes). 0 by default.
 *     @param int      $args['buffer_after']  Optional. Buffer time after the service
 *                                            (in minutes). 0 by default.
 *     @param DateTime $args['min_time']      Optional. No limitations by default.
 *     @param string   $args['alignment']     Optional. 'hour'|'none'. Alignment from
 *                                            the settings by default.
 * @return TimePeriod[] [Time period string => Time period]
 *
 * @since 1.2.1
 */
function mpa_time_slots( $time, $args ) {
	if ( $time instanceof TimePeriods ) {
		$time = $time->periods;
	}

	if ( is_array( $time ) ) {
		$slotsPerPeriod = array_map( mpa_carry( 'mpa_time_slots', $args ), $time );
		return mpa_combine_subarrays( $slotsPerPeriod );
	}

	// Check required args
	if ( ! isset( $args['duration'] ) ) {
		return array();
	}

	// Add defaults
	$args += array(
		'time_step'     => mpa_time_step(),
		'buffer_before' => 0,
		'buffer_after'  => 0,
		'min_time'      => $time->startTime,
		'alignment'     => mpapp()->settings()->getTimeStepAlignment(),
	);

	extract( $args );

	$startTime = $time->startTime > $min_time ? clone $time->startTime : clone $min_time;
	$endTime   = clone $time->endTime;

	// Apply buffer time
	$startTime->modify( "+{$buffer_before} minutes" );
	$endTime->modify( "-{$buffer_after} minutes" );

	// Re-align time
	if ( 'hour' == $alignment ) {
		$startTime   = mpa_next_time_step(
			$startTime,
			array(
				'time_step' => $time_step,
				'alignment' => $alignment,
			)
		);
		$hourMinutes = (int) $startTime->format( 'i' );

		$hourMinutes -= $time_step;
	}

	$startMinutes = mpa_timestamp_minutes( $startTime );
	$endMinutes   = mpa_timestamp_minutes( $endTime );

	// Build slots
	$slots = array();

	for ( $timestamp = $startMinutes; ; $timestamp += $time_step ) {
		// Align timestamp
		switch ( $alignment ) {
			case 'hour':
				$hourMinutes += $time_step;

				if ( $hourMinutes >= 60 ) {
					// Go back to XX:00
					$timestamp  -= $hourMinutes % 60;
					$hourMinutes = 0;
				}

				break;
		}

		if ( $timestamp + $duration > $endMinutes ) {
			// No enough time for one more slot
			break;
		}

		// Add new period
		$startTime = mpa_format_minutes( $timestamp, 'internal' );
		$endTime   = mpa_format_minutes( $timestamp + $duration, 'internal' );

		$period    = new TimePeriod( $startTime, $endTime );
		$periodStr = $period->toString( 'internal' );

		$slots[ $periodStr ] = $period;
	}

	return $slots;
}

/**
 * @param DateTime $time
 * @param array $args Optional.
 *     @param int    $args['time_step'] Time step from the settings by default.
 *     @param string $args['alignment'] Alignment from the settings by default.
 * @return DateTime New time, aligned to the time step.
 *
 * @since 1.2.1
 */
function mpa_next_time_step( $time, $args = array() ) {
	$args += array(
		'time_step' => mpa_time_step(),
		'alignment' => mpapp()->settings()->getTimeStepAlignment(),
	);

	extract( $args );

	// Check the minutes value
	$minutes = (int) $time->format( 'i' );

	if ( 0 == $minutes % $time_step ) {
		return $time;
	} else {
		// How much we need to add to get to the next step
		$offsetMinutes = $time_step - ( $minutes % $time_step );

		// Re-align time
		switch ( $alignment ) {
			case 'hour':
				$newMinutes = $minutes + $offsetMinutes;

				if ( $newMinutes > 60 ) {
					// Go back to XX:00
					$offsetMinutes -= $newMinutes % 60;
				}

				break;
		}

		$newTime = clone $time;
		$newTime->modify( "+{$offsetMinutes} minutes" );

		return $newTime;
	}
}

/**
 * @return int
 *
 * @since 1.2.1
 */
function mpa_time_step() {
	return mpapp()->settings()->getTimeStep();
}

/**
 * @since 1.4.0
 *
 * @param TimePeriod|string $timePeriod
 * @param Service $service
 * @return TimePeriod
 */
function mpa_add_buffer_time( $timePeriod, $service ) {
	if ( ! ( $timePeriod instanceof TimePeriod ) ) {
		$timePeriod = new TimePeriod( $timePeriod );
	}

	$timePeriod->expand( $service->getBufferTimeBefore(), $service->getBufferTimeAfter() );

	return $timePeriod;
}
