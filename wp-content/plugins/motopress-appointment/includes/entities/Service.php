<?php

namespace MotoPress\Appointment\Entities;

use MotoPress\Appointment\Structures\Service\ServiceVariations;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * @since 1.0
 * @see \MotoPress\Appointment\Repositories\ServiceRepository
 */
class Service extends AbstractEntity {

	const DEPOSIT_TYPE_DISABLED   = 'disabled';
	const DEPOSIT_TYPE_FIXED      = 'fixed';
	const DEPOSIT_TYPE_PERCENTAGE = 'percentage';


	const DEFAULT_COLOR = '#fbf8cc';

	const DEPOSIT_TYPES = array(
		self::DEPOSIT_TYPE_DISABLED,
		self::DEPOSIT_TYPE_FIXED,
		self::DEPOSIT_TYPE_PERCENTAGE,
	);

	/**
	 * @since 1.0
	 * @var int[]
	 */
	protected $employeeIds = array();

	/**
	 * @since 1.0
	 * @var string
	 */
	protected $title = '';

	/**
	 * @since 1.0
	 * @var string
	 */
	protected $description = '';

	/**
	 * @since 1.0
	 * @var float
	 */
	protected $price = 0.0;

	/**
	 * Duration time in minutes.
	 *
	 * @since 1.0
	 * @var int
	 */
	protected $duration = 0;

	/**
	 * Buffer time in minutes.
	 *
	 * @since 1.0
	 * @var int
	 */
	protected $bufferTimeBefore = 0;

	/**
	 * Buffer time in minutes.
	 *
	 * @since 1.0
	 * @var int
	 */
	protected $bufferTimeAfter = 0;

	/**
	 * Time in minutes.
	 *
	 * @since 1.0
	 * @var int
	 */
	protected $timeBeforeBooking = 0;

	/**
	 * @since 1.0
	 * @var int
	 */
	protected $minCapacity = 1;

	/**
	 * @since 1.0
	 * @var int
	 */
	protected $maxCapacity = 1;

	/**
	 * @since 1.3.1
	 * @var bool
	 */
	protected $multiplyPrice = false;

	/**
	 * @since 1.11.0
	 * @var string
	 */
	protected $color = self::DEFAULT_COLOR;

	/**
	 * @since 1.3.1
	 * @var ServiceVariations
	 */
	protected $variations;

	/**
	 * @since 1.14.0
	 * @var string
	 */
	protected $depositType = self::DEPOSIT_TYPE_DISABLED;

	/**
	 * @since 1.14.0
	 * @var float
	 */
	protected $depositAmount = 0;

	/**
	 * @since 1.13.0
	 * @var string[] [1 => ..., 2 => ...]
	 */
	protected $notificationNotices = array(
		1 => '',
		2 => '',
	);


	public function getEmployeeIds(): array {
		return $this->employeeIds;
	}

	public function setEmployeeIds( array $employeeIds ) {
		$this->employeeIds = $employeeIds;
	}

	public function getTitle(): string {
		return $this->title;
	}

	public function getDescription(): string {
		return $this->description;
	}

	/**
	 * @since 1.0
	 * @since 1.3.1 added the <code>$capacity</code> argument.
	 *
	 * @param int $employeeId Optional. 0 by default.
	 * @param int $capacity Optional. 0 by default (minimum capacity of the
	 *     service).
	 * @return float
	 */
	public function getPrice( $employeeId = 0, $capacity = 0 ) {
		if ( ! $capacity ) {
			$capacity = $this->minCapacity;
		}

		$price = $this->variations->getPrice( $employeeId, $this->price );

		if ( $this->multiplyPrice ) {
			$price *= $capacity;
		}

		return $price;
	}

	/**
	 * @since 1.0
	 *
	 * @param int $employeeId Optional.
	 * @return int
	 */
	public function getDuration( $employeeId = 0 ) {
		return $this->variations->getDuration( $employeeId, $this->duration );
	}

	public function getBufferTimeBefore(): int {
		return $this->bufferTimeBefore;
	}

	public function getBufferTimeAfter(): int {
		return $this->bufferTimeAfter;
	}

	public function getTimeBeforeBooking(): int {
		return $this->timeBeforeBooking;
	}
	/**
	 * @since 1.3.1
	 *
	 * @param int $employeeId Optional.
	 * @return int
	 */
	public function getMinCapacity( $employeeId = 0 ) {
		return $this->variations->getMinCapacity( $employeeId, $this->minCapacity );
	}

	/**
	 * @since 1.3.1
	 *
	 * @param int $employeeId Optional.
	 * @return int
	 */
	public function getMaxCapacity( $employeeId = 0 ) {
		return $this->variations->getMaxCapacity( $employeeId, $this->maxCapacity );
	}

	public function isMultiplyPrice(): bool {
		return $this->multiplyPrice;
	}
	/**
	 * @since 1.9.0
	 *
	 * @param int $employeeId Optional.
	 * @return int[]
	 */
	public function getCapacityRange( $employeeId = 0 ) {
		$minCapacity = $this->getMinCapacity( $employeeId );
		$maxCapacity = $this->getMaxCapacity( $employeeId );

		return range( $minCapacity, $maxCapacity );
	}

	/**
	 * @since 1.3.1
	 *
	 * @param int $employeeId Optional.
	 * @return int The maximum number of guests in range [0; ∞).
	 */
	public function getMaxGuests( $employeeId = 0 ) {
		$maxCapacity = $this->getMaxCapacity( $employeeId );
		$minCapacity = $this->getMinCapacity( $employeeId );

		$maxGuests = $maxCapacity - $minCapacity;

		return max( 0, $maxGuests );
	}

	public function getColor() {
		return $this->color;
	}

	public function getVariations(): ServiceVariations {
		return $this->variations;
	}

	public function setVariations( ServiceVariations $variations ) {
		$this->variations = $variations;
	}

	public function getDepositType(): string {
		return $this->depositType;
	}

	public function getDepositAmount(): float {
		return $this->depositAmount;
	}

	/**
	 * @since 1.13.0
	 */
	public function getNotificationNotice1(): string {
		return $this->notificationNotices[1];
	}

	/**
	 * @since 1.13.0
	 */
	public function getNotificationNotice2(): string {
		return $this->notificationNotices[2];
	}

	/**
	 * @since 1.13.0
	 *
	 * @return string[] [1 => ..., 2 => ...]
	 */
	public function getNotificationNotices(): array {
		return $this->notificationNotices;
	}

	/**
	 * @return WP_Term[]
	 */
	public function getCategories(): array {

		$serviceCategories = wp_get_post_terms(
			$this->getId(),
			\MotoPress\Appointment\PostTypes\ServicePostType::CATEGORY_NAME
		);

		return is_array( $serviceCategories ) ? $serviceCategories : array();
	}
}
