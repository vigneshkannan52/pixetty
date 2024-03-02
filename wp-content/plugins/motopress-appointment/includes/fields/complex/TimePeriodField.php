<?php

namespace MotoPress\Appointment\Fields\Complex;

use MotoPress\Appointment\Fields\AbstractField;


if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


/**
 * @since 1.10.2
 */
class TimePeriodField extends AbstractField {

	/** @since 1.10.2 */
	const TYPE = 'time-period';

	/**
	 * @var int
	 *
	 * @since 1.10.2
	 */
	public $minDays = 0;

	/**
	 * @var int
	 *
	 * @since 1.10.2
	 */
	public $maxDays = 31;

	/**
	 * @var int
	 *
	 * @since 1.10.2
	 */
	public $minHours = 0;

	/**
	 * @var int
	 *
	 * @since 1.10.2
	 */
	public $maxHours = 23;

	/**
	 * @var int
	 *
	 * @since 1.10.2
	 */
	public $minMinutes = 0;

	/**
	 * @var int
	 *
	 * @since 1.10.2
	 */
	public $maxMinutes = 59;

	/**
	 * @var int
	 *
	 * @since 1.10.2
	 */
	public $minutesStep = 15;

	/**
	 * @param string $inputName Prefixed name.
	 * @param array $args
	 * @param mixed $value Optional. Null by default.
	 *
	 * @since 1.10.2
	 */
	public function __construct( $inputName, $args, $value = null ) {

		if ( isset( $args['maxDays'] ) ) {

			$this->maxDays = absint( $args['maxDays'] );
		}

		if ( empty( $value ) ) {

			$value = array(
				'days'    => $this->minDays,
				'hours'   => $this->minHours,
				'minutes' => $this->minMinutes,
			);
		}

		parent::__construct( $inputName, $args, $value );
	}

	/**
	 * @param mixed $value
	 * @return mixed
	 *
	 * @since 1.10.2
	 */
	protected function validateValue( $value ) {

		$validatedValues            = array();
		$validatedValues['days']    = isset( $value['days'] ) ? absint( $value['days'] ) : $this->minDays;
		$validatedValues['hours']   = isset( $value['hours'] ) ? absint( $value['hours'] ) : $this->minHours;
		$validatedValues['minutes'] = isset( $value['minutes'] ) ? absint( $value['minutes'] ) : $this->minMinutes;

		$validatedValues['days']    = mpa_limit( $validatedValues['days'], $this->minDays, $this->maxDays );
		$validatedValues['hours']   = mpa_limit( $validatedValues['hours'], $this->minHours, $this->maxHours );
		$validatedValues['minutes'] = mpa_limit( $validatedValues['minutes'], $this->minMinutes, $this->maxMinutes );

		return $validatedValues;
	}

	/**
	 * @param string $context Optional. 'internal' by default. Variants:
	 *     'internal' - for internal use (in the functions of the plugin);
	 *     'save'     - prepare the value for the database.
	 * @return mixed
	 *
	 * @since 1.10.2
	 */
	public function getValue( $context = 'internal' ) {

		$value = $this->value;

		if ( 'save' == $context ) {

			$value = 0;

			if ( isset( $this->value['days'] ) ) {

				$value += absint( $this->value['days'] ) * 24 * 60;
			}

			if ( isset( $this->value['hours'] ) ) {

				$value += absint( $this->value['hours'] ) * 60;
			}

			if ( isset( $this->value['minutes'] ) ) {

				$value += absint( $this->value['minutes'] );
			}
		}

		return $value;
	}


	/**
	 * @param mixed $value
	 * @param mixed $validate Optional. False by default.
	 *
	 * @since 1.10.2
	 */
	public function setValue( $value, $validate = false ) {

		if ( ! is_array( $value ) ) {

			$days    = intdiv( $value, 1440 /** 24 * 60 */ );
			$hours   = intdiv( $value - $days * 1440, 60 );
			$minutes = $value - $days * 1440 - $hours * 60;

			$value = array(
				'days'    => $days,
				'hours'   => $hours,
				'minutes' => $minutes,
			);
		}
		parent::setValue( $value, $validate );
	}

	/**
	 * @return string
	 */
	public function renderLabel() {
		return $this->hasLabel() ? '<label>' . esc_html( $this->label ) . '</label>' : '';
	}

	/**
	 * @return string
	 *
	 * @since 1.10.2
	 */
	public function renderInput() {

		$output = '<div ' . mpa_tmpl_atts( $this->inputAtts() ) . '><label>';

		if ( 0 < $this->maxDays ) {

			$daysRange   = range( $this->minDays, $this->maxDays );
			$daysOptions = array_combine( $daysRange, $daysRange );

			$output .= mpa_tmpl_select( $daysOptions, $this->value['days'], array( 'name' => "{$this->inputName}[days]" ) ) .
				'&nbsp;' . esc_html__( 'days', 'motopress-appointment' ) . '&nbsp;';
		}

		if ( 0 < $this->maxHours ) {

			$hoursRange   = range( $this->minHours, $this->maxHours );
			$hoursOptions = array_combine( $hoursRange, $hoursRange );

			$output .= mpa_tmpl_select( $hoursOptions, $this->value['hours'], array( 'name' => "{$this->inputName}[hours]" ) ) .
				'&nbsp;' . esc_html__( 'hours', 'motopress-appointment' ) . '&nbsp;';
		}

		if ( 0 < $this->maxMinutes ) {

			$minutesRange   = range( $this->minMinutes, $this->maxMinutes, $this->minutesStep );
			$minutesOptions = array_combine( $minutesRange, $minutesRange );

			$output .= mpa_tmpl_select( $minutesOptions, $this->value['minutes'], array( 'name' => "{$this->inputName}[minutes]" ) ) .
				'&nbsp;' . esc_html__( 'minutes', 'motopress-appointment' );
		}

		$output .= '</label></div>';

		return $output;
	}
}
