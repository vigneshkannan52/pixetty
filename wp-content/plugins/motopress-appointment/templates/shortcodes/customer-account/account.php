<?php
/**
 * @var string $customerName
 * @var string $customerEmail
 * @var string $customerPhone
 * @var string $totalBookings
 * @var string $bookingsURL
 *
 * @since 1.18.0
 */

?>
<div class="mpa-account-details">
    <div class="mpa-customer-details mpa-customer-name">
        <span class="label"><?php esc_html_e( 'Name', 'motopress-appointment' ); ?>:</span>
        <span class="value"><?php echo esc_html( $customerName ); ?></span>
    </div>
    <div class="mpa-customer-details mpa-customer-email">
        <span class="label"><?php esc_html_e( 'Email', 'motopress-appointment' ); ?>:</span>
        <span class="value"><a href="mailto:<?php echo sanitize_email( $customerEmail ); ?>"><?php echo sanitize_email( $customerEmail ); ?></a></span>
    </div>
    <div class="mpa-customer-details mpa-customer-phone">
        <span class="label"><?php esc_html_e( 'Phone', 'motopress-appointment' ); ?>:</span>
        <span class="value"><a href="tel:<?php echo esc_attr( $customerPhone ); ?>"><?php echo esc_html( $customerPhone ); ?></a></span>
    </div>
    <div class="mpa-customer-details mpa-customer-total-bookings">
        <span class="label"><?php esc_html_e( 'Total Bookings', 'motopress-appointment' ); ?>:</span>
        <span class="value"><a href="<?php echo esc_url( $bookingsURL ); ?>"><?php echo esc_html( $totalBookings ); ?></a></span>
    </div>
</div>
