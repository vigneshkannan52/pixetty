<?php
/**
 * The template for displaying mpa_service_category archive
 *
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package pixetty
 */

get_header();
?>

    <main id="primary" class="site-main">

        <?php if (have_posts()) : ?>

        <header class="entry-header hero-header">
            <div class="entry-header-info">
                <?php
                the_archive_title('<h1 class="entry-subtitle">', '</h1>');
                the_archive_description('<div class="archive-description">', '</div>');
                pixetty_scroll_to_content_button();
                ?>
            </div>

            <?php pixetty_thumbnail_image(); ?>

        </header><!-- .entry-header -->
        <div id="main-content" class="main-content-wrap">

            <?php
            /* Start the Loop */
            while (have_posts()) :
                the_post();

                /*
                 * Include the Post-Type-specific template for the content.
                 * If you want to override this in a child theme, then include a file
                 * called content-___.php (where ___ is the Post Type name) and that will be used instead.
                 */
                get_template_part('template-parts/content', get_post_type());

            endwhile;

            pixetty_posts_pagination();

            else :

                get_template_part('template-parts/content', 'none');

            endif;
            ?>
        </div>

    </main><!-- #main -->

<?php

get_footer();
