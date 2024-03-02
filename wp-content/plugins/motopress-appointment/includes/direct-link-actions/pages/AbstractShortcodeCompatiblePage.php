<?php

namespace MotoPress\Appointment\DirectLinkActions\Pages;

/**
 * @since 1.15.0
 */
abstract class AbstractShortcodeCompatiblePage extends AbstractRealPage {

	public function __construct() {
		parent::__construct();

		add_action( 'init', array( $this, 'defineShortcodesEntity' ), 10 );
	}

	/**
	 * @return \MotoPress\Appointment\Shortcodes\DirectLinkActions\AbstractDirectLinkEntityShortcode[]
	 */
	protected function getCompatibleShortcodes() {
		return mpapp()->shortcodes()->getDirectLinkActionShortcodes();
	}

	public function defineShortcodesEntity() {

		$shortcodes = $this->getCompatibleShortcodes();

		if ( ! count( $shortcodes ) ) {
			return;
		}

		$entity = $this->getEntity();

		if ( ! $entity ) {
			return;
		}

		foreach ( $shortcodes as $shortcode ) {
			add_filter(
				$shortcode->getName(),
				function () use ( $entity ) {
					return $entity;
				}
			);
		}
	}
}
