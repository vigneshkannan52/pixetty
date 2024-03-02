<?php

if (!defined('ABSPATH')) {
    exit;
}

?>
<div class="mpa-booking-step mpa-booking-step-booking mpa-hide">
    <p class="mpa-message">
        <?php esc_html_e('Making a reservation...', 'pixetty'); ?>
        <span class="mpa-preloader"></span>
    </p>

    <?php
    $image_url = get_theme_mod('pixetty_appointment_checkout_image', false);
    if ($image_url) : ?>
        <div class="mpa-booking-image-wrap">
            <div class="mpa-booking-image">
                <img src="<?php echo esc_url($image_url); ?>" alt="">
            </div>
            <div class="mpa-booking-image-border"></div>
        </div>
    <?php endif; ?>

    <p class="mpa-actions mpa-hide">
        <?php echo mpa_tmpl_button(esc_html__('Back', 'pixetty'), ['class' => 'button button-secondary mpa-button-back']); ?>
        <?php echo mpa_tmpl_button(esc_html__('Add New Reservation', 'pixetty'), ['class' => 'button button-primary mpa-button-reset']); ?>
    </p>
</div>
