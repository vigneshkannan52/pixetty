<?php
/**
 * The template for displaying search results pages
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#search-result
 *
 * @package pixetty
 */

get_header();
?>

    <main id="primary" class="site-main">

        <?php if (have_posts()) : ?>


        <header class="entry-header hero-header">
            <div class="entry-header-info">
                <h1 class="entry-subtitle">
                    <?php
                    /* translators: %s: search query. */
                    printf(esc_html__('Search Results for: %s', 'pixetty'), '<span>' . get_search_query() . '</span>');
                    ?>
                </h1>

                <?php pixetty_scroll_to_content_button(); ?>
            </div>

			<?php pixetty_thumbnail_image(); ?>
        </header><!-- .entry-header -->

        <div id="main-content" class="main-content-wrap">
            <?php
            /* Start the Loop */
            while (have_posts()) :
                the_post();

                /**
                 * Run the loop for the search to output the results.
                 * If you want to overload this in a child theme then include a file
                 * called content-search.php and that will be used instead.
                 */
                get_template_part('template-parts/content', 'search');

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
