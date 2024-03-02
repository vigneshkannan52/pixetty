<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/documentation/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'pixetty' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', '' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'zkqt,9eGuhZhy-A}Fh)ru5Aq?{RCLg%V!zN;z|q56-W))z*y!vlI!VzY3X$+gtR~' );
define( 'SECURE_AUTH_KEY',  'bA%L#VzV(EcnzEiROSya2,k ESU^cY0_=WvIQ6xzM=$@Tl/I|?o+W_UV#D*_u2Fe' );
define( 'LOGGED_IN_KEY',    ':u~y]G>M&QT:5 ,35*:FTdTy6Pgz@sd@8CuzX~O{I&{l%jEqQl`)zhW`.BHb3CGr' );
define( 'NONCE_KEY',        'J[5/[u,LgFZt$eM]@RrA8bq@wQJr)S{Z-fb~QdP0QBOr~9,UxT#vW9)?&ZM]6V*7' );
define( 'AUTH_SALT',        'vjfH]k!?Inyn3}Gxz;>YB[XdPfJ.-=;.YS.j9]{i_~x+MW7/aIhxTqpog+d=-:|b' );
define( 'SECURE_AUTH_SALT', 'AU=kH]!P@W+zjA?g,W7d{f#1s[ms-RS6VJwEL{wLU qNC6o`j<;YA0W+8gEeTZB+' );
define( 'LOGGED_IN_SALT',   'M|4>A7h=BzymITmVr#S(KmU|??zmG=iIbNGxlnpZY]cdd@Z`nALbw3V!A_s{AL+o' );
define( 'NONCE_SALT',       ':YB5 %?w0f4a5~r>v<r`u-8-kc}zVumuRyHEOkR!0Pr<X@ lWW}RHe*tP4N154v;' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/documentation/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
