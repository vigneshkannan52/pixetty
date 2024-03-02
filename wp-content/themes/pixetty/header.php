<?php
/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package pixetty
 */

?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="profile" href="https://gmpg.org/xfn/11">

    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>

<?php wp_body_open(); ?>
<div id="page" class="site">
    <a class="skip-link screen-reader-text" href="#primary"><?php esc_html_e('Skip to content', 'pixetty'); ?></a>

    <header id="masthead"
            class="<?php echo esc_attr(implode(' ', apply_filters('pixetty_header_classes', array('site-header')))); ?>">
        <div class="site-branding">
            <?php pixetty_render_logo(); ?>

            <div class="site-title-wrapper">
                <?php if (is_front_page() && is_home()) : ?>
                    <h1 class="site-title"><a href="<?php echo esc_url(home_url('/')); ?>"
                                              rel="home"><?php bloginfo('name'); ?></a></h1>
                <?php
                else :
                    ?>
                    <p class="site-title"><a href="<?php echo esc_url(home_url('/')); ?>"
                                             rel="home"><?php bloginfo('name'); ?></a></p>
                <?php
                endif;
                $pixetty_description = get_bloginfo('description', 'display');
                if ($pixetty_description || is_customize_preview()) :
                    ?>
                    <p class="site-description"><?php echo wp_kses($pixetty_description, 'default'); ?></p>
                <?php endif; ?>
            </div>
        </div><!-- .site-branding -->

        <div class="header-menus">

            <?php if (has_nav_menu('menu-1')) : ?>

                <nav id="site-navigation" class="main-navigation">
                    <div class="primary-menu-wrapper">
                        <?php
                        wp_nav_menu(
                            array(
                                'theme_location' => 'menu-1',
                                'menu_id' => 'primary-menu',
                                'container_class' => 'primary-menu-container',
                            )
                        ); ?>
                    </div>
                </nav><!-- #site-navigation -->

            <?php endif; ?>

            <?php if (has_nav_menu('menu-2')) : ?>

                <nav id="main-navigation-dropdown" class="main-navigation-dropdown">
                    <div class="primary-menu-wrapper">
                        <?php
                        wp_nav_menu(
                            array(
                                'theme_location' => 'menu-2',
                                'menu_id' => 'primary-menu-dropdown',
                                'container_class' => 'primary-menu-container',
                            )
                        ); ?>
                    </div>
                </nav><!-- #site-navigation -->

            <?php endif; ?>

            <?php get_sidebar(); ?>
        </div>

		<?php do_action('pixetty_after_main_navigation'); ?>
        <?php pixetty_rsidebar_toggle(); ?>

		<?php pixetty_header_dropdown_toggle(); ?>

    </header><!-- #masthead -->

    <?php pixetty_rsidebar(); ?>
