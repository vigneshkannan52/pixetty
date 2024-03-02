<?php

namespace MotoPress\Appointment\Emails\Tags\Payment;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * @since 1.15.2
 */
class PaymentInstructionsTag extends AbstractPaymentEntityTag {

	public function getName(): string {
		return 'payment_instructions';
	}

	protected function description(): string {
		return esc_html__( 'Payment gateway instructions', 'motopress-appointment' );
	}

	public function getTagContent(): string {
		$gateway = $this->getEntity()->getGateway();
		if ( ! isset( $gateway ) ) {
			return '';
		}

		return property_exists( $gateway, 'instructions' ) ? $gateway->getInstructions() : '';
	}
}
