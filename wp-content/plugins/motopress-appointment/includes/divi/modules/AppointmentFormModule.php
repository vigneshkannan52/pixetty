<?php

namespace MotoPress\Appointment\Divi\Modules;

use MotoPress\Appointment\Shortcodes;

class AppointmentFormModule extends AbstractShortcodeModule {

	public $slug       = 'appointment_form';
	public $vb_support = 'partial';

	protected $module_credits = array(
		'module_uri' => '',
		'author'     => 'MotoPress',
		'author_uri' => 'https://motopress.com/',
	);

	public function init() {

		$this->name = esc_html__( 'Appointment Form', 'motopress-appointment' );
	}

	public function get_fields() {

		$unselectedId = array( 0 => esc_html__( '— Unselected —', 'motopress-appointment' ) );

		return array(
			'form_title'               => array(
				'label'           => esc_html__( 'Form Title', 'motopress-appointment' ),
				'type'            => 'text',
				'option_category' => 'basic_option',
				'default'         => '',
			),
			'show_category'            => array(
				'label'           => esc_html__( 'Show Category?', 'motopress-appointment' ),
				'description'     => esc_html__( 'Show the service category field in the form.', 'motopress-appointment' ),
				'type'            => 'yes_no_button',
				'option_category' => 'basic_option',
				'options'         => array(
					'on'  => esc_html__( 'Yes', 'motopress-appointment' ),
					'off' => esc_html__( 'No', 'motopress-appointment' ),
				),
				'default'         => 'on',
			),
			'show_service'             => array(
				'label'           => esc_html__( 'Show Service?', 'motopress-appointment' ),
				'description'     => esc_html__( 'Show the service field in the form.', 'motopress-appointment' ),
				'type'            => 'yes_no_button',
				'option_category' => 'basic_option',
				'options'         => array(
					'on'  => esc_html__( 'Yes', 'motopress-appointment' ),
					'off' => esc_html__( 'No', 'motopress-appointment' ),
				),
				'default'         => 'on',
			),
			'show_location'            => array(
				'label'           => esc_html__( 'Show Location?', 'motopress-appointment' ),
				'description'     => esc_html__( 'Show the location field in the form.', 'motopress-appointment' ),
				'type'            => 'yes_no_button',
				'option_category' => 'basic_option',
				'options'         => array(
					'on'  => esc_html__( 'Yes', 'motopress-appointment' ),
					'off' => esc_html__( 'No', 'motopress-appointment' ),
				),
				'default'         => 'on',
			),
			'show_employee'            => array(
				'label'           => esc_html__( 'Show Employee?', 'motopress-appointment' ),
				'description'     => esc_html__( 'Show the employee field in the form.', 'motopress-appointment' ),
				'type'            => 'yes_no_button',
				'option_category' => 'basic_option',
				'options'         => array(
					'on'  => esc_html__( 'Yes', 'motopress-appointment' ),
					'off' => esc_html__( 'No', 'motopress-appointment' ),
				),
				'default'         => 'on',
			),
			'label_category'           => array(
				'label'           => esc_html__( 'Category Field Label', 'motopress-appointment' ),
				'type'            => 'text',
				'option_category' => 'basic_option',
				'default'         => esc_html__( 'Service Category', 'motopress-appointment' ),
				'description'     => esc_html__( 'Custom label for the service category field.', 'motopress-appointment' ),
			),
			'label_service'            => array(
				'label'           => esc_html__( 'Service Field Label', 'motopress-appointment' ),
				'type'            => 'text',
				'option_category' => 'basic_option',
				'default'         => esc_html__( 'Service', 'motopress-appointment' ),
				'description'     => esc_html__( 'Custom label for the service field.', 'motopress-appointment' ),
			),
			'label_location'           => array(
				'label'           => esc_html__( 'Location Field Label', 'motopress-appointment' ),
				'type'            => 'text',
				'option_category' => 'basic_option',
				'default'         => esc_html__( 'Location', 'motopress-appointment' ),
				'description'     => esc_html__( 'Custom label for the location field.', 'motopress-appointment' ),
			),
			'label_employee'           => array(
				'label'           => esc_html__( 'Employee Field Label', 'motopress-appointment' ),
				'type'            => 'text',
				'option_category' => 'basic_option',
				'default'         => esc_html__( 'Employee', 'motopress-appointment' ),
				'description'     => esc_html__( 'Custom label for the employee field.', 'motopress-appointment' ),
			),
			'label_unselected'         => array(
				'label'           => esc_html__( 'Unselected Service', 'motopress-appointment' ),
				'type'            => 'text',
				'option_category' => 'basic_option',
				'default'         => esc_html__( '— Select —', 'motopress-appointment' ),
				'description'     => esc_html__( 'Custom label for the unselected service field.', 'motopress-appointment' ),
			),
			'label_option'             => array(
				'label'           => esc_html__( 'Unselected Option', 'motopress-appointment' ),
				'type'            => 'text',
				'option_category' => 'basic_option',
				'default'         => esc_html__( '— Any —', 'motopress-appointment' ),
				'description'     => esc_html__( 'Comma-separated slugs or IDs of tags that will be shown.', 'motopress-appointment' ),
			),
			'default_category'         => array(
				'label'           => esc_html__( 'Service Category', 'motopress-appointment' ),
				'description'     => esc_html__( 'Slug of the selected service category.', 'motopress-appointment' ),
				'type'            => 'select',
				'option_category' => 'basic_option',
				'options'         => $unselectedId + mpa_get_service_categories(),
				'default'         => '',
			),
			'default_service'          => array(
				'label'           => esc_html__( 'Service', 'motopress-appointment' ),
				'description'     => esc_html__( 'ID of the selected service.', 'motopress-appointment' ),
				'type'            => 'select',
				'option_category' => 'basic_option',
				'options'         => $unselectedId + mpa_get_services(),
				'default'         => 0,
			),
			'default_location'         => array(
				'label'           => esc_html__( 'Location', 'motopress-appointment' ),
				'description'     => esc_html__( 'ID of the selected location.', 'motopress-appointment' ),
				'type'            => 'select',
				'option_category' => 'basic_option',
				'options'         => $unselectedId + mpa_get_locations(),
				'default'         => 0,
			),
			'default_employee'         => array(
				'label'           => esc_html__( 'Employee', 'motopress-appointment' ),
				'description'     => esc_html__( 'ID of the selected employee.', 'motopress-appointment' ),
				'type'            => 'select',
				'option_category' => 'basic_option',
				'options'         => $unselectedId + mpa_get_employees(),
				'default'         => 0,
			),
			'timepicker_columns'       => array(
				'label'          => esc_html__( 'Timepicker Columns Count', 'motopress-appointment' ),
				'type'           => 'range',
				'default'        => '3',
				'unitless'       => true,
				'range_settings' => array(
					'min'  => 1,
					'max'  => 5,
					'step' => 1,
				),
			),
			'show_timepicker_end_time' => array(
				'label'           => esc_html__( 'Show End Time?', 'motopress-appointment' ),
				'description'     => esc_html__( 'Show the time when the appointment ends.', 'motopress-appointment' ),
				'type'            => 'yes_no_button',
				'option_category' => 'basic_option',
				'options'         => array(
					'on'  => esc_html__( 'Yes', 'motopress-appointment' ),
					'off' => esc_html__( 'No', 'motopress-appointment' ),
				),
				'default'         => 'off',
			),
		);
	}

	/**
	 * @since 1.19.1
	 *
	 * @return Shortcodes\AppointmentFormShortcode
	 */
	protected function getMPAShortcode(): Shortcodes\AbstractShortcode {
		return mpa_shortcodes()->appointmentForm();
	}
}
