<?php

namespace MotoPress\Appointment\Shortcodes;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * @since 1.0
 */
class AppointmentFormShortcode extends AbstractPostShortcode {

	/**
	 * @return string
	 *
	 * @since 1.0
	 */
	public function getName() {
		return 'appointment_form';
	}

	/**
	 * @return string
	 *
	 * @since 1.2
	 */
	public function getLabel() {
		return esc_html__( 'Appointment Form', 'motopress-appointment' );
	}

	/**
	 * @return array
	 *
	 * @since 1.2
	 */
	public function getAttributes() {
		$appointmentFormAtts = array(
			'form_title'               => array(
				'type'    => 'string',
				'default' => '',
			),
			'show_category'            => array(
				'type'        => 'bool',
				'description' => esc_html__( 'Show the service category field in the form.', 'motopress-appointment' ),
				'default'     => true,
			),
			'show_service'             => array(
				'type'        => 'bool',
				'description' => esc_html__( 'Show the service field in the form.', 'motopress-appointment' ),
				'default'     => true,
			),
			'show_location'            => array(
				'type'        => 'bool',
				'description' => esc_html__( 'Show the location field in the form.', 'motopress-appointment' ),
				'default'     => true,
			),
			'show_employee'            => array(
				'type'        => 'bool',
				'description' => esc_html__( 'Show the employee field in the form.', 'motopress-appointment' ),
				'default'     => true,
			),
			'label_category'           => array(
				'type'          => 'string',
				'description'   => esc_html__( 'Custom label for the service category field.', 'motopress-appointment' ),
				'default'       => '',
				'default_label' => esc_html__( 'Service Category', 'motopress-appointment' ),
			),
			'label_service'            => array(
				'type'          => 'string',
				'description'   => esc_html__( 'Custom label for the service field.', 'motopress-appointment' ),
				'default'       => '',
				'default_label' => esc_html__( 'Service', 'motopress-appointment' ),
			),
			'label_location'           => array(
				'type'          => 'string',
				'description'   => esc_html__( 'Custom label for the location field.', 'motopress-appointment' ),
				'default'       => '',
				'default_label' => esc_html__( 'Location', 'motopress-appointment' ),
			),
			'label_employee'           => array(
				'type'          => 'string',
				'description'   => esc_html__( 'Custom label for the employee field.', 'motopress-appointment' ),
				'default'       => '',
				'default_label' => esc_html__( 'Employee', 'motopress-appointment' ),
			),
			'label_unselected'         => array(
				'type'          => 'string',
				'description'   => esc_html__( 'Custom label for the unselected service field.', 'motopress-appointment' ),
				'default'       => '',
				'default_label' => esc_html__( '— Select —', 'motopress-appointment' ),
			),
			'label_option'             => array(
				'type'          => 'string',
				'description'   => esc_html__( 'Custom label for the unselected service category, location and employee fields.', 'motopress-appointment' ),
				'default'       => '',
				'default_label' => esc_html__( '— Any —', 'motopress-appointment' ),
			),
			'default_category'         => array(
				'type'          => 'string',
				'description'   => esc_html__( 'Slug of the selected service category.', 'motopress-appointment' ),
				'default'       => '',
				'default_label' => null,
			),
			'default_service'          => array(
				'type'          => 'integer',
				'description'   => esc_html__( 'ID of the selected service.', 'motopress-appointment' ),
				'default'       => 0,
				'default_label' => null,
			),
			'default_location'         => array(
				'type'          => 'integer',
				'description'   => esc_html__( 'ID of the selected location.', 'motopress-appointment' ),
				'default'       => 0,
				'default_label' => null,
			),
			'default_employee'         => array(
				'type'          => 'integer',
				'description'   => esc_html__( 'ID of the selected employee.', 'motopress-appointment' ),
				'default'       => 0,
				'default_label' => null,
			),
			'timepicker_columns'       => array(
				'type'        => 'integer',
				'description' => esc_html__( 'The number of columns in the timepicker.', 'motopress-appointment' ),
				'default'     => 3,
			),
			'show_timepicker_end_time' => array(
				'type'        => 'bool',
				'description' => esc_html__( 'Show the time when the appointment ends.', 'motopress-appointment' ),
				'default'     => false,
			),
		);

		return $appointmentFormAtts + parent::getAttributes();
	}

	/**
	 * @param array $args
	 * @param string $content
	 * @param string $shortcodeTag
	 * @return string
	 *
	 * @since 1.0
	 */
	public function renderContent( $args, $content, $shortcodeTag ) {
		if ( ! is_admin() ) {
			$this->enqueueScripts();
		}

		return mpa_render_template( 'shortcodes/appointment-form.php', $args );
	}

	/**
	 * @param array $validArgs
	 * @param array $postArgs Source values.
	 * @return array
	 *
	 * @since 1.2
	 */
	protected function filterPostArgs( $validArgs, $postArgs ) {
		$filteredArgs = parent::filterPostArgs( $validArgs, $postArgs );

		// Add show_* parameters
		if ( isset( $postArgs['show_items'] ) && is_array( $postArgs['show_items'] ) ) {
			$filteredArgs += array(
				'show_category' => in_array( 'category', $postArgs['show_items'] ),
				'show_service'  => in_array( 'service', $postArgs['show_items'] ),
				'show_location' => in_array( 'location', $postArgs['show_items'] ),
				'show_employee' => in_array( 'employee', $postArgs['show_items'] ),
			);
		}

		return $filteredArgs;
	}

	/**
	 * Enqueue shortcode scripts:
	 * - front-end scripts
	 * - payment gateways api handler scripts
	 *
	 * @return void
	 */
	protected function enqueueScripts() {
		mpa_assets()->enqueueBundle( 'mpa-public' );

		// define customer data for autocompletion on the frontend
		if ( is_user_logged_in() ) {
			$userId   = get_current_user_id();
			$customer = mpapp()->repositories()->customer()->findByUserId( $userId );
			if ( $customer ) {
				wp_localize_script( 'mpa-public', 'MPA_CURRENT_CUSTOMER', array(
					'name'  => $customer->getName(),
					'email' => $customer->getEmail(),
					'phone' => $customer->getPhone(),
				) );
			}
		}

		if ( ! mpapp()->settings()->isPaymentsEnabled() ) {
			return;
		}

		$gateways = mpapp()->payments()->getActive();
		foreach ( $gateways as $gateway ) {
			if ( method_exists( $gateway, 'enqueueScripts' ) ) {
				$gateway->enqueueScripts();
			}
		}
	}
}
