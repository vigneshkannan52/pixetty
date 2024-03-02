<?php
/**
 * The sidebar containing the main widget area
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package pixetty
 */

$page_id = get_theme_mod('pixetty_dropdown_menu_page', '');

if (!$page_id) {
	return;
}

$query = new WP_Query(array(
	'page_id' => $page_id,
));

if (!$query->have_posts()) {
	return;
}

while ($query->have_posts()) : $query->the_post();
?>
<div id="header-sidebar" class="header-sidebar">
    <div class="header-sidebar-inner">
        <?php the_content(); ?>
    </div>
</div>
<?php
endwhile;

wp_reset_postdata();
