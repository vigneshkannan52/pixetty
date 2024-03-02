<?php

namespace MotoPress\Appointment\DirectLinkActions\Pages;

/**
 * @since 1.15.0
 */
abstract class AbstractBookingPage extends AbstractShortcodeCompatiblePage {

	/**
	 * @return \MotoPress\Appointment\Repositories\BookingRepository
	 */
	protected function getEntityRepository() {
		return mpapp()->repositories()->booking();
	}
}
