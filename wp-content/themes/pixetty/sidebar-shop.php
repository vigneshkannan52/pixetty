<?php
/**
 * The sidebar containing the shop widget area
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package Pixetty
 */

if (!is_active_sidebar('woocommerce-sidebar')) {
    return;
}
?>

<div  class="widget-area woocommerce-sidebar">
    <?php dynamic_sidebar('woocommerce-sidebar'); ?>
</div>
