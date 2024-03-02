<?php
/**
 * WooCommerce Compatibility File
 *
 * @link https://woocommerce.com/
 *
 * @package pixetty
 */

/**
 * WooCommerce setup function.
 *
 * @link https://docs.woocommerce.com/document/third-party-custom-theme-compatibility/
 * @link https://github.com/woocommerce/woocommerce/wiki/Enabling-product-gallery-features-(zoom,-swipe,-lightbox)
 * @link https://github.com/woocommerce/woocommerce/wiki/Declaring-WooCommerce-support-in-themes
 *
 * @return void
 */
function pixetty_woocommerce_setup() {
	add_theme_support(
		'woocommerce',
		array(
			'thumbnail_image_width' => 860,
			'single_image_width'    => 860,
			'product_grid'          => array(
				'default_rows'    => 3,
				'min_rows'        => 1,
				'default_columns' => 3,
				'min_columns'     => 1,
				'max_columns'     => 6,
			),
		)
	);
	add_theme_support( 'wc-product-gallery-zoom' );
	add_theme_support( 'wc-product-gallery-lightbox' );
	add_theme_support( 'wc-product-gallery-slider' );
}
add_action( 'after_setup_theme', 'pixetty_woocommerce_setup' );

/**
 * WooCommerce specific scripts & stylesheets.
 *
 * @return void
 */
function pixetty_woocommerce_scripts() {
	wp_enqueue_style( 'pixetty-woocommerce-style', get_template_directory_uri() . '/woocommerce.css', array(), PIXETTY_VERSION );

	$font_path   = WC()->plugin_url() . '/assets/fonts/';
	$inline_font = '@font-face {
			font-family: "star";
			src: url("' . $font_path . 'star.eot");
			src: url("' . $font_path . 'star.eot?#iefix") format("embedded-opentype"),
				url("' . $font_path . 'star.woff") format("woff"),
				url("' . $font_path . 'star.ttf") format("truetype"),
				url("' . $font_path . 'star.svg#star") format("svg");
			font-weight: normal;
			font-style: normal;
		}';

	wp_add_inline_style( 'pixetty-woocommerce-style', $inline_font );
}
add_action( 'wp_enqueue_scripts', 'pixetty_woocommerce_scripts' );

/**
 * Disable the default WooCommerce stylesheet.
 *
 * Removing the default WooCommerce stylesheet and enqueing your own will
 * protect you during WooCommerce core updates.
 *
 * @link https://docs.woocommerce.com/document/disable-the-default-stylesheet/
 */
add_filter( 'woocommerce_enqueue_styles', '__return_empty_array' );

/**
 * Add 'woocommerce-active' class to the body tag.
 *
 * @param  array $classes CSS classes applied to the body tag.
 * @return array $classes modified to include 'woocommerce-active' class.
 */
function pixetty_woocommerce_active_body_class( $classes ) {
	$classes[] = 'woocommerce-active';

	return $classes;
}
add_filter( 'body_class', 'pixetty_woocommerce_active_body_class' );

/**
 * Related Products Args.
 *
 * @param array $args related products args.
 * @return array $args related products args.
 */
function pixetty_woocommerce_related_products_args( $args ) {
	$defaults = array(
		'posts_per_page' => 3,
		'columns'        => 3,
	);

	$args = wp_parse_args( $defaults, $args );

	return $args;
}
add_filter( 'woocommerce_output_related_products_args', 'pixetty_woocommerce_related_products_args' );

/**
 * Remove default WooCommerce wrapper.
 */
remove_action( 'woocommerce_before_main_content', 'woocommerce_output_content_wrapper', 10 );
remove_action( 'woocommerce_after_main_content', 'woocommerce_output_content_wrapper_end', 10 );

if ( ! function_exists( 'pixetty_woocommerce_wrapper_before' ) ) {
	/**
	 * Before Content.
	 *
	 * Wraps all WooCommerce content in wrappers which match the theme markup.
	 *
	 * @return void
	 */
	function pixetty_woocommerce_wrapper_before() {
		pixetty_woo_custom_header();
		?>
			<main id="primary" class="site-main">
				<div class="woo-wrapper">
		<?php
	}
}
add_action( 'woocommerce_before_main_content', 'pixetty_woocommerce_wrapper_before' );

if ( ! function_exists( 'pixetty_woocommerce_wrapper_after' ) ) {
	/**
	 * After Content.
	 *
	 * Closes the wrapping divs.
	 *
	 * @return void
	 */
	function pixetty_woocommerce_wrapper_after() {
		?>
				</div>
			</main><!-- #main -->
		<?php
	}
}
add_action( 'woocommerce_after_main_content', 'pixetty_woocommerce_wrapper_after' );

/**
 * Sample implementation of the WooCommerce Mini Cart.
 *
 * You can add the WooCommerce Mini Cart to header.php like so ...
 *
	<?php
		if ( function_exists( 'pixetty_woocommerce_header_cart' ) ) {
			pixetty_woocommerce_header_cart();
		}
	?>
 */

if ( ! function_exists( 'pixetty_woocommerce_cart_link_fragment' ) ) {
	/**
	 * Cart Fragments.
	 *
	 * Ensure cart contents update when products are added to the cart via AJAX.
	 *
	 * @param array $fragments Fragments to refresh via AJAX.
	 * @return array Fragments to refresh via AJAX.
	 */
	function pixetty_woocommerce_cart_link_fragment( $fragments ) {
		ob_start();
		pixetty_woocommerce_cart_link();
		$fragments['a.cart-contents'] = ob_get_clean();

		return $fragments;
	}
}
add_filter( 'woocommerce_add_to_cart_fragments', 'pixetty_woocommerce_cart_link_fragment' );

if ( ! function_exists( 'pixetty_woocommerce_cart_link' ) ) {
	/**
	 * Cart Link.
	 *
	 * Displayed a link to the cart including the number of items present and the cart total.
	 *
	 * @return void
	 */
	function pixetty_woocommerce_cart_link() {
		?>
		<a class="cart-contents" href="<?php echo esc_url( wc_get_cart_url() ); ?>">
			<span class="icon"><i class="fa fa-shopping-cart"></i></span>
			<span class="count"><?php echo esc_html( WC()->cart->get_cart_contents_count() ); ?></span>
		</a>
		<?php
	}
}

if ( ! function_exists( 'pixetty_woocommerce_header_cart' ) ) {
	/**
	 * Display Header Cart.
	 *
	 * @return void
	 */
	function pixetty_woocommerce_header_cart() {

		if (!get_theme_mod('pixetty_enable_header_cart', true)) {
			return;
		}

		if ( is_cart() ) {
			$class = 'current-menu-item';
		} else {
			$class = '';
		}
		?>
		<ul id="site-header-cart" class="site-header-cart">
			<li class="<?php echo esc_attr( $class ); ?>">
				<?php pixetty_woocommerce_cart_link(); ?>
			</li>
			<li>
				<?php
				$instance = array(
					'title' => '',
				);

				the_widget( 'WC_Widget_Cart', $instance );
				?>
			</li>
		</ul>
		<?php
	}
}

function pixetty_woo_widgets_init() {
	register_sidebar(
		array(
			'name' => esc_html__('Shop Sidebar', 'pixetty'),
			'id' => 'woocommerce-sidebar',
			'description' => esc_html__('Add widgets here.', 'pixetty'),
			'before_widget' => '<section id="%1$s" class="widget %2$s">',
			'after_widget' => '</section>',
			'before_title' => '<h4 class="widget-title">',
			'after_title' => '</h4>',
		)
	);
}

add_action('widgets_init', 'pixetty_woo_widgets_init');

remove_action('woocommerce_before_main_content', 'woocommerce_breadcrumb', 20);
remove_action('woocommerce_sidebar', 'woocommerce_get_sidebar', 10);

add_action('pixetty_woo_sidebar', 'woocommerce_get_sidebar', 10);

function pixetty_woo_before_shop_loop_info() {
	?>
	<div class="woocommerce-shop-info">
		<div class="woocommerce-shop-info-wrapper">
	<?php
}

add_action('woocommerce_before_shop_loop', 'pixetty_woo_before_shop_loop_info', 15);

function pixetty_woo_after_shop_loop_info() {
	?>
		</div>
	</div>
	<?php
}

add_action('woocommerce_before_shop_loop', 'pixetty_woo_after_shop_loop_info', 35);

function pixetty_woo_shop_wrapper_open() {
	?>
	<div class="woocommerce-shop-wrapper">
		<div class="woocommerce-shop-content">
	<?php
}

add_action('woocommerce_before_shop_loop', 'pixetty_woo_shop_wrapper_open', 5);

function pixetty_woo_shop_wrapper_close() {
	?>
		</div>
		<?php do_action('pixetty_woo_sidebar'); ?>
	</div>
	<?php
}

add_action('woocommerce_after_shop_loop', 'pixetty_woo_shop_wrapper_close', 20);

function pixetty_woo_pagination_args($args) {

	$icon_prev = '<svg width="20" height="21" viewBox="0 0 20 21" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 20.25L12.1082 18.1418L5.70747 11.741L20 11.741L20 8.75902L5.70747 8.75902L12.1082 2.35824L10 0.25L-4.37114e-07 10.25L10 20.25Z"/>
                </svg>';

	$icon_next = '<svg width="20" height="21" viewBox="0 0 20 21" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 0.25L7.89175 2.35825L14.2925 8.75902L-5.02287e-07 8.75902L-3.71941e-07 11.741L14.2925 11.741L7.89176 18.1418L10 20.25L20 10.25L10 0.25Z"/>
                </svg>';

	return array_merge($args, array(
		'mid_size' => 1,
		'prev_text' => $icon_prev,
		'next_text' => $icon_next
	));
}

add_filter('woocommerce_pagination_args', 'pixetty_woo_pagination_args', 10);

function pixetty_woo_before_single_product_images() {
	?>
	<div class="single-product-header">
		<div class="single-product-images-wrapper">
	<?php
}

add_action('woocommerce_before_single_product_summary', 'pixetty_woo_before_single_product_images', 5);

function pixetty_woo_after_single_product_images() {
	?>
	</div>
	<?php
}

add_action('woocommerce_before_single_product_summary', 'pixetty_woo_after_single_product_images', 30);

function pixetty_woo_after_single_product_summary() {
	?>
	</div>
	<?php
}

add_action('woocommerce_after_single_product_summary', 'pixetty_woo_after_single_product_summary', 5);

function pixetty_woo_gallery_image_size() {
	return 'medium';
}

add_filter('woocommerce_gallery_thumbnail_size', 'pixetty_woo_gallery_image_size', 10);

function pixetty_woo_related_products_args( $args ) {
	$args['posts_per_page'] = 4;
	$args['columns'] = 4;
	return $args;
}

add_filter('woocommerce_output_related_products_args', 'pixetty_woo_related_products_args', 20);

function pixetty_woo_cross_sells_columns( $columns ) {
	return 3;
}

add_filter('woocommerce_cross_sells_columns', 'pixetty_woo_cross_sells_columns');

add_action('pixetty_after_main_navigation', 'pixetty_woocommerce_header_cart', 10);

function pixetty_woo_custom_header()
{
	?>
	<div class="entry-header hero-header woo-header">
		<div class="entry-header-info">
			<h2 class="entry-subtitle"><?php woocommerce_page_title(); ?></h2>
			<div class="archive-description">
				<?php do_action( 'woocommerce_archive_description' ); ?>
			</div>
		</div>
	</div>
	<?php
}

function pixetty_woo_address_fields($address_fields) {

	$address_fields['country']['class'][] = 'form-row-first';
	$address_fields['address_1']['class'][] = 'form-row-last';

	$address_fields['city']['class'][] = 'form-row-first';
	$address_fields['state']['class'][] = 'form-row-last';

	return $address_fields;
}

add_filter('woocommerce_default_address_fields', 'pixetty_woo_address_fields', 20, 1);

function pixetty_woo_billing_fields($billing_fields) {
	$billing_fields['billing_phone']['class'][] = 'form-row-first';
	$billing_fields['billing_email']['class'][] = 'form-row-last';

	return $billing_fields;
}

add_filter('woocommerce_billing_fields', 'pixetty_woo_billing_fields', 20, 1);
