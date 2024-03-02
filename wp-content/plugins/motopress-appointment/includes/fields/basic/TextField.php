<?php

namespace MotoPress\Appointment\Fields\Basic;

use MotoPress\Appointment\Fields\AbstractField;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * @since 1.0
 */
class TextField extends AbstractField {

	/** @since 1.0 */
	const TYPE = 'text';

	/**
	 * @var string
	 *
	 * @since 1.1.0
	 */
	public $placeholder = '';

	/**
	 * @return array
	 *
	 * @since 1.1.0
	 */
	protected function mapFields() {
		return parent::mapFields() + array(
			'placeholder' => 'placeholder',
		);
	}

	/**
	 * @param mixed $value
	 * @return mixed
	 *
	 * @since 1.0
	 */
	protected function validateValue( $value ) {
		if ( '' === $value ) {
			return $this->default;
		} else {
			return sanitize_text_field( $value );
		}
	}

	/**
	 * @return string
	 *
	 * @since 1.0
	 */
	public function renderInput() {
		return '<input' . mpa_tmpl_atts( $this->inputAtts() ) . '>';
	}

	/**
	 * @return array
	 *
	 * @since 1.0
	 */
	protected function inputAtts() {
		$atts = parent::inputAtts() + array(
			'type'  => 'text',
			'value' => $this->value,
		);

		if ( ! empty( $this->placeholder ) ) {
			$atts['placeholder'] = $this->placeholder;
		}

		return $atts;
	}
}
