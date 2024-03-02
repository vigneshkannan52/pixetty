=== Pixetty ===

Contributors: motopress
Tags: custom-background, custom-logo, custom-menu, featured-images, threaded-comments, translation-ready

Requires at least: 5.0
Tested up to: 6.4
Requires PHP: 5.6
Stable tag: 1.0.3
License: GNU General Public License v2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

== Description ==

Pixetty is made for portfolio and photographer booking needs. Its modern and bold WordPress design will impress and inspire people who are looking to buy a photography session. The theme is powered by the MotoPress Appointment booking plugin that makes it easy to organize automated appointment scheduling for a solo photographer or studio.

== Installation ==

1. In your admin panel, go to Appearance > Themes and click the Add New button.
2. Click Upload Theme and Choose File, then select the theme's .zip file. Click Install Now.
3. Click Activate to use your new theme right away.

== Changelog ==

= 1.1.3 - Nov 30 2023 =
* Appointment Booking plugin updated to version 1.21.0:
    * Added the "Analytics" page to display your key business metrics.
    * Added the ability to export bookings data in a CSV file.
    * Added the ability to filter bookings by date, service, location, employee.
    * Added RTL support for emails.
    * Added Advanced settings functionality, enabling the addition of custom Anchor and Class attributes to blocks associated with the Appointment Booking plugin.
    * Expanded Reservation tags with a new {reservation_clients_number} tag for utilization in email notifications.
    * Integrated the option to showcase a booking form with pre-selected fields, facilitating bookings for specific individual services, categories, locations, or employees.
    * Improved the calendar page in the admin dashboard.
    * Improvement: Only published posts (Service categories, Services, Employees, Locations) can be displayed in the appointment form.
    * Improved compatibility with WordPress 6.2+.
    * Improved translation and localization files by adding text string locations.
    * Improved the UX of the booking form customization through the WordPress block editor and shortcode settings.
    * Improved the display of available slots in the calendar for customers by implementing instant redirection to months with available slots.
    * Improved filtering capabilities across all booking form fields, such as Service Category, Service, Location, and Employee.
    * Fixed an issue that appeared in version 1.19.1 and caused errors with service bookings.
    * Fixed an issue with sending notifications that appeared in version 1.18.0.
    * Fixed an issue where the 'Show items' option was not displaying correctly in the Appointment form widget.
    * Fixed an issue of potential overbooking.
    * Fixed an issue of displaying an appointment form in Divi.
    * Fixed an issue involving the unauthorized use of discount coupons.
    * Fixed a PHP warning occurring on the customer account page.
    * Fixed a PHP warning related to the Employee list block and mpa_employees_list shortcode.
    * Fixed a browser warning that arose while editing input text fields in the Appointment Booking blocks’ settings.
    * Fixed a link for viewing all booking payments on WordPress multisite.
    * Fixed a deprecated PHP warning on pages containing Divi modules associated with Appointment Booking.
    * Fixed an issue with updating timeslots in the appointment booking form when the user selects a different service.
    * Fixed the wrong phone validation that occurred right after loading the customer info step in the appointment booking form.
    * Fixed the transparent background of the booking info popup in the admin calendar.
    * Fixed the incorrect display of the start day of the week right after loading the admin calendar.
    * Removed Divi assets from enqueueing when Divi is deactivated.

= 1.1.2 - Jul 11 2023 =
* Appointment Booking plugin updated to version 1.18.0:
    * Added the user area for customers that allows them to log in, view bookings and speed up reservations with pre-populated info at checkout. Website admins can set the plugin to create a user account automatically or let customers opt for its creation.
    * Added the ability to send SMS notifications via Twilio. An extra extension is required.
    * Added the ability to pay using Apple Pay, Google Pay and Link via Stripe.
    * Added the ability to allow clients to cancel their bookings.
    * Added new payment tags to the admin and customer email templates, which indicate the total booking price and the sum left to pay.
    * Added the ability to enable deposit online payments service-wise. Deposit-based bookings are added with the 'Confirmed' status to the list of reservations.
    * Fixed an issue with applying coupons in the booking confirmation mode without a payment.
    * Fixed an incorrect price calculation for services with minimum and maximum capacity greater than 1.
    * Fixed an issue with employee contacts not being shown in the employee shortcodes.
    * Fixed a fatal error upon creating appointment notifications.
    * Fixed an issue of blocking timeslots on the frontend that were not actually booked.
    * Fixed an issue with displaying a card number field at checkout.
    * Fixed an issue with editing services in a booking on the admin backend.
    * Improved the interface of the admin bookings calendar.
    * Improved the security of payment processing via the website.
* Minor bugfixes and improvements.

= 1.1.1 - Jan 17 2023 =
* Improved compatibility with PHP 8.

= 1.1.0 - Sep 07 2022 =
* Appointment Booking plugin updated to version 1.13.0.
* Added support for WooCommerce plugin.
* Minor style improvements.

= 1.0.4 - Jun 20 2022 =
* Minor bugfixes and improvements.

= 1.0.3 - Jun 16 2022 =
* Minor bugfixes and improvements.

= 1.0.2 - Jun 15 2022 =
* Minor bugfixes and improvements.

= 1.0.1 - Jun 14 2022 =
* Minor style improvements.

= 1.0.0 - Jun 09 2022 =
* Initial release

== Credits ==

* Based on Underscores https://underscores.me/, (C) 2012-2020 Automattic, Inc., [GPLv2 or later](https://www.gnu.org/licenses/gpl-2.0.html)
* normalize.css https://necolas.github.io/normalize.css/, (C) 2012-2018 Nicolas Gallagher and Jonathan Neal, [MIT](https://opensource.org/licenses/MIT)
