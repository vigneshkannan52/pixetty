<?php
/**
 * Template part for displaying page content in page.php
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package pixetty
 */

?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
    <header class="entry-header hero-header">
        <div class="entry-header-info">
            <?php the_title('<h1 class="entry-title">', '</h1>'); ?>

            <span class="entry-subtitle">
                <?php if (has_excerpt()) {
                    echo get_the_excerpt();
                }
                ?>
            </span>

            <?php pixetty_scroll_to_content_button(); ?>
        </div>

        <?php pixetty_thumbnail_image(); ?>

    </header><!-- .entry-header -->

    <div id="main-content" class="entry-content main-content-wrap">
        <?php
        the_content();

        wp_link_pages(
            array(
                'before' => '<div class="page-links">' . esc_html__('Pages:', 'pixetty'),
                'after' => '</div>',
            )
        );
        ?>
    </div><!-- .entry-content -->

    <?php if (get_edit_post_link()) : ?>
        <footer class="entry-footer">
            <?php
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
            ?>
        </footer><!-- .entry-footer -->
    <?php endif; ?>
</article><!-- #post-<?php the_ID(); ?> -->
