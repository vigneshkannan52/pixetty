<?php
/**
 * Functions which enhance the theme by hooking into WordPress
 *
 * @package pixetty
 */

/**
 * Adds custom classes to the array of body classes.
 *
 * @param array $classes Classes for the body element.
 * @return array
 */
function pixetty_body_classes($classes)
{
    // Adds a class of hfeed to non-singular pages.
    if (!is_singular()) {
        $classes[] = 'hfeed';
    }

    // Adds a class of no-sidebar when there is no sidebar present.
    if (!is_active_sidebar('sidebar-1')) {
        $classes[] = 'no-sidebar';
    }

    return $classes;
}

add_filter('body_class', 'pixetty_body_classes');

/**
 * Add a pingback url auto-discovery header for single posts, pages, or attachments.
 */
function pixetty_pingback_header()
{
    if (is_singular() && pings_open()) {
        printf('<link rel="pingback" href="%s">', esc_url(get_bloginfo('pingback_url')));
    }
}

add_action('wp_head', 'pixetty_pingback_header');

function pixetty_add_ellipses_to_nav($nav_menu, $args)
{

    if (('menu-1' === $args->theme_location || 'menu-2' === $args->theme_location) && get_theme_mod('pixetty_menu_overflow', false)) :

        $nav_menu .= '
			<div class="main-menu-more">
				<ul class="main-menu">
					<li class="menu-item menu-item-has-children">
						<button class="submenu-expand primary-menu-more-toggle is-empty" tabindex="-1"
							aria-label="' . esc_attr__('More', 'pixetty') . '" aria-haspopup="true" aria-expanded="false">
							<span class="screen-reader-text">' . esc_html__('More', 'pixetty') . '</span><i class="fas fa-ellipsis-h"></i>
						</button>
						<ul class="sub-menu hidden-links"></ul>
					</li>
				</ul>
			</div>';

    endif;

    return $nav_menu;
}

add_filter('wp_nav_menu', 'pixetty_add_ellipses_to_nav', 10, 2);


function pixetty_posts_pagination()
{
    $icon_prev = '<svg width="20" height="21" viewBox="0 0 20 21" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 20.25L12.1082 18.1418L5.70747 11.741L20 11.741L20 8.75902L5.70747 8.75902L12.1082 2.35824L10 0.25L-4.37114e-07 10.25L10 20.25Z"/>
                </svg>';

    $icon_next = '<svg width="20" height="21" viewBox="0 0 20 21" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 0.25L7.89175 2.35825L14.2925 8.75902L-5.02287e-07 8.75902L-3.71941e-07 11.741L14.2925 11.741L7.89176 18.1418L10 20.25L20 10.25L10 0.25Z"/>
                </svg>';

    the_posts_pagination(array(
        'mid_size' => 1,
        'prev_text' => $icon_prev,
        'next_text' => $icon_next
    ));
}

add_filter('comment_form_default_fields', 'pixetty_comment_form_default_fields');

function pixetty_comment_form_default_fields($fields)
{
    unset($fields['url']);
    return $fields;
}

function pixetty_filter_header_classes($classes)
{
    $position = get_theme_mod('pixetty_menu_position', '');
    $menu_overflow = get_theme_mod('pixetty_menu_overflow', false);


    if (is_front_page() && !is_home() && $position) {
        $classes[] = 'header-' . $position;
    }

    if ($menu_overflow) {
        $classes[] = 'hide-overflow';
    }

    return $classes;
}

add_filter('pixetty_header_classes', 'pixetty_filter_header_classes', 10, 1);

function pixetty_render_logo()
{

    if ( get_theme_mod('pixetty_dropdown_logo', '') != '') {

        ?>
        <div class="site-logos-wrapper">
            <div class="default"><?php the_custom_logo(); ?></div>

            <div class="absolute">
                <a href="<?php echo esc_url(home_url('/')) ?>" class="custom-logo-link">
                    <img src="<?php echo esc_url( get_theme_mod('pixetty_dropdown_logo', '')); ?>" alt="<?php bloginfo('name'); ?>">
                </a>
            </div>
        </div>
        <?php
        return;
    }

    the_custom_logo();
}

function pixetty_scroll_to_content_button()
{ ?>
    <div class="scroll-button-wrap">
        <a href="#main-content">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12L21.4701 9.47011L13.7892 17.151L13.7892 0L10.2108 0L10.2108 17.151L2.52989 9.47011L0 12L12 24L24 12Z"
                      fill="#A9A9A9"/>
            </svg>
        </a>
    </div>
<?php
}

function pixetty_scroll_to_top_button()
{ ?>
    <button class="scroll-to-top">
        <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-1.5299e-06 17.5L3.68943 21.1894L14.8908 9.98807L14.8908 35L20.1092 35L20.1092 9.98807L31.3106 21.1894L35 17.5L17.5 1.5299e-06L-1.5299e-06 17.5Z"
                  fill="#A9A9A9"/>
        </svg>
    </button>
<?php
}

function pixetty_thumbnail_image()
{
    $page_for_posts = get_option('page_for_posts');
    $image_url = false;

	if ( is_singular() && has_post_thumbnail() ) {
		$image_url = get_the_post_thumbnail_url(get_the_ID(), 'pixetty-large');
	}

    if ( is_home() || is_archive() ) {
        $image_url = get_header_image();
    }

	if ( is_home() && $blog_image_url = get_the_post_thumbnail_url($page_for_posts) ) {
		$image_url = $blog_image_url;
	}

    if ($image_url) { ?>
        <div class="entry-header-image">
            <div class="post-thumbnail">
                <img src="<?php echo esc_url($image_url); ?>" alt="<?php echo esc_attr(single_post_title('', false)); ?>">
            </div>
        </div>
    <?php }
}

function pixetty_taxonomy_list()
{
    $terms = get_terms(
        array(
            'taxonomy' => 'cptp-portfolio-category',
            'hide_empty' => false,
        )
    );

    if (!empty($terms) && is_array($terms)) {

        ?>
        <div class="taxonomy-list">
            <?php
            foreach ($terms as $term) { ?>
            <a href="<?php echo esc_url(get_term_link($term)) ?>">
                <?php echo esc_html($term->name); ?>
                </a><?php
            }
            ?>
        </div>
        <?php
    }
}

add_action('getwid/icons-manager/init', 'pixetty_getwid_add_custom_icons');

function pixetty_getwid_add_custom_icons($manager)
{
    $custom_icons = [
        'icons' => pixetty_custom_icons_list(),
        'handle' => 'pixetty-icons',
        'src' => get_template_directory_uri() . '/fonts/pixetty-icons/pixetty.css',
        'deps' => null,
        'ver' => PIXETTY_VERSION
    ];

    $manager->registerFont('pixetty-icons', $custom_icons);
}

function pixetty_custom_icons_list()
{
    return array(
        'Pixetty Icons' => array(
            'pixetty-icon-mail',
            'pixetty-icon-phone',
            'pixetty-icon-arrow-down',
        )
    );
}

function pixetty_get_attachment_by_name($name)
{
    $args = array(
        'post_type' => 'attachment',
        'name' => $name,
        'posts_per_page' => 1,
        'post_status' => 'inherit',
    );

    $image = get_posts($args);

    return $image ? array_pop($image) : null;
}

function pixetty_image_sizes($size_names)
{
    $new_sizes = array(
        'pixetty-vertical-medium' => esc_html__('Pixetty vertical medium', 'pixetty'),
    );
    return array_merge($size_names, $new_sizes);
}

add_filter('image_size_names_choose', 'pixetty_image_sizes');

function pixetty_header_dropdown_toggle()
{
	$has_content = get_theme_mod('pixetty_dropdown_menu_page');
	$has_menu1 = has_nav_menu('menu-1');
	$has_menu2 = has_nav_menu('menu-2');
	$classes = ['header-toggle'];

	if (!$has_content && !$has_menu1 && !$has_menu2) {
		return;
	}

	if ($has_menu1 && !$has_menu2) {
		$classes[] = 'hide-desktop';
	}

	?>
	<div class="<?php echo esc_attr(implode(' ', $classes)); ?>">
		<button id="header-toggle-button" class="header-toggle-button"><span
					class="screen-reader-text"><?php esc_html_e('menu', 'pixetty'); ?></span></button>
	</div>
	<?php
}

function pixetty_tag_cloud_font_sizes( array $args ) {
	$args['smallest'] = '16';
	$args['largest'] = '16';
	$args['unit'] = 'px';

	return $args;
}

add_filter( 'widget_tag_cloud_args', 'pixetty_tag_cloud_font_sizes');
