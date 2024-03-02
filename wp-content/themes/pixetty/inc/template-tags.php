<?php
/**
 * Custom template tags for this theme
 *
 * Eventually, some of the functionality here could be replaced by core features.
 *
 * @package pixetty
 */

if (!function_exists('pixetty_posted_on')) :
    /**
     * Prints HTML with meta information for the current post-date/time.
     */
    function pixetty_posted_on()
    {
        $time_string = '<time class="entry-date published updated" datetime="%1$s">%2$s</time>';
        if (get_the_time('U') !== get_the_modified_time('U')) {
            $time_string = '<time class="entry-date published" datetime="%1$s">%2$s</time><time class="updated" datetime="%3$s">%4$s</time>';
        }

        $time_string = sprintf(
            $time_string,
            esc_attr(get_the_date(DATE_W3C)),
            esc_html(get_the_date()),
            esc_attr(get_the_modified_date(DATE_W3C)),
            esc_html(get_the_modified_date())
        );

        $posted_on = sprintf(
        /* translators: %s: post date. */
            esc_html_x('%s', 'post date', 'pixetty'),
            '<a href="' . esc_url(get_permalink()) . '" rel="bookmark">' . $time_string . '</a>'
        );

        echo '<span class="posted-on">' . $posted_on . '</span>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped

    }
endif;

if (!function_exists('pixetty_posted_by')) :
    /**
     * Prints HTML with meta information for the current author.
     */
    function pixetty_posted_by()
    {
        $byline = sprintf(
        /* translators: %s: post author. */
            esc_html_x('by %s', 'post author', 'pixetty'),
            '<span class="author vcard"><a class="url fn n" href="' . esc_url(get_author_posts_url(get_the_author_meta('ID'))) . '">' . esc_html(get_the_author()) . '</a></span>'
        );

        echo '<span class="byline"> ' . $byline . '</span>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped

    }
endif;


if (!function_exists('pixetty_posted_in')) :
    function pixetty_posted_in()
    {
        $categories_list = get_the_category_list('');

        if ($categories_list) {
            echo '<span class="cat-links">' . $categories_list . '</span>';
        }
    }
endif;


if (!function_exists('pixetty_category_list')) :

    function pixetty_category_list()
    {
        // Hide category and tag text for pages.
        if ('post' === get_post_type()) {
            /* translators: used between list items, there is a space after the comma */
            $categories_list = get_the_category_list(esc_html__(', ', 'pixetty'));
            if ($categories_list) {
                /* translators: 1: list of categories. */
                printf('<span class="cat-links">' . esc_html__('Posted in %1$s', 'pixetty') . '</span>', $categories_list); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
            }
        }
    }
endif;

if (!function_exists('pixetty_entry_footer')) :
    /**
     * Prints HTML with meta information for the categories, tags and comments.
     */
    function pixetty_entry_footer()
    {
        // Hide category and tag text for pages.
        if ('post' === get_post_type()) {

            /* translators: used between list items, there is a space after the comma */
            $tags_list = get_the_tag_list('', esc_html_x(' ', 'list item separator', 'pixetty'));
            if ($tags_list) {
                /* translators: 1: list of tags. */
                printf('<span class="tags-links">' . esc_html__('%1$s', 'pixetty') . '</span>', $tags_list); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
            }
        }

        edit_post_link(
            sprintf(
                wp_kses(
                /* translators: %s: Name of current post. Only visible to screen readers */
                    __('Edit <span class="screen-reader-text">%s</span>', 'pixetty'),
                    array(
                        'span' => array(
                            'class' => array(),
                        ),
                    )
                ),
                wp_kses_post(get_the_title())
            ),
            '<span class="edit-link">',
            '</span>'
        );
    }
endif;

if (!function_exists('pixetty_sticky_post')) :
	function pixetty_sticky_post() {
		if ( is_sticky() ) {
			?>
			<span class="is-sticky"><?php esc_html_e('Featured', 'pixetty');?></span>
			<?php
		}
	}
endif;

if (!function_exists('pixetty_post_thumbnail')) :
    /**
     * Displays an optional post thumbnail.
     *
     * Wraps the post thumbnail in an anchor element on index views, or a div
     * element when on single views.
     */
    function pixetty_post_thumbnail($size = 'post-thumbnail')
    {
        if (post_password_required() || is_attachment() || !has_post_thumbnail()) {
            return;
        }

        if (is_singular()) :
            ?>

            <div class="post-thumbnail">
                <?php the_post_thumbnail($size); ?>
            </div><!-- .post-thumbnail -->

        <?php else : ?>

            <a class="post-thumbnail" href="<?php the_permalink(); ?>" aria-hidden="true" tabindex="-1">
                <?php
                the_post_thumbnail(
                    $size,
                    array(
                        'alt' => the_title_attribute(
                            array(
                                'echo' => false,
                            )
                        ),
                    )
                );
                ?>
            </a>

        <?php
        endif; // End is_singular().
    }
endif;

if (!function_exists('wp_body_open')) :
    /**
     * Shim for sites older than 5.2.
     *
     * @link https://core.trac.wordpress.org/ticket/12563
     */
    function wp_body_open()
    {
        do_action('wp_body_open');
    }
endif;


function pixetty_rsidebar_toggle()
{
    $header_button_title = get_theme_mod('pixetty_rsidebar_button_text');

    if (is_active_sidebar('sidebar-right') && $header_button_title) :
        ?>
        <div class="right-sidebar-toggle-wrapper">
            <button class="right-sidebar-toggle">
                <?php echo esc_html($header_button_title); ?>
            </button>
        </div>

    <?php endif;
}

function pixetty_rsidebar_toggle_footer()
{
    $footer_button_title = get_theme_mod('pixetty_rsidebar_footer_button_text');

    if (is_active_sidebar('sidebar-right') && $footer_button_title) :
        ?>
        <button class="button btn-border right-sidebar-toggle">
            <?php echo esc_html($footer_button_title); ?>
        </button>
    <?php endif;
}

function pixetty_rsidebar()
{
    $footer_button_title = get_theme_mod('pixetty_rsidebar_footer_button_text');
    $header_button_title = get_theme_mod('pixetty_rsidebar_button_text');

    if (!is_active_sidebar('sidebar-right') || (!$header_button_title && !$footer_button_title)) {
        return;
    }
    ?>

    <div id="right-sidebar" class="right-sidebar">
        <button id="rsidebar-close" class="rsidebar-close"><i class="icon pixetty-icon-close"></i></button>
        <div class="widget-area">
            <?php dynamic_sidebar('sidebar-right'); ?>
        </div>
    </div>
    <?php
}

function pixetty_posts_navigation()
{

    if (is_singular('mpa_service')) {
        return;
    }

    if (is_singular('mpa_employee')) {
        return;
    }

    if (is_singular('cptp-portfolio')) {
        return;
    }

    $icon_prev = '<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 24L14.5299 21.4701L6.84896 13.7892L24 13.7892L24 10.2108L6.84896 10.2108L14.5299 2.52989L12 -5.24537e-07L-5.24537e-07 12L12 24Z"/>
                </svg>';

    $icon_next = '<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 -5.24537e-07L9.47011 2.5299L17.151 10.2108L-6.02744e-07 10.2108L-4.46329e-07 13.7892L17.151 13.7892L9.47011 21.4701L12 24L24 12L12 -5.24537e-07Z"/>
                </svg>';

    the_post_navigation(
        array(
            'prev_text' => '<span class="nav-icon">' . $icon_prev . '</span> <span class="nav-title">%title</span>',
            'next_text' => '<span class="nav-title">%title</span> <span class="nav-icon">' . $icon_next . '</span>',
        )
    );
}
