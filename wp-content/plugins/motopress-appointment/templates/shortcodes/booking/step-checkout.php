<?php

/**
 * @param string $template_name Optional. Full shortcode name. 'appointment_form' by default.
 * @param string $html_id       Optional. Unique ID of the shortcode instance.
 *
 * @since 1.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Initialize args
extract(
	array(
		'template_name' => 'appointment_form',
		'html_id'       => '',
	),
	EXTR_SKIP
);

if ( empty( $html_id ) ) {
	$html_id = uniqid();
}

/**
 * @param string $placeholder
 *
 * @since 1.0
 */
$placeholderName = apply_filters( "{$template_name}_shortcode_name_placeholder", esc_html__( 'Name', 'motopress-appointment' ) );

/**
 * @param string $placeholder
 *
 * @since 1.0
 */
$placeholderEmail = apply_filters( "{$template_name}_shortcode_email_placeholder", esc_html__( 'Email', 'motopress-appointment' ) );

/**
 * @param string $placeholder
 *
 * @since 1.0
 */
$placeholderPhone = apply_filters( "{$template_name}_shortcode_phone_placeholder", '' );

$isLoggedInAndHasAccount = false;
if ( is_user_logged_in() ) {
	$user = wp_get_current_user();
	if ( $user &&
	     mpapp()->repositories()->customer()->findByUserId( $user->ID )
	) {
		$isLoggedInAndHasAccount = true;
	}
}

// Display template
?>
<div class="mpa-booking-step mpa-booking-step-checkout mpa-hide">
	<form class="mpa-checkout-form" method="POST" action="">
		<section class="mpa-customer-details mpa-checkout-section">
			<p class="mpa-shortcode-title">
				<?php esc_html_e( 'Your Information', 'motopress-appointment' ); ?>
			</p>

			<p class="mpa-required-tip">
				<?php echo mpa_tmpl_required_tip(); ?>
			</p>

			<p class="mpa-input-wrapper mpa-customer-name-wrapper">
				<label for="mpa-customer-name-<?php echo esc_attr( $html_id ); ?>">
					<?php esc_html_e( 'Name', 'motopress-appointment' ); ?>
					<?php echo mpa_tmpl_required(); ?>
				</label>

				<input
					id="mpa-customer-name-<?php echo esc_attr( $html_id ); ?>"
					class="mpa-customer-name"
					type="text"
					name="name"
					placeholder="<?php echo $placeholderName; ?>"
					required="required">
			</p>

			<p class="mpa-input-wrapper mpa-customer-email-wrapper">
				<label for="mpa-customer-email-<?php echo esc_attr( $html_id ); ?>">
					<?php esc_html_e( 'Email', 'motopress-appointment' ); ?>
					<?php echo mpa_tmpl_required(); ?>
				</label>

				<input
					id="mpa-customer-email-<?php echo esc_attr( $html_id ); ?>"
					class="mpa-customer-email"
					type="email"
					name="email"
					placeholder="<?php echo $placeholderEmail; ?>"
					required="required">
			</p>

			<p class="mpa-input-wrapper mpa-customer-phone-wrapper">
				<label for="mpa-customer-phone-<?php echo esc_attr( $html_id ); ?>">
					<?php esc_html_e( 'Phone', 'motopress-appointment' ); ?>
					<?php echo mpa_tmpl_required(); ?>
				</label>

				<input
					id="mpa-customer-phone-<?php echo esc_attr( $html_id ); ?>"
					class="mpa-customer-phone"
					type="tel"
					name="tel"
					placeholder="<?php echo esc_attr( $placeholderPhone ); ?>"
					autocomplete="on"
					required="required"
				>
				<br><span id="mpa-customer-phone-<?php echo esc_attr( $html_id ); ?>_error" class="mpa-phone-field-error mpa-hide"><?php esc_html_e( 'Phone number is invalid.', 'motopress-appointment' ); ?></span>
			</p>
			<?php \MotoPress\Appointment\Fields\Basic\PhoneField::echoPhoneInputInitJavascript( 'tel', 'mpa-customer-phone-' . esc_attr( $html_id ) ); ?>

			<p class="mpa-input-wrapper mpa-customer-notes-wrapper">
				<label for="mpa-customer-notes-<?php echo esc_attr( $html_id ); ?>">
					<?php esc_html_e( 'Booking notes', 'motopress-appointment' ); ?>
				</label>

				<textarea
					id="mpa-customer-notes-<?php echo esc_attr( $html_id ); ?>"
					class="mpa-customer-notes"
					name="notes"
					rows="4"></textarea>
			</p>

			<?php if ( ! $isLoggedInAndHasAccount && mpapp()->settings()->isAllowCustomerAccountCreation() ): ?>
                <p class="mpa-input-wrapper mpa-customer-create-account-wrapper <?php if( mpapp()->settings()->isCustomerAccountCreateAutomatically() ) { echo 'mpa-hide'; } ?>">
                    <label for="mpa-customer-create-account-<?php echo esc_attr( $html_id ); ?>">
                        <input
                                id="mpa-customer-create-account-<?php echo esc_attr( $html_id ); ?>"
                                class="mpa-customer-create-account"
                                type="checkbox"
	                        <?php if ( mpapp()->settings()->isCustomerAccountCreateAutomatically() ) {
		                        echo 'disabled="disabled" checked';
	                        } ?>
                        >
						<?php esc_html_e( 'Create an account?', 'motopress-appointment' ); ?>
                    </label>
                    <em class="mpa-customer-create-account-description mpa-hide">
						<?php esc_html_e( 'Information about access to your account will be sent by email.', 'motopress-appointment' ); ?>
                    </em>
                </p>
                <p class="mpa-message mpa-error mpa-hide"></p>
                <div class="mpa-loading mpa-hide"></div>
			<?php endif; ?>
        </section>

        <?php
			/**
			 * @since 1.11.0
			 *
			 * @hooked MotoPress\Appointment\Views\ShortcodesView::appointmentFormCheckoutCouponSection() - 10
			 * @hooked MotoPress\Appointment\Views\ShortcodesView::appointmentFormCheckoutOrderSection()  - 20
			 */
			do_action( "{$template_name}_checkout_bottom_sections", $template_args );
		?>

		<?php if ( ! mpapp()->settings()->isPaymentsEnabled() ) { ?>
			<?php mpa_display_template( 'shortcodes/booking/sections/accept-terms.php', array( 'html_id' => $html_id ) ); ?>
		<?php } ?>

		<p class="mpa-actions">
			<?php echo mpa_tmpl_button( esc_html__( 'Back', 'motopress-appointment' ), array( 'class' => 'button button-secondary mpa-button-back' ) ); ?>
			<?php
			echo mpa_tmpl_button(
				mpapp()->settings()->isPaymentsEnabled() ? esc_html__( 'Next', 'motopress-appointment' ) : esc_html__( 'Reserve', 'motopress-appointment' ),
				array(
					'class'    => 'button button-primary mpa-button-next',
					'type'     => 'submit',
					'disabled' => 'disabled',
				)
			);
			?>
		</p>
	</form>
</div>
