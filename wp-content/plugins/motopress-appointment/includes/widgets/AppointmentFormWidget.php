<?php

namespace MotoPress\Appointment\Widgets;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * @since 1.3
 */
class AppointmentFormWidget extends AbstractWidget {

	/**
	 * @return string
	 *
	 * @since 1.3
	 */
	public function getId() {
		return 'appointment_form';
	}

	/**
	 * @return string
	 *
	 * @since 1.3
	 */
	public function getName() {
		return esc_html__( 'Appointment Form', 'motopress-appointment' );
	}

	/**
	 * @param array $instanceArgs
	 * @param \WP_Widget $widget The widget instance.
	 * @return array
	 *
	 * @since 1.3
	 */
	public function filterArgs( $instanceArgs, $widget ) {
		if ( $widget !== $this ) {
			return $instanceArgs;
		}

		$instanceArgs = parent::filterArgs( $instanceArgs, $widget );

		// Storing the value of $instanceArgs['show_items'] into a variable before possible removed by array_filter($instanceArgs);
		$showItems = array();
		if ( isset( $instanceArgs['show_items'] ) ) {
			$showItems = $instanceArgs['show_items'];
			unset( $instanceArgs['show_items'] );
		}

		// Remove unset values
		$instanceArgs = array_filter( $instanceArgs );

		// Add show_* parameters
		// ( Convert parameter show_items to show_{item} )
		$instanceArgs += array(
			'show_category' => in_array( 'category', $showItems ),
			'show_service'  => in_array( 'service', $showItems ),
			'show_location' => in_array( 'location', $showItems ),
			'show_employee' => in_array( 'employee', $showItems ),
		);

		return $instanceArgs;
	}

	/**
	 * @param array $instanceArgs Saved parameters from the database.
	 * @return string
	 *
	 * @since 1.3
	 */
	protected function renderContent( $instanceArgs ) {
		if ( ! is_admin() ) {
			$this->enqueueScripts();
		}

		return mpa_render_template( 'widgets/appointment-form.php', $instanceArgs );
	}

	/**
	 * Enqueue widget scripts:
	 * - front-end scripts
	 * - payment gateways api handler scripts
	 *
	 * @since 1.15.2
	 */
	protected function enqueueScripts() {
		mpa_assets()->enqueueBundle( 'mpa-public' );

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

	/**
	 * @return array
	 *
	 * @since 1.3
	 */
	protected function getFields() {
		$unselectedSlug = array( '' => esc_html__( '— Unselected —', 'motopress-appointment' ) );
		$unselectedId   = array( 0 => esc_html__( '— Unselected —', 'motopress-appointment' ) );

		return array(
			'title'                    => array(
				'type'    => 'text',
				'label'   => esc_html__( 'Title', 'motopress-appointment' ),
				'default' => esc_html__( 'Appointment Form', 'motopress-appointment' ),
				'size'    => 'wide',
			),
			'form_title'               => array(
				'type'  => 'text',
				'label' => esc_html__( 'Form Title', 'motopress-appointment' ),
				'size'  => 'wide',
			),
			'show_items'               => array(
				'type'    => 'checklist',
				'label'   => esc_html__( 'Show Items', 'motopress-appointment' ),
				'options' => array(
					'category' => esc_html__( 'Service Category', 'motopress-appointment' ),
					'service'  => esc_html__( 'Service', 'motopress-appointment' ),
					'location' => esc_html__( 'Location', 'motopress-appointment' ),
					'employee' => esc_html__( 'Employee', 'motopress-appointment' ),
				),
				'value'   => array( 'category', 'service', 'location', 'employee' ),
			),

			'labels_group'             => array(
				'type'  => 'group',
				'label' => esc_html__( 'Labels', 'motopress-appointment' ),
			),
			'label_category'           => array(
				'type'        => 'text',
				'label'       => esc_html__( 'Service Category', 'motopress-appointment' ),
				'placeholder' => esc_html__( 'Service Category', 'motopress-appointment' ),
				'size'        => 'wide',
			),
			'label_service'            => array(
				'type'        => 'text',
				'label'       => esc_html__( 'Service', 'motopress-appointment' ),
				'placeholder' => esc_html__( 'Service', 'motopress-appointment' ),
				'size'        => 'wide',
			),
			'label_location'           => array(
				'type'        => 'text',
				'label'       => esc_html__( 'Location', 'motopress-appointment' ),
				'placeholder' => esc_html__( 'Location', 'motopress-appointment' ),
				'size'        => 'wide',
			),
			'label_employee'           => array(
				'type'        => 'text',
				'label'       => esc_html__( 'Employee', 'motopress-appointment' ),
				'placeholder' => esc_html__( 'Employee', 'motopress-appointment' ),
				'size'        => 'wide',
			),
			'label_unselected'         => array(
				'type'        => 'text',
				'label'       => esc_html__( 'Unselected Service', 'motopress-appointment' ),
				'description' => esc_html__( 'Custom label for the unselected service field.', 'motopress-appointment' ),
				'placeholder' => esc_html__( '— Select —', 'motopress-appointment' ),
				'size'        => 'wide',
			),
			'label_option'             => array(
				'type'        => 'text',
				'label'       => esc_html__( 'Unselected Option', 'motopress-appointment' ),
				'description' => esc_html__( 'Custom label for the unselected service category, location and employee fields.', 'motopress-appointment' ),
				'placeholder' => esc_html__( '— Any —', 'motopress-appointment' ),
				'size'        => 'wide',
			),

			'defaults_group'           => array(
				'type'  => 'group',
				'label' => esc_html__( 'Default Values', 'motopress-appointment' ),
			),
			'default_category'         => array(
				'type'    => 'select',
				'label'   => esc_html__( 'Service Category', 'motopress-appointment' ),
				'options' => $unselectedSlug + mpa_get_service_categories(),
				'size'    => 'wide',
			),
			'default_service'          => array(
				'type'    => 'select',
				'label'   => esc_html__( 'Service', 'motopress-appointment' ),
				'options' => $unselectedId + mpa_get_services(),
				'size'    => 'wide',
			),
			'default_location'         => array(
				'type'    => 'select',
				'label'   => esc_html__( 'Location', 'motopress-appointment' ),
				'options' => $unselectedId + mpa_get_locations(),
				'size'    => 'wide',
			),
			'default_employee'         => array(
				'type'    => 'select',
				'label'   => esc_html__( 'Employee', 'motopress-appointment' ),
				'options' => $unselectedId + mpa_get_employees(),
				'size'    => 'wide',
			),

			'timepicker_group'         => array(
				'type'  => 'group',
				'label' => esc_html__( 'Timepicker', 'motopress-appointment' ),
			),
			'timepicker_columns'       => array(
				'type'    => 'number',
				'label'   => esc_html__( 'Columns Count', 'motopress-appointment' ),
				'min'     => 1,
				'max'     => 5,
				'default' => 3,
				'size'    => 'small',
			),
			'show_timepicker_end_time' => array(
				'type'    => 'checkbox',
				'label'   => esc_html__( 'Show End Time', 'motopress-appointment' ),
				'label2'  => esc_html__( 'Show the time when the appointment ends.', 'motopress-appointment' ),
				'default' => false,
			),

			'advanced_group'           => array(
				'type'  => 'group',
				'label' => esc_html__( 'Advanced', 'motopress-appointment' ),
			),
			'html_id'                  => array(
				'type'        => 'text',
				'label'       => esc_html__( 'HTML Anchor', 'motopress-appointment' ),
				'description' => mpa_kses_link( __( 'HTML Anchor. Anchors lets you link directly to a section on a page. <a href="https://wordpress.org/support/article/page-jumps/" target="_blank">Learn more about anchors.</a>', 'motopress-appointment' ) ),
				'size'        => 'wide',
			),
			'html_class'               => array(
				'type'        => 'text',
				'label'       => esc_html__( 'CSS Class(es)', 'motopress-appointment' ),
				'description' => esc_html__( 'Additional CSS Class(es). Separate multiple classes with spaces.', 'motopress-appointment' ),
				'size'        => 'wide',
			),
		);
	}
}
