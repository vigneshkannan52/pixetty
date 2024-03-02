<?php
/**
 * The main template file
 *
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * E.g., it puts together the home page when no home.php file exists.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Pixetty
 */

get_header();

$blog_style = get_theme_mod('pixetty_blog_layout', '');
$page_for_posts = get_option('page_for_posts');
?>

    <main id="primary" class="site-main">

        <?php
        if (have_posts()) :

        if (is_home() && !is_front_page()) :
            ?>

            <header class="entry-header hero-header">
                <div class="entry-header-info">
                    <h1 class="page-title title"><?php single_post_title(); ?></h1>
                    <p class="entry-subtitle"><?php echo get_the_excerpt($page_for_posts); ?></p>

                    <?php pixetty_scroll_to_content_button(); ?>
                </div>
                <?php pixetty_thumbnail_image(); ?>
            </header><!-- .entry-header -->

        <?php endif; ?>
        <div id="main-content" class="main-content-wrap">
            <?php

            if ($blog_style === 'modern') { ?>
            <div class="posts-loop-wrapper">
                <?php }

                /* Start the Loop */
                while (have_posts()) :
                    the_post();

                    /*
                     * Include the Post-Type-specific template for the content.
                     * If you want to override this in a child theme, then include a file
                     * called content-___.php (where ___ is the Post Type name) and that will be used instead.
                     */
                    get_template_part('template-parts/content-loop', $blog_style . '-' . get_post_type());

                endwhile;

                pixetty_posts_pagination();

                else :

                    get_template_part('template-parts/content', 'none');

                endif;
                ?>

                <?php if ($blog_style === 'modern') { ?>
            </div>
        <?php } ?>
        </div>

    </main><!-- #main -->

<?php

get_footer();
