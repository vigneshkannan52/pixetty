<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package pixetty
 */

$scroll_button = get_theme_mod('pixetty_show_footer_scroll_button', '');
?>

<footer id="colophon" class="site-footer">
    <div class="footer-top">
        <?php if (is_active_sidebar('footer-1')) { ?>
            <div class="footer-left">
                <?php dynamic_sidebar('footer-1'); ?>
            </div>
        <?php } ?>

        <div class="footer-right">
            <?php if (is_active_sidebar('footer-2')) { ?>
                <div class="footer-contacts">
                    <?php dynamic_sidebar('footer-2'); ?>
                </div>
            <?php } ?>

            <?php
            pixetty_rsidebar_toggle_footer();
            ?>
        </div>
    </div>
    <div class="footer-bottom">
        <div class="footer-left">
            <?php
            if (get_theme_mod('pixetty_show_footer_text', true)):
                ?>
                <div class="site-info">
                    <?php
                    $dateObj = new DateTime;
                    $year = $dateObj->format("Y");
                    printf(
                        get_theme_mod('pixetty_footer_text',
                            sprintf(
                                esc_html_x('All Rights Reserved - %2$s &copy; %1$s', 'Default footer text, %1$s - blog name, %2$s - current year', 'pixetty'),
                                get_bloginfo('name'),
                                $year
                            )
                        ),
                        get_bloginfo('name'),
                        $year
                    );
                    ?>
                </div><!-- .site-info -->
            <?php endif; ?>
        </div>
        <div class="footer-right">
            <?php if (has_nav_menu('menu-3')): ?>
                <div class="social-nav">
                    <?php
                    wp_nav_menu(array(
                        'theme_location' => 'menu-3',
                        'menu_class' => 'footer-socials',
                        'depth' => 1,
                        'link_before' => '<span class="menu-text">',
                        'link_after' => '</span>',
                    )); ?>
                </div>
            <?php endif; ?>
        </div>
    </div>
    <?php
    if ($scroll_button) {
        pixetty_scroll_to_top_button();
    }
    ?>

</footer><!-- #colophon -->
</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>
