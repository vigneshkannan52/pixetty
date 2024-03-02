=== Appointment Booking ===
Contributors: MotoPress
Donate link: https://motopress.com/
Tags: appointment
Requires at least: 5.3
Tested up to: 6.4
Requires PHP: 7.0
Stable tag: trunk
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

MotoPress Appointment Booking makes it easy for time and service-based businesses to accept bookings and appointments online.

== Description ==

MotoPress Appointment Booking makes it easy for time and service-based businesses to accept bookings and appointments online.

== Installation ==

1. Upload the Appointment Booking plugin to the /wp-content/plugins/ directory.
2. Activate the plugin through the 'Plugins' menu in WordPress.

== Copyright ==

Appointment Booking plugin, Copyright (C) 2020, MotoPress https://motopress.com/
Appointment Booking plugin is distributed under the terms of the GNU GPL.

== Changelog ==

= 1.21.0, Nov 23 2023 =
* Added the "Analytics" page to display your key business metrics.
* Added RTL support for emails.
* Improved the calendar page in the admin dashboard.

= 1.20.0, Oct 23 2023 =
* Added the ability to filter bookings by date, service, location, employee.
* Added the ability to export bookings data in a CSV file.

= 1.19.2, Oct 9 2023 =
* Fixed an issue that appeared in version 1.19.1 and caused errors with service bookings.
* Fixed an issue with sending notifications that appeared in version 1.18.0.

= 1.19.1, Sep 26 2023 =
* Fixed an issue where the 'Show items' option was not displaying correctly in the Appointment form widget.
* Fixed an issue of potential overbooking.
* Fixed an issue of displaying an appointment form in Divi.
* Fixed an issue involving the unauthorized use of discount coupons.
* Improvement: Only published posts (Service categories, Services, Employees, Locations) can be displayed in the appointment form.
* Improved compatibility with WordPress 6.2+.
* Improved translation and localization files by adding text string locations.

= 1.19.0, Sep 4 2023 =
* Improved the UX of the booking form customization through the WordPress block editor and shortcode settings.
* Improved the display of available slots in the calendar for customers by implementing instant redirection to months with available slots.
* Improved filtering capabilities across all booking form fields, such as Service Category, Service, Location, and Employee.
* Integrated the option to showcase a booking form with pre-selected fields, facilitating bookings for specific individual services, categories, locations, or employees.
* Added Advanced settings functionality, enabling the addition of custom Anchor and Class attributes to blocks associated with the Appointment Booking plugin.
* Expanded Reservation tags with a new {reservation_clients_number} tag for utilization in email notifications.
* Fixed a PHP warning occurring on the customer account page.
* Fixed a PHP warning related to the Employee list block and mpa_employees_list shortcode.
* Fixed a browser warning that arose while editing input text fields in the Appointment Booking blocks’ settings.
* Fixed a link for viewing all booking payments on WordPress multisite.
* Fixed a deprecated PHP warning on pages containing Divi modules associated with Appointment Booking.
* Removed Divi assets from enqueueing when Divi is deactivated.

= 1.18.1, Jul 14 2023 =
* Refactored and improved legacy code of payment gateways.
* Fixed an issue with updating timeslots in the appointment booking form when the user selects a different service.
* Fixed the wrong phone validation that occurred right after loading the customer info step in the appointment booking form.
* Fixed the transparent background of the booking info popup in the admin calendar.
* Fixed the incorrect display of the start day of the week right after loading the admin calendar.

= 1.18.0, Jun 14 2023 =
* Added the user area for customers that allows them to log in, view bookings and speed up reservations with pre-populated info at checkout. Website admins can set the plugin to create a user account automatically or let customers opt for its creation.

= 1.17.2, Jun 2 2023 =
* Fixed an issue with applying coupons in the booking confirmation mode without a payment.
* Removed deprecated code of integration with the Elementor plugin.

= 1.17.1, May 31 2023 =
* Fixed an incorrect price calculation for services with minimum and maximum capacity greater than 1.
* Fixed an issue with employee contacts not being shown in the employee shortcodes.

= 1.17.0, May 4 2023 =
* Added the ability to send SMS notifications via Twilio. An extra extension is required.

= 1.16.0, Mar 10 2023 =
* Added the ability to pay using Apple Pay, Google Pay and Link via Stripe.
* Fixed compatibility issues of the Appointment Employee user role with WooCommerce.

= 1.15.2, Jan 20 2023 =
* Bug fix: fixed an issue with turning abandoned, canceled, and trashed bookings into available time slots.
* Bug fix: fixed an issue with time zones to avoid issues with booking available time slots.
* Bug fix: fixed an issue with the legacy widget for the Appointment booking form.
* Improvement: Made improvements for better compatibility with Elementor.
* Improvement: Categorized the email template tags and deleted deprecated ones.

= 1.15.1, Dec 7 2022 =
* Fixed an issue with displaying the G\hi time format in the booking form.

= 1.15.0, Nov 14 2022 =
* Added the ability to allow clients to cancel their bookings.
* Added new payment tags to the admin and customer email templates, which indicate the total booking price and the sum left to pay.
* Fixed a fatal error upon creating appointment notifications.
* Fixed an issue of blocking timeslots on the frontend that were not actually booked.
* Fixed an issue with a booking link inside the admin email.
* Fixed an issue with displaying the admin bookings calendar in WordPress 6.1.
* Fixed an issue with displaying a card number field at checkout.
* Fixed an issue with editing services in a booking on the admin backend.
* Fixed an issue of editing tags and categories for services in the block editor.

= 1.14.0, Sep 2 2022 =
* Added the ability to enable deposit online payments service-wise. Deposit-based bookings are added with the 'Confirmed' status to the list of reservations.
* Improved the interface of the admin bookings calendar:
  * Added more booking details to the individual booking pop-up.
  * Added the ability to choose which weekday displays as the first one in the calendar.
* Improved the security of payment processing via the website.
* Bug fixed: fixed an issue with applying coupon codes of the 100% discount value.

= 1.13.0, Aug 2 2022 =
* Added the ability to send automated email notifications in a certain time frame before and after the appointment.

= 1.12.0, Jun 24 2022 =
* Code improvements for the ability to add new payment gateways.

= 1.11.0, May 13 2022 =
* Added the ability to create and apply coupon codes.
* Enhanced the bookings calendar interface on the backend.
* Fixed a timezone issue.

= 1.10.2, May 3 2022 =
* Added the ability to designate Time Before Booking (a minimum period of time before the appointment when customers can submit a booking request) up to 31 days.
* Added the ability to display a mandatory "terms and conditions" consent checkbox for the user before they can pay / reserve the appointment.
* Added the ability for clients to add notes when placing a booking. Admins can also record notes on the backend.
* Added the browser history synchronization with the booking calendar filters in the admin dashboard.
* Reduced size of the Google Calendar library code to increase the loading speed of the plugin.
* Fixed an issue of using quotes in the HTML email templates.
* Fixed an issue of incorrect displaying of images uploaded to the email templates.
* Fixed an issue of overwriting Reservation Details in email templates through the settings.

= 1.10.1, Mar 31 2022 =
* Added the ability to duplicate Employee and Schedule.
* Fixed the issue of undelivered emails for bookings placed via the admin dashboard.

= 1.10.0, Mar 25 2022 =
* Added the ability to synchronize bookings with an employee's Google Calendar.

= 1.9.0, Mar 17 2022 =
* Added the ability to edit existing bookings.

= 1.8.1, Mar 16 2022 =
* Bug fix: fixed the plugin error that appeared in version 1.8.0.

= 1.8.0, Mar 14 2022 =
* Added the calendar view for bookings.

= 1.7.0, Feb 15 2022 =
* Added the new Appointment Manager and Appointment Employee user roles that define access to the Appointment Booking plugin settings and menus. Note: after you updated the plugin to this version, you might need to change user roles.

= 1.6.3, Jan 6 2022 =
* Fixed the booking issue.

= 1.6.2, Jan 5 2022 =
* Added the ability for admins to view and create log messages when editing bookings and payments.
* Removed the payment options step from the booking wizard for clients who book free services.
* Added the ability for clients to book more services right away after they completed their first reservation.
* Added support for WordPress 5.8.

= 1.6.1, Dec 28 2021 =
* Bug fix: fixed missing files in the previous version.

= 1.6.0, Dec 17 2021 =
* Added the ability to receive payments through the PayPal gateway.
* Bug fix: fixed an issue when one employee with multiple assigned services could have been booked for the same time.

= 1.5.0, Dec 2 2021 =
* Added the ability to receive payments through Stripe, Direct Bank Transfer and Pay on Arrival gateways. Note: default email notification templates were updated to support payments, you might want to check them out.
* Added more appointment booking form customization options: the ability to change the booking form title, the number of columns in a timepicker, and choose to show or hide the appointment end time.

= 1.4.1, Jul 28 2021 =
* Updated translation files.

= 1.4.0, Jul 20 2021 =
* Added the Multibooking option. It enables your clients to add several services to cart, thus reserve more than one appointment at one go. Note: default email notification templates were updated to support multiservice booking, you might want to check them out.
* Improved the Appointment Booking widgets' customization experience in Divi and Elementor.

= 1.3.1, Jun 11 2021 =
* Added the service capacity settings: now you can set the min and max number of people per one service allowing a client to book an appointment for a group of people.
* Fixed an issue with applying search filters incorrectly in the appointment booking form in Safari.

= 1.3.0, May 26 2021 =
* Added integration with popular builders: Elementor, the block editor (Gutenberg), and Divi. This will allow you to add and edit appointment forms and blocks visually with drag and drop.

= 1.2.2, May 13 2021 =
* Fixed an issue with including days off and custom working days in the Appointment Form.
* Fixed an issue with including service variations.

= 1.2.1, Apr 21 2021 =
* Improved 'Any' values support for the Location and Employee fields in the Appointment Form.
* Improved field filters for the Appointment Form shortcode.
* Added datepicker localization for 50+ languages.
* Fixed an issue with the translations support on the frontend.

= 1.2.0, Mar 29 2021 =
* Added 15 new Appointment form shortcode parameters to help you customize the process of selecting a service: default values, the ability to rename form labels and edit texts, and the ability to remove unneeded form fields.
* Added 12 new shortcodes: a list of employees, locations, services, and service categories; plus, 8 single-employee shortcodes that will help you build up a single employee page.
* Added a dedicated page for customizing major shortcodes, where you can edit shortcode parameters of the Appointment form and lists and save them for further use.
* Added 3 new blocks for an Employee: Contact Information, Social Networks and Additional Information.
* Improved the view of the shortcodes list on the Help page. Added all the new shortcodes and their parameters.
* Improved the Appointment Form shortcode: the Next button is always visible, while invalid inputs are highlighted once the button is clicked.

= 1.1.0, Dec 24 2020 =
* Added the ability to set a Default appointment status (Confirmed or Pending) for newly created bookings.
* Added the Shortcodes page with shortcodes and their descriptions.
* Added the ability to send client and admin email notifications associated with bookings.

= 1.0.0, Nov 26 2020 =
* Initial release.
