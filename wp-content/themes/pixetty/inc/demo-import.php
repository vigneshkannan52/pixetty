<?php

/**
 *
 * Demo data
 *
 **/

function pixetty_ocdi_import_files()
{
    $import_notice = '<h4>' . __('Important note before importing sample data.', 'pixetty') . '</h4>';
    $import_notice .= __('Data import is generally not immediate and can take up to 10 minutes.', 'pixetty') . '<br/>';

    $import_notice = wp_kses(
        $import_notice,
        array(
            'a' => array(
                'href' => array(),
            ),
            'ol' => array(),
            'li' => array(),
            'h4' => array(),
            'br' => array(),
        )
    );

    $demos[] = array(
        'import_file_name' => 'Pixetty Demo Import',
        'local_import_file' => get_template_directory() . '/assets/demo-data/pixetty.xml',
        'local_import_widget_file' => get_template_directory() . '/assets/demo-data/pixetty-widgets.wie',
        'import_preview_image_url' => trailingslashit(get_template_directory_uri()) . '/assets/demo-data/pixetty.jpg',
        'import_notice' => $import_notice,
        'preview_url' => 'https://themes.getmotopress.com/pixetty',
    );

    return $demos;
}

add_filter('pt-ocdi/import_files', 'pixetty_ocdi_import_files');

function pixetty_after_import_setup()
{
    // Assign menus to their locations.
    $menu1 = get_term_by('slug', 'primary', 'nav_menu');
    $menu2 = get_term_by('slug', 'primary-dropdown', 'nav_menu');
    $menu3 = get_term_by('slug', 'footer-socials', 'nav_menu');

    set_theme_mod('nav_menu_locations', array(
            'menu-1' => $menu1->term_id,
            'menu-2' => $menu2->term_id,
            'menu-3' => $menu3->term_id,
        )
    );

    // Assign front page and posts page (blog page).
    $front_page_id = get_page_by_title('Home');
    $blog_page_id = get_page_by_title('Blog');

    update_option('show_on_front', 'page');
    update_option('page_on_front', $front_page_id->ID);
    update_option('page_for_posts', $blog_page_id->ID);

    update_option('getwid_section_content_width', 1703);

    $dropdown_menu_page = get_page_by_title('Header Dropdown');
    set_theme_mod('pixetty_dropdown_menu_page', $dropdown_menu_page->ID);
    set_theme_mod('pixetty_menu_position', 'absolute');
    set_theme_mod('pixetty_menu_overflow', true);
    set_theme_mod('pixetty_rsidebar_button_text', 'Book Now');
    set_theme_mod('pixetty_rsidebar_footer_button_text', 'Make an Appointment');
    set_theme_mod('pixetty_show_footer_scroll_button', true);
    set_theme_mod('pixetty_blog_layout', 'modern');

    //update taxonomies
    $update_taxonomies = array(
        'post_tag',
        'category',
    );

    foreach ($update_taxonomies as $taxonomy) {
        pixetty_ocdi_update_taxonomy($taxonomy);
    }

    //set site default logo
    $logo = pixetty_get_attachment_by_name('icon-logo');
    if ($logo) {
        set_theme_mod('custom_logo', $logo->ID);
    }

    $logo_dropdown = wp_get_attachment_url(pixetty_get_attachment_by_name('icon-logo-dropdown')->ID);
    if ($logo_dropdown) {
        set_theme_mod('pixetty_dropdown_logo', $logo_dropdown);
    }
}

add_action('pt-ocdi/after_import', 'pixetty_after_import_setup');


function pixetty_ocdi_update_taxonomy($taxonomy)
{
    $get_terms_args = array(
        'taxonomy' => $taxonomy,
        'fields' => 'ids',
        'hide_empty' => false,
    );

    $update_terms = get_terms($get_terms_args);
    if ($taxonomy && is_array($update_terms)) {
        wp_update_term_count_now($update_terms, $taxonomy);
    }
}

function pixetty_make_existed_widgets_inactive()
{
    $widgets = get_option('sidebars_widgets');

    $sidebars = array(
        'sidebar-right',
        'footer-1',
        'footer-2',
    );

    foreach ($sidebars as $sidebar) {
        if (is_active_sidebar($sidebar)) {
            $widgets['wp_inactive_widgets'] = array_merge($widgets['wp_inactive_widgets'], $widgets[$sidebar]);
            $widgets[$sidebar] = [];
        }
    }

    update_option('sidebars_widgets', $widgets);
}

add_action('pt-ocdi/widget_importer_before_widgets_import', 'pixetty_make_existed_widgets_inactive');
