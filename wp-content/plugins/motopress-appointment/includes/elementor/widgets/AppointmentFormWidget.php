<?php
/**
 * Class: AppointmentFormWidget
 * Name: Appointment Form
 * Slug: appointment-form
 */

namespace MotoPress\Appointment\Elementor\Widgets;

use \Elementor\Controls_Manager;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class AppointmentFormWidget extends AbstractAppointmentWidget {


	public function get_script_depends() {
		return array( 'mpa-public', 'mpa-elementor-widgets' );
	}

	public function get_name() {
		return 'appointment-form';
	}

	public function get_title() {
		return esc_html__( 'Appointment Form', 'motopress-appointment' );
	}

	public function get_icon() {
		return 'eicon-single-post';
	}

	protected function register_controls() {
		$unselectedId = array( 0 => esc_html__( '— Unselected —', 'motopress-appointment' ) );

		$this->start_controls_section(
			'section_content',
			array(
				'label' => esc_html__( 'Settings', 'motopress-appointment' ),
				'tab'   => Controls_Manager::TAB_CONTENT,
			)
		);

			$this->add_control(
				'form_title',
				array(
					'label'       => esc_html__( 'Form Title', 'motopress-appointment' ),
					'type'        => Controls_Manager::TEXT,
					'label_block' => true,
				)
			);

			$this->add_control(
				'show_category',
				array(
					'label'        => esc_html__( 'Show Category?', 'motopress-appointment' ),
					'description'  => esc_html__( 'Show the service category field in the form.', 'motopress-appointment' ),
					'type'         => Controls_Manager::SWITCHER,
					'return_value' => 'true',
					'default'      => 'true',
				)
			);

			$this->add_control(
				'show_service',
				array(
					'label'        => esc_html__( 'Show Service?', 'motopress-appointment' ),
					'description'  => esc_html__( 'Show the service category field in the form.', 'motopress-appointment' ),
					'type'         => Controls_Manager::SWITCHER,
					'return_value' => 'true',
					'default'      => 'true',
				)
			);

			$this->add_control(
				'show_location',
				array(
					'label'        => esc_html__( 'Show Location?', 'motopress-appointment' ),
					'description'  => esc_html__( 'Show the location field in the form.', 'motopress-appointment' ),
					'type'         => Controls_Manager::SWITCHER,
					'return_value' => 'true',
					'default'      => 'true',
				)
			);

			$this->add_control(
				'show_employee',
				array(
					'label'        => esc_html__( 'Show Employee?', 'motopress-appointment' ),
					'description'  => esc_html__( 'Show the employee field in the form.', 'motopress-appointment' ),
					'type'         => Controls_Manager::SWITCHER,
					'return_value' => 'true',
					'default'      => 'true',
				)
			);

			$this->add_control(
				'label_category',
				array(
					'label'       => esc_html__( 'Category Field Label', 'motopress-appointment' ),
					'type'        => Controls_Manager::TEXT,
					'label_block' => true,
					'placeholder' => esc_html__( 'Service Category', 'motopress-appointment' ),
					'description' => esc_html__( 'Custom label for the service category field.', 'motopress-appointment' ),
				)
			);

			$this->add_control(
				'label_service',
				array(
					'label'       => esc_html__( 'Service Field Label', 'motopress-appointment' ),
					'type'        => Controls_Manager::TEXT,
					'label_block' => true,
					'placeholder' => esc_html__( 'Service', 'motopress-appointment' ),
					'description' => esc_html__( 'Custom label for the service field.', 'motopress-appointment' ),
				)
			);

			$this->add_control(
				'label_location',
				array(
					'label'       => esc_html__( 'Location Field Label', 'motopress-appointment' ),
					'type'        => Controls_Manager::TEXT,
					'label_block' => true,
					'placeholder' => esc_html__( 'Location', 'motopress-appointment' ),
					'description' => esc_html__( 'Custom label for the location field.', 'motopress-appointment' ),
				)
			);

			$this->add_control(
				'label_employee',
				array(
					'label'       => esc_html__( 'Employee Field Label', 'motopress-appointment' ),
					'type'        => Controls_Manager::TEXT,
					'label_block' => true,
					'placeholder' => esc_html__( 'Employee', 'motopress-appointment' ),
					'description' => esc_html__( 'Custom label for the employee field.', 'motopress-appointment' ),
				)
			);

			$this->add_control(
				'label_unselected',
				array(
					'label'       => esc_html__( 'Unselected Service', 'motopress-appointment' ),
					'type'        => Controls_Manager::TEXT,
					'label_block' => true,
					'placeholder' => esc_html__( '— Select —', 'motopress-appointment' ),
					'description' => esc_html__( 'Custom label for the unselected service field.', 'motopress-appointment' ),
				)
			);

			$this->add_control(
				'label_option',
				array(
					'label'       => esc_html__( 'Unselected Option', 'motopress-appointment' ),
					'type'        => Controls_Manager::TEXT,
					'label_block' => true,
					'placeholder' => esc_html__( '— Any —', 'motopress-appointment' ),
					'description' => esc_html__( 'Custom label for the unselected service category, location and employee fields.', 'motopress-appointment' ),
				)
			);

			$this->add_control(
				'default_category',
				array(
					'label'       => esc_html__( 'Service Category', 'motopress-appointment' ),
					'description' => esc_html__( 'Slug of the selected service category.', 'motopress-appointment' ),
					'type'        => Controls_Manager::SELECT,
					'default'     => 0,
					'options'     => $unselectedId + mpa_get_service_categories(),
					'separator'   => 'before',
				)
			);

			$this->add_control(
				'default_service',
				array(
					'label'       => esc_html__( 'Service', 'motopress-appointment' ),
					'description' => esc_html__( 'ID of the selected service.', 'motopress-appointment' ),
					'type'        => Controls_Manager::SELECT,
					'default'     => 0,
					'options'     => $unselectedId + mpa_get_services(),
				)
			);

			$this->add_control(
				'default_location',
				array(
					'label'       => esc_html__( 'Location', 'motopress-appointment' ),
					'description' => esc_html__( 'ID of the selected location.', 'motopress-appointment' ),
					'type'        => Controls_Manager::SELECT,
					'default'     => 0,
					'options'     => $unselectedId + mpa_get_locations(),
				)
			);

			$this->add_control(
				'default_employee',
				array(
					'label'       => esc_html__( 'Employee', 'motopress-appointment' ),
					'description' => esc_html__( 'ID of the selected employee.', 'motopress-appointment' ),
					'type'        => Controls_Manager::SELECT,
					'default'     => 0,
					'options'     => $unselectedId + mpa_get_employees(),
					'separator'   => 'after',
				)
			);

			$this->add_control(
				'timepicker_columns',
				array(
					'label'    => esc_html__( 'Timepicker Columns Count', 'motopress-appointment' ),
					'type'     => Controls_Manager::NUMBER,
					'required' => true,
					'step'     => 1,
					'min'      => 1,
					'max'      => 5,
					'default'  => 3,
				)
			);

			$this->add_control(
				'show_timepicker_end_time',
				array(
					'label'        => esc_html__( 'Show End Time?', 'motopress-appointment' ),
					'description'  => esc_html__( 'Show the time when the appointment ends.', 'motopress-appointment' ),
					'type'         => Controls_Manager::SWITCHER,
					'return_value' => 'true',
					'default'      => 'false',
				)
			);

			$this->add_control(
				'html_id',
				array(
					'label'       => esc_html__( 'HTML Anchor', 'motopress-appointment' ),
					'type'        => Controls_Manager::TEXT,
					'default'     => '',
					'dynamic'     => array(
						'active' => true,
					),
					'label_block' => true,
					'description' => mpa_kses_link( __( 'HTML Anchor. Anchors lets you link directly to a section on a page. <a href="https://wordpress.org/support/article/page-jumps/" target="_blank">Learn more about anchors.</a>', 'motopress-appointment' ) ),
				)
			);

			$this->add_control(
				'html_class',
				array(
					'label'       => __( 'CSS Class(es)', 'motopress-appointment' ),
					'type'        => Controls_Manager::TEXT,
					'default'     => '',
					'dynamic'     => array(
						'active' => true,
					),
					'label_block' => true,
					'description' => esc_html__( 'Additional CSS Class(es). Separate multiple classes with spaces.', 'motopress-appointment' ),
				)
			);

		$this->end_controls_section();
	}

	protected function render() {
		$attributes = $this->get_settings();
		echo mpa_shortcodes()->appointmentForm()->render( $attributes );
	}
}
