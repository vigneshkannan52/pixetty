<?php

namespace MotoPress\Appointment\Shortcodes\DirectLinkActions;

use MotoPress\Appointment\Shortcodes\AbstractShortcode;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

abstract class AbstractDirectLinkEntityShortcode extends AbstractShortcode {

	public function __construct() {
		parent::__construct();

		add_filter(
			$this->getName() . '_shortcode_wrapper_class',
			function ( $wrapperClass ) {
				return $wrapperClass . ' mpa-direct-link-action-shortcode';
			}
		);
	}

	abstract protected function name();

	abstract protected function getContent( $entity );

	protected function getPrefix() {
		return 'mpa_direct_link';
	}

	public function getName() {
		return $this->getPrefix() . '_' . $this->name();
	}

	public function getRawShortcode() {
		return '[' . $this->getName() . ']';
	}

	protected function renderContent( $args, $content, $shortcodeTag ) {
		$entity = null;

		$entity = apply_filters( $this->getName(), $entity );

		if ( ! $entity ) {
			return '';
		}

		return $this->getContent( $entity );
	}
}
