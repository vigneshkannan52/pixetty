<?php
/**
 * Template part for displaying posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package pixetty
 */

?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
    <header class="entry-header hero-header">
        <div class="entry-header-info">
            <div class="entry-meta">
                <?php if (is_singular('mpa_service')) {
                    echo esc_html__('Services', 'pixetty');
                } elseif (is_singular('mpa_employees')) {
                    echo esc_html__('My team', 'pixetty');
                } else {
                    pixetty_posted_on();
                    pixetty_posted_in();
                } ?>
            </div>

            <?php the_title('<h1 class="entry-title">', '</h1>'); ?>

            <?php
            pixetty_scroll_to_content_button();
            ?>
        </div>

        <?php pixetty_thumbnail_image(); ?>

    </header><!-- .entry-header -->

    <div id="main-content" class="post-content main-content-wrap">

        <div class="entry-content">
            <?php
            the_content(
                sprintf(
                    wp_kses(
                    /* translators: %s: Name of current post. Only visible to screen readers */
                        __('Continue reading<span class="screen-reader-text"> "%s"</span>', 'pixetty'),
                        array(
                            'span' => array(
                                'class' => array(),
                            ),
                        )
                    ),
                    wp_kses_post(get_the_title())
                )
            );

            wp_link_pages(
                array(
                    'before' => '<div class="page-links">' . esc_html__('Pages:', 'pixetty'),
                    'after' => '</div>',
                )
            );
            ?>
        </div><!-- .entry-content -->

        <footer class="entry-footer">
            <?php pixetty_entry_footer(); ?>
        </footer><!-- .entry-footer -->
    </div>

</article><!-- #post-<?php the_ID(); ?> -->

