<?php
/**
 * Template Name: Canvas
 * Template Post Type: mpa_service
 *
 * The template for displaying all single services
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package pixetty
 */

get_header();
?>

	<main id="primary" class="site-main single-service-canvas">

		<?php
		while ( have_posts() ) :
			the_post();

			get_template_part( 'template-parts/content-mpa_service-canvas');

		endwhile; // End of the loop.
		?>

	</main><!-- #main -->

<?php
get_footer();
