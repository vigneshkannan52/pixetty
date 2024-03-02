<?php

namespace MotoPress\Appointment\Fields\Basic;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
/**
 * Uses https://github.com/jackocnr/intl-tel-input
 * and https://github.com/giggsey/libphonenumber-for-php
 */
class PhoneField extends TextField {

	const TYPE = 'phone';

	protected $isSeveralPhonesAllowed = false;


	protected function mapFields() {
		return parent::mapFields() + array(
			'isSeveralPhonesAllowed' => 'isSeveralPhonesAllowed',
		);
	}

	/**
	 * Validation uses: https://github.com/giggsey/libphonenumber-for-php
	 * @param mixed $value
	 * @return mixed
	 * @throws \Exception when value is invalid
	 */
	protected function validateValue( $value ) {

		$phoneNumbers = trim( $value );

		if ( empty( $value ) ) {

			if ( empty( $this->default ) ) {
				return '';
			}

			$phoneNumbers = $this->default;
		}

		$currentValidatingPhone = '';

		try {
			$phoneUtil = \libphonenumber\PhoneNumberUtil::getInstance();

			if ( $this->isSeveralPhonesAllowed ) {

				$phoneNumbers = explode( ',', $value );

			} else {

				$phoneNumbers = array( $phoneNumbers );
			}

			$validPhoneNumbers = array();

			foreach ( $phoneNumbers as $phoneNumber ) {

				$currentValidatingPhone = $phoneNumber;

				$currentValidatingPhone = $phoneUtil->parse( trim( $currentValidatingPhone ) );

				if ( $phoneUtil->isValidNumber( $currentValidatingPhone ) ) {

					$currentValidatingPhone = $phoneUtil->format( $currentValidatingPhone, \libphonenumber\PhoneNumberFormat::E164 );

				} else {
					throw new \Exception(
						sprintf(
							// translators: %s is phone number string
							__( 'Phone number %s is invalid.', 'motopress-appointment' ),
							$currentValidatingPhone
						)
					);
				}

				$validPhoneNumbers[] = $currentValidatingPhone;
			}

			$phoneNumbers = implode( ', ', $validPhoneNumbers );

			return $phoneNumbers;

		} catch ( \Throwable $e ) {

			throw new \Exception(
				sprintf(
					// translators: %s is phone number string
					__( 'Phone number %s is invalid.', 'motopress-appointment' ),
					$currentValidatingPhone
				)
			);
		}
	}

	public static function echoPhoneInputInitJavascript( string $inputName, string $inputId ) {

		?>

		<script type="text/javascript">
			(function() {

				document.addEventListener('DOMContentLoaded', function() {

					var phoneInput = jQuery("#<?php echo esc_attr( $inputId ); ?>");
					var phoneInputError = jQuery("#<?php echo esc_attr( $inputId ); ?>_error");

					var iti = window.intlTelInput(phoneInput[0], {
						separateDialCode: true,
						initialCountry: "<?php echo esc_attr( mpapp()->settings()->getCountry() ); ?>",
						hiddenInput: "<?php echo esc_attr( $inputName ); ?>",
						utilsScript: "<?php echo esc_url( \MotoPress\Appointment\PLUGIN_URL . 'assets/js/intl-tel-input-17.0.19/js/utils.js' ); ?>"
					});

					phoneInput.on("countrychange", function() {
						showOrHidePhoneError();
					});

					phoneInput.on("input", function(event) {
						showOrHidePhoneError();
					});

					// check fierfox autocomplete
					iti.promise.then(()=>{
						if (phoneInput.val()) {
							showOrHidePhoneError();
						}
					});

					function showOrHidePhoneError() {

						var iti = window.intlTelInputGlobals.getInstance(phoneInput[0]);

						if (iti.isValidNumber()) {
							jQuery("input[type='hidden'][name='" + "<?php echo esc_attr( $inputName ); ?>" + "']").val(iti.getNumber(intlTelInputUtils.numberFormat.E164));
							phoneInput.removeClass('mpa-phone-number--invalid');
							phoneInputError.addClass('mpa-hide');
						} else {
							phoneInput.addClass('mpa-phone-number--invalid');
							phoneInputError.removeClass('mpa-hide');
						}
					}

					showOrHidePhoneError();
				}, false);
			}());
		</script>

		<?php
	}

	public function renderInput() {

		$output = parent::renderInput();

		if ( ! $this->isSeveralPhonesAllowed ) {

			ob_start();

			?>

			<br><span id="<?php echo esc_attr( $this->inputId ); ?>_error" class="mpa-phone-field-error mpa-hide"><?php esc_html_e( 'Phone number is invalid.', 'motopress-appointment' ); ?></span>

			<?php

			static::echoPhoneInputInitJavascript( $this->inputName, $this->inputId );

			$output .= ob_get_clean();
		}

		return $output;
	}

	/**
	 * @return array
	 *
	 * @since 1.1.0
	 */
	protected function inputAtts() {

		if ( $this->isSeveralPhonesAllowed ) {

			return parent::inputAtts();

		} else {

			return array_merge(
				parent::inputAtts(),
				array(
					'type' => 'tel',
				)
			);
		}
	}
}
