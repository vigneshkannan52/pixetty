<?php

namespace MotoPress\Appointment\DirectLinkActions;

use MotoPress\Appointment\DirectLinkActions\Pages\BookingCancellationPage;
use MotoPress\Appointment\DirectLinkActions\Pages\BookingCancelledPage;
use MotoPress\Appointment\DirectLinkActions\Actions\BookingCancellationAction;

/**
 * @since 1.15.0
 */
class DirectLinkActions {

	/**
	 * @var BookingCancellationPage
	 */
	private $bookingCancellationPage;

	/**
	 * @var BookingCancelledPage
	 */
	private $bookingCancelledPage;

	/**
	 * @var BookingCancellationAction
	 */
	private $bookingCancellationAction;

	public function __construct() {
		$this->initPages();
		$this->initActions();
	}

	private function initPages() {
		$this->bookingCancellationPage = new BookingCancellationPage();
		$this->bookingCancelledPage    = new BookingCancelledPage();
	}

	private function initActions() {
		$this->bookingCancellationAction = new BookingCancellationAction();
	}

	/**
	 * @return BookingCancellationPage|null
	 */
	public function getBookingCancellationPage() {
		return $this->bookingCancellationPage;
	}

	/**
	 * @return BookingCancelledPage|null
	 */
	public function getBookingCancelledPage() {
		return $this->bookingCancelledPage;
	}

	/**
	 * @return BookingCancellationAction|null
	 */
	public function getBookingCancellationAction() {
		return $this->bookingCancellationAction;
	}
}
