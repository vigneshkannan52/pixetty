<?php
/**
 * pixetty Theme Customizer
 *
 * @package pixetty
 */

/**
 * Add postMessage support for site title and description for the Theme Customizer.
 *
 * @param WP_Customize_Manager $wp_customize Theme Customizer object.
 */
function pixetty_customize_register($wp_customize)
{
    $wp_customize->get_setting('blogname')->transport = 'postMessage';
    $wp_customize->get_setting('blogdescription')->transport = 'postMessage';
    $wp_customize->get_setting('header_textcolor')->transport = 'postMessage';

    if (isset($wp_customize->selective_refresh)) {
        $wp_customize->selective_refresh->add_partial(
            'blogname',
            array(
                'selector' => '.site-title a',
                'render_callback' => 'pixetty_customize_partial_blogname',
            )
        );
        $wp_customize->selective_refresh->add_partial(
            'blogdescription',
            array(
                'selector' => '.site-description',
                'render_callback' => 'pixetty_customize_partial_blogdescription',
            )
        );
    }

    $wp_customize->add_panel(
        'pixetty_theme_settings',
        array(
            'title' => esc_html__('Theme Settings', 'pixetty')
        )
    );

    $wp_customize->add_section('pixetty_front_page', array(
        'title' => esc_html__('Front Page', 'pixetty'),
        'panel' => 'pixetty_theme_settings'
    ));

    $wp_customize->add_setting('pixetty_menu_position', array(
        'default' => '',
        'sanitize_callback' => 'pixetty_sanitize_select'
    ));

    $wp_customize->add_control('pixetty_menu_position', array(
        'type' => 'select',
        'section' => 'pixetty_front_page',
        'label' => esc_html__('Menu Position', 'pixetty'),
        'choices' => array(
            '' => esc_html__('Default', 'pixetty'),
            'absolute' => esc_html__('Absolute', 'pixetty'),
        ),
    ));

    $wp_customize->add_section(
        'pixetty_blog',
        array(
            'title' => esc_html__('Blog', 'pixetty'),
            'panel' => 'pixetty_theme_settings'
        )
    );

    $wp_customize->add_setting('pixetty_blog_layout', array(
        'default' => '',
        'sanitize_callback' => 'pixetty_sanitize_select'
    ));

    $wp_customize->add_control('pixetty_blog_layout', array(
        'type' => 'select',
        'section' => 'pixetty_blog',
        'label' => esc_html__('Blog layout', 'pixetty'),
        'choices' => array(
            '' => esc_html__('Default', 'pixetty'),
            'modern' => esc_html__('Modern', 'pixetty'),
        ),
    ));

    $wp_customize->add_section(
        'pixetty_header',
        array(
            'title' => esc_html__('Header', 'pixetty'),
            'panel' => 'pixetty_theme_settings'
        )
    );

    $wp_customize->add_setting('pixetty_dropdown_menu_page',
        array(
            'default' => '',
            'transport' => 'refresh',
            'sanitize_callback' => 'absint'
        )
    );

    $wp_customize->add_control('pixetty_dropdown_menu_page',
        array(
            'label' => __('Fullscreen dropdown menu', 'pixetty'),
            'description' => esc_html__('Please select the page with the menu', 'pixetty'),
            'section' => 'pixetty_header',
            'type' => 'dropdown-pages',
        )
    );

    $wp_customize->add_setting('pixetty_menu_overflow', array(
        'default' => false,
        'transport' => 'refresh',
        'type' => 'theme_mod',
        'sanitize_callback' => 'pixetty_sanitize_checkbox'
    ));

    $wp_customize->add_control('pixetty_menu_overflow', array(
            'label' => esc_html__('Show main menu always in one line?', 'pixetty'),
            'description' => esc_html__('Menu items that do not fit will be moved to dropdown.', 'pixetty'),
            'section' => 'pixetty_header',
            'type' => 'checkbox',
            'settings' => 'pixetty_menu_overflow'
        )
    );


    $wp_customize->add_setting('pixetty_dropdown_logo', array(
        'sanitize_callback' => 'esc_url_raw'
    ));

    $wp_customize->add_control(new WP_Customize_Image_Control( $wp_customize, 'pixetty_dropdown_logo', array(
            'label' => esc_html__('Logo used for dropdown menu', 'pixetty'),
            'section' => 'pixetty_header',
            'settings' => 'pixetty_dropdown_logo',
        )
    ));

	if ( class_exists( 'WooCommerce' ) ) {
		$wp_customize->add_setting(
			'pixetty_enable_header_cart',
			array(
				'default' => true,
				'sanitize_callback' => 'pixetty_sanitize_checkbox'
			)
		);

		$wp_customize->add_control(
			'pixetty_enable_header_cart',
			array(
				'label' => __('Show header cart?', 'pixetty'),
				'section' => 'pixetty_header',
				'type' => 'checkbox'
			)
		);
	}

    $wp_customize->add_section(
        'pixetty_footer',
        array(
            'title' => esc_html__('Footer', 'pixetty'),
            'panel' => 'pixetty_theme_settings'
        )
    );

    $wp_customize->add_setting('pixetty_show_footer_scroll_button', array(
        'default' => false,
        'type' => 'theme_mod',
        'sanitize_callback' => 'pixetty_sanitize_checkbox'
    ));

    $wp_customize->add_control('pixetty_show_footer_scroll_button', array(
            'label' => esc_html__('Show Footer Scroll To Top Button?', 'pixetty'),
            'section' => 'pixetty_footer',
            'type' => 'checkbox',
            'settings' => 'pixetty_show_footer_scroll_button'
        )
    );

    $wp_customize->add_setting('pixetty_show_footer_text', array(
        'default' => true,
        'type' => 'theme_mod',
        'sanitize_callback' => 'pixetty_sanitize_checkbox'
    ));

    $wp_customize->add_control('pixetty_show_footer_text', array(
            'label' => esc_html__('Show Footer Text?', 'pixetty'),
            'section' => 'pixetty_footer',
            'type' => 'checkbox',
            'settings' => 'pixetty_show_footer_text'
        )
    );

    $default_footer_text = esc_html_x('%1$s &copy; %2$s All Rights Reserved', 'Default footer text, %1$s - blog name, %2$s - current year', 'pixetty');
    $wp_customize->add_setting('pixetty_footer_text', array(
        'default' => $default_footer_text,
        'type' => 'theme_mod',
        'sanitize_callback' => 'wp_kses_post'
    ));

    $wp_customize->add_control('pixetty_footer_text', array(
            'label' => esc_html__('Footer Text', 'pixetty'),
            'description' => esc_html__('Use %1$s to insert the blog name, %2$s to insert the current year.', 'pixetty'),
            'section' => 'pixetty_footer',
            'type' => 'textarea',
            'settings' => 'pixetty_footer_text'
        )
    );

    $wp_customize->add_section('pixetty_appointment_options', array(
        'title' => esc_html__('Appointment', 'pixetty'),
        'panel' => 'pixetty_theme_settings'
    ));

    $wp_customize->add_setting('pixetty_appointment_checkout_image', array(
        'default' => '',
        'sanitize_callback' => 'esc_url_raw'
    ));

    $wp_customize->add_control(new WP_Customize_Image_Control($wp_customize, 'pixetty_appointment_checkout_image', array(
            'label' => esc_html__('Image used at booking checkout', 'pixetty'),
            'section' => 'pixetty_appointment_options',
            'settings' => 'pixetty_appointment_checkout_image',
        )
    ));

    $wp_customize->add_setting('pixetty_rsidebar_button_text', array(
        'default' => '',
        'type' => 'theme_mod',
        'sanitize_callback' => 'sanitize_text_field'
    ));

    $wp_customize->add_control('pixetty_rsidebar_button_text', array(
        'label' => esc_html__('Sidebar toggle button text', 'pixetty'),
        'description' => esc_html__('Leave blank if you want hide button.', 'pixetty'),
        'section' => 'pixetty_appointment_options',
        'type' => 'text',
        'settings' => 'pixetty_rsidebar_button_text'
    ));

    $wp_customize->add_setting('pixetty_rsidebar_footer_button_text', array(
        'default' => '',
        'type' => 'theme_mod',
        'sanitize_callback' => 'sanitize_text_field'
    ));

    $wp_customize->add_control('pixetty_rsidebar_footer_button_text', array(
        'label' => esc_html__('Footer Sidebar toggle button text', 'pixetty'),
        'description' => esc_html__('Leave blank if you want hide button in footer.', 'pixetty'),
        'section' => 'pixetty_appointment_options',
        'type' => 'text',
        'settings' => 'pixetty_rsidebar_footer_button_text'
    ));
}

add_action('customize_register', 'pixetty_customize_register');

/**
 * Render the site title for the selective refresh partial.
 *
 * @return void
 */
function pixetty_customize_partial_blogname()
{
    bloginfo('name');
}

/**
 * Render the site tagline for the selective refresh partial.
 *
 * @return void
 */
function pixetty_customize_partial_blogdescription()
{
    bloginfo('description');
}

/**
 * Binds JS handlers to make Theme Customizer preview reload changes asynchronously.
 */
function pixetty_customize_preview_js()
{
    wp_enqueue_script('pixetty-customizer', get_template_directory_uri() . '/js/customizer.js', array('customize-preview'), PIXETTY_VERSION, true);
}

add_action('customize_preview_init', 'pixetty_customize_preview_js');

function pixetty_sanitize_checkbox($input)
{
    return filter_var($input, FILTER_VALIDATE_BOOLEAN);
}

function pixetty_sanitize_select($input, $setting)
{
    //input must be a slug: lowercase alphanumeric characters, dashes and underscores are allowed only
    $input = sanitize_key($input);

    //get the list of possible select options
    $choices = $setting->manager->get_control($setting->id)->choices;

    //return input if valid or return default option
    return (array_key_exists($input, $choices) ? $input : $setting->default);
}
