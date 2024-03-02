<?php

namespace MotoPress\Appointment\Payments\Gateways;

use MotoPress\Appointment\API\StripeAPI;
use MotoPress\Appointment\Payments\Gateways\Webhooks\StripeWebhooksListener;
use MotoPress\Appointment\Utils\ParseUtils;
use WP_Error;
use MotoPress\Appointment\Entities\Payment;
use \MotoPress\Appointment\Entities\Booking;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * @since 1.5.0
 */
class StripePaymentGateway extends AbstractPaymentGateway {

	const PAYMENT_META_CLIENT_SECRET = 'client_secret';

	/**
	 * Public API key.
	 *
	 * @since 1.5.0
	 * @var string
	 */
	public $publicKey = '';

	/**
	 * Secret API key.
	 *
	 * @since 1.5.0
	 * @var string
	 */
	public $secretKey = '';

	/**
	 * Webhook endpoint secret key.
	 *
	 * @since 1.5.0
	 * @var string
	 */
	public $webhookKey = '';

	/**
	 * Enabled payment methods.
	 *
	 * @since 1.5.0
	 * @var string[]
	 */
	public $paymentMethods = array();

	/**
	 * Equals to <code>$paymentMethods</code> property if the currency is euro,
	 * [] or ['card'] otherwise.
	 *
	 * @since 1.5.0
	 * @var string[]
	 */
	public $allowedMethods = array();

	/**
	 * @since 1.5.0
	 * @var string
	 */
	public $checkoutLocale = 'auto';

	/**
	 * @since 1.5.0
	 * @var StripeAPI
	 */
	public $api = null;

	/**
	 * @since 1.5.0
	 * @var StripeWebhooksListener
	 */
	public $webhooks = null;

	/**
	 * @since 1.16.0
	 * @var string
	 */
	protected $accountCountry = '';


	public function __construct() {

		parent::__construct();

		$this->addListeners();
	}

	public function getId(): string {
		return 'stripe';
	}

	public function getName(): string {
		return __( 'Stripe', 'motopress-appointment' );
	}

	public function getDefaultPublicName(): string {
		return __( 'Credit card (Stripe)', 'motopress-appointment' );
	}

	protected function getDefaultDescription(): string {
		return __( 'Pay with your credit card via Stripe. Use the card number 4242424242424242 with CVC 123, a valid expiration date and random 5-digit ZIP-code to test a payment.', 'motopress-appointment' );
	}

	/**
	 * @since 1.5.0
	 */
	protected function setupProperties() {

		parent::setupProperties();

		$this->publicKey  = $this->getOption( 'public_key', $this->publicKey );
		$this->secretKey  = $this->getOption( 'secret_key', $this->secretKey );
		$this->webhookKey = $this->getOption( 'webhook_key', $this->webhookKey );

		$this->paymentMethods = $this->getOption( 'payment_methods', $this->paymentMethods );

		if ( ! is_array( $this->paymentMethods ) ) {
			$this->paymentMethods = array();
		}

		$this->api      = new StripeAPI( $this->secretKey );
		$this->webhooks = new StripeWebhooksListener( $this, $this->api );

		if ( $this->isEnabled() ) {

			$this->accountCountry = $this->api->getAccountCountry();
		}
		$this->allowedMethods = $this->getAllowedMethods( $this->paymentMethods );
		$this->checkoutLocale = $this->getOption( 'checkout_locale', $this->checkoutLocale );
	}

	/**
	 * @since 1.16.0
	 *
	 * @param array $paymentMethods
	 *
	 * @return array|string[]
	 */
	protected function getAllowedMethods( array $paymentMethods ) {

		// Define allowed payment methods
		if ( mpapp()->settings()->getCurrency() !== 'EUR' &&
			in_array( 'card', $this->paymentMethods )
		) {
			return array( 'card' );
		}

		if ( ! in_array( $this->accountCountry, array( 'AT', 'BE', 'DE', 'ES', 'IT', 'NL' ) ) ) {
			mpa_array_remove( $this->allowedMethods, 'sofort' );
		}

		return $paymentMethods;
	}

	/**
	 * @since 1.5.0
	 */
	protected function addListeners() {

		if ( $this->isActive() ) {

			$this->webhooks->addListeners();

		}
	}

	public function enqueueScripts() {

		wp_enqueue_script(
			'mpa-stripe',
			'https://js.stripe.com/v3/',
			array(),
			'3.0',
			true
		);
	}

	/**
	 * @param array $paymentMethods
	 *
	 * @return array
	 * @since 1.16.0
	 *
	 * Converting wallets to a card payment method, because wallets are a variation of the 'card' payment method.
	 *
	 */
	protected function transformWalletsToPaymentMethods( array $paymentMethods ) {

		$converted = false;
		$wallets   = array( 'apple_pay', 'google_pay', 'link' );

		foreach ( $wallets as $wallet ) {
			$key = array_search( $wallet, $paymentMethods );
			if ( false !== $key ) {
				unset( $paymentMethods[ $key ] );
				$converted = true;
			}
		}

		if ( ! $converted ) {
			return $paymentMethods;
		}

		if ( ! in_array( 'card', $paymentMethods ) ) {
			array_unshift( $paymentMethods, 'card' );
		}

		return array_values( $paymentMethods );
	}

	/**
	 * @param \Stripe\PaymentMethod $paymentMethod
	 *
	 * @return string
	 * @since 1.16.0
	 *
	 */
	protected function getPaymentMethodName( $paymentMethod ) {

		$paymentMethodName = $paymentMethod->type;

		if ( isset( $paymentMethod->card ) &&
			isset( $paymentMethod->card->wallet )
		) {
			$paymentMethods = $this->getPaymentMethods();
			if ( isset( $paymentMethods[ $paymentMethod->card->wallet->type ] ) ) {
				$paymentMethodName = strtolower( $paymentMethods[ $paymentMethod->card->wallet->type ] );
			}
		}

		return $paymentMethodName;
	}

	/**
	 * @since 1.5.0
	 *
	 * @return array
	 */
	public function getFrontendData() {
		/**
		 * @since 1.5.0
		 *
		 * @param array $style
		 *
		 * @see https://github.com/stripe/stripe-payments-demo/blob/master/public/javascripts/payments.js#L46
		 */
		$elementStyle = apply_filters( 'mpa_stripe_elements_style', array( 'base' => array( 'fontSize' => '15px' ) ) );

		return parent::getFrontendData() + array(
			'hide_postal_code' => true,
			'country'          => $this->accountCountry,
			'locale'           => $this->checkoutLocale,
			'payment_methods'  => $this->allowedMethods,
			'public_key'       => $this->publicKey,
			'style'            => $elementStyle,
		);
	}

	/**
	 * @since 1.5.0
	 *
	 * @return array Raw field args.
	 */
	public function getFields() {

		$fields = parent::getFields();

		$fields[ $this->getOptionNameRaw( 'public_key' ) ] = array(
			'type'        => 'text',
			'label'       => esc_html__( 'Public Key', 'motopress-appointment' ),
			'description' => mpa_kses_link( __( '<a href="https://support.stripe.com/questions/locate-api-keys-in-the-dashboard" target="_blank">Locate API keys in the Dashboard</a>', 'motopress-appointment' ) ),
			'size'        => 'regular',
			'value'       => $this->publicKey,
		);

		$fields[ $this->getOptionNameRaw( 'secret_key' ) ] = array(
			'type'  => 'text',
			'label' => esc_html__( 'Secret Key', 'motopress-appointment' ),
			'size'  => 'regular',
			'value' => $this->secretKey,
		);

		$fields[ $this->getOptionNameRaw( 'webhook_key' ) ] = array(
			'type'        => 'text',
			'label'       => esc_html__( 'Webhook Secret Key', 'motopress-appointment' ),
			'description' => mpa_kses_link( __( '<a href="https://stripe.com/docs/webhooks/go-live#configure-webhook-settings" target="_blank">Setting up webhook endpoints</a>', 'motopress-appointment' ) ),
			'size'        => 'regular',
			'value'       => $this->webhookKey,
		);

		$fields[ $this->getOptionNameRaw( 'payment_methods' ) ] = array(
			'type'        => 'checklist',
			'label'       => esc_html__( 'Payment Methods', 'motopress-appointment' ),
			'description' => esc_html__( "The payment options of Apple Pay, Google Pay, and Link will only be displayed if your client's browser supports them and your website has a valid SSL certificate installed.", 'motopress-appointment' ) . '<br>' .
								mpa_kses_link( __( 'To use Apple Pay, you need to go to your Stripe account and <a href="https://stripe.com/docs/stripe-js/elements/payment-request-button#verifying-your-domain-with-apple-pay" target="_blank">verify your domain name</a>.', 'motopress-appointment' ) ),
			'options'     => $this->getPaymentMethods(),
			'value'       => $this->paymentMethods,
		);

		$fields[ $this->getOptionNameRaw( 'checkout_locale' ) ] = array(
			'type'        => 'select',
			'label'       => esc_html__( 'Checkout Locale', 'motopress-appointment' ),
			'description' => esc_html__( "Display Checkout in the user's preferred language, if available.", 'motopress-appointment' ),
			'options'     => $this->getCheckoutLocales(),
			'value'       => $this->checkoutLocale,
			'size'        => 'regular',
		);

		return $fields;
	}

	/**
	 * @since 1.5.0
	 *
	 * @return string Payment gateway description on the top of the page, before
	 *      the first field.
	 */
	protected function getAdminDescription() {

		$description = parent::getAdminDescription();

		if ( ! is_ssl() ) {
			// Translators: %s: Payment gateway name, like "Stripe".
			$message = sprintf( esc_html__( 'Please enable SSL and ensure your server has a valid SSL certificate. Otherwise, %s will only work in Test Mode.', 'motopress-appointment' ), $this->name );

			$description .= mpa_tmpl_notice( 'warning', $message, false );
		}

		if ( count( $this->allowedMethods ) !== count( $this->paymentMethods ) && mpapp()->settings()->getCurrency() !== 'EUR' ) {
			$message = esc_html__( 'Euro is the only acceptable currency for the selected payment methods. Change your currency to Euro in General settings.', 'motopress-appointment' );

			$description .= mpa_tmpl_notice( 'warning', $message, false );

		} elseif ( in_array( 'sofort', $this->paymentMethods ) && ! in_array( 'sofort', $this->allowedMethods ) ) {
			$message = esc_html__( 'The SOFORT payment method is only available in the following countries: Austria, Belgium, Germany, Spain, Italy and Netherlands.', 'motopress-appointment' );

			$description .= mpa_tmpl_notice( 'warning', $message, false );
		}

		if ( $this->isActive() ) {
			// Translators: %s: Webhooks URL.
			$message = sprintf( esc_html__( 'Webhooks Destination URL: %s', 'motopress-appointment' ), '<code>' . esc_url( $this->webhooks->getWebhookUrl() ) . '</code>' );

			$description .= '<p>' . $message . '</p>';
		}

		if ( $this->isSandbox() ) {
			// Translators: 1: Test card number, 2: Test CVC code.
			$message = sprintf( esc_html__( 'Use the card number %1$s with CVC %2$s, a valid expiration date and random 5-digit ZIP-code to test a payment.', 'motopress-appointment' ), '4242424242424242', '123' );

			$description .= '<p>' . $message . '</p>';
		}

		return $description;
	}

	/**
	 * @since 1.5.0
	 *
	 * @return array [Payment method ID => Payment method name]
	 */
	public function getPaymentMethods() {
		return array(
			'card'       => esc_html__( 'Card Payments', 'motopress-appointment' ),
			'apple_pay'  => esc_html__( 'Apple Pay', 'motopress-appointment' ),
			'google_pay' => esc_html__( 'Google Pay', 'motopress-appointment' ),
			'link'       => esc_html__( 'Link', 'motopress-appointment' ),
			'bancontact' => esc_html__( 'Bancontact', 'motopress-appointment' ),
			'ideal'      => esc_html__( 'iDEAL', 'motopress-appointment' ),
			'giropay'    => esc_html__( 'Giropay', 'motopress-appointment' ),
			'sepa_debit' => esc_html__( 'SEPA Direct Debit', 'motopress-appointment' ),
			'sofort'     => esc_html__( 'SOFORT', 'motopress-appointment' ),
		);
	}

	/**
	 * @since 1.5.0
	 *
	 * @see https://stripe.com/docs/js/appendix/supported_locales
	 *
	 * @return array [Locale => Locale title]
	 */
	public function getCheckoutLocales() {
		return array(
			'auto'   => esc_html__( 'Auto', 'motopress-appointment' ),
			'ar'     => esc_html__( 'Arabic', 'motopress-appointment' ),
			'bg'     => esc_html__( 'Bulgarian', 'motopress-appointment' ),
			'cs'     => esc_html__( 'Czech', 'motopress-appointment' ),
			'da'     => esc_html__( 'Danish', 'motopress-appointment' ),
			'de'     => esc_html__( 'German', 'motopress-appointment' ),
			'el'     => esc_html__( 'Greek', 'motopress-appointment' ),
			'en'     => esc_html__( 'English', 'motopress-appointment' ),
			'en-GB'  => esc_html__( 'English (United Kingdom)', 'motopress-appointment' ),
			'es'     => esc_html__( 'Spanish', 'motopress-appointment' ),
			'es-419' => esc_html__( 'Spanish (Latin America)', 'motopress-appointment' ),
			'et'     => esc_html__( 'Estonian', 'motopress-appointment' ),
			'fi'     => esc_html__( 'Finnish', 'motopress-appointment' ),
			'fil'    => esc_html__( 'Filipino', 'motopress-appointment' ),
			'fr'     => esc_html__( 'French', 'motopress-appointment' ),
			'fr-CA'  => esc_html__( 'French (Canada)', 'motopress-appointment' ),
			'he'     => esc_html__( 'Hebrew', 'motopress-appointment' ),
			'hr'     => esc_html__( 'Croatian', 'motopress-appointment' ),
			'hu'     => esc_html__( 'Hungarian', 'motopress-appointment' ),
			'id'     => esc_html__( 'Indonesian', 'motopress-appointment' ),
			'it'     => esc_html__( 'Italian', 'motopress-appointment' ),
			'ja'     => esc_html__( 'Japanese', 'motopress-appointment' ),
			'ko'     => esc_html__( 'Korean', 'motopress-appointment' ),
			'lt'     => esc_html__( 'Lithuanian', 'motopress-appointment' ),
			'lv'     => esc_html__( 'Latvian', 'motopress-appointment' ),
			'ms'     => esc_html__( 'Malay', 'motopress-appointment' ),
			'mt'     => esc_html__( 'Maltese', 'motopress-appointment' ),
			'nb'     => esc_html__( 'Norwegian Bokmål', 'motopress-appointment' ),
			'nl'     => esc_html__( 'Dutch', 'motopress-appointment' ),
			'pl'     => esc_html__( 'Polish', 'motopress-appointment' ),
			'pt'     => esc_html__( 'Portuguese', 'motopress-appointment' ),
			'pt-BR'  => esc_html__( 'Portuguese (Brazil)', 'motopress-appointment' ),
			'ro'     => esc_html__( 'Romanian', 'motopress-appointment' ),
			'ru'     => esc_html__( 'Russian', 'motopress-appointment' ),
			'sk'     => esc_html__( 'Slovak', 'motopress-appointment' ),
			'sl'     => esc_html__( 'Slovenian', 'motopress-appointment' ),
			'sv'     => esc_html__( 'Swedish', 'motopress-appointment' ),
			'th'     => esc_html__( 'Thai', 'motopress-appointment' ),
			'tr'     => esc_html__( 'Turkish', 'motopress-appointment' ),
			'vi'     => esc_html__( 'Vietnamese', 'motopress-appointment' ),
			'zh'     => esc_html__( 'Chinese Simplified', 'motopress-appointment' ),
			'zh-HK'  => esc_html__( 'Chinese Traditional (Hong Kong)', 'motopress-appointment' ),
			'zh-TW'  => esc_html__( 'Chinese Traditional (Taiwan)', 'motopress-appointment' ),
		);
	}

	/**
	 * @since 1.5.0
	 *
	 * @return string
	 */
	public function getPublicKey() {
		return $this->publicKey;
	}

	/**
	 * @since 1.5.0
	 *
	 * @return string
	 */
	public function getSecretKey() {
		return $this->secretKey;
	}

	/**
	 * @since 1.5.0
	 *
	 * @return string
	 */
	public function getWebhookKey() {
		return $this->webhookKey;
	}

	/**
	 * @since 1.5.0
	 *
	 * @return StripeAPI
	 */
	public function getApi() {
		return $this->api;
	}

	/**
	 * @since 1.5.0
	 *
	 * @return bool
	 */
	public function isActive() {
		return $this->isEnabled()
			&& ! empty( $this->publicKey )
			&& ! empty( $this->secretKey )
			&& ! empty( $this->allowedMethods );
	}

	/**
	 * Creates pending payment transaction which will be processed later.
	 * @param array $paymentData - can contains gateway specific data from frontend
	 * (for example, payment transaction id, token, payment intent id and so on)
	 * @return mixed any gateway specific data needed on frontend
	 */
	public function startPayment( Booking $booking, string $currencyCode, float $payingAmount, array $paymentData ) {

		$payment = parent::startPayment( $booking, $currencyCode, $payingAmount, $paymentData );

		return $payment->getGatewaySpecificData( static::PAYMENT_META_CLIENT_SECRET );
	}

	/**
	 * Each gateway can add here additional payment data for a new starting payment.
	 * @throws \Exception if payment had not been stored
	 */
	protected function prepareAndStoreNewPayment( Payment $payment, Booking $booking, array $paymentData ): Payment {

		$paymentIntent = $this->preparePaymentIntent( $payment, $paymentData['payment_method_id'] );

		if ( is_wp_error( $paymentIntent ) ) {
			throw new \Exception( $paymentIntent->get_error_message() );
		}

		$payment->setTransactionId( $paymentIntent->id );
		$payment->setGatewaySpecificData( static::PAYMENT_META_CLIENT_SECRET, $paymentIntent->client_secret );

		$payment = parent::prepareAndStoreNewPayment( $payment, $booking, $paymentData );

		return $payment;
	}

	/**
	 * @since 1.14.0
	 *
	 * @see PaymentsRestController::preparePayment()
	 *
	 * @param Payment $payment
	 * @param string $payment_method_id
	 * @return \Stripe\PaymentIntent|WP_Error Payment Intent or WP_Error.
	 */
	public function preparePaymentIntent( $payment, $payment_method_id ) {

		$amount   = ParseUtils::parsePrice( $payment->getAmount() );
		$currency = $payment->getCurrency();

		if ( ! $this->getApi()->checkMinimumAmount( $amount, $currency ) ) {

			$minimumAmount = $this->getApi()->getMinimumAmount( $currency );
			$minimumPrice  = \MotoPress\Appointment\Helpers\PriceCalculationHelper::formatPrice(
				$minimumAmount,
				array(
					'currency_symbol' => '',
					'literal_free'    => false,
					'trim_zeros'      => false,
				)
			);

			// Translators: 1: Currency code (like "EUR"), 2: Payment amount.
			return new WP_Error( 'stripe_api_error', sprintf( esc_html__( 'The minimum amount in %1$s is %2$s.', 'motopress-appointment' ), $currency, $minimumPrice ) );
		}

		$requestArgs = array(
			'amount'               => $this->getApi()->convertToSmallestUnit( $amount, $currency ),
			'currency'             => $currency,
			'description'          => mpa_generate_product_name( $payment->getBookingId() ),
			'payment_method_types' => $this->transformWalletsToPaymentMethods( $this->allowedMethods ),
		);

		if ( in_array( 'bancontact', $this->allowedMethods ) ) {

			if ( in_array( $this->checkoutLocale, array( 'en', 'de', 'fr', 'nl' ) ) ) {
				$requestArgs['payment_method_options']['bancontact']['preferred_language'] = $this->checkoutLocale;
			}
		}
		if ( in_array( 'sofort', $this->allowedMethods ) ) {

			if ( in_array( $this->checkoutLocale, array( 'de', 'en', 'es', 'it', 'fr', 'nl', 'pl' ) ) ) {
				$requestArgs['payment_method_options']['sofort']['preferred_language'] = $this->checkoutLocale;
			}
		}

		if ( ! empty( $payment_method_id ) ) {
			$requestArgs['payment_method'] = $payment_method_id;
		}

		return $this->getApi()->createPaymentIntent( $requestArgs );
	}

	/**
	 * All payment process finish on front-end side. Payment status will set by received webhook.
	 * So return true or WP_Error for indicate about error.
	 *
	 * @param Payment $payment
	 * @param array $paymentData[ 'booking' => Booking, ... any gateway specific data from frontend ]
	 * @return Payment
	 * @throws \Exception if something goes wrong
	 */
	public function processPayment( $payment, $paymentData ) {

		if ( empty( $payment->getTransactionId() ) ) {

			$failMessage = esc_html__( 'Payment intent ID is not set.', 'motopress-appointment' );
			mpa_payment_manager()->failPayment( $payment, $failMessage );

			throw new \Exception( 'process_payment', $failMessage );
		}

		try {
			$paymentIntent = $this->getApi()->getPaymentIntent( $payment->getTransactionId() );
			$paymentMethod = $this->getApi()->getPaymentMethod( $paymentIntent->payment_method );

			$paymentMethodName = $this->getPaymentMethodName( $paymentMethod );
			$payment->setPaymentMethod( $paymentMethodName, true );

		} catch ( \Exception $error ) {
			// Translators: %1$s Payment method, %2$s: Stripe error message.
			$payment->addLog( sprintf( esc_html__( 'Failed to process %1$s payment. %2$s', 'motopress-appointment' ), $payment->getPaymentMethod(), $error->getMessage() ) );

			throw new \Exception( 'process_payment', $error->getMessage() );
		}

		if ( 'succeeded' === $paymentIntent->status ) {
			// Translators: %s: Payment intent type or ID.
			mpa_payment_manager()->completePayment( $payment, sprintf( esc_html__( 'Payment for payment intent %s succeeded.', 'motopress-appointment' ), $paymentIntent->id ) );

		} else {
			/**
			 * On-hold payments will confirmed via the received webhook
			 * @see \MotoPress\Appointment\Payments\Gateways\Webhooks\StripeWebhooksListener::processEvent
			 */
			// Translators: %s: Stripe Payment Intent ID.
			mpa_payment_manager()->holdPayment( $payment, sprintf( esc_html__( 'Payment for payment intent %s is processing.', 'motopress-appointment' ), $paymentIntent->id ) );
		}

		return $payment;
	}
}
