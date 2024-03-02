<?php
/**
 *
 * The template for displaying all single services
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package pixetty
 */

?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

    <div id="main-content" class="post-content">

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
    </div>

</article><!-- #post-<?php the_ID(); ?> -->

