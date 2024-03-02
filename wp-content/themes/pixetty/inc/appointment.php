<?php

function pixetty_mpa_pagination_args($args)
{

    $icon_prev = '<svg width="20" height="21" viewBox="0 0 20 21" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 20.25L12.1082 18.1418L5.70747 11.741L20 11.741L20 8.75902L5.70747 8.75902L12.1082 2.35824L10 0.25L-4.37114e-07 10.25L10 20.25Z"/>
                </svg>';

    $icon_next = '<svg width="20" height="21" viewBox="0 0 20 21" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 0.25L7.89175 2.35825L14.2925 8.75902L-5.02287e-07 8.75902L-3.71941e-07 11.741L14.2925 11.741L7.89176 18.1418L10 20.25L20 10.25L10 0.25Z"/>
                </svg>';

    $new_args = [
        'prev_text' => $icon_prev,
        'next_text' => $icon_next,
        'before_page_number' => '<span class="meta-nav screen-reader-text">' . esc_html__('Page', 'pixetty') . ' </span>',
        'mid_size' => 2,
    ];

    return array_merge($args, $new_args);
}

add_filter('mpa_employees_list_pagination_args', 'pixetty_mpa_pagination_args');
add_filter('mpa_locations_list_pagination_args', 'pixetty_mpa_pagination_args');
add_filter('mpa_services_list_pagination_args', 'pixetty_mpa_pagination_args');

function pixetty_mpa_employee_before_item_end()
{
    ?>
    </div>
    <a href="<?php the_permalink(); ?>"
       class="button loop-employee-link"><?php esc_html_e('Make an Appointment', 'pixetty'); ?></a>
    <?php
}

add_action('mpa_employees_list_before_item_end', 'pixetty_mpa_employee_before_item_end', 10);


function pixetty_update_mpa_service_post_type_args($args, $post_type)
{

        if ( !in_array($post_type, array('mpa_service', 'mpa_employee')) ) {
            return $args;
        }

    $args['show_in_rest'] = true;
    return $args;
}

add_filter('register_post_type_args', 'pixetty_update_mpa_service_post_type_args', 10, 2);

function pixetty_appointment_templates() {
	if ( is_page_template('template-canvas-service.php') ) {
		remove_action('mpa_service_single_post_attributes', 'pixetty_before_mpa_service_single_attributes', 1);
		remove_action('mpa_service_single_post_attributes', 'pixetty_after_mpa_service_single_attributes', 20);
		remove_action('mpa_service_single_post_attributes', [\MotoPress\Appointment\Views\PostTypesView::getInstance(), 'serviceSinglePostAttributes']);
	}
}

add_action('template_redirect', 'pixetty_appointment_templates');

function pixetty_mpa_employees_list_item_title()
{
    ?>
    <div class="mpa-employee-content-wrap">
    <div class="mpa-employee-content">
<?php }

add_action('mpa_employees_list_item_title', 'pixetty_mpa_employees_list_item_title', 1);

function pixetty_mpa_employees_list_before_item_end()
{
    ?>
    </div>
<?php }

add_action('mpa_employees_list_before_item_end', 'pixetty_mpa_employees_list_before_item_end', 10);