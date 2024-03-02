(function (wp_i18n) {
	'use strict';

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	const attributes$c = {
	  form_title: {
	    type: 'string',
	    default: ''
	  },
	  show_category: {
	    type: 'boolean',
	    default: true
	  },
	  show_service: {
	    type: 'boolean',
	    default: true
	  },
	  show_location: {
	    type: 'boolean',
	    default: true
	  },
	  show_employee: {
	    type: 'boolean',
	    default: true
	  },
	  label_category: {
	    type: 'string',
	    default: ''
	  },
	  label_service: {
	    type: 'string',
	    default: ''
	  },
	  label_location: {
	    type: 'string',
	    default: ''
	  },
	  label_employee: {
	    type: 'string',
	    default: ''
	  },
	  label_unselected: {
	    type: 'string',
	    default: ''
	  },
	  label_option: {
	    type: 'string',
	    default: ''
	  },
	  default_category: {
	    type: 'string',
	    default: ''
	  },
	  default_service: {
	    type: 'string',
	    default: ''
	  },
	  default_location: {
	    type: 'string',
	    default: ''
	  },
	  default_employee: {
	    type: 'string',
	    default: ''
	  },
	  timepicker_columns: {
	    type: 'number',
	    default: 3
	  },
	  show_timepicker_end_time: {
	    type: 'boolean',
	    default: false
	  }
	};

	/**
	 * @abstract
	 *
	 * @since 1.0
	 */
	class AbstractEntity {
	  /**
	   * @param {Number} id
	   * @param {Object} properties Optional.
	   *
	   * @since 1.0
	   */
	  constructor(id, properties = {}) {
	    this.id = id;
	    this.setupProperties();
	    this.setupValues(properties);
	  }

	  /**
	   * @access protected
	   *
	   * @since 1.0
	   */
	  setupProperties() {}

	  /**
	   * @param {Object} properties
	   *
	   * @access protected
	   *
	   * @since 1.0
	   */
	  setupValues(properties) {
	    for (let property in properties) {
	      this[property] = properties[property];
	    }
	  }

	  /**
	   * @return {Number}
	   *
	   * @since 1.11.0
	   */
	  getId() {
	    return this.id;
	  }
	}

	/**
	 * Draft version just to present employee as an object in some code.
	 *
	 * @since 1.4.0
	 */
	class Employee extends AbstractEntity {
	  /**
	   * @since 1.4.0
	   * @access protected
	   */
	  setupProperties() {
	    super.setupProperties();
	    this.name = '';
	  }
	}

	/**
	 * Draft version just to present location as an object in some code.
	 *
	 * @since 1.4.0
	 */
	class Location extends AbstractEntity {
	  /**
	   * @since 1.4.0
	   * @access protected
	   */
	  setupProperties() {
	    super.setupProperties();
	    this.name = '';
	  }
	}

	/**
	 * @param {Array} array
	 * @return {Array}
	 *
	 * @since 1.0
	 */
	function mpa_array_unique(array) {
	  let unique = array.filter((value, index, self) => {
	    return self.indexOf(value) === index;
	  });
	  return unique;
	}

	/**
	 * @param {Array} array1
	 * @param {Array} array2
	 * @return {Array}
	 *
	 * @since 1.2.1
	 */
	function mpa_array_intersect(array1, array2) {
	  return array1.filter(value => array2.indexOf(value) != -1);
	}

	/**
	 * @since 1.4.0
	 *
	 * @param {Array} keys
	 * @param {Array} values
	 * @return {Object}
	 */
	function mpa_array_combine(keys, values) {
	  let size = Math.min(keys.length, values.length);
	  let object = {};
	  for (let i = 0; i < size; i++) {
	    object[keys[i]] = values[i];
	  }
	  return object;
	}

	/**
	 * @since 1.4.0
	 *
	 * @param {Number} start
	 * @param {Number} end
	 * @param {Number} step Optional. 1 by default.
	 * @return {Array} An array of numbers from <code>start</code> to <code>end</code>
	 *		with step <code>step</code>.
	 */
	function mpa_array_range(start, end, step = 1) {
	  let validStep = step || 1; // No 0
	  let length = Math.abs(Math.floor((end - start) / validStep)) + 1;
	  let range = [...Array(length).keys()].map(i => i * step + start);
	  return range;
	}

	/**
	 * @since 1.0
	 */
	class Service extends AbstractEntity {
	  /**
	   * @since 1.0
	   * @access protected
	   */
	  setupProperties() {
	    // Declare only the required minimum for methods. Still get all fields
	    // from REST requests
	    super.setupProperties();
	    this.name = '';
	    this.price = 0;

	    /**
	     *  @since 1.14.0
	     *  string disabled|fixed|percentage
	     */
	    this.depositType = 'disabled';
	    /**
	     *  @since 1.14.0
	     */
	    this.depositAmount = 0;
	    this.duration = 0; // Minutes

	    this.bufferTimeBefore = 0; // Minutes
	    this.bufferTimeAfter = 0; // Minutes
	    this.timeBeforeBooking = 0; // Minutes

	    this.minCapacity = 1;
	    this.maxCapacity = 1;
	    this.multiplyPrice = false;
	    this.variations = {}; // {Employee ID: {employee, price, duration, min_capacity, max_capacity}}

	    /** @since 1.4.0 */
	    this.image = '';

	    /** @since 1.4.0 */
	    this.thumbnail = '';
	  }

	  /**
	   * @since 1.0
	   * @since 1.3.1 added the <code>capacity</code> argument.
	   *
	   * @param {Number} employeeId Optional. 0 by default.
	   * @param {Number} capacity Optional. 0 by default (minimum capacity of the
	   *     service).
	   * @return {Number}
	   */
	  getPrice(employeeId = 0, capacity = 0) {
	    if (!capacity) {
	      capacity = this.minCapacity;
	    }
	    let price = this.getVariation('price', employeeId, this.price);
	    if (this.multiplyPrice) {
	      price *= capacity;
	    }
	    return price;
	  }

	  /**
	   * @since 1.0
	   *
	   * @param {Number} employeeId Optional.
	   * @return {Number}
	   */
	  getDuration(employeeId = 0) {
	    return this.getVariation('duration', employeeId, this.duration);
	  }

	  /**
	   * @since 1.3.1
	   *
	   * @param {Number} employeeId Optional.
	   * @return {Number}
	   */
	  getMinCapacity(employeeId = 0) {
	    return this.getVariation('min_capacity', employeeId, this.minCapacity);
	  }

	  /**
	   * @since 1.3.1
	   *
	   * @param {Number} employeeId Optional.
	   * @return {Number}
	   */
	  getMaxCapacity(employeeId = 0) {
	    return this.getVariation('max_capacity', employeeId, this.maxCapacity);
	  }

	  /**
	   * @since 1.9.0
	   *
	   * @param {Number} employeeId Optional.
	   * @return {Number[]}
	   */
	  getCapacityRange(employeeId = 0) {
	    let minCapacity = this.getMinCapacity(employeeId);
	    let maxCapacity = this.getMaxCapacity(employeeId);
	    return mpa_array_range(minCapacity, maxCapacity);
	  }

	  /**
	   * @since 1.3.1
	   *
	   * @param {Number} employeeId Optional.
	   * @return {Number} The maximum number of guests in range [0; ∞).
	   *
	   * @todo Not used. Remove after implementing the Events feature.
	   */
	  getMaxGuests(employeeId = 0) {
	    let maxCapacity = this.getMaxCapacity(employeeId);
	    let minCapacity = this.getMinCapacity(employeeId);
	    let maxGuests = maxCapacity - minCapacity;
	    return Math.max(0, maxGuests);
	  }

	  /**
	   * @since 1.3.1
	   * @access protected
	   *
	   * @param {String} field
	   * @param {Number} employeeId
	   * @param {*} defaultValue
	   * @return {*}
	   */
	  getVariation(field, employeeId, defaultValue) {
	    if (employeeId in this.variations) {
	      return this.variations[employeeId][field];
	    } else {
	      return defaultValue;
	    }
	  }
	}

	/**
	 * @since 1.4.0
	 */
	class EntityUtils {
	  /**
	   * @since 1.4.0
	   *
	   * @param {AbstractEntity} entity
	   * @param {AbstractRepository} repository
	   * @param {Boolean} forceReload Optional. False by default.
	   * @return {Promise}
	   */
	  static loadInBackground(entity, repository, forceReload = false) {
	    return repository.findById(entity.id, forceReload).then(loadedEntity => {
	      // If got real result (not null)...
	      if (loadedEntity !== null) {
	        // ... then copy all property values to existing entity
	        for (let property in loadedEntity) {
	          entity[property] = loadedEntity[property];
	        }
	      }
	      return loadedEntity;
	    });
	  }
	}

	let namespace = '/motopress/appointment/v1';

	/**
	 * @param {String} route
	 * @param {Object} args Optional.
	 * @param {String} type Optional. 'GET' by default.
	 * @return {Promise}
	 *
	 * @since 1.0
	 */
	function mpa_rest_request(route, args = {}, type = 'GET') {
	  return new Promise((resolve, reject) => {
	    wp.apiRequest({
	      path: namespace + route,
	      type: type,
	      data: args
	    })
	    // Convert jqXHR object into Promise
	    .done(responseData => resolve(responseData)).fail((request, statusText) => {
	      let message = 'parsererror'; // Default response for PHP error

	      // Get error message
	      if (request.responseJSON && request.responseJSON.message) {
	        message = request.responseJSON.message;
	      } else {
	        message = `Status: ${statusText}`;
	      }
	      if (message == 'parsererror') {
	        message = 'REST request failed. Maybe PHP error on the server side. Check PHP logs.';
	      }
	      reject(new Error(message));
	    });
	  });
	}

	/**
	 * @param {String} route
	 * @param {Object} args Optional.
	 * @return {Promise}
	 *
	 * @since 1.0
	 */
	function mpa_rest_get(route, args = {}) {
	  return mpa_rest_request(route, args, 'GET');
	}

	/**
	 * @param {String} route
	 * @param {Object} args
	 * @return {Promise}
	 *
	 * @since 1.0
	 */
	function mpa_rest_post(route, args) {
	  return mpa_rest_request(route, args, 'POST');
	}

	/**
	 * @since 1.0
	 */
	class Settings {
	  /**
	   * @since 1.0
	   */
	  constructor() {
	    this.settings = this.getDefaults();
	    this.loadingPromise = this.load();
	  }

	  /**
	   * @since 1.0
	   *
	   * @access protected
	   *
	   * @return {Object}
	   */
	  getDefaults() {
	    return {
	      plugin_name: 'Appointment Booking',
	      // No translation required
	      today: '2030-01-01',
	      business_name: '',
	      default_time_step: 30,
	      default_booking_status: 'confirmed',
	      confirmation_mode: 'auto',
	      terms_page_id_for_acceptance: 0,
	      allow_multibooking: false,
	      allow_coupons: false,
	      allow_customer_account_creation: false,
	      country: '',
	      currency: 'EUR',
	      currency_symbol: '&euro;',
	      currency_position: 'before',
	      decimal_separator: '.',
	      thousand_separator: ',',
	      number_of_decimals: 2,
	      date_format: 'F j, Y',
	      time_format: 'H:i',
	      week_starts_on: 0,
	      thumbnail_size: {
	        width: 150,
	        height: 150
	      },
	      flatpickr_locale: 'en',
	      enable_payments: false,
	      active_gateways: [],
	      payment_received_page_url: '',
	      failed_transaction_page_url: '',
	      default_payment_gateway: ''
	    };
	  }

	  /**
	   * @return {Promise}
	   *
	   * @access protected
	   *
	   * @since 1.0
	   */
	  load() {
	    return new Promise((resolve, reject) => {
	      mpa_rest_get('/settings').then(responseData => this.settings = responseData, error => console.error('Unable to load public settings.', error)).finally(() => resolve(this.settings));
	    });
	  }

	  /**
	   * @return {Promise}
	   *
	   * @since 1.0
	   */
	  ready() {
	    return this.loadingPromise;
	  }

	  /**
	   * @since 1.5.0
	   *
	   * @return {String}
	   */
	  getPluginName() {
	    return this.settings.plugin_name;
	  }

	  /**
	   * @since 1.11.0
	   *
	   * @return {String} 'Y-m-d'
	   */
	  getBusinessDate() {
	    return this.settings.today;
	  }

	  /**
	   * @return {String}
	   */
	  getBusinessName() {
	    return this.settings.business_name;
	  }

	  /**
	   * @return {Number} Step for time slots (in minutes).
	   *
	   * @since 1.0
	   */
	  getTimeStep() {
	    return this.settings.default_time_step;
	  }

	  /**
	   * @return {String} 'pending' or 'confirmed'.
	   *
	   * @since 1.1.0
	   */
	  getDefaultBookingStatus() {
	    return this.settings.default_booking_status;
	  }

	  /**
	   * @since 1.5.0
	   * @return {String} auto|manual|payment
	   */
	  getConfirmationMode() {
	    return this.settings.confirmation_mode;
	  }

	  /**
	   * @since 1.10.2
	   * @return {Integer} 0 | page id
	   */
	  getTermsPageIdForAcceptance() {
	    return this.settings.terms_page_id_for_acceptance;
	  }

	  /**
	   * @since 1.4.0
	   *
	   * @return {Boolean}
	   */
	  isMultibookingEnabled() {
	    return this.settings.allow_multibooking;
	  }

	  /**
	   * @since 1.11.0
	   *
	   * @return {Boolean}
	   */
	  isCouponsEnabled() {
	    return this.settings.allow_coupons;
	  }

	  /**
	   * @since 1.18.0
	   *
	   * @return {Boolean}
	   */
	  isAllowCustomerAccountCreation() {
	    return this.settings.allow_customer_account_creation;
	  }

	  /**
	   * @since 1.5.0
	   *
	   * @return {String}
	   */
	  getCountry() {
	    return this.settings.country;
	  }

	  /**
	   * @return {String} Currency code, like "EUR".
	   *
	   * @since 1.0
	   */
	  getCurrency() {
	    return this.settings.currency;
	  }

	  /**
	   * @return {String}
	   *
	   * @since 1.0
	   */
	  getCurrencySymbol() {
	    return this.settings.currency_symbol;
	  }

	  /**
	   * @return {String}
	   *
	   * @since 1.0
	   */
	  getCurrencyPosition() {
	    return this.settings.currency_position;
	  }

	  /**
	   * @return {String}
	   *
	   * @since 1.0
	   */
	  getDecimalSeparator() {
	    return this.settings.decimal_separator;
	  }

	  /**
	   * @return {String}
	   *
	   * @since 1.0
	   */
	  getThousandSeparator() {
	    return this.settings.thousand_separator;
	  }

	  /**
	   * @return {Number}
	   *
	   * @since 1.0
	   */
	  getDecimalsCount() {
	    return this.settings.number_of_decimals;
	  }

	  /**
	   * @return {String}
	   *
	   * @since 1.0
	   */
	  getDateFormat() {
	    return this.settings.date_format;
	  }

	  /**
	   * @return {String}
	   *
	   * @since 1.0
	   */
	  getTimeFormat() {
	    return this.settings.time_format;
	  }

	  /**
	   * @return {Number}
	   *
	   * @since 1.0
	   */
	  getFirstDayOfWeek() {
	    return this.settings.week_starts_on;
	  }

	  /**
	   * @since 1.4.0
	   *
	   * @return {Object} {width, height}
	   */
	  getThumbnailSize() {
	    return this.settings.thumbnail_size;
	  }

	  /**
	   * @return {String}
	   *
	   * @since 1.2.1
	   */
	  getFlatpickrLocale() {
	    return this.settings.flatpickr_locale;
	  }

	  /**
	   * @since 1.5.0
	   *
	   * @return {Boolean}
	   */
	  isPaymentsEnabled() {
	    return this.settings.enable_payments;
	  }

	  /**
	   * @since 1.5.0
	   *
	   * @return {String[]}
	   */
	  getActiveGateways() {
	    return this.settings.active_gateways;
	  }

	  /**
	   * @since 1.5.0
	   *
	   * @return {String}
	   */
	  getPaymentReceivedPageUrl() {
	    return this.settings.payment_received_page_url;
	  }

	  /**
	   * @since 1.5.0
	   *
	   * @return {String}
	   */
	  getFailedTransactionPageUrl() {
	    return this.settings.failed_transaction_page_url;
	  }

	  /**
	   * @since 1.6.2
	   *
	   * @return {String}
	   */
	  getDefaultPaymentGateway() {
	    return this.settings.default_payment_gateway;
	  }
	}

	/**
	 * @since 1.0
	 */
	class Plugin {
	  /**
	   * @since 1.0
	   */
	  constructor() {
	    this.settingsCtrl = new Settings();
	    this.loadingPromise = this.load();
	  }

	  /**
	   * @return {Promise}
	   *
	   * @since 1.0
	   */
	  load() {
	    return Promise.all([this.settingsCtrl.ready()]).then(() => this);
	  }

	  /**
	   * @return {Promise}
	   *
	   * @since 1.0
	   */
	  ready() {
	    return this.loadingPromise;
	  }

	  /**
	   * @since 1.0
	   */
	  settings() {
	    return this.settingsCtrl;
	  }

	  /**
	   * @since 1.0
	   */
	  static getInstance() {
	    if (Plugin.instance == undefined) {
	      Plugin.instance = new Plugin();
	    }
	    return Plugin.instance;
	  }
	}

	/**
	 * @return {Plugin}
	 *
	 * @since 1.0
	 */
	function mpapp() {
	  return Plugin.getInstance();
	}

	const localTranslate = (text, domain = '') => text;
	const localTranslateWithContext = (text, context, domain = '') => text;
	const localSprintf = (format, ...args) => {
	  let argIndex = 0;
	  return format.replace(/%([sdf])/g, (match, specifier) => {
	    if (argIndex >= args.length) return match;
	    let value = args[argIndex++];
	    switch (specifier) {
	      case 's':
	        return String(value);
	      case 'd':
	        return parseInt(value, 10);
	      case 'f':
	        return parseFloat(value);
	      default:
	        return match;
	    }
	  });
	};
	const __ = typeof wp !== 'undefined' && wp.i18n && wp.i18n.__ ? wp.i18n.__ : localTranslate;
	const _x = typeof wp !== 'undefined' && wp.i18n && wp.i18n._x ? wp.i18n._x : localTranslateWithContext;
	typeof wp !== 'undefined' && wp.i18n && wp.i18n.sprintf ? wp.i18n.sprintf : localSprintf;

	const locale = {
	  weekdays: {
	    shorthand: [__('Sun', 'motopress-appointment'), __('Mon', 'motopress-appointment'), __('Tue', 'motopress-appointment'), __('Wed', 'motopress-appointment'), __('Thu', 'motopress-appointment'), __('Fri', 'motopress-appointment'), __('Sat', 'motopress-appointment')],
	    longhand: [__('Sunday', 'motopress-appointment'), __('Monday', 'motopress-appointment'), __('Tuesday', 'motopress-appointment'), __('Wednesday', 'motopress-appointment'), __('Thursday', 'motopress-appointment'), __('Friday', 'motopress-appointment'), __('Saturday', 'motopress-appointment')]
	  },
	  months: {
	    shorthand: [__('Jan', 'motopress-appointment'), __('Feb', 'motopress-appointment'), __('Mar', 'motopress-appointment'), __('Apr', 'motopress-appointment'),
	    // Translators: Month name (short variant, like "Apr").
	    _x('May', 'Month (short)', 'motopress-appointment'), __('Jun', 'motopress-appointment'), __('Jul', 'motopress-appointment'), __('Aug', 'motopress-appointment'), __('Sep', 'motopress-appointment'), __('Oct', 'motopress-appointment'), __('Nov', 'motopress-appointment'), __('Dec', 'motopress-appointment')],
	    longhand: [__('January', 'motopress-appointment'), __('February', 'motopress-appointment'), __('March', 'motopress-appointment'), __('April', 'motopress-appointment'), _x('May', 'Month', 'motopress-appointment'), __('June', 'motopress-appointment'), __('July', 'motopress-appointment'), __('August', 'motopress-appointment'), __('September', 'motopress-appointment'), __('October', 'motopress-appointment'), __('November', 'motopress-appointment'), __('December', 'motopress-appointment')]
	  },
	  amPM: ['AM', 'PM'],
	  firstDayOfWeek: mpapp().settings().getFirstDayOfWeek()
	};

	/**
	 * @return {String}
	 *
	 * @since 1.0
	 */
	function mpa_date_format() {
	  return mpapp().settings().getDateFormat();
	}

	/**
	 * Based on Flatpickr's formatDate().
	 *
	 * @see Flatpickr.formatDate(): https://github.com/flatpickr/flatpickr/blob/master/src/utils/formatting.ts
	 * @see PHP date formatting tokens: https://www.php.net/manual/en/datetime.format.php
	 *
	 * @param {Date|String} date
	 * @param {String} Optional. 'public', 'internal' ('Y-m-d') or custom date
	 *     format. 'public' by default.
	 * @return {String}
	 *
	 * @since 1.0
	 */
	function mpa_format_date(date, format = 'public') {
	  if (typeof date == 'string') {
	    return date; // Already stringified
	  }

	  if (format == 'internal') {
	    return mpa_format_date(date, 'Y-m-d');
	  } else if (format == 'public') {
	    return mpa_format_date(date, mpa_date_format());
	  }

	  // Handle custom date format
	  let pad = (number, length = 2) => {
	    // Use at least two zeros for a padding to support milliseconds
	    return ('00' + number).slice(-length);
	  };

	  // Go through the each symbol
	  let isSlashed = false;
	  let dateString = format.split('').map(char => {
	    // Handle slashes '\'
	    if (isSlashed) {
	      isSlashed = false;
	      return char;
	    }

	    // Handle any other symbols
	    switch (char) {
	      // Handle slashes '\'
	      case '\\':
	        isSlashed = true;
	        return '';
	      // Day
	      case 'j':
	        // 1 to 31
	        return date.getDate();
	      case 'd':
	        // 01 to 31
	        return pad(date.getDate());
	      case 'D':
	        // Mon through Sun
	        return locale.weekdays.shorthand[date.getDay()];
	      case 'l':
	        // Monday through Sunday
	        return locale.weekdays.longhand[date.getDay()];
	      case 'N':
	        // 1 (Monday) to 7 (Sunday)
	        return date.getDay() || 7;
	      case 'w':
	        // 0 (Sunday) to 6 (Saturday)
	        return date.getDay();
	      case 'z':
	        // 0 to 365
	        // Thanks to Alex Turpin https://stackoverflow.com/a/8619946
	        let yearStart = new Date(date.getFullYear(), 0, 1);

	        // Compensate daylight savings time
	        let timezoneOffset = yearStart.getTimezoneOffset() - date.getTimezoneOffset();
	        let diffMilliseconds = date - yearStart + timezoneOffset * 60 * 1000;
	        let millisecondsInDay = 1000 * 60 * 60 * 24;
	        return Math.floor(diffMilliseconds / millisecondsInDay);

	      // Week
	      case 'W':
	        // 1 to 52
	        // Thanks to RobG https://stackoverflow.com/a/6117889
	        // Don't modify the original date
	        let cloneDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
	        // Use 7 as a day number for Sunday
	        let currentDay = cloneDate.getUTCDay() || 7;
	        // Set to nearest Thursday: %current date% + 4 - %current day%
	        cloneDate.setUTCDate(cloneDate.getUTCDate() + 4 - currentDay);
	        // Get the first day of the year
	        let utcYear = new Date(Date.UTC(cloneDate.getUTCFullYear(), 0, 1));
	        // Calculate full weeks to nearest Thursday
	        let oneDayMs = 1000 * 60 * 60 * 24;
	        let weekNo = Math.ceil(((cloneDate - utcYear) / oneDayMs + 1) / 7);
	        return weekNo;

	      // Month
	      case 'F':
	        // January through December
	        return locale.months.longhand[date.getMonth()];
	      case 'M':
	        // Jan through Dec
	        return locale.months.shorthand[date.getMonth()];
	      case 'm':
	        // 01 to 12
	        return pad(date.getMonth() + 1);
	      case 'n':
	        // 1 to 12
	        return date.getMonth() + 1;
	      case 't':
	        // 28 to 31
	        // Here is a trick. The days are 1-based. So when we pass 0 as a day number
	        // then JS Date object goes a day before (the last day of the previous month).
	        // So that's how it works: we select the 0-day of the next month and then go
	        // to the last day of the previous (required) month
	        let lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
	        return lastDate.getDate();

	      // Year
	      case 'Y':
	        // Examples: 1999 or 2003
	        return date.getFullYear();
	      case 'y':
	        // Examples: 99 or 03
	        return String(date.getFullYear()).substring(2);
	      case 'L':
	        // 1 (it's a leap year) or 0 (otherwise)
	        return date.getFullYear() % 4 == 0 ? 1 : 0;

	      // Time
	      case 'A':
	        // AM or PM
	        return locale.amPM[date.getHours() > 11 ? 1 : 0];
	      case 'a':
	        // am or pm
	        return locale.amPM[date.getHours() > 11 ? 1 : 0].toLowerCase();
	      case 'H':
	        // Hours, 00 to 23
	        return pad(date.getHours());
	      case 'h':
	        // Hours, 01 to 12
	        return pad(date.getHours() % 12 || 12);
	      case 'G':
	        // Hours, 0 to 23
	        return date.getHours();
	      case 'g':
	        // Hours, 1 to 12
	        return date.getHours() % 12 || 12;
	      case 'i':
	        // Minutes, 00 to 59
	        return pad(date.getMinutes());
	      case 's':
	        // Seconds, 00 to 59
	        return pad(date.getSeconds());
	      case 'v':
	        // Milliseconds, 000 to 999
	        return pad(date.getMilliseconds(), 3);
	      case 'u':
	        // Microseconds, 000000 to 999999
	        return pad(date.getMilliseconds(), 3) + '000';
	      // Partial support

	      // Timezone
	      case 'O': // +0200
	      case 'P':
	        // +02:00
	        let offset = -date.getTimezoneOffset();
	        let sign = offset >= 0 ? '+' : '-';
	        let hours = Math.floor(Math.abs(offset) / 60);
	        let minutes = Math.abs(offset) % 60;
	        let separator = char == 'O' ? '' : ':';
	        return sign + pad(hours) + separator + pad(minutes);
	      case 'Z':
	        // Offset in seconds, -43200 to 50400
	        return date.getTimezoneOffset() * 60;

	      // Full date/time
	      case 'U':
	        // Seconds since the Unix Epoch (January 1 1970 00:00:00 GMT)
	        return Math.floor(date.getTime() / 1000);
	      case 'c':
	        // ISO 8601 date, like: 2004-02-12T15:19:21+00:00

	        // date.toISOString() will return the string with the suffix
	        // '.065Z' (milliseconds) instead of '+02:00'
	        return mpa_format_date(date, 'Y-m-d\\TH:i:sP');
	      case 'r':
	        // RFC 2822 date, like: Thu, 21 Dec 2000 16:01:07 +0200

	        // date.toUTCString() will return the string with the timezone
	        // identifier suffix (GMT) instead of '+0200'
	        return mpa_format_date(date, 'D, d M Y H:i:s O');

	      // Not supported
	      case 'S': // Ordinal suffix, like: st, nd, rd or th
	      case 'o': // ISO-8601 week-numbering year (examples: 1999 or 2003)
	      case 'B': // Swatch Internet time
	      case 'e': // Timezone identifier, like: UTC, GMT or Atlantic/Azores
	      case 'T': // Timezone abbreviation, like: EST, MDT, etc.
	      case 'I':
	        // Whether or not the date is in daylight saving time
	        return '';

	      // Undefined
	      default:
	        return char;
	    } // switch (char)
	  }) // Map each symbol
	  .join('');
	  return dateString;
	}

	/**
	 * @param {String} dateString Only the internal format is acceptable - 'Y-m-d'.
	 * @return {Date|null}
	 *
	 * @since 1.0
	 * @since 1.11.0 returns null if the date string is invalid.
	 */
	function mpa_parse_date(dateString) {
	  let date = dateString.match(mpa_validate_date_pattern());
	  if (date != null) {
	    let year = parseInt(date[1]);
	    let month = parseInt(date[2]);
	    let day = parseInt(date[3]);
	    return new Date(year, month - 1, day);
	  } else {
	    return null;
	  }
	}

	/**
	 * @return {RegExp}
	 *
	 * @since 1.0
	 */
	function mpa_validate_date_pattern() {
	  return /(\d{4})-(\d{2})-(\d{2})/;
	}

	/**
	 * @return {Date}
	 *
	 * @since 1.0
	 */
	function mpa_today() {
	  let today = new Date();
	  today.setHours(0, 0, 0, 0);
	  return today;
	}

	/**
	 * @since 1.11.0
	 */
	class Coupon extends AbstractEntity {
	  setupProperties() {
	    super.setupProperties();
	    this.status = 'new';
	    this.code = '';
	    this.description = '';
	    this.type = 'fixed';
	    this.amount = 0;
	    this.expirationDate = null;
	    this.serviceIds = [];
	    this.minDate = null;
	    this.maxDate = null;
	    this.usageLimit = 0;
	    this.usageCount = 0;
	  }

	  /**
	   * @access protected
	   *
	   * @param {Object} properties
	   */
	  setupValues(properties) {
	    // Parse dates
	    for (let dateProperty of ['expirationDate', 'minDate', 'maxDate']) {
	      let dateValue = properties[dateProperty];
	      if (dateValue != null && dateValue !== '') {
	        this[dateProperty] = mpa_parse_date(dateValue);
	      }
	      delete properties[dateProperty];
	    }

	    // Set up other properties
	    super.setupValues(properties);
	  }

	  /**
	   * @return {String}
	   */
	  getCode() {
	    return this.code;
	  }

	  /**
	   * @param {Cart} cart
	   * @return {Boolean}
	   */
	  isApplicableForCart(cart) {
	    let isApplicable = false;
	    cart.items.forEach(cartItem => {
	      if (this.isApplicableForCartItem(cartItem)) {
	        isApplicable = true;
	        return false; // Stop the cycle
	      }
	    });

	    return isApplicable;
	  }

	  /**
	   * @param {CartItem} cartItem
	   * @return {Boolean}
	   */
	  isApplicableForCartItem(cartItem) {
	    if (!cartItem.isSet()) {
	      return false;
	    }
	    if (this.serviceIds.length > 0 && this.serviceIds.indexOf(cartItem.service.id) == -1) {
	      return false;
	    }
	    if (this.minDate != null && cartItem.date < this.minDate) {
	      return false;
	    }
	    if (this.maxDate != null && cartItem.date > this.maxDate) {
	      return false;
	    }

	    // Applicable
	    return true;
	  }

	  /**
	   * @param {Cart} cart
	   * @return {Number}
	   */
	  calcDiscountAmount(cart) {
	    let discountPrice = this.calcDiscountForCart(cart);
	    return Math.min(discountPrice, cart.getSubtotalPrice());
	  }

	  /**
	   * @access protected
	   *
	   * @param {Cart} cart
	   * @return {Number}
	   */
	  calcDiscountForCart(cart) {
	    let discount = 0;
	    cart.items.forEach(cartItem => {
	      discount += this.calcDiscountForCartItem(cartItem);
	    });
	    return discount;
	  }

	  /**
	   * @access protected
	   *
	   * @param {CartItem} cartItem
	   * @return {Number}
	   */
	  calcDiscountForCartItem(cartItem) {
	    let discountPrice = 0;
	    if (this.isApplicableForCartItem(cartItem)) {
	      let itemPrice = cartItem.getPrice();
	      switch (this.type) {
	        case 'fixed':
	          discountPrice = this.amount;
	          break;
	        case 'percentage':
	          discountPrice = itemPrice * this.amount / 100;
	          break;
	      }

	      // Don't exceed with amount > 100%
	      discountPrice = Math.min(discountPrice, itemPrice);
	    }
	    return discountPrice;
	  }
	}

	/**
	 * @param {Number} number
	 * @param {Number} decimals
	 * @param {String} decimalSeparator
	 * @param {String} thousandsSeparator
	 * @return {String}
	 *
	 * @since 1.0
	 */
	function mpa_number_format(number, decimals = 0, decimalSeparator = '.', thousandsSeparator = ',') {
	  // + Original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
	  // + Improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	  // +   Bugfix by: Michael White (http://crestidg.com)
	  let sign = '',
	    i,
	    j,
	    kw,
	    kd,
	    km;
	  if (number < 0) {
	    sign = '-';
	    number *= -1;
	  }
	  i = parseInt(number = (+number || 0).toFixed(decimals)) + '';
	  if ((j = i.length) > 3) {
	    j = j % 3;
	  } else {
	    j = 0;
	  }
	  km = j ? i.substr(0, j) + thousandsSeparator : '';
	  kw = i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousandsSeparator);
	  kd = decimals ? decimalSeparator + Math.abs(number - i).toFixed(decimals).replace(/-/, 0).slice(2) : '';
	  return sign + km + kw + kd;
	}

	/**
	 * @param {String} string
	 * @return {String}
	 *
	 * @since 1.0
	 */
	function mpa_unprefix(string) {
	  if (string.indexOf('mpa_') === 0) {
	    return string.substring(4); // Remove the public prefix
	  } else if (string.indexOf('_mpa_') === 0) {
	    return string.substring(5); // Remove the private prefix
	  } else {
	    return string; // Already without the prefix
	  }
	}

	/**
	 * Will trim '5.00' to '5', but leave '5.50' as is.
	 *
	 * @param {String} price
	 * @param {String} decimalSeparator Optional. Decimal separator from settings by
	 *     default.
	 * @return {String}
	 *
	 * @since 1.0
	 */
	function mpa_trim_price(price, decimalSeparator = null) {
	  if (decimalSeparator == null) {
	    decimalSeparator = mpapp().settings().getDecimalSeparator();
	  }
	  let regex = new RegExp('\\' + decimalSeparator + '0+$'); // /\.0+$/
	  price = price.replace(regex, '');
	  return price;
	}

	/**
	 * @param {*} value
	 * @return {Boolean}
	 *
	 * @since 1.2
	 */
	function mpa_boolval(value) {
	  return !!value;
	}

	/**
	 * @param {*} value
	 * @return {Number}
	 *
	 * @since 1.2
	 */
	function mpa_intval(value) {
	  let intValue = parseInt(value);
	  if (!isNaN(intValue)) {
	    return intValue;
	  } else {
	    return value << 0;
	  }
	}

	/**
	 * @since 1.3.1
	 *
	 * @param {Number} number
	 * @param {Number} min
	 * @param {Number} max
	 * @return {Number} The number in range [min; max].
	 */
	function mpa_limit(number, min, max) {
	  return Math.max(min, Math.min(number, max));
	}

	/**
	 * @abstract
	 *
	 * @since 1.0
	 */
	class AbstractRepository {
	  /**
	   * @since 1.0
	   */
	  constructor(postType) {
	    this.postType = postType;
	    this.entityType = mpa_unprefix(postType);
	    this.savedEntities = {}; // {Entity ID: Entity instance}
	  }

	  /**
	   * @param {Number} id
	   * @param {Boolean} forceReload Optional. False by default.
	   * @return {Promise}
	   *
	   * @since 1.0
	   */
	  findById(id, forceReload = false) {
	    if (!id) {
	      return Promise.resolve(null);
	    } else if (!forceReload && this.haveEntity(id) && this.getEntity(id) != null) {
	      return Promise.resolve(this.getEntity(id));
	    }
	    return this.requestEntity(id).then(entityData => {
	      let entity = this.mapRestDataToEntity(entityData);

	      // Save the most actual result
	      this.saveEntity(id, entity);
	      return entity;
	    }, error => {
	      // Rewrite the last result, even if entity == null
	      this.saveEntity(id, null);
	      return null;
	    });
	  }

	  /**
	   * @param {Number[]} ids
	   * @param {Boolean} forceReload
	   * @return {AbstractEntity[])
	   */
	  findAll(ids, forceReload = false) {
	    let loadIds = [];
	    let entities = [];
	    for (let id of ids) {
	      if (this.haveEntity(id) && !forceReload) {
	        entities.push(this.getEntity(id));
	      } else {
	        loadIds.push(id);
	      }
	    }
	    if (loadIds.length === 0) {
	      return Promise.resolve(entities);
	    }
	    return this.requestEntities(loadIds).then(rawEntities => {
	      for (let rawEntity of rawEntities) {
	        let entity = this.mapRestDataToEntity(rawEntity);
	        this.saveEntity(entity.id, entity);
	        entities.push(entity);
	      }
	      return entities;
	    }, error => []);
	  }

	  /**
	   * @param {Number} id
	   * @return {Promise}
	   *
	   * @access protected
	   *
	   * @since 1.0
	   */
	  requestEntity(id) {
	    return mpa_rest_get(this.getRoute(), {
	      id
	    });
	  }

	  /**
	   * @access protected
	   *
	   * @param {Number[]} ids
	   * @return {Promise}
	   */
	  requestEntities(ids) {
	    return mpa_rest_get(this.getRoute(), {
	      id: ids
	    });
	  }

	  /**
	   * @access protected
	   *
	   * @param {Number} id
	   * @return {Boolean}
	   */
	  haveEntity(id) {
	    return id in this.savedEntities;
	  }

	  /**
	   * @access protected
	   *
	   * @param {Number} id
	   * @return {AbstractEntity|null}
	   */
	  getEntity(id) {
	    return this.savedEntities[id] || null;
	  }

	  /**
	   * @param {Number} id
	   * @param {AbstractEntity|Null} entity
	   *
	   * @access protected
	   *
	   * @since 1.0
	   */
	  saveEntity(id, entity) {
	    this.savedEntities[id] = entity;
	  }

	  /**
	   * @abstract
	   *
	   * @param {Object} entityData
	   * @return {AbstractEntity}
	   *
	   * @access protected
	   *
	   * @since 1.0
	   */
	  mapRestDataToEntity(entityData) {
	    return null;
	  }

	  /**
	   * @return {String}
	   *
	   * @since 1.0
	   */
	  getRoute() {
	    return `/${this.entityType}s`; // '/services'
	  }
	}

	/**
	 * @since 1.11.0
	 */
	class CouponRepository extends AbstractRepository {
	  /**
	   * @return {Promise} Coupon or null|Error.
	   */
	  findByCode(couponCode, suppressErrors = false) {
	    return mpa_rest_get(this.getRoute(), {
	      code: couponCode
	    }).then(couponData => {
	      let coupon = this.mapRestDataToEntity(couponData);

	      // Save the most actual result
	      this.saveEntity(coupon.getId(), coupon);
	      return coupon;
	    }, error => {
	      if (!suppressErrors) {
	        throw error;
	      } else {
	        return null;
	      }
	    });
	  }

	  /**
	   * @param {Object} entityData
	   * @return {Coupon}
	   *
	   * @access protected
	   */
	  mapRestDataToEntity(entityData) {
	    return new Coupon(entityData.id, entityData);
	  }
	}

	/**
	 * @param {Date|String} time
	 * @param {String} format Optional. 'public', 'internal' ('H:i') or custom time
	 *     format. 'public' by default.
	 * @return {String}
	 *
	 * @since 1.0
	 */
	function mpa_format_time(time, format = 'public') {
	  if (format == 'internal') {
	    return mpa_format_date(time, 'H:i');
	  } else if (format == 'public') {
	    return mpa_format_date(time, mpa_time_format());
	  } else {
	    return mpa_format_date(time, format);
	  }
	}

	/**
	 * @param {String} timeString Only the internal format is acceptable - 'H:i'
	 *     (the function will not check if the format is OK).
	 * @return {Date}
	 *
	 * @since 1.0
	 */
	function mpa_parse_time(timeString) {
	  let time = timeString.split(':');
	  let hours = parseInt(time[0]);
	  let minutes = parseInt(time[1]);
	  let date = mpa_today();
	  date.setHours(hours, minutes);
	  return date;
	}

	/**
	 * Public time format, set in Settings > General.
	 *
	 * @return {String}
	 *
	 * @since 1.0
	 */
	function mpa_time_format() {
	  return mpapp().settings().getTimeFormat();
	}

	/**
	 * @param {Number} serviceId
	 * @param {Date} fromDate
	 * @param {Date} toDate
	 * @param {Object} args Optional.
	 *     @param {Number[]} args['employees']   Optional. Limited list of employee IDs.
	 *     @param {Number[]} args['locations']   Optional. Limited list of location IDs.
	 *     @param {String}   args['exclude']     Optional. Items to exclude in the format of the cart items.
	 * @return {Promise} <code>{'Y-m-d' => {Time period string => Array of [Employee ID, Location ID]}}</code>
	 *
	 * @since 1.2.1
	 */
	function mpa_time_slots(serviceId, fromDate, toDate, args) {
	  // Build new args object for REST API
	  let restArgs = {
	    service_id: serviceId,
	    employees: args['employees'] ? args['employees'].join(',') : '',
	    locations: args['locations'] ? args['locations'].join(',') : '',
	    from_date: mpa_format_date(fromDate, 'internal'),
	    to_date: mpa_format_date(toDate, 'internal'),
	    format: 'full',
	    exclude: args['exclude'] ? args['exclude'] : [],
	    since_today: 'since_today' in args ? args['since_today'] : true
	  };

	  // Request time slots
	  return mpa_rest_get('/calendar/time', restArgs).catch(error => console.error('Failed to make time slots in mpa_time_slots().', error.message) || {});
	}

	/**
	 * @since 1.0
	 */
	class TimePeriod {
	  /**
	   * @param {Date|String} timeOrPeriod
	   * @param {Date|String|Null} endTime
	   *
	   * @since 1.0
	   */
	  constructor(timeOrPeriod, endTime = null) {
	    this.setupProperties();
	    if (endTime == null) {
	      this.parsePeriod(timeOrPeriod);
	    } else {
	      this.setStartTime(timeOrPeriod);
	      this.setEndTime(endTime);
	    }
	  }

	  /**
	   * @access protected
	   *
	   * @since 1.0
	   */
	  setupProperties() {
	    this.startTime = null; // Date
	    this.endTime = null; // Date
	  }

	  /**
	   * @param {String} period
	   *
	   * @since 1.0
	   */
	  parsePeriod(period) {
	    // Explode '08:00 - 14:00' into ['08:00', '14:00']
	    let time = period.split(' - ');
	    this.setStartTime(time[0]);
	    this.setEndTime(time[1]);
	  }

	  /**
	   * @param {String|Number} startTime
	   *
	   * @since 1.0
	   */
	  setStartTime(startTime) {
	    this.startTime = this.convertToTime(startTime);
	  }

	  /**
	   * @param {String|Number} endTime
	   *
	   * @since 1.0
	   */
	  setEndTime(endTime) {
	    this.endTime = this.convertToTime(endTime);
	  }

	  /**
	   * @param {Date|String} input
	   * @return {Date}
	   *
	   * @access protected
	   *
	   * @since 1.0
	   */
	  convertToTime(input) {
	    if (typeof input == 'string') {
	      return mpa_parse_time(input);
	    } else {
	      return new Date(input); // Clone
	    }
	  }

	  /**
	   * @param {Date} date
	   *
	   * @since 1.0
	   */
	  setDate(date) {
	    this.startTime.setFullYear(date.getFullYear());
	    this.startTime.setMonth(date.getMonth(), date.getDate());
	    this.endTime.setFullYear(date.getFullYear());
	    this.endTime.setMonth(date.getMonth(), date.getDate());
	  }

	  /**
	   * @param {TimePeriod} period
	   * @return {Boolean}
	   *
	   * @since 1.0
	   */
	  intersectsWith(period) {
	    return this.startTime < period.endTime && this.endTime > period.startTime;
	  }

	  /**
	   * @param {TimePeriod} period
	   * @return {Boolean}
	   *
	   * @since 1.0
	   */
	  isSubperiodOf(period) {
	    return this.startTime >= period.startTime && this.endTime <= period.endTime;
	  }

	  /**
	   * @param {TimePeriod} period
	   *
	   * @since 1.0
	   */
	  mergePeriod(period) {
	    this.startTime.setTime(Math.min(this.startTime.getTime(), period.startTime.getTime()));
	    this.endTime.setTime(Math.max(this.endTime.getTime(), period.endTime.getTime()));
	  }

	  /**
	   * @param {TimePeriod} period
	   *
	   * @since 1.0
	   */
	  diffPeriod(period) {
	    if (this.startTime < period.startTime) {
	      this.endTime.setTime(Math.min(period.startTime.getTime(), this.endTime.getTime()));
	    } else {
	      this.startTime.setTime(Math.max(period.endTime.getTime(), this.startTime.getTime()));
	    }
	  }

	  /**
	   * @param {TimePeriod} period Must be subperiod of the current object.
	   * @return {TimePeriod[]}
	   *
	   * @since 1.0
	   */
	  splitByPeriod(period) {
	    let split = [];
	    if (period.startTime.getTime() - this.startTime.getTime() > 0) {
	      split.push(new TimePeriod(this.startTime, period.startTime));
	    }
	    if (this.endTime.getTime() - period.endTime.getTime() > 0) {
	      split.push(new TimePeriod(period.endTime, this.endTime));
	    }
	    return split;
	  }

	  /**
	   * @return {Boolean}
	   *
	   * @since 1.0
	   */
	  isEmpty() {
	    return this.endTime.getTime() - this.startTime.getTime() <= 0;
	  }

	  /**
	   * @param {String} format Optional. 'public', 'short', 'internal' or custom
	   *     time format. 'public' by default.
	   * @param {String} glue Optional. ' - ' by default.
	   * @return {String}
	   *
	   * @since 1.0
	   */
	  toString(format = 'public', glue = ' - ') {
	    // Force glue ' - ' for internal values
	    if (format == 'internal') {
	      glue = ' - ';
	    }

	    // mpa_format_time() does not support format 'short'
	    let timeFormat = format == 'short' ? 'public' : format;
	    let startTime = mpa_format_time(this.startTime, timeFormat);
	    let endTime = mpa_format_time(this.endTime, timeFormat);
	    if (format == 'short' && startTime == endTime) {
	      return startTime;
	    } else {
	      return startTime + glue + endTime;
	    }
	  }
	}

	/**
	 * @since 1.0
	 */
	class Reservation extends AbstractEntity {
	  /**
	   * @access protected
	   *
	   * @since 1.0
	   */
	  setupProperties() {
	    // Declare only the required minimum for methods. Still get all fields
	    // from REST requests
	    super.setupProperties();
	    this.serviceId = 0;
	    this.date = null; // Date

	    this.serviceTime = null; // TimePeriod
	    this.bufferTime = null; // TimePeriod
	  }

	  /**
	   * @param {Object} properties
	   *
	   * @access protected
	   *
	   * @since 1.0
	   */
	  setupValues(properties) {
	    for (let property in properties) {
	      if (property == 'date') {
	        this.setDate(properties[property]);
	      } else if (property == 'serviceTime') {
	        this.setServiceTime(properties[property]);
	      } else if (property == 'bufferTime') {
	        this.setBufferTime(properties[property]);
	      } else {
	        this[property] = properties[property];
	      }
	    }
	  }

	  /**
	   * @param {Date|String} date
	   *
	   * @since 1.0
	   */
	  setDate(date) {
	    if (typeof date == 'string') {
	      this.date = mpa_parse_date(date);
	    } else {
	      this.date = date;
	    }
	    if (this.serviceTime != null) {
	      this.serviceTime.setDate(this.date);
	    }
	    if (this.bufferTime != null) {
	      this.bufferTime.setDate(this.date);
	    }
	  }

	  /**
	   * @param {TimePeriod|String} serviceTime
	   *
	   * @since 1.0
	   */
	  setServiceTime(serviceTime) {
	    if (typeof serviceTime == 'string') {
	      this.serviceTime = new TimePeriod(serviceTime);
	    } else {
	      this.serviceTime = serviceTime;
	    }
	    if (this.date != null) {
	      this.serviceTime.setDate(this.date);
	    }
	  }

	  /**
	   * @param {TimePeriod|String} bufferTime
	   *
	   * @since 1.0
	   */
	  setBufferTime(bufferTime) {
	    if (typeof bufferTime == 'string') {
	      this.bufferTime = new TimePeriod(bufferTime);
	    } else {
	      this.bufferTime = bufferTime;
	    }
	    if (this.date != null) {
	      this.bufferTime.setDate(this.date);
	    }
	  }
	}

	/**
	 * @since 1.0
	 */
	class ReservationRepository extends AbstractRepository {
	  /**
	   * @param {Number} serviceId
	   * @param {Object} args Optional.
	   *     @param {Date|String} args['from_date']
	   *     @param {Date|String} args['to_date']
	   * @return {Promise}
	   *
	   * @since 1.0
	   */
	  findAllByService(serviceId, args = {}) {
	    let restArgs = {
	      service_id: serviceId
	    };

	    // Add date range
	    if (args.from_date != undefined) {
	      restArgs['from_date'] = mpa_format_date(args.from_date, 'internal');
	    }
	    if (args.to_date != undefined) {
	      restArgs['to_date'] = mpa_format_date(args.to_date, 'internal');
	    }

	    // Request reservations
	    let findPromise = mpa_rest_get('/bookings/reservations', restArgs)

	    // Save entities
	    .then(reservations => {
	      let entities = [];
	      for (let reservation of reservations) {
	        let entity = this.mapRestDataToEntity(reservation);

	        // Save entities
	        this.saveEntity(entity.id, entity);
	        entities.push(entity);
	      }
	      return entities;
	    })

	    // Log error
	    .catch(error => {
	      console.error('No reservations found.', error.message);
	      return []; // Always return array
	    });

	    return findPromise;
	  }

	  /**
	   * @param {Object} entityData
	   * @return {Reservation}
	   *
	   * @access protected
	   *
	   * @since 1.0
	   */
	  mapRestDataToEntity(entityData) {
	    return new Reservation(entityData.id, entityData);
	  }
	}

	/**
	 * @since 1.0
	 */
	class DatePeriod {
	  /**
	   * @param {Date|String} dateOrPeriod
	   * @param {Date|String|Null} endDate
	   *
	   * @since 1.0
	   */
	  constructor(dateOrPeriod, endDate = null) {
	    this.setupProperties();
	    if (endDate == null) {
	      this.parsePeriod(dateOrPeriod);
	    } else {
	      this.setStartDate(dateOrPeriod);
	      this.setEndDate(endDate);
	    }
	  }

	  /**
	   * @access protected
	   *
	   * @since 1.0
	   */
	  setupProperties() {
	    this.startDate = null; // Date
	    this.endDate = null; // Date
	  }

	  /**
	   * @param {String} period
	   *
	   * @access protected
	   *
	   * @since 1.0
	   */
	  parsePeriod(period) {
	    // Explode '2020-01-25 - 2020-02-10' into ['2020-01-25', '2020-02-10']
	    let dates = period.split(' - ');
	    this.setStartDate(dates[0]);
	    this.setEndDate(dates[1]);
	  }

	  /**
	   * @param {String|Date} startDate
	   *
	   * @since 1.0
	   */
	  setStartDate(startDate) {
	    this.startDate = this.convertToDate(startDate);
	  }

	  /**
	   * @param {String|Date} endDate
	   *
	   * @since 1.0
	   */
	  setEndDate(endDate) {
	    this.endDate = this.convertToDate(endDate);
	  }

	  /**
	   * @param {Date|String} input
	   * @return {Date}
	   *
	   * @access protected
	   *
	   * @since 1.0
	   */
	  convertToDate(input) {
	    if (typeof input == 'string') {
	      return mpa_parse_date(input) || mpa_today();
	    } else {
	      return new Date(input); // Clone
	    }
	  }

	  /**
	   * @return {Number}
	   *
	   * @since 1.0
	   */
	  calcDays() {
	    let diff = this.endDate.getTime() - this.startDate.getTime();

	    // Convert milliseconds to days
	    let days = Math.round(diff / 1000 / 3600 / 24); // Remember: both dates have time 00:00:00.000,
	    // so the math function is not so important

	    return days;
	  }

	  /**
	   * @param {Date|String} date
	   * @return {Boolean}
	   *
	   * @since 1.0
	   */
	  inPeriod(date) {
	    if (typeof date == 'string') {
	      date = mpa_parse_date(date);
	    }
	    return date != null && date >= this.startDate && date <= this.endDate;
	  }

	  /**
	   * @return {Object} {"Y-m-d" date string: Date}
	   *
	   * @since 1.0
	   */
	  splitToDates() {
	    let dates = {};
	    for (let date = new Date(this.startDate); date <= this.endDate; date.setDate(date.getDate() + 1)) {
	      let dateString = mpa_format_date(date, 'internal');
	      let dateClone = new Date(date);
	      dates[dateString] = dateClone;
	    }
	    return dates;
	  }

	  /**
	   * @return {String}
	   *
	   * @since 1.0
	   */
	  toString() {
	    return mpa_format_date(this.startDate, 'internal') + ' - ' + mpa_format_date(this.endDate, 'internal');
	  }
	}

	/**
	 * @since 1.0
	 */
	class Schedule extends AbstractEntity {
	  /**
	   * @access protected
	   *
	   * @since 1.0
	   */
	  setupProperties() {
	    // Declare only the required minimum for methods. Still get all fields
	    // from REST requests
	    super.setupProperties();
	    this.timetable = []; // [Day index: array of {time_period, location, activity}]
	    this.workTimetable = []; // [Day index: array of {time_period, location}]
	    this.customWorkdays = []; // Array of {date_period, time_period}
	    this.daysOff = {}; // {"Y-m-d" date string: Date}
	  }

	  /**
	   * @param {Object} properties
	   *
	   * @access protected
	   *
	   * @since 1.0
	   */
	  setupValues(properties) {
	    for (let property in properties) {
	      if (property == 'timetable') {
	        this.setTimetable(properties[property]);
	      } else if (property == 'customWorkdays') {
	        this.setCustomWorkdays(properties[property]);
	      } else if (property == 'daysOff') {
	        this.setDaysOff(properties[property]);
	      } else {
	        this[property] = properties[property];
	      }
	    }
	  }

	  /**
	   * @param {Array} timetable [Day index: array of {time_period, location, activity}].
	   *
	   * @since 1.0
	   */
	  setTimetable(timetable) {
	    this.timetable = [];
	    this.workTimetable = [];

	    // For each day of a week
	    timetable.forEach(periods => {
	      let dayPeriods = [];
	      let workPeriods = [];

	      // Add periods to current day
	      periods.forEach(period => {
	        let timePeriod = new TimePeriod(period['time_period']);

	        // Add period to general list
	        dayPeriods.push({
	          time_period: timePeriod,
	          location: period['location'],
	          activity: period['activity']
	        });

	        // Add period to working list
	        if (period['activity'] == 'work') {
	          workPeriods.push({
	            time_period: timePeriod,
	            location: period['location']
	          });
	        }
	      });

	      // Save day periods
	      this.timetable.push(dayPeriods);
	      this.workTimetable.push(workPeriods);
	    });
	  }

	  /**
	   * @param {Array} customWorkdays Array of {date_period, time_period}.
	   *
	   * @since 1.0
	   */
	  setCustomWorkdays(customWorkdays) {
	    this.customWorkdays = [];
	    for (let period of customWorkdays) {
	      this.customWorkdays.push({
	        date_period: new DatePeriod(period['date_period']),
	        time_period: new TimePeriod(period['time_period'])
	      });
	    }
	  }

	  /**
	   * @param {String[]} daysOff
	   *
	   * @since 1.0
	   */
	  setDaysOff(daysOff) {
	    this.daysOff = {};

	    // For each date period
	    for (let dayOff of daysOff) {
	      let datePeriod = new DatePeriod(dayOff);
	      let datesInPeriod = datePeriod.splitToDates();
	      jQuery.extend(this.daysOff, datesInPeriod);
	    }
	  }

	  /**
	   * @param {Date|String} date
	   * @return {Boolean}
	   *
	   * @since 1.0
	   */
	  isDayOff(date) {
	    if (typeof date != 'string') {
	      date = mpa_format_date(date, 'internal');
	    }
	    return date in this.daysOff;
	  }

	  /**
	   * @param {Date|String} date
	   * @param {Number} locationId Optional.
	   * @return {TimePeriod[]}
	   *
	   * @since 1.0
	   */
	  getWorkingHours(date, locationId = 0) {
	    // Check the days off first
	    if (this.isDayOff(date)) {
	      return [];
	    }

	    // Convert date string to Date object
	    if (typeof date == 'string') {
	      date = mpa_parse_date(date);
	    }
	    if (date == null) {
	      return [];
	    }

	    // First, get time periods from the timetable
	    let timePeriods = [];
	    let dayOfWeek = date.getDay(); // 0-6 (Sunday-Saturday)

	    for (let period of this.workTimetable[dayOfWeek]) {
	      // Filter by location ID
	      if (locationId == 0 || period['location'] == locationId) {
	        timePeriods.push(period['time_period']);
	      }
	    }

	    // Second, add custom workdays no matter the location
	    for (let period of this.customWorkdays) {
	      if (period['date_period'].inPeriod(date)) {
	        timePeriods.push(period['time_period']);
	      }
	    }
	    return timePeriods;
	  }
	}

	/**
	 * @since 1.0
	 */
	class ScheduleRepository extends AbstractRepository {
	  /**
	   * @param {Object} entityData
	   * @return {Schedule}
	   *
	   * @access protected
	   *
	   * @since 1.0
	   */
	  mapRestDataToEntity(entityData) {
	    return new Schedule(entityData.id, entityData);
	  }
	}

	/**
	 * @since 1.0
	 */
	class ServiceRepository extends AbstractRepository {
	  /**
	   * @param {Object} entityData
	   * @return {Service}
	   *
	   * @access protected
	   *
	   * @since 1.0
	   */
	  mapRestDataToEntity(entityData) {
	    return new Service(entityData.id, entityData);
	  }
	}

	/**
	 * @since 1.0
	 */
	class RepositoriesContainer {
	  /**
	   * @since 1.0
	   */
	  constructor() {
	    this.repositories = {};
	  }

	  /**
	   * @return {ScheduleRepository}
	   *
	   * @since 1.0
	   */
	  schedule() {
	    if (this.repositories['schedule'] == undefined) {
	      this.repositories['schedule'] = new ScheduleRepository('mpa_schedule');
	    }
	    return this.repositories['schedule'];
	  }

	  /**
	   * @return {ServiceRepository}
	   *
	   * @since 1.0
	   */
	  service() {
	    if (this.repositories['service'] == undefined) {
	      this.repositories['service'] = new ServiceRepository('mpa_service');
	    }
	    return this.repositories['service'];
	  }

	  /**
	   * @return {ReservationRepository}
	   *
	   * @since 1.0
	   */
	  reservation() {
	    if (this.repositories['reservation'] == undefined) {
	      this.repositories['reservation'] = new ReservationRepository('mpa_reservation');
	    }
	    return this.repositories['reservation'];
	  }

	  /**
	   * @return {CouponRepository}
	   *
	   * @since 1.11.0
	   */
	  coupon() {
	    if (this.repositories['coupon'] == undefined) {
	      this.repositories['coupon'] = new CouponRepository('mpa_coupon');
	    }
	    return this.repositories['coupon'];
	  }

	  /**
	   * @return {CustomerRepository}
	   *
	   * @since 1.18.0
	   */
	  customer() {
	    if (this.repositories['customer'] === undefined) {
	      this.repositories['customer'] = new CustomerRepository();
	    }
	    return this.repositories['customer'];
	  }

	  /**
	  * @return {RepositoriesContainer}
	  *
	  * @since 1.0
	  */
	  static getInstance() {
	    if (RepositoriesContainer.instance == undefined) {
	      RepositoriesContainer.instance = new RepositoriesContainer();
	    }
	    return RepositoriesContainer.instance;
	  }
	}

	// Move repository functions to separate file to prevent a dependency cycle that
	// leads to an error "Cannot read property 'default' of undefined" on mpapp()


	/**
	 * @return {RepositoriesContainer}
	 *
	 * @since 1.0
	 */
	function mpa_repositories() {
	  return RepositoriesContainer.getInstance();
	}

	let extractedServices = null; // Promise

	/**
	 * @param {Boolean} forceReload Optional. False by default.
	 * @return {Promise}
	 *
	 * @since 1.0
	 */
	function mpa_extract_available_services(forceReload = false) {
	  if (forceReload || extractedServices == null) {
	    // Load available services
	    extractedServices = mpa_rest_get('/services/available').catch(error => {
	      console.error('Unable to extract available services.');
	      return {};
	    });
	  }
	  return extractedServices;
	}

	/**
	 * @since 1.4.0
	 *
	 * @param {*} value
	 * @return {Boolean}
	 */
	function mpa_filter_default(value) {
	  return mpa_boolval(value);
	}

	let globals = {};

	/**
	 * @param {*} value
	 * @param {Boolean} strict Optional. Don't count non-iterable types. False by
	 *     default.
	 * @return {Number}
	 *
	 * @since 1.0
	 */
	function mpa_count(value, strict = false) {
	  if (typeof value == 'object') {
	    if (Array.isArray(value)) {
	      return value.length;
	    } else {
	      return Object.keys(value).length;
	    }
	  } else {
	    return strict ? 0 : 1;
	  }
	}

	/**
	 * @param {*} value
	 * @param {Boolean} strict Optional. False by default.
	 * @return {Boolean}
	 *
	 * @since 1.0
	 */
	function mpa_empty(value, strict = false) {
	  if (typeof value == 'object') {
	    return mpa_count(value) == 0;
	  } else {
	    return strict ? true : !value;
	  }
	}

	/**
	 * @param {String} prefix Optional. '' by default.
	 * @param {Boolean} moreEntropy Optional. False by default.
	 * @return {String}
	 *
	 * @see https://locutus.io/php/misc/uniqid/
	 *
	 * @since 1.0
	 */
	function mpa_uniqid(prefix = '', moreEntropy = false) {
	  let mpa_format_seed = function (seed, requiredWidth) {
	    seed = parseInt(seed, 10).toString(16); // To hex string

	    if (requiredWidth < seed.length) {
	      // So long we split
	      return seed.slice(seed.length - requiredWidth);
	    } else if (requiredWidth > seed.length) {
	      // So short we pad
	      return Array(1 + (requiredWidth - seed.length)).join('0') + seed;
	    } else {
	      // Exact width
	      return seed;
	    }
	  };
	  if (!globals.uniqid_seed) {
	    // Init seed with big random int
	    globals.uniqid_seed = Math.floor(Math.random() * 0x75bcd15);
	  }
	  globals.uniqid_seed++;

	  // Start with prefix
	  let id = prefix;
	  // Add current milliseconds (hex string)
	  id += mpa_format_seed(parseInt(new Date().getTime() / 1000, 10), 8);
	  // Add seed hex string
	  id += mpa_format_seed(globals.uniqid_seed, 5);
	  if (moreEntropy) {
	    // For more entropy we add a float lowe to 10
	    id += (Math.random() * 10).toFixed(8).toString();
	  }
	  return id;
	}

	/**
	 * @since 1.4.0 (Replaced the class <code>BookingService</code>)
	 */
	class AvailabilityService {
	  /**
	   * @since 1.4.0
	   * @access protected
	   */
	  setupProperties() {
	    /**
	     * @since 1.4.0
	     * @var {Object}
	     * @access protected
	     * @see PHP function mpa_extract_available_services() to see the structure.
	     */
	    this.availability = {};

	    /**
	     * @since 1.4.0
	     * @var {Object} {Service ID: Service name}
	     */
	    this.services = {};

	    /**
	     * @since 1.4.0
	     * @var {Object} {Category slug: Category name}
	     */
	    this.serviceCategories = {};

	    /**
	     * @since 1.4.0
	     * @var {Object} {Employee ID: Employee name}
	     */
	    this.employees = {};

	    /**
	     * @since 1.4.0
	     * @var {Object} {Location ID: Location name}
	     */
	    this.locations = {};

	    /**
	     * @since 1.4.0
	     * @var {Promise}
	     * @access protected
	     */
	    this.readyPromise = null;
	  }

	  /**
	   * @since 1.4.0
	   *
	   * @param {Boolean} forceReload Optional. False by default.
	   */
	  constructor(forceReload = false) {
	    this.setupProperties();
	    this.readyPromise = mpa_extract_available_services(forceReload).then(availability => {
	      this.setAvailability(availability);
	      return this;
	    });
	  }

	  /**
	   * @since 1.4.0
	   * @access protected
	   *
	   * @param {Object} availability
	   */
	  setAvailability(availability) {
	    this.availability = availability;

	    // List available services, categories, employees and locations
	    for (let serviceId in availability) {
	      let service = availability[serviceId];

	      // List services
	      this.services[serviceId] = service.name;

	      // List categories
	      for (let categorySlug in service.categories) {
	        let categoryName = service.categories[categorySlug];
	        this.serviceCategories[categorySlug] = categoryName;
	      }

	      // List employees and locations
	      for (let employeeId in service.employees) {
	        let employee = service.employees[employeeId];

	        // List employees
	        this.employees[employeeId] = employee.name;

	        // List locations
	        for (let locationId in employee.locations) {
	          let locationName = employee.locations[locationId];
	          this.locations[locationId] = locationName;
	        }
	      }
	    }
	  }

	  /**
	   * @since 1.4.0
	   *
	   * @return {Boolean}
	   */
	  isEmpty() {
	    return mpa_empty(this.availability);
	  }

	  /**
	   * @since 1.4.0
	   *
	   * @return {Promise}
	   */
	  ready() {
	    return this.readyPromise;
	  }

	  /**
	   * @since 1.4.0
	   *
	   * @param {Number} serviceId
	   * @param {Boolean} load Optional. Load properties of the service. True by
	   *		default.
	   * @return {Service}
	   */
	  getService(serviceId, load = true, callbackAfterLoading = null) {
	    let service = new Service(serviceId);

	    // Set known values
	    if (this.services.hasOwnProperty(serviceId)) {
	      service.name = this.services[serviceId];
	    }

	    // Load all other properties
	    if (load === true) {
	      EntityUtils.loadInBackground(service, mpa_repositories().service()).then(callbackAfterLoading);
	    }
	    return service;
	  }

	  /**
	   * @param {Number} serviceId
	   * @returns {category slug: category name, ...}
	   */
	  getServiceCategories(serviceId) {
	    return this.availability[serviceId].categories;
	  }

	  /**
	   * @since 1.4.0
	   *
	   * @param {Number} employeeId
	   * @return {Employee}
	   */
	  getEmployee(employeeId) {
	    let employee = new Employee(employeeId);

	    // Set known values
	    if (this.employees.hasOwnProperty(employeeId)) {
	      employee.name = this.employees[employeeId];
	    }
	    return employee;
	  }

	  /**
	   * @since 1.4.0
	   *
	   * @param {Number} locationId
	   * @return {Location}
	   */
	  getLocation(locationId) {
	    let location = new Location(locationId);

	    // Set known values
	    if (this.locations.hasOwnProperty(locationId)) {
	      location.name = this.locations[locationId];
	    }
	    return location;
	  }

	  /**
	   * @since 1.4.0
	   * @since 1.19.0 param locationId
	   * @since 1.19.0 param employeeId
	   *
	   * @param {String} categorySlug Optional. '' by default (all categories).
	   * @param {Number} locationId Optional. 0 by default (all locations).
	   * @param {Number} employeeId Optional. 0 by default (all employees).
	   * @return {Object} {Service ID: Service name}
	   */
	  getAvailableServices(categorySlug = '', locationId = 0, employeeId = 0) {
	    let services = {};

	    // For each service
	    for (let serviceId in this.availability) {
	      let service = this.availability[serviceId];

	      // Filter by category
	      if (categorySlug !== '' && !(categorySlug in service.categories)) {
	        continue;
	      }

	      // Filter by location
	      if (locationId !== 0) {
	        let found = false;
	        Object.keys(service.employees).forEach(employeeIndex => {
	          if (service.employees[employeeIndex].locations.hasOwnProperty(locationId)) {
	            found = true;
	          }
	        });
	        if (!found) {
	          continue;
	        }
	      }

	      // Filter by employee
	      if (employeeId !== 0 && !(employeeId in service.employees)) {
	        continue;
	      }

	      // Add service
	      services[serviceId] = service.name;
	    }
	    return services;
	  }

	  /**
	   * @since 1.4.0
	   * @since 1.19.0 param serviceId
	   *
	   * @param {Number} serviceId Optional. 0 by default (all categories).
	   *
	   * @return {Object} {Category slug: Category name}
	   */
	  getAvailableServiceCategories(serviceId = 0) {
	    let categories = {};

	    // For each service
	    for (let offerId in this.availability) {
	      // Filter by service ID
	      if (serviceId != 0 && offerId != serviceId) {
	        continue;
	      }
	      let service = this.availability[offerId];

	      // Merge service categories
	      jQuery.extend(categories, service.categories);
	    }
	    return categories;
	  }

	  /**
	   * @since 1.4.0
	   * @since 1.19.0 param locationId
	   *
	   * @param {Number} serviceId Optional. 0 by default (all services).
	   * @param {Number} locationId Optional. 0 by default (all locations).
	   * @return {Object} {Employee ID: Employee name}
	   */
	  getAvailableEmployees(serviceId = 0, locationId = 0) {
	    let employees = {};

	    // For each service
	    for (let offerId in this.availability) {
	      // Filter by service ID
	      if (serviceId != 0 && offerId != serviceId) {
	        continue;
	      }
	      let service = this.availability[offerId];

	      // For each employee
	      for (let employeeId in service.employees) {
	        let employee = service.employees[employeeId];

	        // Filter by locationId
	        if (locationId !== 0 && !(locationId in employee.locations)) {
	          continue;
	        }

	        // Add employee
	        employees[employeeId] = employee.name;
	      }
	    }
	    return employees;
	  }

	  /**
	   * @since 1.4.0
	   *
	   * @param {Number} serviceId Optional. 0 by default (all services).
	   * @param {Number} employeeId Optional. 0 by default (all employees).
	   * @return {Object} {Location ID: Location name}
	   */
	  getAvailableLocations(serviceId = 0, employeeId = 0) {
	    let locations = {};

	    // For each service
	    for (let offerId in this.availability) {
	      // Filter by service ID
	      if (serviceId != 0 && offerId != serviceId) {
	        continue;
	      }
	      let service = this.availability[offerId];

	      // For each employee
	      for (let workerId in service.employees) {
	        // Filter by employee ID
	        if (employeeId != 0 && workerId != employeeId) {
	          continue;
	        }
	        let employee = service.employees[workerId];

	        // Merge locations
	        jQuery.extend(locations, employee.locations);
	      }
	    }
	    return locations;
	  }

	  /**
	   * @since 1.19.0
	   *
	   * @param {string} categorySlug
	   * @return boolean
	   */
	  isAvailableServiceCategory(categorySlug) {
	    return this.getAvailableServiceCategories().hasOwnProperty(categorySlug);
	  }

	  /**
	   * @since 1.19.0
	   *
	   * @param {Number} serviceId
	   * @return boolean
	   */
	  isAvailableService(serviceId) {
	    return this.getAvailableServices().hasOwnProperty(serviceId);
	  }

	  /**
	   * @since 1.19.0
	   *
	   * @param {Number} locationId
	   * @return boolean
	   */
	  isAvailableLocation(locationId) {
	    return this.getAvailableLocations().hasOwnProperty(locationId);
	  }

	  /**
	   * @since 1.19.0
	   *
	   * @param {Number} employeeId
	   * @return boolean
	   */
	  isAvailableEmployee(employeeId) {
	    return this.getAvailableEmployees().hasOwnProperty(employeeId);
	  }

	  /**
	   * @since 1.4.0
	   *
	   * @param {Number} serviceId
	   * @param {Number|Number[]} locationId Optional. One or move allowed location.
	   * @param {String} output Optional. ids|entities. 'ids' by default.
	   * @return {Array}
	   */
	  filterAvailableEmployees(serviceId, locationId = 0, output = 'ids') {
	    if (!(serviceId in this.availability)) {
	      // No such service in available services list
	      return [];
	    }

	    // Init allowed location IDs
	    let allowedLocations = [];
	    if (Array.isArray(locationId)) {
	      allowedLocations = locationId.filter(mpa_filter_default);
	    } else if (locationId !== 0) {
	      allowedLocations.push(locationId);
	    }

	    // Select all valid employee IDs
	    let employees = [];

	    // Filter #1: filter by service ID
	    for (let employeeId in this.availability[serviceId]['employees']) {
	      employeeId = mpa_intval(employeeId);
	      let employee = this.availability[serviceId]['employees'][employeeId];

	      // Filter #2: filter by location ID
	      if (allowedLocations.length === 0) {
	        // Any employee with any locations list is valid
	        employees.push(employeeId);
	      } else {
	        // Does employee have a valid location?
	        let employeeLocations = Object.keys(employee.locations).map(mpa_intval);
	        let allowedForEmployee = mpa_array_intersect(allowedLocations, employeeLocations);
	        if (allowedForEmployee.length > 0) {
	          employees.push(employeeId);
	        }
	      }
	    }

	    // Convert to proper output format
	    if (employees.length === 0) {
	      return [];
	    } else if (output === 'entities') {
	      return employees.map(employeeId => this.getEmployee(employeeId));
	    } else {
	      return employees;
	    }
	  }

	  /**
	   * @since 1.4.0
	   *
	   * @param {Number} serviceId
	   * @param {Number|Number[]} employeeId Optional. One or move allowed employee.
	   * @param {String} output Optional. ids|entities. 'ids' by default.
	   * @return {Array}
	   */
	  filterAvailableLocations(serviceId, employeeId = 0, output = 'ids') {
	    if (!(serviceId in this.availability)) {
	      // No such service in available services list
	      return [];
	    }

	    // Init allowed employee IDs
	    let allowedEmployees = [];
	    if (Array.isArray(employeeId)) {
	      allowedEmployees = employeeId.filter(mpa_filter_default);
	    } else if (employeeId !== 0) {
	      allowedEmployees.push(employeeId);
	    }

	    // Select all valid location IDs
	    let locations = [];

	    // Filter #1: filter by service ID
	    for (employeeId in this.availability[serviceId]['employees']) {
	      employeeId = mpa_intval(employeeId);

	      // Filter #2: filter by employee ID
	      if (allowedEmployees.length > 0 && allowedEmployees.indexOf(employeeId) === -1) {
	        continue;
	      }
	      let employee = this.availability[serviceId]['employees'][employeeId];

	      // Get all available location
	      for (let locationId in employee.locations) {
	        locations.push(mpa_intval(locationId));
	      }
	    }

	    // Filter duplicates
	    locations = mpa_array_unique(locations);

	    // Convert to proper output format
	    if (locations.length === 0) {
	      return [];
	    } else if (output === 'entities') {
	      return locations.map(locationId => this.getLocation(locationId));
	    } else {
	      return locations;
	    }
	  }
	}

	/**
	 * WordPress dependencies
	 */
	const {
	  Component: Component$p,
	  Fragment: Fragment$p
	} = wp.element;
	const {
	  SelectControl: SelectControl$4,
	  PanelBody: PanelBody$c,
	  TextControl: TextControl$c,
	  Tooltip,
	  ToggleControl: ToggleControl$4,
	  RangeControl: RangeControl$4
	} = wp.components;
	const {
	  InspectorControls: InspectorControls$c
	} = wp.blockEditor || wp.editor;

	/**
	 * Create an Inspector Controls
	 */
	let Inspector$c = class Inspector extends Component$p {
	  constructor() {
	    super();
	    this.availability = new AvailabilityService();

	    // Load all values for use in render
	    this.availability.ready().finally(() => {
	      this.availability.getAvailableServiceCategories();
	      this.availability.getAvailableServices();
	      this.availability.getAvailableEmployees();
	      this.availability.getAvailableLocations();
	    });
	  }
	  getSelectOptions(options, unselectedValue, unselectedLabel) {
	    let selectOptions = [{
	      'value': unselectedValue,
	      'label': unselectedLabel
	    }];
	    for (const key in options) {
	      let service = {};
	      service['value'] = key;
	      service['label'] = options[key];
	      selectOptions.push(service);
	    }
	    return selectOptions;
	  }
	  render() {
	    const {
	      form_title,
	      show_category,
	      show_service,
	      show_location,
	      show_employee,
	      label_category,
	      label_service,
	      label_location,
	      label_employee,
	      label_unselected,
	      label_option,
	      default_category,
	      default_service,
	      default_location,
	      default_employee,
	      timepicker_columns,
	      show_timepicker_end_time
	    } = this.props.attributes;
	    const {
	      setAttributes
	    } = this.props;
	    const serviceId = mpa_intval(default_service);
	    const employeeId = mpa_intval(default_employee);
	    const locationId = mpa_intval(default_location);
	    const selectedCategory = this.availability.isAvailableServiceCategory(default_category) ? default_category : '';
	    const selectedService = this.availability.isAvailableService(serviceId) ? serviceId : 0;
	    const selectedLocation = this.availability.isAvailableLocation(locationId) ? locationId : 0;
	    const selectedEmployee = this.availability.isAvailableEmployee(employeeId) ? employeeId : 0;
	    const getServiceCategories = this.availability.getAvailableServiceCategories(selectedService);
	    const getService = this.availability.getAvailableServices(selectedCategory, selectedLocation, selectedEmployee);
	    const getLocations = this.availability.getAvailableLocations(selectedService, selectedEmployee);
	    const getEmployees = this.availability.getAvailableEmployees(selectedService, selectedLocation);
	    const serviceCategoriesArr = this.getSelectOptions(getServiceCategories, '', wp_i18n.__('— Any —', 'motopress-appointment'));
	    const serviceArr = this.getSelectOptions(getService, 0, wp_i18n.__('— Unselected —', 'motopress-appointment'));
	    const locationsArr = this.getSelectOptions(getLocations, 0, wp_i18n.__('— Any —', 'motopress-appointment'));
	    const employeesArr = this.getSelectOptions(getEmployees, 0, wp_i18n.__('— Any —', 'motopress-appointment'));
	    const ShowServiceCategoryToggleControlComponent = wp.element.createElement(ToggleControl$4, {
	      label: wp_i18n.__('Show Category?', 'motopress-appointment'),
	      help: wp_i18n.__('Show the service category field in the form.', 'motopress-appointment'),
	      checked: show_service !== false && show_category,
	      disabled: show_service === false,
	      onChange: value => {
	        setAttributes({
	          show_category: value
	        });
	      }
	    });
	    const ShowServiceCategoryToggleControl = show_service === false ? wp.element.createElement(Tooltip
	    // Translators: %s: Checkbox label.
	    , {
	      text: wp_i18n.sprintf(wp_i18n.__("To enable this option, you need to check the '%s' box.", 'motopress-appointment'), wp_i18n.__('Show Service?', 'motopress-appointment'))
	    }, wp.element.createElement("div", {
	      style: {
	        display: 'inline-block'
	      }
	    }, ShowServiceCategoryToggleControlComponent)) : ShowServiceCategoryToggleControlComponent;
	    const ShowServiceToggleControlComponent = wp.element.createElement(ToggleControl$4, {
	      label: wp_i18n.__('Show Service?', 'motopress-appointment'),
	      help: wp_i18n.__('Show the service field in the form.', 'motopress-appointment'),
	      checked: selectedService === 0 || show_service,
	      disabled: selectedService === 0,
	      onChange: value => {
	        setAttributes({
	          show_service: value
	        });
	      }
	    });
	    const ShowServiceToggleControl = selectedService === 0 ? wp.element.createElement(Tooltip, {
	      text: wp_i18n.__("To enable booking for the specific service only, select the service below first, then uncheck the 'Service' box here.", 'motopress-appointment')
	    }, wp.element.createElement("div", {
	      style: {
	        display: 'inline-block'
	      }
	    }, ShowServiceToggleControlComponent)) : ShowServiceToggleControlComponent;
	    return [wp.element.createElement(InspectorControls$c, {
	      key: "inspector"
	    }, wp.element.createElement(Fragment$p, null, wp.element.createElement(PanelBody$c, {
	      title: wp_i18n.__('Settings', 'motopress-appointment'),
	      initialOpen: true
	    }, wp.element.createElement(TextControl$c, {
	      label: wp_i18n.__('Form Title', 'motopress-appointment'),
	      value: form_title,
	      onChange: form_title => {
	        setAttributes({
	          form_title
	        });
	      }
	    }), ShowServiceCategoryToggleControl, ShowServiceToggleControl, wp.element.createElement(ToggleControl$4, {
	      label: wp_i18n.__('Show Location?', 'motopress-appointment'),
	      help: wp_i18n.__('Show the location field in the form.', 'motopress-appointment'),
	      checked: show_location,
	      onChange: value => {
	        setAttributes({
	          show_location: value
	        });
	      }
	    }), wp.element.createElement(ToggleControl$4, {
	      label: wp_i18n.__('Show Employee?', 'motopress-appointment'),
	      help: wp_i18n.__('Show the employee field in the form.', 'motopress-appointment'),
	      checked: show_employee,
	      onChange: value => {
	        setAttributes({
	          show_employee: value
	        });
	      }
	    }), wp.element.createElement(TextControl$c, {
	      label: wp_i18n.__('Category Field Label', 'motopress-appointment'),
	      help: wp_i18n.__('Custom label for the service category field.', 'motopress-appointment'),
	      placeholder: wp_i18n.__('Service Category', 'motopress-appointment'),
	      value: label_category,
	      onChange: label_category => {
	        setAttributes({
	          label_category
	        });
	      }
	    }), wp.element.createElement(TextControl$c, {
	      label: wp_i18n.__('Service Field Label', 'motopress-appointment'),
	      help: wp_i18n.__('Custom label for the service field.', 'motopress-appointment'),
	      placeholder: wp_i18n.__('Service', 'motopress-appointment'),
	      value: label_service,
	      onChange: label_service => {
	        setAttributes({
	          label_service
	        });
	      }
	    }), wp.element.createElement(TextControl$c, {
	      label: wp_i18n.__('Location Field Label', 'motopress-appointment'),
	      help: wp_i18n.__('Custom label for the location field.', 'motopress-appointment'),
	      placeholder: wp_i18n.__('Location', 'motopress-appointment'),
	      value: label_location,
	      onChange: label_location => {
	        setAttributes({
	          label_location
	        });
	      }
	    }), wp.element.createElement(TextControl$c, {
	      label: wp_i18n.__('Employee Field Label', 'motopress-appointment'),
	      help: wp_i18n.__('Custom label for the employee field.', 'motopress-appointment'),
	      placeholder: wp_i18n.__('Employee', 'motopress-appointment'),
	      value: label_employee,
	      onChange: label_employee => {
	        setAttributes({
	          label_employee
	        });
	      }
	    }), wp.element.createElement(TextControl$c, {
	      label: wp_i18n.__('Unselected Service', 'motopress-appointment'),
	      help: wp_i18n.__('Custom label for the unselected service field.', 'motopress-appointment'),
	      placeholder: wp_i18n.__('— Select —', 'motopress-appointment'),
	      value: label_unselected,
	      onChange: label_unselected => {
	        setAttributes({
	          label_unselected
	        });
	      }
	    }), wp.element.createElement(TextControl$c, {
	      label: wp_i18n.__('Unselected Option', 'motopress-appointment'),
	      help: wp_i18n.__('Custom label for the unselected service category, location and employee fields.', 'motopress-appointment'),
	      placeholder: wp_i18n.__('— Any —', 'motopress-appointment'),
	      value: label_option,
	      onChange: label_option => {
	        setAttributes({
	          label_option
	        });
	      }
	    }), wp.element.createElement(SelectControl$4, {
	      label: wp_i18n.__('Service Category', 'motopress-appointment'),
	      help: wp_i18n.__('Slug of the selected service category.', 'motopress-appointment'),
	      value: selectedCategory,
	      onChange: value => setAttributes({
	        default_category: value
	      }),
	      options: serviceCategoriesArr
	    }), wp.element.createElement(SelectControl$4, {
	      label: wp_i18n.__('Service', 'motopress-appointment'),
	      help: wp_i18n.__('ID of the selected service.', 'motopress-appointment'),
	      value: selectedService,
	      onChange: value => setAttributes({
	        default_service: value
	      }),
	      options: serviceArr
	    }), wp.element.createElement(SelectControl$4, {
	      label: wp_i18n.__('Location', 'motopress-appointment'),
	      help: wp_i18n.__('ID of the selected location.', 'motopress-appointment'),
	      value: selectedLocation,
	      onChange: value => setAttributes({
	        default_location: value
	      }),
	      options: locationsArr
	    }), wp.element.createElement(SelectControl$4, {
	      label: wp_i18n.__('Employee', 'motopress-appointment'),
	      help: wp_i18n.__('ID of the selected employee.', 'motopress-appointment'),
	      value: selectedEmployee,
	      onChange: value => setAttributes({
	        default_employee: value
	      }),
	      options: employeesArr
	    }), wp.element.createElement(RangeControl$4, {
	      label: wp_i18n.__('Timepicker Columns Count', 'motopress-appointment'),
	      help: wp_i18n.__('The number of columns in the timepicker.', 'motopress-appointment'),
	      value: timepicker_columns,
	      onChange: value => setAttributes({
	        timepicker_columns: value
	      }),
	      min: 1,
	      max: 5
	    }), wp.element.createElement(ToggleControl$4, {
	      label: wp_i18n.__('Show End Time?', 'motopress-appointment'),
	      help: wp_i18n.__('Show the time when the appointment ends.', 'motopress-appointment'),
	      checked: show_timepicker_end_time,
	      onChange: value => {
	        setAttributes({
	          show_timepicker_end_time: value
	        });
	      }
	    }))))];
	  }
	};

	var md5$1 = {exports: {}};

	var crypt = {exports: {}};

	(function() {
	  var base64map
	      = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',

	  crypt$1 = {
	    // Bit-wise rotation left
	    rotl: function(n, b) {
	      return (n << b) | (n >>> (32 - b));
	    },

	    // Bit-wise rotation right
	    rotr: function(n, b) {
	      return (n << (32 - b)) | (n >>> b);
	    },

	    // Swap big-endian to little-endian and vice versa
	    endian: function(n) {
	      // If number given, swap endian
	      if (n.constructor == Number) {
	        return crypt$1.rotl(n, 8) & 0x00FF00FF | crypt$1.rotl(n, 24) & 0xFF00FF00;
	      }

	      // Else, assume array and swap all items
	      for (var i = 0; i < n.length; i++)
	        n[i] = crypt$1.endian(n[i]);
	      return n;
	    },

	    // Generate an array of any length of random bytes
	    randomBytes: function(n) {
	      for (var bytes = []; n > 0; n--)
	        bytes.push(Math.floor(Math.random() * 256));
	      return bytes;
	    },

	    // Convert a byte array to big-endian 32-bit words
	    bytesToWords: function(bytes) {
	      for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
	        words[b >>> 5] |= bytes[i] << (24 - b % 32);
	      return words;
	    },

	    // Convert big-endian 32-bit words to a byte array
	    wordsToBytes: function(words) {
	      for (var bytes = [], b = 0; b < words.length * 32; b += 8)
	        bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
	      return bytes;
	    },

	    // Convert a byte array to a hex string
	    bytesToHex: function(bytes) {
	      for (var hex = [], i = 0; i < bytes.length; i++) {
	        hex.push((bytes[i] >>> 4).toString(16));
	        hex.push((bytes[i] & 0xF).toString(16));
	      }
	      return hex.join('');
	    },

	    // Convert a hex string to a byte array
	    hexToBytes: function(hex) {
	      for (var bytes = [], c = 0; c < hex.length; c += 2)
	        bytes.push(parseInt(hex.substr(c, 2), 16));
	      return bytes;
	    },

	    // Convert a byte array to a base-64 string
	    bytesToBase64: function(bytes) {
	      for (var base64 = [], i = 0; i < bytes.length; i += 3) {
	        var triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
	        for (var j = 0; j < 4; j++)
	          if (i * 8 + j * 6 <= bytes.length * 8)
	            base64.push(base64map.charAt((triplet >>> 6 * (3 - j)) & 0x3F));
	          else
	            base64.push('=');
	      }
	      return base64.join('');
	    },

	    // Convert a base-64 string to a byte array
	    base64ToBytes: function(base64) {
	      // Remove non-base-64 characters
	      base64 = base64.replace(/[^A-Z0-9+\/]/ig, '');

	      for (var bytes = [], i = 0, imod4 = 0; i < base64.length;
	          imod4 = ++i % 4) {
	        if (imod4 == 0) continue;
	        bytes.push(((base64map.indexOf(base64.charAt(i - 1))
	            & (Math.pow(2, -2 * imod4 + 8) - 1)) << (imod4 * 2))
	            | (base64map.indexOf(base64.charAt(i)) >>> (6 - imod4 * 2)));
	      }
	      return bytes;
	    }
	  };

	  crypt.exports = crypt$1;
	})();

	var cryptExports = crypt.exports;

	var charenc = {
	  // UTF-8 encoding
	  utf8: {
	    // Convert a string to a byte array
	    stringToBytes: function(str) {
	      return charenc.bin.stringToBytes(unescape(encodeURIComponent(str)));
	    },

	    // Convert a byte array to a string
	    bytesToString: function(bytes) {
	      return decodeURIComponent(escape(charenc.bin.bytesToString(bytes)));
	    }
	  },

	  // Binary encoding
	  bin: {
	    // Convert a string to a byte array
	    stringToBytes: function(str) {
	      for (var bytes = [], i = 0; i < str.length; i++)
	        bytes.push(str.charCodeAt(i) & 0xFF);
	      return bytes;
	    },

	    // Convert a byte array to a string
	    bytesToString: function(bytes) {
	      for (var str = [], i = 0; i < bytes.length; i++)
	        str.push(String.fromCharCode(bytes[i]));
	      return str.join('');
	    }
	  }
	};

	var charenc_1 = charenc;

	/*!
	 * Determine if an object is a Buffer
	 *
	 * @author   Feross Aboukhadijeh <https://feross.org>
	 * @license  MIT
	 */

	// The _isBuffer check is for Safari 5-7 support, because it's missing
	// Object.prototype.constructor. Remove this eventually
	var isBuffer_1 = function (obj) {
	  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
	};

	function isBuffer (obj) {
	  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
	}

	// For Node v0.10 support. Remove this eventually.
	function isSlowBuffer (obj) {
	  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
	}

	(function(){
	  var crypt = cryptExports,
	      utf8 = charenc_1.utf8,
	      isBuffer = isBuffer_1,
	      bin = charenc_1.bin,

	  // The core
	  md5 = function (message, options) {
	    // Convert to byte array
	    if (message.constructor == String)
	      if (options && options.encoding === 'binary')
	        message = bin.stringToBytes(message);
	      else
	        message = utf8.stringToBytes(message);
	    else if (isBuffer(message))
	      message = Array.prototype.slice.call(message, 0);
	    else if (!Array.isArray(message) && message.constructor !== Uint8Array)
	      message = message.toString();
	    // else, assume byte array already

	    var m = crypt.bytesToWords(message),
	        l = message.length * 8,
	        a =  1732584193,
	        b = -271733879,
	        c = -1732584194,
	        d =  271733878;

	    // Swap endian
	    for (var i = 0; i < m.length; i++) {
	      m[i] = ((m[i] <<  8) | (m[i] >>> 24)) & 0x00FF00FF |
	             ((m[i] << 24) | (m[i] >>>  8)) & 0xFF00FF00;
	    }

	    // Padding
	    m[l >>> 5] |= 0x80 << (l % 32);
	    m[(((l + 64) >>> 9) << 4) + 14] = l;

	    // Method shortcuts
	    var FF = md5._ff,
	        GG = md5._gg,
	        HH = md5._hh,
	        II = md5._ii;

	    for (var i = 0; i < m.length; i += 16) {

	      var aa = a,
	          bb = b,
	          cc = c,
	          dd = d;

	      a = FF(a, b, c, d, m[i+ 0],  7, -680876936);
	      d = FF(d, a, b, c, m[i+ 1], 12, -389564586);
	      c = FF(c, d, a, b, m[i+ 2], 17,  606105819);
	      b = FF(b, c, d, a, m[i+ 3], 22, -1044525330);
	      a = FF(a, b, c, d, m[i+ 4],  7, -176418897);
	      d = FF(d, a, b, c, m[i+ 5], 12,  1200080426);
	      c = FF(c, d, a, b, m[i+ 6], 17, -1473231341);
	      b = FF(b, c, d, a, m[i+ 7], 22, -45705983);
	      a = FF(a, b, c, d, m[i+ 8],  7,  1770035416);
	      d = FF(d, a, b, c, m[i+ 9], 12, -1958414417);
	      c = FF(c, d, a, b, m[i+10], 17, -42063);
	      b = FF(b, c, d, a, m[i+11], 22, -1990404162);
	      a = FF(a, b, c, d, m[i+12],  7,  1804603682);
	      d = FF(d, a, b, c, m[i+13], 12, -40341101);
	      c = FF(c, d, a, b, m[i+14], 17, -1502002290);
	      b = FF(b, c, d, a, m[i+15], 22,  1236535329);

	      a = GG(a, b, c, d, m[i+ 1],  5, -165796510);
	      d = GG(d, a, b, c, m[i+ 6],  9, -1069501632);
	      c = GG(c, d, a, b, m[i+11], 14,  643717713);
	      b = GG(b, c, d, a, m[i+ 0], 20, -373897302);
	      a = GG(a, b, c, d, m[i+ 5],  5, -701558691);
	      d = GG(d, a, b, c, m[i+10],  9,  38016083);
	      c = GG(c, d, a, b, m[i+15], 14, -660478335);
	      b = GG(b, c, d, a, m[i+ 4], 20, -405537848);
	      a = GG(a, b, c, d, m[i+ 9],  5,  568446438);
	      d = GG(d, a, b, c, m[i+14],  9, -1019803690);
	      c = GG(c, d, a, b, m[i+ 3], 14, -187363961);
	      b = GG(b, c, d, a, m[i+ 8], 20,  1163531501);
	      a = GG(a, b, c, d, m[i+13],  5, -1444681467);
	      d = GG(d, a, b, c, m[i+ 2],  9, -51403784);
	      c = GG(c, d, a, b, m[i+ 7], 14,  1735328473);
	      b = GG(b, c, d, a, m[i+12], 20, -1926607734);

	      a = HH(a, b, c, d, m[i+ 5],  4, -378558);
	      d = HH(d, a, b, c, m[i+ 8], 11, -2022574463);
	      c = HH(c, d, a, b, m[i+11], 16,  1839030562);
	      b = HH(b, c, d, a, m[i+14], 23, -35309556);
	      a = HH(a, b, c, d, m[i+ 1],  4, -1530992060);
	      d = HH(d, a, b, c, m[i+ 4], 11,  1272893353);
	      c = HH(c, d, a, b, m[i+ 7], 16, -155497632);
	      b = HH(b, c, d, a, m[i+10], 23, -1094730640);
	      a = HH(a, b, c, d, m[i+13],  4,  681279174);
	      d = HH(d, a, b, c, m[i+ 0], 11, -358537222);
	      c = HH(c, d, a, b, m[i+ 3], 16, -722521979);
	      b = HH(b, c, d, a, m[i+ 6], 23,  76029189);
	      a = HH(a, b, c, d, m[i+ 9],  4, -640364487);
	      d = HH(d, a, b, c, m[i+12], 11, -421815835);
	      c = HH(c, d, a, b, m[i+15], 16,  530742520);
	      b = HH(b, c, d, a, m[i+ 2], 23, -995338651);

	      a = II(a, b, c, d, m[i+ 0],  6, -198630844);
	      d = II(d, a, b, c, m[i+ 7], 10,  1126891415);
	      c = II(c, d, a, b, m[i+14], 15, -1416354905);
	      b = II(b, c, d, a, m[i+ 5], 21, -57434055);
	      a = II(a, b, c, d, m[i+12],  6,  1700485571);
	      d = II(d, a, b, c, m[i+ 3], 10, -1894986606);
	      c = II(c, d, a, b, m[i+10], 15, -1051523);
	      b = II(b, c, d, a, m[i+ 1], 21, -2054922799);
	      a = II(a, b, c, d, m[i+ 8],  6,  1873313359);
	      d = II(d, a, b, c, m[i+15], 10, -30611744);
	      c = II(c, d, a, b, m[i+ 6], 15, -1560198380);
	      b = II(b, c, d, a, m[i+13], 21,  1309151649);
	      a = II(a, b, c, d, m[i+ 4],  6, -145523070);
	      d = II(d, a, b, c, m[i+11], 10, -1120210379);
	      c = II(c, d, a, b, m[i+ 2], 15,  718787259);
	      b = II(b, c, d, a, m[i+ 9], 21, -343485551);

	      a = (a + aa) >>> 0;
	      b = (b + bb) >>> 0;
	      c = (c + cc) >>> 0;
	      d = (d + dd) >>> 0;
	    }

	    return crypt.endian([a, b, c, d]);
	  };

	  // Auxiliary functions
	  md5._ff  = function (a, b, c, d, x, s, t) {
	    var n = a + (b & c | ~b & d) + (x >>> 0) + t;
	    return ((n << s) | (n >>> (32 - s))) + b;
	  };
	  md5._gg  = function (a, b, c, d, x, s, t) {
	    var n = a + (b & d | c & ~d) + (x >>> 0) + t;
	    return ((n << s) | (n >>> (32 - s))) + b;
	  };
	  md5._hh  = function (a, b, c, d, x, s, t) {
	    var n = a + (b ^ c ^ d) + (x >>> 0) + t;
	    return ((n << s) | (n >>> (32 - s))) + b;
	  };
	  md5._ii  = function (a, b, c, d, x, s, t) {
	    var n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
	    return ((n << s) | (n >>> (32 - s))) + b;
	  };

	  // Package private blocksize
	  md5._blocksize = 16;
	  md5._digestsize = 16;

	  md5$1.exports = function (message, options) {
	    if (message === undefined || message === null)
	      throw new Error('Illegal argument ' + message);

	    var digestbytes = crypt.wordsToBytes(md5(message, options));
	    return options && options.asBytes ? digestbytes :
	        options && options.asString ? bin.bytesToString(digestbytes) :
	        crypt.bytesToHex(digestbytes);
	  };

	})();

	var md5Exports = md5$1.exports;
	var md5 = /*@__PURE__*/getDefaultExportFromCjs(md5Exports);

	/**
	 * Notice: all nullable properties must be set till the checkout.
	 *
	 * @since 1.0
	 */
	class CartItem {
	  /**
	   * @since 1.4.0
	   * @access protected
	   */
	  setupProperties() {
	    /**
	     * @since 1.4.0
	     * @var {String}
	     * @access protected
	     */
	    this.itemId = '';

	    /**
	     * @since 1.4.0
	     * @var {Service|Null}
	     */
	    this.service = null;
	    this.serviceCategories = {};

	    /**
	     * @since 1.4.0
	     * @var {Employee|Null}
	     */
	    this.employee = null;

	    /**
	     * @since 1.4.0
	     * @var {Location|Null}
	     */
	    this.location = null;

	    /**
	     * @since 1.0
	     * @var {Date|Null}
	     */
	    this.date = null;

	    /**
	     * @since 1.0
	     * @var {TimePeriod|Null}
	     */
	    this.time = null;

	    /**
	     * @since 1.0
	     * @var {Number}
	     */
	    this.capacity = 1;

	    /**
	     * An array of all available employees. For example, when no exact
	     * employee was selected on the previous steps ("- Any -").
	     *
	     * @since 1.4.0
	     * @var {Employee[]}
	     */
	    this.availableEmployees = [];

	    /**
	     * An array of all available locations. For example, when no exact
	     * location was selected on the previous steps ("- Any -").
	     *
	     * @since 1.4.0
	     * @var {Location[]}
	     */
	    this.availableLocations = [];
	  }

	  /**
	   * @since 1.0
	   *
	   * @param {String} itemId
	   */
	  constructor(itemId) {
	    this.setupProperties();
	    this.itemId = itemId;
	  }

	  /**
	   * @since 1.4.0
	   *
	   * @return {String}
	   */
	  getItemId() {
	    return this.itemId;
	  }

	  /**
	   * @since 1.4.0
	   *
	   * @return {Number[]}
	   */
	  getAvailableEmployeeIds() {
	    return this.availableEmployees.map(entity => entity.id);
	  }

	  /**
	   * @since 1.4.0
	   *
	   * @return {Number[]}
	   */
	  getAvailableLocationIds() {
	    return this.availableLocations.map(entity => entity.id);
	  }

	  /**
	   * @since 1.4.0
	   *
	   * @return {Object}
	   */
	  getAvailableIds() {
	    return {
	      // service and employee can impact to time slots availability
	      service_id: this.service !== null ? this.service.id : 0,
	      employee_id: this.employee !== null ? this.employee.id : 0,
	      employee_ids: this.getAvailableEmployeeIds(),
	      location_ids: this.getAvailableLocationIds()
	    };
	  }

	  /**
	   * @since 1.0
	   *
	   * @return {Object}
	   */
	  getIds() {
	    return {
	      service_id: this.service !== null ? this.service.id : 0,
	      employee_id: this.employee !== null ? this.employee.id : 0,
	      location_id: this.location !== null ? this.location.id : 0
	    };
	  }

	  /**
	   * @since 1.0
	   * @since 1.4.0 added the <code>fields</code> argument.
	   *
	   * @param {String} fields Optional. all|ids|period|availability. 'all' by default.
	   * @return {Object}
	   */
	  toArray(fields = 'all') {
	    if (fields === 'ids') {
	      return this.getIds();
	    } else if (fields === 'availability') {
	      return this.getAvailableIds();
	    } else if (fields === 'period') {
	      return {
	        date: this.date !== null ? mpa_format_date(this.date, 'internal') : '',
	        time: this.time !== null ? this.time.toString('internal') : ''
	      };
	    } else {
	      return jQuery.extend(this.getIds(), {
	        date: this.date !== null ? mpa_format_date(this.date, 'internal') : '',
	        time: this.time !== null ? this.time.toString('internal') : '',
	        capacity: this.capacity
	      });
	    }
	  }

	  /**
	   * @since 1.4.0
	   *
	   * @param {String} fields Optional. all|ids|period. 'all' by default.
	   * @return {Boolean}
	   */
	  isSet(fields = 'all') {
	    let isSet = true;
	    if (fields === 'all' || fields === 'ids') {
	      isSet = isSet && this.service !== null && this.employee !== null && this.location !== null;
	    }
	    if (fields === 'all' || fields === 'period') {
	      isSet = isSet && this.date !== null && this.time !== null;
	    }
	    return isSet;
	  }

	  /**
	   * @since 1.11.0
	   *
	   * @return {Number}
	   */
	  getPrice() {
	    if (!this.service) {
	      return 0;
	    }
	    let employeeId = this.employee ? this.employee.id : 0;
	    return this.service.getPrice(employeeId, this.capacity);
	  }

	  /**
	   * @since 1.14.0
	   *
	   * @return {Number}
	   * @param {number} priceAfterPossibleDiscount
	   */
	  getDeposit(priceAfterPossibleDiscount) {
	    let deposit = 0;
	    switch (this.service.depositType) {
	      case 'disabled':
	        deposit = priceAfterPossibleDiscount;
	        break;
	      case 'fixed':
	        deposit = this.service.depositAmount;
	        break;
	      case 'percentage':
	        deposit = priceAfterPossibleDiscount * this.service.depositAmount / 100;
	        break;
	      default:
	        deposit = priceAfterPossibleDiscount;
	    }
	    if (deposit > priceAfterPossibleDiscount) {
	      return priceAfterPossibleDiscount;
	    }
	    return deposit;
	  }

	  /**
	   * @since 1.0
	   *
	   * @param {String} fields Optional. all|ids|availability. 'all' by default.
	   * @return {String} Snapshot MD5 hash.
	   */
	  getHash(fields = 'all') {
	    return md5(JSON.stringify(this.toArray(fields)));
	  }

	  /**
	   * @since 1.0
	   *
	   * @param {String} hash Last saved snapshot.
	   * @param {String} fields Optional. all|ids|availability. 'all' by default.
	   * @return {Boolean}
	   */
	  didChange(hash, fields = 'all') {
	    return hash !== this.getHash(fields);
	  }

	  /**
	   * @since 1.4.0
	   *
	   * @param {Number} employeeId
	   * @return {Employee|Null}
	   */
	  getEmployee(employeeId) {
	    if (this.employee !== null && this.employee.id == employeeId) {
	      return this.employee;
	    } else {
	      for (let employee of this.availableEmployees) {
	        if (employee.id == employeeId) {
	          return employee;
	        }
	      }
	    }
	    return null;
	  }

	  /**
	   * @since 1.4.0
	   *
	   * @param {Number} locationId
	   * @return {Location|Null}
	   */
	  getLocation(locationId) {
	    if (this.location !== null && this.location.id == locationId) {
	      return this.location;
	    } else {
	      for (let location of this.availableLocations) {
	        if (location.id == locationId) {
	          return location;
	        }
	      }
	    }
	    return null;
	  }

	  /**
	   * @since 1.4.0
	   *
	   * @return {Boolean}
	   */
	  hasMultipleAvailableEmployees() {
	    return this.availableEmployees.length > 1;
	  }

	  /**
	   * @since 1.4.0
	   *
	   * @return {Boolean}
	   */
	  hasMultipleAvailableLocations() {
	    return this.availableLocations.length > 1;
	  }

	  /**
	   * @since 1.4.0
	   *
	   * @return {Boolean}
	   */
	  hasMultipleAvailableVariants() {
	    return this.hasMultipleAvailableEmployees() || this.hasMultipleAvailableLocations();
	  }

	  /**
	   * @since 1.4.0
	   *
	   * @param {Service} service
	   */
	  setService(service) {
	    this.service = service;
	  }

	  /**
	   * @param {category slug: category name, ...} serviceCategories 
	   */
	  setServiceCategories(serviceCategories) {
	    this.serviceCategories = serviceCategories;
	  }

	  /**
	   * @since 1.4.0
	   *
	   * @param {Employee|Number} employee Employee object or ID.
	   * @param {Boolean} resetAvailable Optional. True by default.
	   */
	  setEmployee(employee, resetAvailable = true) {
	    if (typeof employee === 'number') {
	      employee = this.getEmployee(employee);
	    }
	    this.employee = employee;
	    if (resetAvailable === true) {
	      this.availableEmployees = [employee];
	    }
	  }

	  /**
	   * @since 1.4.0
	   *
	   * @param {Employee[]} availableEmployees
	   * @param {Boolean} resetEmployee Optional. True by default.
	   */
	  setAvailableEmployees(availableEmployees, resetEmployee = true) {
	    this.availableEmployees = availableEmployees;
	    if (resetEmployee === true) {
	      this.employee = null;
	    }
	  }

	  /**
	   * @since 1.4.0
	   *
	   * @param {Location|Number} location Location object or ID.
	   * @param {Boolean} resetAvailable Optional. True by default.
	   */
	  setLocation(location, resetAvailable = true) {
	    if (typeof location === 'number') {
	      location = this.getLocation(location);
	    }
	    this.location = location;
	    if (resetAvailable === true) {
	      this.availableLocations = [location];
	    }
	  }

	  /**
	   * @since 1.4.0
	   *
	   * @param {Location[]} availableLocations
	   * @param {Boolean} resetLocation Optional. True by default.
	   */
	  setAvailableLocations(availableLocations, resetLocation = true) {
	    this.availableLocations = availableLocations;
	    if (resetLocation === true) {
	      this.location = null;
	    }
	  }
	}

	/**
	 * @since 1.0
	 */
	class Map {
	  /**
	   * @param {Object|Null} values Optional. Starting values. Null by default.
	   *
	   * @since 1.0
	   */
	  constructor(values = null) {
	    this.setupProperties();
	    if (values != null) {
	      this.merge(values);
	    }
	  }

	  /**
	   * @access protected
	   *
	   * @since 1.0
	   */
	  setupProperties() {
	    this.keys = [];
	    this.values = {};
	    this.length = 0;
	  }

	  /**
	   * @param {Object} values
	   *
	   * @since 1.0
	   */
	  merge(values) {
	    for (let key in values) {
	      this.push(key, values[key]);
	    }
	  }

	  /**
	   * @param {String|Number|Symbol} key
	   * @param {*} value
	   * @return {Boolean} Is this a new item (key) or a duplicate.
	   *
	   * @since 1.0
	   */
	  push(key, value) {
	    let isNew = !this.includesKey(key);

	    // Add value
	    this.values[key] = value;

	    // Add key
	    if (isNew) {
	      this.keys.push(key);
	      this.length++;
	    }
	    return isNew;
	  }

	  /**
	   * @param {String|Number|Symbol} key
	   * @param {*} defaultValue Optional. Null by default.
	   * @return {*} Item value or default value.
	   *
	   * @since 1.0
	   */
	  find(key, defaultValue = null) {
	    if (this.includesKey(key)) {
	      return this.values[key];
	    } else {
	      return defaultValue;
	    }
	  }

	  /**
	   * @param {String|Number|Symbol} key
	   * @param {*} defaultValue Optional. Null by default.
	   * @return {*} Next item value or default value.
	   *
	   * @since 1.9.0
	   */
	  findNext(key, defaultValue = null) {
	    let nextKey = this.findNextKey(key);
	    if (nextKey !== '') {
	      return this.values[nextKey];
	    } else {
	      return defaultValue;
	    }
	  }

	  /**
	   * @param {String|Number|Symbol} key
	   * @return {String|Number|Symbol} Next or last key.
	   *
	   * @since 1.9.0
	   */
	  findNextKey(key) {
	    let index = this.keys.indexOf(key);
	    if (index === -1) {
	      return '';
	    }
	    let nextIndex = index + 1;
	    let nextKey = nextIndex < this.length ? this.keys[nextIndex] : this.keys[index];
	    return nextKey;
	  }

	  /**
	   * @param {String|Number|Symbol} key
	   * @param {*} defaultValue Optional. Null by default.
	   * @return {*} Previous item value or default value.
	   *
	   * @since 1.9.0
	   */
	  findPrevious(key, defaultValue = null) {
	    let previousKey = this.findPreviousKey(key);
	    if (previousKey !== '') {
	      return this.values[previousKey];
	    } else {
	      return defaultValue;
	    }
	  }

	  /**
	   * @param {String|Number|Symbol} key
	   * @return {String|Number|Symbol} Previous or first key.
	   *
	   * @since 1.9.0
	   */
	  findPreviousKey(key) {
	    let index = this.keys.indexOf(key);
	    if (index === -1) {
	      return '';
	    }
	    let previousIndex = index - 1;
	    let previousKey = previousIndex >= 0 ? this.keys[previousIndex] : this.keys[index];
	    return previousKey;
	  }

	  /**
	   * Currently it's an alias of push() and has no difference.
	   *
	   * @param {String|Number|Symbol} key
	   * @param {*} value
	   * @return {Boolean} Is this a new item (key) or a duplicate.
	   *
	   * @since 1.0
	   */
	  update(key, value) {
	    return this.push(key, value);
	  }

	  /**
	   * @param {String|Number|Symbol} key
	   * @return {*} The removed value or null if there was no item with a such key.
	   *
	   * @since 1.0
	   */
	  remove(key) {
	    if (!this.includesKey(key)) {
	      return null;
	    }
	    let value = this.values[key];

	    // Remove value
	    delete this.values[key];

	    // Remove key
	    let index = this.keys.indexOf(key);
	    this.keys.splice(index, 1);

	    // Update length
	    this.length--;
	    return value;
	  }

	  /**
	   * @return {Map}
	   *
	   * @since 1.0
	   */
	  empty() {
	    this.keys = [];
	    this.values = {};
	    this.length = 0;
	    return this;
	  }

	  /**
	   * @return {Boolean}
	   *
	   * @since 1.0
	   */
	  isEmpty() {
	    return this.length == 0;
	  }

	  /**
	   * @param {String|Number|Symbol} key
	   * @return {Boolean}
	   *
	   * @since 1.0
	   */
	  includesKey(key) {
	    return key in this.values;
	  }

	  /**
	   * @since 1.6.2
	   *
	   * @return {String|null}
	   */
	  firstKey() {
	    if (this.keys.length > 0) {
	      return this.keys[0];
	    } else {
	      return null;
	    }
	  }

	  /**
	   * @since 1.6.2
	   *
	   * @return {*|null}
	   */
	  firstValue() {
	    let firstKey = this.firstKey();
	    if (firstKey !== null) {
	      return this.values[firstKey];
	    } else {
	      return null;
	    }
	  }

	  /**
	   * @return {*}
	   *
	   * @since 1.0
	   */
	  lastValue() {
	    let lastKey = this.lastKey();
	    if (lastKey != null) {
	      return this.values[lastKey];
	    } else {
	      return null;
	    }
	  }

	  /**
	   * @return {String|Number|Symbol|Null}
	   *
	   * @since 1.0
	   */
	  lastKey() {
	    if (!this.isEmpty()) {
	      return this.keys[this.length - 1];
	    } else {
	      return null;
	    }
	  }

	  /**
	   * @return {Array}
	   *
	   * @since 1.0
	   */
	  cloneKeys() {
	    return [...this.keys];
	  }

	  /**
	   * @param {String|Number|Symbol} column
	   * @return {Array} Column values (only unique ones).
	   *
	   * @since 1.0
	   */
	  getColumn(column) {
	    let values = [];
	    for (let key of this.keys) {
	      let value = this.values[key][column];
	      if (value != undefined) {
	        if (Array.isArray(value)) {
	          // Merge arrays
	          values = values.concat(value);
	        } else {
	          // Add value to array
	          values.push(value);
	        }
	      }
	    }
	    return mpa_array_unique(values);
	  }

	  /**
	   * @param {Function} callback
	   *
	   * @since 1.0
	   */
	  forEach(callback) {
	    let i = 0;
	    for (let key of this.keys) {
	      let response = callback(this.values[key], i, key, this);
	      i++;
	      if (response === false) {
	        break;
	      }
	    }
	  }

	  /**
	   * @param {Function} callback
	   * @return {Array} May have duplicates.
	   *
	   * @since 1.0
	   */
	  map(callback) {
	    let values = [];
	    let i = 0;
	    for (let key of this.keys) {
	      values.push(callback(this.values[key], i, key, this));
	      i++;
	    }
	    return values;
	  }

	  /**
	   * @return {Array}
	   *
	   * @since 1.0
	   */
	  toArray() {
	    let values = [];
	    for (let key of this.keys) {
	      values.push(this.values[key]);
	    }
	    return values;
	  }
	}

	/**
	 * @since 1.0
	 */
	class Cart {
	  /**
	   * @since 1.4.0
	   * @access protected
	   */
	  setupProperties() {
	    /**
	     * @since 1.0
	     * @var {Map}
	     */
	    this.items = new Map();

	    /**
	     * @since 1.4.0 (Replaced the property <code>selectedItem</code>)
	     * @var {CartItem|Null}
	     */
	    this.activeItem = null;

	    /**
	     * @since 1.0
	     * @var {Object}
	     */
	    this.customerDetails = {
	      name: '',
	      email: '',
	      phone: ''
	    };

	    /**
	     * @since 1.5.0
	     * @var {Object}
	     */
	    this.paymentDetails = {
	      booking_id: 0,
	      gateway_id: 'none'
	    };

	    /**
	     * @since 1.11.0
	     * @var {Coupon|Null}
	     */
	    this.coupon = null;
	  }

	  /**
	   * @since 1.0
	   */
	  constructor() {
	    this.setupProperties();
	  }

	  /**
	   * @since 1.0
	   * @since 1.4.0 added the <code>itemId</code> argument.
	   * @since 1.4.0 returns <code>CartItem</code> object instead of item identifier.
	   *
	   * @param {String} itemId Optional.
	   * @return {CartItem} New item.
	   */
	  createItem(itemId = '') {
	    if (!itemId) {
	      itemId = mpa_uniqid();
	    }
	    let item = new CartItem(itemId);
	    this.items.push(itemId, item);
	    this.activeItem = item;
	    return item;
	  }

	  /**
	   * @since 1.0
	   *
	   * @param {String} itemId
	   * @return {CartItem|Null}
	   */
	  getItem(itemId) {
	    return this.items.find(itemId);
	  }

	  /**
	   * @since 1.4.0
	   *
	   * @return {CartItem|Null}
	   */
	  getActiveItem() {
	    return this.activeItem;
	  }

	  /**
	   * @since 1.4.0
	   *
	   * @return {String}
	   */
	  getActiveItemId() {
	    if (this.activeItem !== null) {
	      return this.activeItem.getItemId();
	    } else {
	      return '';
	    }
	  }

	  /**
	   * @since 1.4.0
	   *
	   * @return {Number}
	   */
	  getItemsCount() {
	    return this.items.length;
	  }

	  /**
	   * @since 1.4.0
	   *
	   * @param {String|CartItem} item
	   */
	  setActiveItem(item) {
	    if (typeof item === 'string') {
	      this.activeItem = this.getItem(item);
	    } else {
	      this.activeItem = item;
	    }
	  }

	  /**
	   * @since 1.4.0
	   *
	   * @param {String|CartItem} item
	   */
	  removeItem(item) {
	    if (typeof item === 'string') {
	      this.items.remove(item);
	    } else {
	      this.items.remove(item.getItemId());
	    }
	  }

	  /**
	   * @since 1.4.0
	   *
	   * @return {Boolean}
	   */
	  isEmpty() {
	    return this.getItemsCount() === 0;
	  }

	  /**
	   * @since 1.4.0
	   *
	   * @return {Object} {Product name: Product price}
	   */
	  getProductPrices() {
	    let products = [];
	    this.items.forEach(cartItem => {
	      if (cartItem.service != null) {
	        products.push({
	          name: cartItem.service.name,
	          price: cartItem.getPrice()
	        });
	      }
	    });
	    return products;
	  }

	  /**
	   * @since 1.4.0
	   *
	   * @param {Array|Null} products Optional. List of products to calculate the
	   *		subtotal price. Products of the cart by default.
	   * @return {Number}
	   */
	  getSubtotalPrice(products = null) {
	    if (products === null) {
	      products = this.getProductPrices();
	    }
	    let subtotal = 0;
	    for (let product of products) {
	      subtotal += product.price;
	    }
	    return subtotal;
	  }

	  /**
	   * @since 1.4.0
	   *
	   * @param {Object|Null} products Optional. List of products to calculate the
	   *		total price. Products of the cart by default.
	   * @return {Number}
	   */
	  getTotalPrice(products = null) {
	    let subtotalPrice = this.getSubtotalPrice(products);
	    if (this.hasCoupon()) {
	      let discountPrice = this.coupon.calcDiscountAmount(this);
	      return Math.max(0, subtotalPrice - discountPrice);
	    } else {
	      return subtotalPrice;
	    }
	  }

	  /**
	   * @since 1.14.0
	   * @return {Number}
	   */
	  getDeposit() {
	    let deposit = 0;
	    this.items.forEach(cartItem => {
	      // TODO: ask all prices via ajax call to avoid calculation duplication
	      let price = cartItem.getPrice();
	      if (this.hasCoupon()) {
	        price = price - this.coupon.calcDiscountForCartItem(cartItem);
	      }
	      deposit += cartItem.getDeposit(price);
	    });
	    return deposit;
	  }

	  /**
	   * @since 1.5.0
	   *
	   * @return {Object}
	   */
	  getCustomer() {
	    return this.customerDetails;
	  }

	  /**
	   * @since 1.4.0
	   *
	   * @return {Object}
	   */
	  getOrder() {
	    let products = this.getProductPrices();
	    let order = {
	      products: products,
	      subtotal: this.getSubtotalPrice(products),
	      total: this.getTotalPrice(products),
	      customer: this.getCustomer()
	    };
	    if (this.hasCoupon()) {
	      order['coupon'] = {
	        code: this.coupon.getCode(),
	        amount: this.coupon.calcDiscountAmount(this)
	      };
	    }
	    order['deposit'] = this.getDeposit();
	    return order;
	  }

	  /**
	   * @since 1.5.0
	   *
	   * @return {Object}
	   */
	  getPaymentDetails() {
	    return this.paymentDetails;
	  }

	  /**
	   * @since 1.0
	   * @since 1.4.0 added the <code>fields</code> argument.
	   *
	   * @param {String} fields Optional. all|items. 'all' by default.
	   * @return {Object|Array}
	   */
	  toArray(fields = 'all') {
	    let cart = {
	      items: [],
	      customer: this.customerDetails
	    };

	    // Add items
	    this.items.forEach(cartItem => {
	      if (!cartItem.isSet()) {
	        return;
	      }
	      cart.items.push(cartItem.toArray());
	    });

	    // Add payment details
	    if (mpapp().settings().isPaymentsEnabled()) {
	      cart.payment_details = this.paymentDetails;
	    }

	    // Add coupon
	    if (this.hasCoupon()) {
	      cart['coupon'] = this.coupon.getCode();
	    }
	    if (fields === 'items') {
	      return cart.items;
	    } else {
	      return cart;
	    }
	  }

	  /**
	   * @since 1.5.0
	   *
	   * @param {String} fields Optional. all|order|items. 'all' by default.
	   * @return {String} Snapshot MD5 hash.
	   */
	  getHash(fields = 'all') {
	    if (fields !== 'order') {
	      return md5(JSON.stringify(this.toArray(fields)));
	    } else {
	      return md5(JSON.stringify(this.getOrder()));
	    }
	  }

	  /**
	   * @since 1.5.0
	   *
	   * @param {String} hash Last saved snapshot.
	   * @param {String} fields Optional. all|order|items. 'all' by default.
	   * @return {Boolean}
	   */
	  didChange(hash, fields = 'all') {
	    return hash !== this.getHash(fields);
	  }

	  /**
	   * @since 1.4.0 (Replaced the method <code>addCustomerDetails()</code>)
	   *
	   * @param {Object} customerDetails
	   */
	  setCustomerDetails(customerDetails) {
	    jQuery.extend(this.customerDetails, customerDetails);
	  }

	  /**
	   * @since 1.5.0
	   *
	   * @param {Object} paymentDetails
	   */
	  setPaymentDetails(paymentDetails) {
	    jQuery.extend(this.paymentDetails, paymentDetails);
	  }

	  /**
	   * @since 1.6.2
	   */
	  reset() {
	    this.setupProperties();
	  }

	  /**
	   * @since 1.9.0
	   *
	   * @return {Date}
	   */
	  getMinDate() {
	    let minDate = null;
	    this.items.forEach(cartItem => {
	      if (!cartItem.date) {
	        return;
	      }
	      if (!minDate || minDate > cartItem.date) {
	        minDate = new Date(cartItem.date.getTime());
	      }
	    });
	    return minDate || mpa_today();
	  }

	  /**
	   * @since 1.9.0
	   *
	   * @return {Number[]}
	   */
	  getServiceIds() {
	    let serviceIds = this.items.map(cartItem => {
	      return cartItem.service != null ? cartItem.service.id : 0;
	    });
	    serviceIds = mpa_array_unique(serviceIds);
	    return serviceIds;
	  }

	  /**
	   * @since 1.9.0
	   *
	   * @param {Service[]} services
	   */
	  updateServices(services) {
	    for (let service of services) {
	      this.items.forEach(cartItem => {
	        if (cartItem.service != null && cartItem.service.id === service.id) {
	          cartItem.service = service;
	        }
	      });
	    }
	  }

	  /**
	   * @since 1.11.0
	   *
	   * @param {Coupon} coupon
	   */
	  setCoupon(coupon) {
	    this.coupon = coupon;
	  }

	  /**
	   * @since 1.11.0
	   */
	  removeCoupon() {
	    this.coupon = null;
	  }

	  /**
	   * @since 1.11.0
	   */
	  hasCoupon() {
	    return this.coupon != null;
	  }

	  /**
	   * @since 1.11.0
	   */
	  testCoupon() {
	    if (this.hasCoupon() && !this.coupon.isApplicableForCart(this)) {
	      this.removeCoupon();
	    }
	  }
	}

	class BookingSteps {
	  /**
	   * @param {Cart} cart
	   */
	  constructor(cart) {
	    this.cart = cart;
	    this.steps = new Map();
	    this.currentStep = null;
	    this.currentStepId = '';
	  }

	  /**
	   * @param {AbstractStep} step
	   * @return {BookingSteps}
	   */
	  addStep(step) {
	    this.steps.push(step.stepId, step);
	    return this;
	  }

	  /**
	   * @param {String} stepId
	   * @return {AbstractStep|null}
	   */
	  getStep(stepId) {
	    return this.steps.find(stepId);
	  }
	  mount($element) {
	    this.addListeners($element);
	  }

	  /**
	   * @access protected
	   */
	  addListeners($element) {
	    $element.children('.mpa-booking-step').on('mpa_booking_step_next', (event, details) => this.onStep('next', details)).on('mpa_booking_step_back', (event, details) => this.onStep('back', details)).on('mpa_booking_step_new', (event, details) => this.onStep('new', details)).on('mpa_reset_booking', (event, details) => this.onStep('reset', details));
	  }

	  /**
	   * @access protected
	   *
	   * @param {String} move next|back|new|reset
	   * @param {Object} eventDetails
	   *		@param {String} eventDetails['step'] Optional. Step ID that initiates the switch.
	   */
	  onStep(move, eventDetails) {
	    if (eventDetails && eventDetails.step && eventDetails.step !== this.currentStepId) {
	      return; // Don't accept events from inactive steps
	    }

	    // OK, switch step
	    switch (move) {
	      case 'next':
	        this.goToNextStep();
	        break;
	      case 'back':
	        this.goToPreviousStep();
	        break;
	      case 'new':
	        this.goToFirstStep();
	        break;
	      case 'reset':
	        this.reset();
	        break;
	    }
	  }

	  /**
	   * @since 1.19.0
	   */
	  isCurrentStepHiddenGoToNextStep() {
	    if (this.currentStep === null) {
	      return;
	    }
	    this.currentStep.ready().finally(() => {
	      if (this.currentStep.isHiddenStep) {
	        // go to next step with submitting data
	        this.currentStep.submit();
	      }
	    });
	  }

	  /**
	   * @since 1.19.0
	   */
	  isCurrentStepHiddenGoToPreviousStep() {
	    if (this.currentStep === null) {
	      return;
	    }
	    this.currentStep.ready().finally(() => {
	      if (this.currentStep.isHiddenStep) {
	        // go to previous step
	        this.currentStep.cancel();
	      }
	    });
	  }
	  goToNextStep() {
	    if (this.steps.isEmpty()) {
	      return; // Nowhere to go
	    }

	    let nextStepId = !this.currentStep ? this.steps.firstKey() : this.steps.findNextKey(this.currentStepId);
	    if (nextStepId === this.currentStepId) {
	      return; // Nowhere to go, already at the last step
	    }

	    this.switchStep(nextStepId);
	    this.isCurrentStepHiddenGoToNextStep();
	  }
	  goToPreviousStep() {
	    if (this.steps.isEmpty()) {
	      return; // Nowhere to go
	    }

	    let previousStepId = !this.currentStep ? '' : this.steps.findPreviousKey(this.currentStepId);
	    if (!previousStepId || previousStepId === this.currentStepId) {
	      return; // Nowhere to go, already at the beginning
	    }

	    this.switchStep(previousStepId);
	    this.isCurrentStepHiddenGoToPreviousStep();
	  }

	  /**
	   * Goes to the first step when adding new item to the cart.
	   */
	  goToFirstStep() {
	    if (this.steps.isEmpty()) {
	      return; // Nowhere to go
	    }

	    // Add new item to the cart
	    this.cart.createItem();

	    // Reset cart item steps
	    this.steps.forEach(step => {
	      if (step.getCartContext() === 'cart item') {
	        step.reset();
	      }
	    });

	    // Switch to the first step
	    let firstStepId = this.steps.firstKey();
	    this.switchStep(firstStepId);
	    this.isCurrentStepHiddenGoToNextStep();
	  }

	  /**
	   * @param {String} stepId
	   */
	  goToStep(stepId) {
	    this.switchStep(stepId);
	  }

	  /**
	   * @since 1.19.0
	   * @return {String} Step Id
	   */
	  getFirstVisibleStepId() {
	    let firstVisibleStepId = null;
	    this.steps.forEach(step => {
	      if (step.isHiddenStep === false) {
	        firstVisibleStepId = step.stepId;
	        return false;
	      }
	    });
	    return firstVisibleStepId;
	  }

	  /**
	   * @since 1.19.0
	   * @param {String} stepId
	   * @return {boolean}
	   */
	  isFirstVisibleStepId(stepId) {
	    return this.getFirstVisibleStepId() === stepId;
	  }

	  /**
	   * @access protected
	   *
	   * @param {String} newStepId
	   */
	  switchStep(newStepId) {
	    let newStep = this.steps.find(newStepId);
	    if (newStep == null) {
	      return; // Step not found
	    }

	    if (this.isFirstVisibleStepId(newStepId)) {
	      newStep.hideButtonBack();
	    }

	    // Hide current step
	    if (this.currentStep != null) {
	      this.currentStep.hide();
	    }
	    this.currentStep = newStep;
	    this.currentStepId = newStepId;

	    // Load and show new step
	    newStep.load();
	    newStep.ready().finally(() => newStep.show());
	  }
	  reset() {
	    this.cart.reset();

	    // goToFirstStep() will also do the cart.createItem() after the reset
	    this.goToFirstStep();

	    // Cart item steps already reseted. Reset all other steps.
	    this.steps.forEach(step => {
	      if (step.getCartContext() !== 'cart item') {
	        step.reset();
	      }
	    });
	  }
	}

	/**
	 * @abstract
	 *
	 * @since 1.0
	 */
	class AbstractStep {
	  /**
	   * @param {Object} $element jQuery element.
	   * @param {Cart} cart
	   *
	   * @since 1.0
	   */
	  constructor($element, cart) {
	    this.$element = $element;
	    this.cart = cart;
	    this.setupProperties();
	    this.addListeners();
	  }

	  /**
	   * @access protected
	   *
	   * @since 1.0
	   */
	  setupProperties() {
	    this.stepId = this.theId();
	    this.schema = this.propertiesSchema();
	    this.isActive = false;
	    this.isLoaded = false;
	    this.isHiddenStep = false;
	    this.preventReact = false; // See setProperty()
	    this.preventUpdate = false; // See setProperty()

	    this.hideButtons = false; // Hide buttons if one of the values is not
	    // valid. If false, then buttons will be
	    // disabled, but visible

	    this.readyPromise = null;
	    this.$buttons = this.$element.find('.mpa-actions');
	    this.$buttonBack = this.$buttons.find('.mpa-button-back');
	    this.$buttonNext = this.$buttons.find('.mpa-button-next');
	  }

	  /**
	   * @abstract
	   *
	   * @return {String}
	   *
	   * @access protected
	   *
	   * @since 1.0
	   */
	  theId() {
	    return 'abstract';
	  }

	  /**
	   * @return {String} 'cart'|'cart item'
	   *
	   * @since 1.9.0
	   */
	  getCartContext() {
	    return 'cart';
	  }

	  /**
	   * @return {Object} {Property name: {type, default}}
	   *
	   * @access protected
	   *
	   * @since 1.0
	   */
	  propertiesSchema() {
	    return {};
	  }

	  /**
	   * @access protected
	   *
	   * @since 1.0
	   */
	  addListeners() {
	    this.$buttonBack.on('click', this.cancel.bind(this));
	    this.$buttonNext.on('click', this.submit.bind(this));
	  }

	  /**
	   * @since 1.0
	   */
	  load() {
	    if (!this.isLoaded) {
	      this.readyPromise = this.loadEntities();
	      this.isLoaded = true;
	    } else {
	      this.readyPromise = this.reload();
	    }
	  }

	  /**
	   * @return {Promise}
	   * @access protected
	   *
	   * @since 1.0
	   */
	  loadEntities() {
	    return Promise.resolve(this);
	  }

	  /**
	   * @return {Promise}
	   * @access protected
	   *
	   * @since 1.0
	   */
	  reload() {
	    return Promise.resolve(this);
	  }

	  /**
	   * Reset step before a new item.
	   *
	   * @since 1.4.0
	   * @abstract
	   */
	  reset() {}

	  /**
	   * @return {Promise}
	   *
	   * @since 1.0
	   */
	  ready() {
	    return this.readyPromise;
	  }

	  /**
	   * @abstract
	   *
	   * @return {Boolean}
	   *
	   * @since 1.0
	   */
	  isValidInput() {
	    return false;
	  }

	  /**
	   * @param {String} propertyName
	   * @param {*} value
	   *
	   * @since 1.0
	   */
	  setProperty(propertyName, value) {
	    if (this.preventUpdate) {
	      return;
	    }
	    let newValue = this.validateProperty(propertyName, value);

	    // Do nothing if nothing changed
	    if (newValue === this[propertyName]) {
	      return;
	    }

	    // Is it a change of the dependent property?
	    let isChain = this.preventReact;

	    // Block excess reacts and update linked values
	    this.preventReact = true;
	    this.updateProperty(propertyName, newValue);

	    // Run react() after all changes (once)
	    if (!isChain) {
	      if (this.isActive) {
	        this.react();
	      }
	      this.preventReact = false;
	    }
	  }

	  /**
	   * @param {String} propertyName
	   *
	   * @since 1.0
	   */
	  resetProperty(propertyName) {
	    this.setProperty(propertyName);
	  }

	  /**
	   * @param {String} propertyName
	   * @param {*} value
	   * @return {*}
	   *
	   * @access protected
	   *
	   * @since 1.0
	   */
	  validateProperty(propertyName, value) {
	    let validValue = value;
	    if (propertyName in this.schema) {
	      let propertySchema = this.schema[propertyName];
	      if (value == null) {
	        validValue = propertySchema.default;
	      } else {
	        switch (propertySchema.type) {
	          case 'bool':
	            validValue = mpa_boolval(value);
	            break;
	          case 'integer':
	            validValue = mpa_intval(value);
	            break;
	        }

	        // Check allowed options (but don't check empty values, like 0
	        // or "" - they are kind of allowed (to filter dependent fields))
	        if (!mpa_empty(validValue) && propertySchema.options != undefined) {
	          let isAllowed = propertySchema.options.indexOf(validValue) >= 0;

	          // If new value is not allowed, then don't change the value
	          if (!isAllowed) {
	            validValue = this[propertyName];
	          }
	        }
	      } // If value not null
	    } else if (value == undefined) {
	      validValue = null;
	    }
	    return validValue;
	  }

	  /**
	   * Executed only when the new value is different from the old one.
	   *
	   * @param {String} propertyName
	   * @param {*} newValue
	   *
	   * @access protected
	   *
	   * @since 1.0
	   */
	  updateProperty(propertyName, newValue) {
	    let oldValue = this[propertyName];
	    this[propertyName] = newValue;
	    this.afterUpdate(propertyName, newValue, oldValue);
	  }

	  /**
	   * Executed only when the new value is different from the old one.
	   *
	   * @param {String} propertyName
	   * @param {*} newValue
	   * @param {*} oldValue
	   *
	   * @access protected
	   *
	   * @since 1.0
	   * @since 1.5.0 added the <code>oldValue</code> argument.
	   */
	  afterUpdate(propertyName, newValue, oldValue) {}

	  /**
	   * @access protected
	   *
	   * @since 1.0
	   */
	  react() {
	    let inputsValid = this.isValidInput();
	    this.$buttonNext.prop('disabled', !inputsValid);
	    if (this.hideButtons) {
	      this.$buttons.toggleClass('mpa-hide', !inputsValid);
	    }
	  }

	  /**
	   * @since 1.0
	   */
	  show() {
	    // Set active
	    this.enable();

	    // Update elements due to the state
	    this.react();

	    // Show element
	    this.$element.removeClass('mpa-hide');

	    // Hide loading GIF
	    this.readyPromise.finally(() => this.showReady());
	  }

	  /**
	   * @access protected
	   *
	   * @since 1.0
	   */
	  showReady() {
	    // Hide loading GIF
	    this.$element.addClass('mpa-loaded');

	    // Show buttons
	    if (!this.hideButtons) {
	      this.$buttons.removeClass('mpa-hide');
	    }
	  }

	  /**
	   * @since 1.0
	   */
	  hide() {
	    // Set inactive
	    this.disable();

	    // Hide element
	    this.$element.addClass('mpa-hide');
	  }

	  /**
	   * @access protected
	   *
	   * @since 1.0
	   */
	  enable() {
	    this.isActive = true;
	    this.$buttonBack.prop('disabled', false);
	    this.$buttonNext.prop('disabled', false);
	  }

	  /**
	   * @access protected
	   *
	   * @since 1.0
	   */
	  disable() {
	    this.isActive = false;
	    this.$buttonBack.prop('disabled', true);
	    this.$buttonNext.prop('disabled', true);
	  }

	  /**
	   * @since 1.0
	   */
	  cancel(event) {
	    if (typeof event !== 'undefined') {
	      event.stopPropagation();
	    }
	    if (!this.isActive) {
	      return;
	    }

	    // Stop editing
	    this.disable();

	    // Trigger as cancelled
	    this.triggerBack();
	  }

	  /**
	   * @since 1.0
	   */
	  submit(event) {
	    if (typeof event !== 'undefined') {
	      event.stopPropagation();
	    }
	    if (!this.isActive || !this.isValidInput()) {
	      return;
	    }

	    // Stop editing
	    this.disable();

	    // Submit data
	    let submitted = this.maybeSubmit();
	    if (submitted == undefined) {
	      // No response - take it as a success
	      this.triggerNext();
	    } else if (typeof submitted !== 'object') {
	      // If not a Promise
	      // Succeded or failed
	      submitted ? this.triggerNext() : this.cancelSubmission();
	    } else {
	      // Wait for a Promise
	      submitted.then(
	      // executes if submitted will be resolved
	      this.triggerNext.bind(this),
	      // executes if submitted will be rejected
	      this.cancelSubmission.bind(this));
	    }
	  }

	  /**
	   * @since 1.0
	   * @since 1.5.0 may return <code>Promise</code>.
	   *
	   * @access protected
	   *
	   * @return {*}
	   */
	  maybeSubmit() {}

	  /**
	   * @since 1.5.0
	   *
	   * @access protected
	   */
	  cancelSubmission() {
	    this.enable();
	    this.react();
	  }

	  /**
	   * @access protected
	   *
	   * @since 1.0
	   */
	  triggerBack() {
	    this.$element.trigger('mpa_booking_step_back', {
	      step: this.stepId
	    });
	  }

	  /**
	   * @access protected
	   *
	   * @since 1.0
	   */
	  triggerNext() {
	    this.$element.trigger('mpa_booking_step_next', {
	      step: this.stepId
	    });
	  }

	  /**
	   * @since 1.19.0
	   */
	  hideButtonBack() {
	    this.$buttonBack.prop('disabled', true);
	    this.$buttonBack.toggleClass('mpa-hide', true);
	  }
	}

	/**
	 * @since 1.0
	 */
	class StepBooking extends AbstractStep {
	  /**
	   * @access protected
	   *
	   * @since 1.0
	   */
	  setupProperties() {
	    super.setupProperties();
	    this.hideButtons = true;
	    this.isPosted = false;
	    this.isBooked = false;
	    this.$message = this.$element.find('.mpa-message').first();
	    this.$buttonReset = this.$buttons.find('.mpa-button-reset');
	  }

	  /**
	   * @return {Promise}
	   * @access protected
	   *
	   * @since 1.0
	   */
	  reload() {
	    this.isPosted = false;
	    this.isBooked = false;
	    this.setMessage(__('Making a reservation...', 'motopress-appointment') + ' <span class="mpa-preloader"></span>');
	    return Promise.resolve(this);
	  }

	  /**
	   * @since 1.6.2
	   * @access protected
	   */
	  addListeners() {
	    super.addListeners();
	    this.$buttonReset.on('click', this.resetForm.bind(this));
	  }

	  /**
	   * @return {String}
	   *
	   * @access protected
	   *
	   * @since 1.0
	   */
	  theId() {
	    return 'booking';
	  }

	  /**
	   * @since 1.6.2
	   * @access protected
	   */
	  react() {
	    if (!this.isPosted) {
	      return;
	    }
	    this.$buttons.removeClass('mpa-hide');
	    this.$buttonBack.toggleClass('mpa-hide', this.isBooked);
	    this.$buttonReset.toggleClass('mpa-hide', !this.isBooked || this.isRedirectNeeded());
	  }

	  /**
	   * @since 1.0
	   */
	  show() {
	    super.show();

	    // Book services
	    mpa_rest_post('/bookings', this.cart.toArray()).then(response => {
	      this.isPosted = this.isBooked = true;
	      this.setMessage(response.message);
	      if (this.isRedirectNeeded()) {
	        this.redirectPayment();
	      } else {
	        this.react();
	      }
	    }, error => {
	      this.isPosted = true;
	      this.setMessage(error.message);
	      this.react();
	    });
	  }

	  /**
	   * @since 1.6.2
	   * @access protected
	   */
	  showReady() {
	    super.showReady();
	    this.$buttonBack.addClass('mpa-hide');
	    this.$buttonReset.addClass('mpa-hide');
	  }

	  /**
	   * @param {String} message
	   *
	   * @since 1.0
	   */
	  setMessage(message) {
	    this.$message.html(message);
	  }

	  /**
	   * Redirect to complete the payment.
	   *
	   * @since 1.6.2
	   */
	  redirectPayment() {
	    let paymentDetails = this.cart.getPaymentDetails();
	    window.location.href = paymentDetails.redirect_url;
	  }

	  /**
	   * @since 1.6.2
	   * @access protected
	   */
	  isRedirectNeeded() {
	    let paymentDetails = this.cart.getPaymentDetails();
	    return 'redirect_url' in paymentDetails && paymentDetails.redirect_url != '';
	  }

	  /**
	   * @since 1.6.2
	   * @access protected
	   */
	  resetForm(event) {
	    event.preventDefault();
	    if (this.isPosted && this.isBooked) {
	      this.$element.trigger('mpa_reset_booking');
	    }
	  }
	}

	/**
	 * @param {Object} atts
	 * @return {String}
	 *
	 * @since 1.0
	 */
	function mpa_tmpl_atts(atts) {
	  let output = '';
	  for (let name in atts) {
	    output += ' ' + name + '="' + atts[name] + '"';
	  }
	  return output;
	}

	/**
	 * @param {String} label
	 * @param {Object} atts
	 * @return {String}
	 *
	 * @since 1.0
	 */
	function mpa_tmpl_button(label, atts = {}) {
	  atts = jQuery.extend({}, {
	    type: 'button',
	    'class': 'button'
	  }, atts);
	  return '<button' + mpa_tmpl_atts(atts) + '>' + label + '</button>';
	}

	/**
	 * @since 1.0.0
	 * @since 1.4.0 builds output only by template. Added the <code>$template</code> argument.
	 *
	 * @param {CartItem} cartItem
	 * @param {Object} $template
	 * @return {String}
	 */
	function mpa_tmpl_cart_item(cartItem, $template) {
	  let selectors = {
	    // Template tag:			jQuery selector
	    service_id: '.mpa-service-id',
	    service_name: '.mpa-service-name',
	    service_thumbnail: '.mpa-service-thumbnail',
	    employee_id: '.mpa-employee-id',
	    employee_name: '.mpa-employee-name',
	    location_id: '.mpa-location-id',
	    location_name: '.mpa-location-name',
	    reservation_date: '.mpa-reservation-date',
	    // Public date string
	    reservation_save_date: '.mpa-reservation-save-date',
	    // Internal date string

	    reservation_time: '.mpa-reservation-time',
	    // Public start time string
	    reservation_period: '.mpa-reservation-period',
	    // Public period time string
	    reservation_save_period: '.mpa-reservation-save-period',
	    // Internal period time string

	    reservation_capacity: '.mpa-reservation-capacity',
	    // Wrapper for <select> with capacity options
	    reservation_clients: '.mpa-reservation-clients',
	    // Only the capacity <option>'s
	    reservation_clients_count: '.mpa-reservation-clients-count',
	    // Capacity number: "1", "2" etc.

	    reservation_price: '.mpa-reservation-price'
	  };

	  // Generate new item
	  let $cartItem = $template.clone();

	  // Set cart ID
	  $cartItem.attr('data-id', cartItem.getItemId());

	  // Replace all tags
	  for (let tagName in selectors) {
	    let selector = selectors[tagName];
	    let $element = $cartItem.find(selector).first();
	    let elementHtml = $element.length > 0 ? $element.html() : '';
	    let tag = '{' + tagName + '}';
	    if (!elementHtml.includes(tag)) {
	      continue;
	    }
	    let content = '';
	    switch (tagName) {
	      case 'service_id':
	        content = cartItem.service.id;
	        break;
	      case 'service_name':
	        content = cartItem.service.name;
	        break;
	      case 'service_thumbnail':
	        content = mpa_tmpl_thumbnail_image(cartItem.service.thumbnail);
	        break;
	      case 'employee_id':
	        content = cartItem.employee.id;
	        break;
	      case 'employee_name':
	        content = cartItem.employee.name;
	        break;
	      case 'location_id':
	        content = cartItem.location.id;
	        break;
	      case 'location_name':
	        content = cartItem.location.name;
	        break;
	      case 'reservation_date':
	        content = mpa_format_date(cartItem.date);
	        break;
	      case 'reservation_save_date':
	        content = mpa_format_date(cartItem.date, 'internal');
	        break;
	      case 'reservation_time':
	        content = mpa_format_time(cartItem.time.startTime);
	        break;
	      case 'reservation_period':
	        content = cartItem.time.toString();
	        break;
	      case 'reservation_save_period':
	        content = cartItem.time.toString('internal');
	        break;
	      case 'reservation_capacity':
	        let capacityRange = cartItem.service.getCapacityRange(cartItem.employee.id);
	        let capacityVariants = mpa_array_combine(capacityRange, capacityRange);
	        content = mpa_tmpl_select(capacityVariants, cartItem.capacity);
	        break;
	      case 'reservation_clients':
	        let capacityLimits = cartItem.service.getCapacityRange(cartItem.employee.id);
	        let capacityClients = mpa_array_combine(capacityLimits, capacityLimits);
	        content = mpa_tmpl_select_options(capacityClients, cartItem.capacity);
	        break;
	      case 'reservation_clients_count':
	        content = cartItem.capacity;
	        break;
	      case 'reservation_price':
	        let employeeId = cartItem.employee.id;
	        let price = cartItem.service.getPrice(employeeId, cartItem.capacity);
	        content = mpa_tmpl_price(price);
	        break;
	    }
	    $element.html($element.html().replace(tag, content));
	  } // For each tag

	  // Replace {item_id} with the actual ID
	  $cartItem.find('[name*="{item_id}"]').each((i, element) => {
	    element.name = element.name.replace('{item_id}', cartItem.getItemId());
	  });

	  // hide capacity if we have only one possible client
	  if (1 === cartItem.service.getCapacityRange().length) {
	    $cartItem.find('.cell-people').addClass('mpa-hide');
	  }
	  return $cartItem;
	}

	/**
	 * @since 1.4.0
	 * @see Cart.getOrder()
	 *
	 * @param {Object} order
	 * @return {String}
	 */
	function mpa_tmpl_order(order) {
	  let output = '';
	  output += '<table class="mpa-order widefat">';
	  output += '<tbody>';
	  for (let product of order.products) {
	    output += '<tr class="mpa-order-service">';
	    output += '<td class="column-service">' + product.name + '</td>';
	    output += '<td class="column-price">' + mpa_tmpl_price_number(product.price) + '</td>';
	    output += '</tr>';
	  }

	  // Show subtotal price
	  output += '<tr class="mpa-order-subtotal">';
	  output += '<th class="column-subtotal">' + __('Subtotal', 'motopress-appointment') + '</th>';
	  output += '<th class="column-price">' + mpa_tmpl_price_number(order.subtotal) + '</th>';
	  output += '</tr>';
	  output += '</tbody>';
	  output += '<tfoot>';
	  if (order.coupon) {
	    output += '<tr class="mpa-order-coupon">';
	    output += '<th class="column-coupon">';
	    output +=
	    // Translators: %s: Coupon code.
	    __('Coupon: %s', 'motopress-appointment').replace('%s', order.coupon.code);
	    output += '</th>';
	    output += '<td class="column-price">';
	    output += mpa_tmpl_price_number(-order.coupon.amount);
	    output += ' ';
	    output += '<a href="#" class="mpa-remove-coupon">' + __('Remove', 'motopress-appointment') + '</a>';
	    output += '</td>';
	    output += '</tr>';
	  }

	  // Shot total price
	  output += '<tr class="mpa-order-total">';
	  output += '<th class="column-total">' + __('Total', 'motopress-appointment') + '</th>';
	  output += '<th class="column-price">' + mpa_tmpl_price_number(order.total) + '</th>';
	  output += '</tr>';
	  output += '</tfoot>';
	  output += '</table>';
	  return output;
	}

	/**
	 * @since 1.14.0
	 * @see Cart.getOrder()
	 *
	 * @param {Object} order
	 * @return {String}
	 */
	function mpa_tmpl_deposit(order) {
	  const leftToPay = parseFloat(order.total) - parseFloat(order.deposit);
	  let output = '';
	  if (leftToPay > 0) {
	    output += '<table class="widefat">';
	    output += '<tbody>';
	    output += '<tr class="mpa-deposit-title">';
	    output += '<td class="column-title" colspan="2">';
	    output += __('Deposit', 'motopress-appointment');
	    output += '</td>';
	    output += '</tr>';
	    output += '<tr class="mpa-deposit-now">';
	    output += '<th class="column-title">';
	    output += __('Paying now', 'motopress-appointment');
	    output += '</th>';
	    output += '<th class="column-price">';
	    output += mpa_tmpl_price_number(order.deposit);
	    output += '</th>';
	    output += '</tr>';
	    output += '<tr class="mpa-deposit-left">';
	    output += '<th class="column-title">';
	    output += __('Left to pay', 'motopress-appointment');
	    output += '</th>';
	    output += '<th class="column-price">';
	    output += mpa_tmpl_price_number(leftToPay);
	    output += '</th>';
	    output += '</tr>';
	    output += '</tbody>';
	    output += '</table>';
	  }
	  return output;
	}

	/**
	 * @param {Number} price
	 * @param {Object} args
	 * @return {String}
	 *
	 * @since 1.0
	 */
	function mpa_tmpl_price(price, args = {}) {
	  let settings = mpapp().settings();
	  args = jQuery.extend({
	    currency_symbol: settings.getCurrencySymbol(),
	    currency_position: settings.getCurrencyPosition(),
	    decimal_separator: settings.getDecimalSeparator(),
	    thousand_separator: settings.getThousandSeparator(),
	    decimals: settings.getDecimalsCount(),
	    literal_free: true,
	    trim_zeros: true
	  }, args);
	  let priceString = mpa_number_format(Math.abs(price), args.decimals, args.decimal_separator, args.thousand_separator);
	  let classes = 'mpa-price';
	  if (price == 0) {
	    classes += ' mpa-zero-price';
	  }
	  if (price == 0 && args.literal_free) {
	    // Use text 'Free' as a price string
	    classes += ' mpa-price-free';
	    priceString = _x('Free', 'Zero price', 'motopress-appointment');
	  } else {
	    // Trim zeros
	    if (args.trim_zeros) {
	      priceString = mpa_trim_price(priceString);
	    }

	    // Add currency to the price
	    let currencySpan = '<span class="mpa-currency">' + args.currency_symbol + '</span>';
	    switch (args.currency_position) {
	      case 'before':
	        priceString = currencySpan + priceString;
	        break;
	      case 'after':
	        priceString = priceString + currencySpan;
	        break;
	      case 'before_with_space':
	        priceString = currencySpan + '&nbsp;' + priceString;
	        break;
	      case 'after_with_space':
	        priceString = priceString + '&nbsp;' + currencySpan;
	        break;
	    }

	    // Add sign
	    if (price < 0) {
	      priceString = '-' + priceString;
	    }
	  }
	  let priceHtml = '<span class="' + classes + '">' + priceString + '</span>';
	  return priceHtml;
	}

	/**
	 * @since 1.4.0
	 *
	 * @param {Number} price
	 * @param {Object} args Optional. See mpa_tmpl_price() for details.
	 * @return {String}
	 */
	function mpa_tmpl_price_number(price, args = {}) {
	  // Force number for all results
	  args.literal_free = false;
	  return mpa_tmpl_price(price, args);
	}

	/**
	 * @param {Object} options
	 * @param {*} selected
	 * @param {Object} atts Optional. {} by default.
	 * @return {String}
	 *
	 * @since 1.0
	 */
	function mpa_tmpl_select(options, selected, atts = {}) {
	  let output = '<select' + mpa_tmpl_atts(atts) + '>';
	  output += mpa_tmpl_select_options(options, selected);
	  output += '</select>';
	  return output;
	}

	/**
	 * @param {String|Number} value
	 * @param {String} label
	 * @param {Boolean} isSelected
	 * @return {String}
	 *
	 * @since 1.0
	 */
	function mpa_tmpl_select_option(value, label, isSelected = false) {
	  let output = '';
	  let selectedAttr = isSelected ? ' selected="selected"' : '';
	  output = '<option value="' + value + '"' + selectedAttr + '>';
	  output += label;
	  output += '</option>';
	  return output;
	}

	/**
	 * @param {Object} options
	 * @param {*} selected
	 * @return {String}
	 *
	 * @since 1.0
	 */
	function mpa_tmpl_select_options(options, selected) {
	  let output = '';
	  for (let value in options) {
	    output += mpa_tmpl_select_option(value, options[value], value == selected);
	  }
	  return output;
	}

	/**
	 * @param {Object} $select jQuery element.
	 * @param {Object} emptyOptions '— Select —'/'— Any —' value.
	 * @param {Object} allowedOptions All other values.
	 * @param {*} selected Selected option value.
	 *
	 * @since 1.19.0
	 */
	function update_select_options($select, emptyOptions, allowedOptions, selected) {
	  let emptyOptionsHtml = mpa_tmpl_select_options(emptyOptions, selected);
	  let allowedOptionsHtml = mpa_tmpl_select_options(allowedOptions, selected);
	  let optionsHtml = emptyOptionsHtml + allowedOptionsHtml;
	  $select.empty().append(optionsHtml).val(selected);
	}

	/**
	 * @since 1.4.0
	 *
	 * @param {String} imageUrl
	 * @return {String}
	 */
	function mpa_tmpl_thumbnail_image(imageUrl) {
	  let {
	    width,
	    height
	  } = mpapp().settings().getThumbnailSize();
	  let atts = {
	    width,
	    height,
	    src: imageUrl,
	    'class': 'attachment-thumbnail size-thumbnail'
	  };
	  return '<img' + mpa_tmpl_atts(atts) + '>';
	}

	/**
	 * @since 1.4.0
	 */
	class StepCart extends AbstractStep {
	  /**
	   * @since 1.4.0
	   * @access protected
	   */
	  setupProperties() {
	    super.setupProperties();
	    this.isBeginCheckoutEventSent = false;
	    this.$cart = this.$element.find('.mpa-cart');
	    this.$items = this.$cart.find('.mpa-cart-items');
	    this.$itemTemplate = this.$cart.find('.mpa-cart-item-template');
	    this.$noItems = this.$element.find('.no-items'); // May be out of the .mpa-cart

	    this.$totalPrice = this.$element.find('.mpa-cart-total-price');
	    this.$buttonNew = this.$buttons.find('.mpa-button-new');
	  }

	  /**
	   * @since 1.4.0
	   * @access protected
	   *
	   * @return {String}
	   */
	  theId() {
	    return 'cart';
	  }

	  /**
	   * @since 1.4.0
	   * @access protected
	   */
	  addListeners() {
	    super.addListeners();
	    this.$buttonNew.on('click', this.createNew.bind(this));
	  }

	  /**
	   * @since 1.4.0
	   */
	  load() {
	    // Remove template from the cart
	    this.$itemTemplate.remove();
	    this.$itemTemplate.removeClass('mpa-cart-item-template');
	    this.updateActiveItemCapacity();
	    this.refreshCart();
	    this.isLoaded = true;
	    this.readyPromise = Promise.resolve(this);
	  }

	  /**
	   * @since 1.6.2
	   */
	  reset() {
	    this.$items.find('.mpa-cart-item').remove();
	    this.$noItems.removeClass('mpa-hide');
	    this.isBeginCheckoutEventSent = false;
	  }

	  /**
	   * @since 1.4.0
	   * @access protected
	   */
	  updateActiveItemCapacity() {
	    let cartItem = this.cart.getActiveItem();
	    if (!cartItem) {
	      return;
	    }
	    let service = cartItem.service;
	    let employeeId = cartItem.employee.id;
	    let minCapacity = service.getMinCapacity(employeeId);
	    let maxCapacity = service.getMaxCapacity(employeeId);

	    // Validate capacity to the limits of the new employee
	    cartItem.capacity = mpa_limit(cartItem.capacity, minCapacity, maxCapacity);
	  }

	  /**
	   * @since 1.4.0
	   * @access protected
	   */
	  refreshCart() {
	    let activeCartItemId = this.cart.getActiveItemId();

	    // Add new items
	    this.cart.items.forEach((cartItem, _, cartItemId) => {
	      let itemSelector = '.mpa-cart-item[data-id="' + cartItemId + '"]';
	      let $cartItem = this.$items.find(itemSelector);
	      if ($cartItem.length === 0) {
	        // Add new item
	        $cartItem = this.addItem(cartItem);
	        this.bindListeners($cartItem);
	      } else if (cartItemId === activeCartItemId) {
	        // Update active item (only)
	        $cartItem = this.updateItem($cartItem, cartItem);
	        this.bindListeners($cartItem);
	      }
	    });

	    // Update total price
	    this.updateTotalPrice();
	  }

	  /**
	   * @since 1.4.0
	   * @access protected
	   *
	   * @param {CartItem} cartItem
	   * @return {Object} New cart item element (jQuery object).
	   */
	  addItem(cartItem) {
	    let $cartItem = mpa_tmpl_cart_item(cartItem, this.$itemTemplate);
	    this.$items.append($cartItem);
	    this.$noItems.addClass('mpa-hide');
	    return $cartItem;
	  }

	  /**
	   * @since 1.4.0
	   * @access protected
	   *
	   * @param {Object} $foundItem Existing item (jQuery element).
	   * @param {CartItem} cartItem
	   * @return {Object} New cart item element (jQuery object).
	   */
	  updateItem($cartItem, cartItem) {
	    let $newCartItem = mpa_tmpl_cart_item(cartItem, this.$itemTemplate);
	    $cartItem.replaceWith($newCartItem);
	    return $newCartItem;
	  }

	  /**
	   * @since 1.4.0
	   *
	   * @param {Object} $item
	   */
	  bindListeners($item) {
	    let cartItemId = $item.data('id');
	    let cartItem = this.cart.getItem(cartItemId);
	    let $people = $item.find('.mpa-reservation-capacity select, .mpa-reservation-clients select');
	    let $price = $item.find('.mpa-reservation-price');
	    let $removeButton = $item.find('.mpa-button-remove, .mpa-button-edit-or-remove');
	    let $updateButton = $item.find('.mpa-button-edit, .mpa-button-edit-or-remove');

	    // Change cart item capacity and prices when amount of people changes
	    $people.on('change', event => {
	      let newCapacity = mpa_intval(event.target.value);
	      let employeeId = cartItem.employee.id;

	      // Update item capacity
	      cartItem.capacity = newCapacity;

	      // Update item price
	      let itemPrice = cartItem.service.getPrice(employeeId, newCapacity);
	      $price.html(mpa_tmpl_price(itemPrice));

	      // Update total price
	      this.updateTotalPrice();
	    });

	    // Add "Remove" listener
	    if (this.isMultibookingEnabled()) {
	      $removeButton.on('click', event => {
	        event.stopPropagation();

	        // Remove item element
	        $item.remove();

	        // Remove item from the cart
	        let removedCartItem = this.cart.getItem(cartItemId);
	        this.cart.removeItem(cartItemId);
	        if (this.cart.isEmpty()) {
	          this.$noItems.removeClass('mpa-hide');
	        }

	        // React to changes
	        this.updateTotalPrice();
	        this.react();
	        document.dispatchEvent(new CustomEvent('mpa_remove_from_cart', {
	          detail: {
	            cartItem: removedCartItem,
	            currencyCode: mpapp().settings().getCurrency()
	          }
	        }));
	      });
	    }

	    // Add "Update" listener
	    if (!this.isMultibookingEnabled()) {
	      $updateButton.on('click', () => {
	        this.cart.setActiveItem(cartItemId);

	        // Go back
	        this.cancel();
	      });
	    }
	  }

	  /**
	   * @since 1.4.0
	   * @access protected
	   */
	  updateTotalPrice() {
	    this.$totalPrice.html(mpa_tmpl_price_number(this.cart.getTotalPrice()));
	  }
	  isMultibookingEnabled() {
	    return mpapp().settings().isMultibookingEnabled();
	  }

	  /**
	   * @since 1.4.0
	   *
	   * @return {Boolean}
	   */
	  isValidInput() {
	    return !this.cart.isEmpty();
	  }

	  /**
	   * @since 1.4.0
	   * @access protected
	   */
	  createNew() {
	    if (!this.isActive) {
	      return;
	    }

	    // Stop editing
	    this.disable();

	    // Trigger as cancelled
	    this.triggerNew();
	  }

	  /**
	   * @since 1.4.0
	   * @access protected
	   */
	  triggerNew() {
	    this.$element.trigger('mpa_booking_step_new', {
	      step: this.stepId
	    });
	  }

	  /**
	   * @access protected
	   */
	  maybeSubmit() {
	    if (!this.isBeginCheckoutEventSent) {
	      document.dispatchEvent(new CustomEvent('mpa_begin_checkout', {
	        detail: {
	          cart: this.cart,
	          currencyCode: mpapp().settings().getCurrency()
	        }
	      }));
	      this.isBeginCheckoutEventSent = true;
	    }
	  }
	}

	const KEY_ENTER = 'Enter';

	/**
	 * @since 1.11.0
	 */
	class CouponSection {
	  /**
	   * @param {jQuery} $element
	   * @param {Cart} cart
	   */
	  constructor($element, cart) {
	    this.cart = cart;
	    this.$element = $element;
	    this.$couponCode = $element.find('[name="coupon_code"]');
	    this.$applyButton = $element.find('.mpa-apply-coupon-button');
	    this.$messageHolder = $element.find('.mpa-message-wrapper');
	    this.$preloader = $element.find('.mpa-preloader');
	    this.$parentForm = $element.parents('.mpa-booking-step').first();
	    this.addListeners();
	  }

	  /**
	   * @access protected
	   */
	  addListeners() {
	    this.$couponCode.on('keydown', event => {
	      if (event.code === KEY_ENTER) {
	        this.onEnter(event);
	      }
	    });
	    this.$applyButton.on('click', this.onSubmit.bind(this));
	  }

	  /**
	   * Triggers when user types [Enter] in the input field.
	   *
	   * @access protected
	   *
	   * @param {Event} event
	   */
	  onEnter(event) {
	    event.preventDefault();
	    event.stopPropagation();
	    this.applyCouponCode(event.target.value);
	  }

	  /**
	   * Triggers when user clicks "Apply" button.
	   *
	   * @access protected
	   *
	   * @param {Event} event
	   */
	  onSubmit(event) {
	    event.preventDefault();
	    event.stopPropagation();
	    this.applyCouponCode(this.$couponCode.val());
	  }

	  /**
	   * @param {String} couponCode
	   */
	  applyCouponCode(couponCode) {
	    this.clearMessage();
	    if (!couponCode) {
	      this.setMessage(__('Coupon code is empty.', 'motopress-appointment'));
	      return;
	    }
	    this.pauseAll();
	    mpa_repositories().coupon().findByCode(couponCode).then(coupon => {
	      if (coupon.isApplicableForCart(this.cart)) {
	        this.cart.setCoupon(coupon);
	        this.reset();
	        this.triggerApplied(coupon);
	        this.setMessage(__('Coupon code applied successfully.', 'motopress-appointment'));
	      } else {
	        this.setMessage(__('Sorry, your booking is not eligible for this coupon.', 'motopress-appointment'));
	      }
	      this.unpauseAll();
	    }, error => {
	      this.setMessage(error.message);
	      this.unpauseAll();
	    });
	  }
	  reset() {
	    this.$couponCode.val('');
	    this.clearMessage();
	    this.enable();
	  }
	  disable() {
	    this.$couponCode.prop('disabled', true);
	    this.$applyButton.prop('disabled', true);
	  }
	  enable() {
	    this.$couponCode.prop('disabled', false);
	    this.$applyButton.prop('disabled', false);
	  }

	  /**
	   * @access protected
	   */
	  pauseAll() {
	    this.disable();
	    this.showPreloader();
	    this.$parentForm.trigger('mpa_booking_step_disable');
	  }

	  /**
	   * @access protected
	   */
	  unpauseAll() {
	    this.enable();
	    this.hidePreloader();
	    this.$parentForm.trigger('mpa_booking_step_enable');
	  }

	  /**
	   * @access protected
	   *
	   * @param {Coupon} coupon
	   */
	  triggerApplied(coupon) {
	    this.$parentForm.trigger('mpa_booking_coupon_applied', {
	      coupon
	    });
	  }

	  /**
	   * @param {String} message
	   */
	  setMessage(message) {
	    this.$messageHolder.html(message).removeClass('mpa-hide');
	  }
	  clearMessage() {
	    this.$messageHolder.html('').addClass('mpa-hide');
	  }

	  /**
	   * @access protected
	   */
	  showPreloader() {
	    this.$preloader.removeClass('mpa-hide');
	  }

	  /**
	   * @access protected
	   */
	  hidePreloader() {
	    this.$preloader.addClass('mpa-hide');
	  }
	}

	/**
	 * @since 1.0
	 */
	class StepCheckout extends AbstractStep {
	  /**
	   * @access protected
	   *
	   * @since 1.0
	   */
	  setupProperties() {
	    super.setupProperties();
	    this.name = '';
	    this.email = '';
	    this.phone = '';
	    this.notes = '';
	    this.acceptTerms = false;
	    this.createAccount = false;
	    this.$checkoutForm = this.$element.find('.mpa-checkout-form');
	    this.$name = this.$element.find('.mpa-customer-name');
	    this.$email = this.$element.find('.mpa-customer-email');
	    this.$phone = this.$element.find('.mpa-customer-phone');
	    this.$notes = this.$element.find('.mpa-customer-notes');
	    this.$order = this.$element.find('.mpa-order');
	    if (mpapp().settings().getTermsPageIdForAcceptance()) {
	      this.$acceptTerms = this.$element.find('.mpa-accept-terms');
	    }
	    this.$messageHolder = this.$element.find('.mpa-message').first();
	    this.$preloader = this.$element.find('.mpa-loading');
	    if (mpapp().settings().isAllowCustomerAccountCreation()) {
	      this.$createAccount = this.$element.find('.mpa-customer-create-account');
	      this.$createAccountDescription = this.$element.find('.mpa-customer-create-account-description');

	      // Set default value of property createAccount.
	      // Actually for mode: 'Customer account creation' = 'create_automatically'
	      this.setProperty('createAccount', this.$createAccount.prop('checked'));
	    }
	    if (window.MPA_CURRENT_CUSTOMER !== undefined) {
	      this.setProperty('name', window.MPA_CURRENT_CUSTOMER.name);
	      this.$name.val(window.MPA_CURRENT_CUSTOMER.name);
	      this.setProperty('email', window.MPA_CURRENT_CUSTOMER.email);
	      this.$email.val(window.MPA_CURRENT_CUSTOMER.email);
	      this.setProperty('phone', window.MPA_CURRENT_CUSTOMER.phone);
	      let iti = window.intlTelInputGlobals.getInstance(this.$phone[0]);
	      // set phone number through itt to remove country code from number if it is there
	      iti.setNumber(window.MPA_CURRENT_CUSTOMER.phone);
	      // send event to validate phone number
	      this.$phone.trigger('input');
	    }
	    this.service = null;
	    this.couponSection = null;
	  }

	  /**
	   * @return {String}
	   *
	   * @access protected
	   *
	   * @since 1.0
	   */
	  theId() {
	    return 'checkout';
	  }

	  /**
	   * @return {Object} {Property name: {type, default}}
	   *
	   * @access protected
	   *
	   * @since 1.0
	   */
	  propertiesSchema() {
	    return {
	      name: {
	        type: 'string',
	        default: ''
	      },
	      email: {
	        type: 'string',
	        default: ''
	      },
	      phone: {
	        type: 'string',
	        default: ''
	      },
	      notes: {
	        type: 'string',
	        default: ''
	      },
	      acceptTerms: {
	        type: 'bool',
	        default: false
	      },
	      $createAccount: {
	        type: 'bool',
	        default: false
	      }
	    };
	  }

	  /**
	   * @access protected
	   *
	   * @since 1.0
	   */
	  addListeners() {
	    super.addListeners();
	    this.$checkoutForm.on('submit', event => false); // Disable submit

	    this.$name.on('input', event => this.setProperty('name', event.target.value));
	    this.$email.on('input', event => this.setProperty('email', event.target.value));
	    this.$phone.on('input', event => {
	      this.setProperty('phone', '');
	      let iti = window.intlTelInputGlobals.getInstance(this.$phone[0]);
	      if (iti.isValidNumber()) {
	        this.setProperty('phone', iti.getNumber(intlTelInputUtils.numberFormat.E164));
	      }
	    });
	    this.$phone.on("countrychange", event => {
	      this.setProperty('phone', '');
	      let iti = window.intlTelInputGlobals.getInstance(this.$phone[0]);
	      if (iti.isValidNumber()) {
	        this.setProperty('phone', iti.getNumber(intlTelInputUtils.numberFormat.E164));
	      }
	    });
	    this.$notes.on('input', event => this.setProperty('notes', event.target.value));
	    if (mpapp().settings().getTermsPageIdForAcceptance()) {
	      this.$acceptTerms.on('input', event => this.setProperty('acceptTerms', event.target.checked));
	    }
	    if (mpapp().settings().isAllowCustomerAccountCreation()) {
	      this.$createAccount.on('input', event => {
	        this.setProperty('createAccount', event.target.checked);
	        if (event.target.checked) {
	          this.$createAccountDescription.removeClass('mpa-hide');
	        } else {
	          this.$createAccountDescription.addClass('mpa-hide');
	        }
	      });
	    }
	    this.$element.on('mpa_booking_step_disable', this.disable.bind(this));
	    this.$element.on('mpa_booking_step_enable', this.enable.bind(this));
	    this.$element.on('mpa_booking_coupon_applied', () => this.updateOrder());
	  }

	  /**
	   * @since 1.4.0
	   */
	  load() {
	    // Initialize coupon section control
	    if (!this.couponSection) {
	      if (mpapp().settings().isCouponsEnabled()) {
	        this.couponSection = new CouponSection(this.$element.find('.mpa-coupon-details'), this.cart);
	      }
	    } else {
	      // Instead of reload()
	      this.couponSection.reset(); // Clear previous messages
	    }

	    // Is the coupon still applicable to the cart?
	    if (this.cart.hasCoupon()) {
	      this.cart.testCoupon();
	    }
	    this.updateOrder();
	    this.isLoaded = true;
	    this.readyPromise = Promise.resolve(this);
	  }

	  /**
	   * @since 1.6.2
	   */
	  reset() {
	    // do not clear name, email and phone for second reservation and nextes
	    this.$notes.val('');
	    // val() will not trigger 'input' event, so reset the properties manually
	    this.resetProperty('notes');
	    if (mpapp().settings().getTermsPageIdForAcceptance()) {
	      this.$acceptTerms.prop('checked', false);
	      this.resetProperty('acceptTerms');
	    }
	    if (mpapp().settings().isAllowCustomerAccountCreation()) {
	      this.clearMessage();
	      this.$createAccount.prop('checked', false);
	      this.resetProperty('createAccount');
	    }

	    // Reset coupon section
	    if (this.couponSection) {
	      this.couponSection.reset();
	    }
	  }

	  /**
	   * @since 1.4.0
	   * @access protected
	   */
	  updateOrder() {
	    if (this.$order.length === 0) {
	      return;
	    }
	    this.$order.empty();
	    this.$order.html(mpa_tmpl_order(this.cart.getOrder()));

	    // Bind remove coupon button
	    let $removeCoupon = this.$order.find('.mpa-remove-coupon');
	    if ($removeCoupon.length > 0) {
	      $removeCoupon.on('click', this.removeCoupon.bind(this));
	    }
	  }

	  /**
	   * @since 1.11.0
	   *
	   * @access protected
	   *
	   * @param {Event} event
	   */
	  removeCoupon(event) {
	    event.preventDefault();
	    event.stopPropagation();
	    this.cart.removeCoupon();
	    this.couponSection.clearMessage();
	    this.updateOrder();
	  }

	  /**
	   * @return {Boolean}
	   *
	   * @since 1.0
	   */
	  isValidInput() {
	    return this.isValidName() && this.isValidEmail() && this.isValidPhone() && this.isValidAcceptTerms();
	  }

	  /**
	   * @since 1.3.1
	   * @access protected
	   *
	   * @return {Boolean} 
	   */
	  isValidName() {
	    return this.name !== '';
	  }

	  /**
	   * @return {Boolean}
	   *
	   * @access protected
	   *
	   * @since 1.1.0
	   */
	  isValidEmail() {
	    return this.email !== '' && !!this.email.match(/.+@.+/);
	  }

	  /**
	   * @return {Boolean}
	   *
	   * @access protected
	   *
	   * @since 1.1.0
	   */
	  isValidPhone() {
	    let iti = window.intlTelInputGlobals.getInstance(this.$phone[0]);
	    return iti.isValidNumber();
	  }

	  /**
	   * @return {Boolean}
	   *
	   * @access protected
	   *
	   * @since 1.10.2
	   */
	  isValidAcceptTerms() {
	    return !mpapp().settings().getTermsPageIdForAcceptance() || mpapp().settings().isPaymentsEnabled() || this.acceptTerms;
	  }

	  /**
	   * @access protected
	   *
	   * @since 1.0
	   */
	  react() {
	    super.react();

	    // Always enable submit button to allow validation messages
	    this.$buttonNext.prop('disabled', false);
	  }

	  /**
	   * @param {String} message
	   *
	   * @since 1.18.0
	   */
	  setMessage(message) {
	    this.$messageHolder.html(message).removeClass('mpa-hide');
	  }

	  /**
	   * @since 1.18.0
	   */
	  clearMessage() {
	    this.$messageHolder.html('').addClass('mpa-hide');
	  }

	  /**
	   * @access protected
	   *
	   * @since 1.18.0
	   */
	  showPreloader() {
	    this.$preloader.removeClass('mpa-hide');
	  }

	  /**
	   * @access protected
	   *
	   * @since 1.18.0
	   */
	  hidePreloader() {
	    this.$preloader.addClass('mpa-hide');
	  }

	  /**
	   * @access protected
	   *
	   * @since 1.0
	   */
	  maybeSubmit() {
	    // Disable coupons section
	    if (this.couponSection) {
	      this.couponSection.disable();
	    }
	    this.cart.setCustomerDetails({
	      name: this.name,
	      email: this.email,
	      phone: this.phone,
	      notes: this.notes,
	      acceptTerms: this.acceptTerms
	    });
	    if (this.createAccount) {
	      this.showPreloader();
	      const customerData = {
	        name: this.name,
	        email: this.email,
	        phone: this.phone
	      };
	      return mpa_rest_post('/customers/create', customerData).then(customer => {
	        this.hidePreloader();
	        this.clearMessage();
	      }, error => {
	        this.hidePreloader();
	        this.setMessage(error);
	        throw error;
	      });
	    }
	  }
	}

	/**
	 * @since 1.5.0
	 */
	class PaymentGateway {
	  /**
	   * @since 1.5.0
	   * @access protected
	   */
	  setupProperties() {
	    /**
	     * @since 1.5.0
	     * @var {String}
	     */
	    this.gatewayId = 'basic';

	    /**
	     * @since 1.5.0
	     * @var {Object}
	     */
	    this.settings = this.getDefaults();

	    /**
	     * @since 1.5.0
	     * @var {Object}
	     */
	    this.$mountWrapper = null;

	    /**
	     * @since 1.5.0
	     * @var {Promise}
	     */
	    this.loadPromise = null;

	    /**
	     * @since 1.5.0
	     * @var {Boolean}
	     */
	    this.isEnabled = false;

	    /**
	     * @since 1.5.0
	     * @var {Boolean}
	     */
	    this.isMounted = false;

	    /**
	     * Input(s) have errors.
	     *
	     * @since 1.5.0
	     * @var {Boolean}
	     */
	    this.haveErrors = false;
	  }

	  /**
	   * @since 1.5.0
	   * @since 1.6.0 Added cart parameter
	   *
	   * @param {Object} $mountWrapper
	   */
	  constructor($mountWrapper, cart) {
	    this.setupProperties();
	    this.$mountWrapper = $mountWrapper;
	    this.cart = cart;
	  }

	  /**
	   * @since 1.5.0
	   *
	   * @return {Promise}
	   */
	  load() {
	    this.addListeners();
	    this.loadPromise = Promise.resolve(this);
	    return this.loadPromise;
	  }

	  /**
	   * @since 1.5.0
	   * @access protected
	   */
	  addListeners() {}

	  /**
	   * @since 1.5.0
	   */
	  onCartChange(cart) {}

	  /**
	   * @since 1.5.0
	   * @access protected
	   *
	   * @param {Object} $mountWrapper
	   */
	  mount($mountWrapper) {}

	  /**
	   * @since 1.5.0
	   *
	   * @return {Promise}
	   */
	  ready() {
	    return this.loadPromise;
	  }

	  /**
	   * @since 1.5.0
	   */
	  enable() {
	    if (!this.isEnabled) {
	      if (!this.isMounted) {
	        this.mount(this.$mountWrapper);
	        this.isMounted = true;
	      }
	      this.$mountWrapper.removeClass('mpa-hide');
	      this.isEnabled = true;
	    }
	  }

	  /**
	   * @since 1.5.0
	   */
	  disable() {
	    if (this.isEnabled) {
	      this.$mountWrapper.addClass('mpa-hide');
	      this.isEnabled = false;
	    }
	  }

	  /**
	   * @since 1.5.0
	   *
	   * @return {Boolean}
	   */
	  isValid() {
	    return !this.haveErrors;
	  }

	  /**
	   * @since 1.5.0
	   *
	   * @param {Cart} cart
	   * @param {Object} bookingDetails
	   * @return {Promise} On fulfillment: return processed payment data. On
	   *		rejection: throw error.
	   */
	  processPayment(cart, bookingDetails) {
	    return mpa_rest_post('/payments/prepare', {
	      payment_details: cart.paymentDetails
	    });
	  }

	  /**
	   * @since 1.5.0
	   * @access protected
	   *
	   * @return {Object}
	   */
	  getDefaults() {
	    return {
	      country: mpapp().settings().getCountry(),
	      redirect_url: {
	        payment_received: mpapp().settings().getPaymentReceivedPageUrl(),
	        failed_transaction: mpapp().settings().getFailedTransactionPageUrl()
	      }
	    };
	  }

	  /**
	   * @since 1.6.2
	   */
	  reset() {}
	}

	/**
	 * @since 1.14.0
	 */
	class FreeGateway extends PaymentGateway {
	  enable() {}
	}

	/**
	 * @since 1.5.0
	 */
	class StripeGatewayView {
	  /**
	   * @since 1.5.0
	   * @access protected
	   */
	  setupProperties() {
	    /**
	     * @since 1.14.0
	     * @var {Methods}
	     */
	    this.methods = null;

	    /**
	     * @since 1.5.0
	     * @var {String}
	     */
	    this.uid = '';

	    /**
	     * @since 1.5.0
	     * @var {Map} Key - method name ('card', 'ideal'), value - {$nav, $fields}.
	     */
	    this.paymentMethods = new Map();

	    /**
	     * @since 1.5.0
	     * @var {String}
	     */
	    this.selectedMethod = '';

	    /**
	     * @since 1.5.0
	     * @var {Object|null}
	     */
	    this.$mountWrapper = null;

	    /**
	     * @since 1.5.0
	     * @var {Object|null}
	     */
	    this.$errorsWrapper = null;

	    /**
	     * @since 1.16.0
	     * @type {Object}
	     */
	    this.$gatewayPreloader = null;

	    /**
	     * @since 1.16.0
	     * @type {Array}
	     * [ {method_name} => (bool), true - mounted ]
	     */
	    this.mountedMethods = [];
	  }

	  /**
	   * @since 1.5.0
	   *
	   * @param {Object[]} Stripe payment methods
	   */
	  constructor(methods) {
	    this.setupProperties();
	    this.methods = methods;
	    this.uid = mpa_uniqid();
	    this.addPaymentMethods(this.methods);
	  }
	  mountedMethod() {
	    let hasUnmountedMethod = false;
	    Object.entries(this.mountedMethods).forEach((mountedMethod, isMountedMethod) => {
	      if (!isMountedMethod) {
	        hasUnmountedMethod = true;
	      }
	    });
	    if (hasUnmountedMethod) {
	      this.$gatewayPreloader.addClass('mpa-hide');
	    }
	  }

	  /**
	   * @since 1.5.0
	   *
	   * @param {String[]} paymentMethods
	   */
	  addPaymentMethods(paymentMethods) {
	    for (const paymentMethod in paymentMethods) {
	      if (this.paymentMethods.includesKey(paymentMethod)) {
	        continue; // Already exists
	      }

	      // Add new payment method
	      this.paymentMethods.push(paymentMethod, {
	        $nav: null,
	        $fields: null
	      });

	      // Init this.selectedMethod property
	      if (!this.selectedMethod) {
	        this.selectedMethod = paymentMethod;
	      }
	    }
	  }

	  /**
	   * @since 1.5.0
	   *
	   * @return {Boolean}
	   */
	  isMounted() {
	    return this.$mountWrapper !== null;
	  }

	  /**
	   * @since 1.5.0
	   *
	   * @param {Object} $mountWrapper
	   */
	  mount($mountWrapper) {
	    $mountWrapper.append(this.render());
	    this.$gatewayPreloader = $mountWrapper.parent().find('.mpa-payment-gateway-title .mpa-preloader');
	    this.$gatewayPreloader.removeClass('mpa-hide');

	    // Init all payment methods
	    this.paymentMethods.forEach((references, i, paymentMethod) => {
	      references.$nav = $mountWrapper.find('.mpa-stripe-payment-method.' + paymentMethod);
	      references.$fields = $mountWrapper.find('.mpa-stripe-payment-fields.' + paymentMethod);
	      const methodControl = this.methods[paymentMethod].getControl();
	      if (methodControl !== null) {
	        const elementSelector = this.getElementSelector(paymentMethod);
	        this.mountedMethods[paymentMethod] = false;
	        methodControl.mount(elementSelector);
	        methodControl.on('ready', paymentMethod => {
	          this.mountedMethod(paymentMethod);
	          document.querySelector(elementSelector).classList.remove('mpa-preloader-skeleton-pulsate');
	        });
	      }

	      // todo: better to refactor
	      if (paymentMethod === 'card') {
	        this.methods['card'].isCanMakePaymentRequest().then(canMakePayment => {
	          const elementPaymentRequestButtonSelector = this.getElementSelector('payment-request-button');
	          const elementPaymentRequestButton = document.querySelector(elementPaymentRequestButtonSelector);
	          if (!elementPaymentRequestButton) {
	            return;
	          }
	          if (canMakePayment) {
	            this.mountedMethods['payment_request_button'] = false;
	            this.methods['card'].paymentRequestButton.mount(elementPaymentRequestButtonSelector);
	            this.methods['card'].paymentRequestButton.on('ready', event => {
	              this.mountedMethod('payment_request_button');
	              elementPaymentRequestButton.classList.remove('mpa-preloader-skeleton-pulsate');
	            });
	          } else {
	            elementPaymentRequestButton.classList.add('mpa-hide');
	            document.querySelector('.mpa-stripe-payment-request-button-separator').classList.add('mpa-hide');
	          }
	        });
	      }
	    });

	    // Listen change of payment method
	    $mountWrapper.find('input[name="stripe_payment_method"]').on('change', this.onPaymentMethodChange.bind(this));
	    this.$mountWrapper = $mountWrapper;
	    this.$errorsWrapper = $mountWrapper.find('.mpa-errors');
	  }

	  /**
	   * @since 1.5.0
	   * @access protected
	   *
	   * @param {Event} event
	   */
	  onPaymentMethodChange(event) {
	    // Clear previous control
	    let previousControl = null;
	    switch (this.selectedMethod) {
	      case 'card':
	      case 'ideal':
	      case 'sepa_debit':
	        previousControl = this.methods[this.selectedMethod].getControl();
	        break;
	    }
	    if (previousControl !== null) {
	      previousControl.clear();
	    }

	    // Select new payment method
	    this.selectPaymentMethod(event.target.value);
	  }

	  /**
	   * @since 1.5.0
	   *
	   * @param {String} paymentMethod
	   */
	  selectPaymentMethod(paymentMethod) {
	    if (paymentMethod !== this.selectedMethod) {
	      this.togglePaymentMethod(this.selectedMethod, false);
	      this.togglePaymentMethod(paymentMethod, true);
	      this.selectedMethod = paymentMethod;
	    }
	  }

	  /**
	   * @since 1.5.0
	   *
	   * @param {String} paymentMethod
	   * @param {Boolean} enable
	   */
	  togglePaymentMethod(paymentMethod, enable) {
	    if (this.isMounted() && this.paymentMethods.includesKey(paymentMethod)) {
	      let refs = this.paymentMethods.find(paymentMethod);
	      refs.$nav.toggleClass('active', enable);
	      refs.$fields.toggleClass('mpa-hide', !enable);
	    }
	  }

	  /**
	   * @since 1.5.0
	   *
	   * @param {String} paymentMethod
	   * @return {String}
	   */
	  getElementSelector(paymentMethod) {
	    if (paymentMethod === 'sepa_debit') {
	      paymentMethod = 'iban';
	    }
	    return '#mpa-stripe-' + paymentMethod + '-element-' + this.uid;
	  }

	  /**
	   * @since 1.5.0
	   *
	   * @return {String}
	   */
	  render() {
	    let output = '';
	    output += '<section class="mpa-stripe-payment-container">';

	    // Navigation tabs
	    if (this.paymentMethods.length > 1) {
	      output += this.renderNavigation();
	    }

	    // Payment fields
	    for (let paymentMethod of this.paymentMethods.keys) {
	      output += this.renderFields(paymentMethod);
	    }

	    // Errors wrapper
	    output += '<div class="mpa-errors"></div>';
	    output += '</section>';
	    return output;
	  }

	  /**
	   * @since 1.5.0
	   * @access protected
	   *
	   * @return {String}
	   */
	  renderNavigation() {
	    let output = '';
	    output += '<nav class="mpa-stripe-payment-methods">';
	    output += '<ul>';
	    for (let paymentMethod of this.paymentMethods.keys) {
	      let isSelected = paymentMethod === this.selectedMethod;
	      let activeClass = isSelected ? ' active' : '';
	      let checkedAttr = isSelected ? ' checked="checked"' : '';
	      output += '<li class="mpa-stripe-payment-method ' + paymentMethod + activeClass + '">';
	      output += '<label>';
	      output += '<input type="radio" name="stripe_payment_method" value="' + paymentMethod + '"' + checkedAttr + '>';
	      output += ' ' + this.methods[paymentMethod].title;
	      output += '</label>';
	      output += '</li>';
	    }
	    output += '</ul>';
	    output += '</nav>';
	    return output;
	  }

	  /**
	   * @since 1.5.0
	   * @access protected
	   *
	   * @param {String} paymentMethod
	   * @return {String}
	   */
	  renderFields(paymentMethod) {
	    let isSelected = paymentMethod === this.selectedMethod;
	    let hideClass = isSelected ? '' : ' mpa-hide';
	    let output = '';
	    output += '<div class="mpa-stripe-payment-fields ' + paymentMethod + hideClass + '">';
	    output += '<fieldset>';
	    switch (paymentMethod) {
	      case 'card':
	        output += this.renderCardFields();
	        break;
	      case 'ideal':
	        output += this.renderIdealFields();
	        break;
	      case 'sepa_debit':
	        output += this.renderSepaDebitFields();
	        break;
	      default:
	        output += this.renderRedirectNotice();
	        break;
	    }
	    output += '</fieldset>';
	    if (paymentMethod === 'sepa_debit') {
	      output += '<p class="notice">';
	      output +=
	      // https://stripe.com/docs/sources/sepa-debit#prerequisite
	      // Translators: %s: Business name.
	      __('By providing your IBAN and confirming this payment, you authorise (A) %s and Stripe, our payment service provider, to send instructions to your bank to debit your account and (B) your bank to debit your account in accordance with those instructions. You are entitled to a refund from your bank under the terms and conditions of your agreement with your bank. A refund must be claimed within 8 weeks starting from the date on which your account was debited.', 'motopress-appointment').replace('%s', mpapp().settings().getBusinessName());
	      output += '</p>';
	    }
	    output += '</div>';
	    return output;
	  }

	  /**
	   * @since 1.5.0
	   * @access protected
	   *
	   * @return {String}
	   */
	  renderCardFields() {
	    let output = '';
	    output += '<label for="mpa-stripe-card-element-' + this.uid + '">';
	    output += __('Credit or debit card', 'motopress-appointment');
	    output += '</label>';
	    if (this.methods['card'].isEnabledWallets()) {
	      output += '<div id="mpa-stripe-payment-request-button-element-' + this.uid + '" class="mpa-stripe-element mpa-stripe-payment-request-button-element mpa-preloader-skeleton-pulsate StripeElement"></div>';
	      output += '<div class="mpa-stripe-payment-request-button-separator">' + __('or', 'motopress-appointment') + '</div>';
	    }
	    output += '<div id="mpa-stripe-card-element-' + this.uid + '" class="mpa-stripe-element mpa-stripe-card-element mpa-preloader-skeleton-pulsate"></div>';
	    return output;
	  }

	  /**
	   * @since 1.5.0
	   * @access protected
	   *
	   * @return {String}
	   */
	  renderIdealFields() {
	    let output = '';
	    output += '<label for="mpa-stripe-ideal-element-' + this.uid + '">';
	    output += __('Select iDEAL Bank', 'motopress-appointment');
	    output += '</label>';
	    output += '<div id="mpa-stripe-ideal-element-' + this.uid + '" class="mpa-stripe-element mpa-stripe-ideal-element mpa-preloader-skeleton-pulsate"></div>';
	    return output;
	  }

	  /**
	   * @since 1.5.0
	   * @access protected
	   *
	   * @return {String}
	   */
	  renderSepaDebitFields() {
	    let output = '';
	    output += '<label for="mpa-stripe-iban-element-' + this.uid + '">';
	    output += __('IBAN', 'motopress-appointment');
	    output += '</label>';
	    output += '<div id="mpa-stripe-iban-element-' + this.uid + '" class="mpa-stripe-element mpa-stripe-iban-element mpa-preloader-skeleton-pulsate"></div>';
	    return output;
	  }

	  /**
	   * @since 1.5.0
	   * @access protected
	   *
	   * @return {String}
	   */
	  renderRedirectNotice() {
	    let output = '';
	    output += '<p class="notice">';
	    output += __('You will be redirected to a secure page to complete the payment.', 'motopress-appointment');
	    output += '</p>';
	    return output;
	  }

	  /**
	   * @since 1.5.0
	   *
	   * @param {String} message
	   */
	  showError(message) {
	    if (this.isMounted()) {
	      this.$errorsWrapper.html(message).removeClass('mpa-hide');
	    }
	  }

	  /**
	   * @since 1.5.0
	   */
	  hideErrors() {
	    if (this.isMounted()) {
	      this.$errorsWrapper.addClass('mpa-hide').html('');
	    }
	  }

	  /**
	   * @since 1.6.2
	   */
	  reset() {
	    let resetMethod = this.paymentMethods.firstKey();
	    this.selectPaymentMethod(resetMethod);

	    // No need to clear the control, StripeGateway will do the job:
	    //     this.methods.reset();
	  }
	}

	/**
	 * @since 1.5.0
	 */
	class CustomizablePaymentGateway extends PaymentGateway {
	  /**
	   * @since 1.5.0
	   *
	   * @return {Promise}
	   */
	  load() {
	    // Note: there is no addListeners() here anymore
	    this.loadPromise = mpa_rest_get('/payments/settings', {
	      gateway_id: this.gatewayId
	    }).catch(error => console.error(error.message) || {}) // "Invalid request: ..."
	    .then(settings => {
	      jQuery.extend(this.settings, settings);
	      return this;
	    });
	    return this.loadPromise;
	  }
	}

	/**
	 * @since 1.14.0
	 */
	class AbstractMethod {
	  name = null;
	  title = null;
	  control = null;
	  api = null;
	  elements = null;

	  /**
	   *
	   * @param {Stripe} api Stripe api ref
	   * @param {Elements} elements Stripe.elements()
	   * @param {Elements} elements Stripe.elements()
	   */
	  constructor(api, elements, settings) {
	    this.api = api;
	    this.settings = settings;
	    this.elements = elements;
	    if (new.target === AbstractMethod) {
	      throw new Error("Cannot construct Abstract instances directly");
	    }
	    if (this.setupProperties === undefined) {
	      throw new Error("Must override method: setupProperties()");
	    }
	    this.setupProperties();
	    if (this.name === null || this.name === undefined) {
	      throw new Error('"name" must be defined in a non-abstract payment method class');
	    }
	    if (this.title === null || this.title === undefined) {
	      throw new Error('"title" must be defined in a non-abstract payment method class');
	    }
	  }

	  /**
	   * If payment method has control elements, this method must creates an instance of the Payment Element.
	   * If hasn't controls, need return null.
	   *
	   * @see {@link https://stripe.com/docs/js/elements_object/create_payment_element}
	   *
	   * @return {Promise<Object>|null}
	   */
	  createControl() {
	    return null;
	  }

	  /**
	   * If payment method has control elements, this method must creates an instance of the Payment Element.
	   * If hasn't controls, need return null.
	   *
	   * @see {@link https://stripe.com/docs/js/elements_object/create_payment_element}
	   *
	   * @return {Promise<Object>|null}
	   */
	  getControl() {
	    if (!this.control) {
	      this.control = this.createControl();
	    }
	    return this.control;
	  }

	  /**
	   * @see {@link https://stripe.com/docs/js/element/other_methods/clear}
	   */
	  reset() {
	    if (this.control !== null) {
	      this.control.clear();
	    }
	  }

	  /**
	   *
	   * @param {string} name
	   * @param {string} email
	   * @param {string} phone
	   *
	   * @return {Object} PaymentMethodData
	   * @see https://stripe.com/docs/api/payment_methods/object
	   */
	  createPaymentMethodData(name, email, phone) {
	    let paymentMethodData = {
	      type: this.name,
	      billing_details: {
	        name: name.padEnd(3, ' '),
	        // Some methods require name length 3 or more symbols. Fill requirements by spaces.
	        email: email,
	        phone: phone
	      }
	    };
	    if (this.control !== null) {
	      paymentMethodData[this.name] = this.control;
	    }
	    return paymentMethodData;
	  }

	  /**
	   *
	   * @param {Object} paymentMethodData
	   * @see https://stripe.com/docs/api/payment_methods/object
	   *
	   * @return {Promise} paymentMethod or error
	   */
	  createPaymentMethod(paymentMethodData) {
	    return this.api.createPaymentMethod(paymentMethodData);
	  }

	  /**
	   *
	   * @param client_secret The client secret of the PaymentIntent.
	   * @param redirect_url_received
	   * @return {Promise}
	   */
	  confirmPayment(client_secret, redirect_url_received) {
	    throw new Error('Abstract Method has no implementation');
	  }

	  /**
	   * @param {Cart} cart
	   * @param {Object} paymentDetails Gateway settings + booking details.
	   * @param {Object} processArgs Optional.
	   *        @param {Function} processArgs['error_handler'] Callback to log errors.
	   * @return {Promise}
	   */
	  processPayment(cart, paymentDetails, processArgs) {
	    const customer = cart.getCustomer();
	    const paymentMethodData = this.createPaymentMethodData(customer.name, customer.email, customer.phone);

	    // Step 1: create payment method on the client side
	    return this.createPaymentMethod(paymentMethodData)

	    // Step 2: create payment intent on the server side
	    .then(paymentMethod => {
	      if (paymentMethod.error) {
	        throw new Error(paymentMethod.error.message);
	      }
	      const paymentDetails = jQuery.extend(cart.paymentDetails, {
	        payment_method_id: paymentMethod.paymentMethod.id
	      });
	      return mpa_rest_post('/payments/prepare', {
	        payment_details: paymentDetails
	      });
	    })

	    // Step 3: confirm payment intent on the client side
	    .then(paymentIntentClientSecret => {
	      // todo: param paymentDetails.redirect_url.payment_received is not used in all implementations.
	      // It is better to move the parameter passing to another place of initialization.
	      return this.confirmPayment(paymentIntentClientSecret, paymentDetails.redirect_url.payment_received)

	      // Handle errors
	      .then(confirmation => {
	        if (confirmation.error) {
	          throw new Error(confirmation.error.message);
	        } else {
	          return confirmation.paymentIntent;
	        }
	      });
	    })

	    // Step 4: build the final payment data
	    .then(paymentIntent => {
	      let paymentData = {
	        payment_method: this.name,
	        payment_intent_id: paymentIntent.id
	      };
	      if (paymentIntent.status == 'requires_action' && paymentIntent.next_action.type == 'redirect_to_url') {
	        paymentData.redirect_url = paymentIntent.next_action.redirect_to_url.url;
	      }
	      return paymentData;
	    })

	    // Catch any error
	    .catch(error => {
	      console.error('Unable to payment process.', error.message);
	      if (processArgs.error_handler != undefined) {
	        processArgs.error_handler(error.message);
	      }
	      throw error;
	    });
	  }
	}

	/**
	 * snake_case to camelCase
	 *
	 * @param {String}
	 * @return {String}
	 *
	 * @since 1.16.0
	 */
	function mpa_snake_to_camel_case(string) {
	  return string.toLowerCase().replace(/([-_][a-z])/g, group => group.toUpperCase().replace('-', '').replace('_', ''));
	}

	/**
	 * @since 1.14.0
	 */
	class CardMethod extends AbstractMethod {
	  setupProperties() {
	    this.name = 'card';
	    this.title = __('Card', 'motopress-appointment');

	    /**
	     * Payment process event object with payment request button
	     * Necessary for correct processing by the processPayment() method and completion of the payment process
	     *
	     * @since 1.16.0
	     * @protected
	     *
	     * @type {Event}
	     */
	    this.paymentRequestButtonEvent = null;

	    /**
	     * @since 1.16.0
	     * @protected
	     *
	     * @type {Promise<array|null>}
	     */
	    this.canMakePaymentRequest = Promise.resolve(null);
	    if (this.isEnabledWallets()) {
	      this.paymentRequest = this.createPaymentRequest();
	      this.canMakePaymentRequest = this.paymentRequest.canMakePayment();
	    }
	  }

	  /**
	   * @since 1.16.0
	   *
	   * @protected
	   *
	   * @return {PaymentRequest} Object of PaymentRequest
	   */
	  createPaymentRequest() {
	    if (this.paymentRequest) {
	      return this.paymentRequest;
	    }
	    return this.api.paymentRequest({
	      country: this.settings.country,
	      currency: mpapp().settings().getCurrency().toLowerCase(),
	      total: {
	        label: __('Total', 'motopress-appointment'),
	        amount: 0,
	        pending: true
	      },
	      requestPayerName: false,
	      requestPayerEmail: false,
	      requestPayerPhone: false,
	      requestShipping: false,
	      disableWallets: this.getDisabledWallets()
	    });
	  }

	  /**
	   * @since 1.16.0
	   *
	   * @return {Promise<null|array>}
	   */
	  isCanMakePaymentRequest() {
	    return this.canMakePaymentRequest;
	  }

	  /**
	   * @since 1.16.0
	   *
	   * @protected
	   *
	   * @return {string[]}
	   */
	  getPossibleWallets() {
	    return ['apple_pay', 'google_pay', 'link'];
	  }

	  /**
	   * @since 1.16.0
	   *
	   * @protected
	   *
	   * @return {Boolean}
	   */
	  isEnabledWallets() {
	    let isEnabledWallets = false;
	    const wallets = this.getPossibleWallets();
	    wallets.forEach(wallet => {
	      if (this.settings.payment_methods.includes(wallet)) {
	        isEnabledWallets = true;
	      }
	    });
	    return isEnabledWallets;
	  }

	  /**
	   * @since 1.16.0
	   *
	   * @return {Array} Array of disabled wallets name
	   */
	  getDisabledWallets() {
	    let disabledWallets = [];
	    const wallets = this.getPossibleWallets();
	    wallets.forEach(wallet => {
	      if (!this.settings.payment_methods.includes(wallet)) {
	        const walletNameInCamelCase = mpa_snake_to_camel_case(wallet);
	        disabledWallets.push(walletNameInCamelCase);
	      }
	    });
	    return disabledWallets;
	  }

	  /**
	   * @since 1.16.0
	   *
	   * @see https://stripe.com/docs/js/elements_object/create_payment_element
	   *
	   * @protected
	   *
	   * @return {Object}
	   */
	  createPaymentRequestButton() {
	    return this.elements.create('paymentRequestButton', {
	      paymentRequest: this.paymentRequest,
	      style: {
	        paymentRequestButton: {
	          height: '50px'
	        }
	      }
	    });
	  }

	  /**
	   * @since 1.16.0
	   * @protected
	   *
	   * @param {Event}
	   */
	  processPaymentRequestButton(event) {
	    this.paymentRequestButtonEvent = event;
	    jQuery('.mpa-booking-step-payment .mpa-actions .mpa-button-next').trigger('click');
	  }

	  /**
	   * @since 1.16.0
	   *
	   * @param {Cart} cart
	   * @param {Object} processArgs Optional.
	   *        @param {Function} processArgs['error_handler'] Callback to log errors.
	   * @return {Promise}
	   */
	  proccessPaymentRequestButtonHandler(cart, processArgs) {
	    const customer = cart.getCustomer();
	    return this.api.createPaymentMethod({
	      type: 'card',
	      card: {
	        token: this.paymentRequestButtonEvent.token.id
	      },
	      billing_details: {
	        name: customer.name,
	        email: customer.email,
	        phone: customer.phone
	      }
	    }).then(paymentMethod => {
	      if (paymentMethod.error) {
	        this.paymentRequestButtonEvent.complete('fail');
	        throw new Error(paymentMethod.error.message);
	      }
	      const paymentDetails = jQuery.extend(cart.paymentDetails, {
	        payment_method_id: paymentMethod.paymentMethod.id
	      });
	      return mpa_rest_post('/payments/prepare', {
	        payment_details: paymentDetails
	      });
	    }).then(paymentIntentClientSecret => {
	      // todo: param paymentDetails.redirect_url.payment_received is not used in all implementations.
	      // It is better to move the parameter passing to another place of initialization.
	      return this.confirmPayment(paymentIntentClientSecret)

	      // Handle errors
	      .then(confirmation => {
	        if (confirmation.error) {
	          this.paymentRequestButtonEvent.complete('fail');
	          this.paymentRequestButtonEvent = null;
	          throw new Error(confirmation.error.message);
	        } else {
	          return confirmation.paymentIntent;
	        }
	      });
	    })

	    // Step 4: build the final payment data
	    .then(paymentIntent => {
	      let paymentData = {
	        payment_method: this.name,
	        payment_intent_id: paymentIntent.id
	      };
	      this.paymentRequestButtonEvent.complete('success');
	      this.paymentRequestButtonEvent = null;
	      return paymentData;
	    })

	    // Catch any error
	    .catch(error => {
	      this.paymentRequestButtonEvent.complete('fail');
	      this.paymentRequestButtonEvent = null;
	      console.error('Unable to payment process.', error.message);
	      if (processArgs.error_handler != undefined) {
	        processArgs.error_handler(error.message);
	      }
	      throw error;
	    });
	  }

	  /**
	   *
	   * @param client_secret The client secret of the PaymentIntent.
	   *
	   * @see {@link https://stripe.com/docs/js/payment_intents/confirm_card_payment}
	   *
	   * @return {Promise}
	   */
	  confirmPayment(client_secret) {
	    return this.api.confirmCardPayment(client_secret);
	  }

	  /**
	   * @param {Cart} cart
	   * @param {Object} paymentDetails Gateway settings + booking details.
	   * @param {Object} processArgs Optional.
	   *        @param {Function} processArgs['error_handler'] Callback to log errors.
	   * @return {Promise}
	   */
	  processPayment(cart, paymentDetails, processArgs) {
	    if (this.paymentRequestButtonEvent) {
	      return this.proccessPaymentRequestButtonHandler(cart, processArgs);
	    }
	    return super.processPayment(cart, paymentDetails, processArgs);
	  }

	  /**
	   * @see https://stripe.com/docs/js/elements_object/create_payment_element
	   *
	   * @return {Object}
	   */
	  createControl() {
	    return this.elements.create(this.name, {
	      style: this.settings.style,
	      hidePostalCode: this.settings.hide_postal_code
	    });
	  }
	}

	/**
	 * @since 1.14.0
	 */
	class SepaDebitMethod extends AbstractMethod {
	  setupProperties() {
	    this.name = 'sepa_debit';
	    this.title = __('SEPA Direct Debit', 'motopress-appointment');
	  }

	  /**
	   *
	   * @param client_secret The client secret of the PaymentIntent.
	   * @param redirect_url_received
	   *
	   * @see {@link https://stripe.com/docs/js/payment_intents/confirm_sepa_debit_payment}
	   *
	   * @return {Promise}
	   */
	  confirmPayment(client_secret, redirect_url_received) {
	    return this.api.confirmSepaDebitPayment(client_secret);
	  }

	  /**
	   * @see https://stripe.com/docs/js/elements_object/create_payment_element
	   *
	   * @return {Promise<Object>}
	   */
	  createControl() {
	    return this.elements.create('iban', {
	      style: this.settings.style,
	      supportedCountries: ['SEPA']
	    });
	  }
	}

	/**
	 * @since 1.14.0
	 */
	class BancontactMethod extends AbstractMethod {
	  setupProperties() {
	    this.name = 'bancontact';
	    this.title = __('Bancontact', 'motopress-appointment');
	  }

	  /**
	   *
	   * @param client_secret The client secret of the PaymentIntent.
	   * @param redirect_url_received
	   *
	   * @see {@link https://stripe.com/docs/js/payment_intents/confirm_bancontact_payment}
	   *
	   * @return {Promise}
	   */
	  confirmPayment(client_secret, redirect_url_received) {
	    return this.api.confirmBancontactPayment(client_secret, {
	      return_url: redirect_url_received
	    }, {
	      handleActions: false
	    });
	  }
	}

	/**
	 * @since 1.14.0
	 */
	class IdealMethod extends AbstractMethod {
	  setupProperties() {
	    this.name = 'ideal';
	    this.title = __('iDEAL', 'motopress-appointment');
	  }

	  /**
	   *
	   * @param client_secret The client secret of the PaymentIntent.
	   * @param redirect_url_received
	   *
	   * @see {@link https://stripe.com/docs/js/payment_intents/confirm_ideal_payment}
	   *
	   * @return {Promise}
	   */
	  confirmPayment(client_secret, redirect_url_received) {
	    return this.api.confirmIdealPayment(client_secret, {
	      return_url: redirect_url_received
	    }, {
	      handleActions: false
	    });
	  }

	  /**
	   * @see https://stripe.com/docs/js/elements_object/create_payment_element
	   *
	   * @return {Promise<Object>}
	   */
	  createControl() {
	    return this.elements.create('idealBank', {
	      style: this.settings.style
	    });
	  }
	}

	/**
	 * @since 1.14.0
	 */
	class GiropayMethod extends AbstractMethod {
	  setupProperties() {
	    this.name = 'giropay';
	    this.title = __('Giropay', 'motopress-appointment');
	  }

	  /**
	   *
	   * @param client_secret The client secret of the PaymentIntent.
	   * @param redirect_url_received
	   *
	   * @see {@link https://stripe.com/docs/js/payment_intents/confirm_giropay_payment}
	   *
	   * @return {Promise}
	   */
	  confirmPayment(client_secret, redirect_url_received) {
	    return this.api.confirmGiropayPayment(client_secret, {
	      return_url: redirect_url_received
	    }, {
	      handleActions: false
	    });
	  }
	}

	/**
	 * @since 1.14.0
	 */
	class SofortMethod extends AbstractMethod {
	  setupProperties() {
	    this.name = 'sofort';
	    this.title = __('SOFORT', 'motopress-appointment');
	  }

	  /**
	   *
	   * @param client_secret The client secret of the PaymentIntent.
	   * @param redirect_url_received
	   *
	   * @see {@link https://stripe.com/docs/js/payment_intents/confirm_sofort_payment}
	   *
	   * @return {Promise}
	   */
	  confirmPayment(client_secret, redirect_url_received) {
	    return this.api.confirmSofortPayment(client_secret, {
	      return_url: redirect_url_received
	    }, {
	      handleActions: false
	    });
	  }

	  /**
	   *
	   * @param {string} name
	   * @param {string} email
	   * @param {string} phone
	   *
	   * @return {Promise} paymentMethod or error
	   */
	  createPaymentMethodData(name, email, phone) {
	    let paymentMethodData = super.createPaymentMethodData(name, email, phone);
	    paymentMethodData.sofort = {
	      country: this.settings.country
	    };
	    return paymentMethodData;
	  }
	}

	/**
	 * @since 1.5.0
	 */
	class StripeGateway extends CustomizablePaymentGateway {
	  /**
	   * @since 1.5.0
	   * @access protected
	   */
	  setupProperties() {
	    super.setupProperties();

	    /**
	     * @since 1.5.0
	     * @var {Object}
	     */
	    this.$gatewayPreloader = null;

	    /**
	     * @since 1.5.0
	     * @var {String}
	     */
	    this.gatewayId = 'stripe';

	    /**
	     * @since 1.14.0
	     * @var {Object[]} Stripe payment methods
	     */
	    this.methods = null;

	    /**
	     * @since 1.5.0
	     * @var {StripeGatewayView}
	     */
	    this.view = null;
	  }

	  /**
	   * @since 1.5.0
	   * @since 1.6.0 Added cart parameter
	   *
	   * @param {Object} $mountWrapper
	   */
	  constructor($mountWrapper, cart) {
	    super($mountWrapper, cart);
	    this.$gatewayPreloader = $mountWrapper.parent().find('.mpa-payment-gateway-title .mpa-preloader');
	  }

	  /**
	   * @since 1.5.0
	   *
	   * @return {Promise}
	   */
	  load() {
	    this.loadPromise = super.load().then(() => {
	      this.methods = this.createPaymentMethods();
	      this.view = new StripeGatewayView(this.methods);
	      return this;
	    });
	    return this.loadPromise;
	  }

	  /**
	   * Validation checks Terms & Conditions checkbox. Checkbox must be checked.
	   * If validation crash, showing default html validation message.
	   *
	   * todo: paypal has the same method, we need to move the check to another method
	   *
	   * @return {Boolean}
	   */
	  isValidAcceptTerms() {
	    if (!mpapp().settings().getTermsPageIdForAcceptance()) {
	      return true;
	    }
	    const acceptTermsMarkup = jQuery('.mpa-booking-step-payment .mpa-accept-terms')[0];
	    if (!acceptTermsMarkup.checkValidity()) {
	      acceptTermsMarkup.reportValidity();
	      return false;
	    }
	    return true;
	  }

	  /**
	   * @see Similar method to StripeAPI::convertToSmallestUnit() in StripeAPI.php.
	   *
	   * @since 1.16.0
	   *
	   * Only used for wallets payments in the paymentRequest object.
	   * This is necessary to display the correct price in the paymentRequest browser payment interface.
	   * The real payment price is formed on the backend side when the PaymentIntent is created.
	   *
	   * @param {Number} amount
	   * @param {String} currency Optional.
	   *
	   * @return {Number}
	   */
	  convertToSmallestUnit(amount, currency) {
	    if (!currency) {
	      currency = mpapp().settings().getCurrency();
	    }

	    // See all currencies presented as links on page
	    // https://stripe.com/docs/currencies#presentment-currencies
	    switch (currency.toUpperCase()) {
	      // Zero decimal currencies
	      case 'BIF':
	      case 'CLP':
	      case 'DJF':
	      case 'GNF':
	      case 'JPY':
	      case 'KMF':
	      case 'KRW':
	      case 'MGA':
	      case 'PYG':
	      case 'RWF':
	      case 'UGX':
	      case 'VND':
	      case 'VUV':
	      case 'XAF':
	      case 'XOF':
	      case 'XPF':
	        amount = Math.floor(amount); // Remove cents
	        break;
	      default:
	        amount = Math.round(amount * 100); // In cents
	        break;
	    }
	    return amount;
	  }

	  /**
	   * @since 1.16.0
	   * @access protected
	   *
	   * @param {Event} event
	   */
	  onClickPaymentRequestButton(event) {
	    if (!this.isValidAcceptTerms()) {
	      event.preventDefault();
	      return;
	    }
	    const order = this.cart.getOrder();
	    let totalPrice = parseFloat(order.total);
	    if (this.cart.paymentDetails.deposit) {
	      totalPrice = parseFloat(order.deposit);
	    }
	    const totalPriceFormatted = this.convertToSmallestUnit(totalPrice, mpapp().settings().getCurrency().toLowerCase());
	    this.methods['card'].paymentRequest.update({
	      total: {
	        amount: totalPriceFormatted,
	        label: __('Total', 'motopress-appointment'),
	        pending: false
	      }
	    });
	  }

	  /**
	   * @since 1.5.0
	   * @access protected
	   *
	   * @param {Event} event
	   */
	  onChange(event) {
	    this.haveErrors = !!event.error;
	    if (this.haveErrors) {
	      this.view.showError(event.error.message);
	    } else {
	      this.view.hideErrors();
	    }
	  }

	  /**
	   * @since 1.5.0
	   * @access protected
	   *
	   * @param {Object} $mountWrapper
	   */
	  mount($mountWrapper) {
	    this.ready().then(() => {
	      this.view.mount($mountWrapper);
	      this.addListeners();
	    });
	  }

	  /**
	   * @since 1.5.0
	   *
	   * @param {Cart} cart
	   * @param {Object} bookingDetails Booking and payment ID/UID.
	   * @return {Promise}
	   */
	  processPayment(cart, bookingDetails) {
	    if (!this.isValid()) {
	      return Promise.reject(new Error('The payment gateway is not valid.'));
	    }
	    this.$gatewayPreloader.removeClass('mpa-hide');
	    let paymentMethod = this.view.selectedMethod;
	    let paymentDetails = jQuery.extend({
	      payment_method: paymentMethod
	    }, this.settings, bookingDetails);
	    let processArgs = {
	      error_handler: this.view.showError.bind(this.view)
	    };
	    const processPayment = this.methods[paymentMethod].processPayment(cart, paymentDetails, processArgs);
	    return processPayment.then(paymentData => {
	      this.$gatewayPreloader.addClass('mpa-hide');
	      return paymentData;
	    }, error => {
	      this.$gatewayPreloader.addClass('mpa-hide');
	      throw error;
	    });
	  }

	  /**
	   * @since 1.5.0
	   * @access protected
	   *
	   * @return {Object}
	   */
	  getDefaults() {
	    return jQuery.extend(super.getDefaults(), {
	      hide_postal_code: true,
	      locale: 'auto',
	      payment_methods: [],
	      public_key: '',
	      style: {}
	    });
	  }

	  /**
	   * @since 1.14.0
	   *
	   * @return {Object[]} Stripe payment methods
	   */
	  createPaymentMethods() {
	    let methods = [];
	    const stripeApi = Stripe(this.settings.public_key, {
	      apiVersion: "2022-11-15"
	    });
	    const stripeElements = stripeApi.elements({
	      locale: this.settings.locale
	    });
	    this.settings.payment_methods.forEach(method => {
	      switch (method) {
	        case 'card':
	          methods['card'] = new CardMethod(stripeApi, stripeElements, this.settings);
	          methods['card'].getControl().on('change', this.onChange.bind(this));

	          // todo: better to refactor
	          methods['card'].isCanMakePaymentRequest().then(canMakePayment => {
	            if (canMakePayment) {
	              methods['card'].paymentRequest.on('token', async event => methods['card'].processPaymentRequestButton(event));
	              methods['card'].paymentRequest.on('cancel', () => {
	                methods['card'].paymentRequestButtonEvent = null;
	              });
	              methods['card'].paymentRequestButton = methods['card'].createPaymentRequestButton();
	              methods['card'].paymentRequestButton.on('click', this.onClickPaymentRequestButton.bind(this));
	            }
	          });
	          break;
	        case 'sepa_debit':
	          methods['sepa_debit'] = new SepaDebitMethod(stripeApi, stripeElements, this.settings);
	          methods['sepa_debit'].getControl().on('change', this.onChange.bind(this));
	          break;
	        case 'bancontact':
	          methods['bancontact'] = new BancontactMethod(stripeApi, stripeElements, this.settings);
	          break;
	        case 'ideal':
	          methods['ideal'] = new IdealMethod(stripeApi, stripeElements, this.settings);
	          break;
	        case 'giropay':
	          methods['giropay'] = new GiropayMethod(stripeApi, stripeElements, this.settings);
	          break;
	        case 'sofort':
	          methods['sofort'] = new SofortMethod(stripeApi, stripeElements, this.settings);
	          break;
	      }
	    });
	    return methods;
	  }

	  /**
	   * @since 1.6.2
	   */
	  reset() {
	    // resetting each of methods
	    Object.entries(this.methods).forEach(([methodName, method]) => {
	      method.reset();
	    });
	    this.view.reset();
	  }
	}

	/**
	 * @since 1.6.0
	 */
	class PayPalGateway extends CustomizablePaymentGateway {
	  /**
	   * @since 1.6.0
	   */
	  setupProperties() {
	    super.setupProperties();

	    /**
	     * @var {String}
	     */
	    this.gatewayId = 'paypal';
	  }

	  /**
	   * @since 1.6.0
	   */
	  enable() {
	    super.enable();
	    if (this.isEnabled) {
	      this.$mountWrapper.closest('form').find('.mpa-button-next').hide();
	    }
	  }

	  /**
	   * @since 1.6.0
	   */
	  disable() {
	    super.disable();
	    if (!this.isEnabled) {
	      this.$mountWrapper.closest('form').find('.mpa-button-next').show();
	    }
	  }

	  /**
	   * Validation checks Terms & Conditions checkbox. Checkbox must be checked.
	   * If validation crash, showing default html validation message.
	   *
	   * @return {Boolean}
	   *
	   * @access protected
	   *
	   * @since 1.14.0
	   */
	  isValidAcceptTerms() {
	    if (!mpapp().settings().getTermsPageIdForAcceptance()) {
	      return true;
	    }
	    const acceptTermsMarkup = jQuery('.mpa-booking-step-payment .mpa-accept-terms')[0];
	    if (!acceptTermsMarkup.checkValidity()) {
	      acceptTermsMarkup.reportValidity();
	      return false;
	    }
	    return true;
	  }

	  /**
	   * @since 1.6.0
	   * @access protected
	   * @param {Object} $mountWrapper
	   */
	  mount($mountWrapper) {
	    let self = this;
	    self.$errorWrapper = $mountWrapper.find('.mpa-paypal-error');
	    self.$gatewayPreloader = $mountWrapper.parent().find('.mpa-payment-gateway-title .mpa-preloader');
	    paypal.Buttons({
	      onClick: function (data, actions) {
	        if (0 === self.cart.getTotalPrice()) {
	          self.paypalDetails = {};
	          jQuery('.mpa-booking-step-payment .mpa-actions .mpa-button-next').trigger('click');
	        }

	        // Rejects payment for invalid form field
	        if (!self.isValidAcceptTerms()) {
	          return actions.reject();
	        }
	      },
	      /**
	       * PayPal checkout server side integration.
	       * Creates PayPal order via REST API request from backend with a correct price.
	       *
	       * @param data
	       * @param actions
	       * @returns {Promise<string>} Order id
	       */
	      createOrder: function (data, actions) {
	        self.$errorWrapper.addClass('mpa-hide');
	        self.$gatewayPreloader.removeClass('mpa-hide');
	        return mpa_rest_post('/payments/prepare', {
	          payment_details: self.cart.paymentDetails
	        }).then(orderId => {
	          self.$gatewayPreloader.addClass('mpa-hide');
	          return orderId;
	        });
	      },
	      onApprove: function (data, actions) {
	        return actions.order.capture().then(function (details) {
	          self.paypalDetails = details;
	          jQuery('.mpa-booking-step-payment .mpa-actions .mpa-button-next').trigger('click');
	        });
	      },
	      onCancel: function (data) {},
	      onError: function (error) {
	        console.log(error);
	        self.$errorWrapper.text(self.settings.paypal_error_message);
	        self.$errorWrapper.removeClass('mpa-hide');
	      }
	    }).render($mountWrapper.find('.mpa-paypal-container')[0]);
	  }

	  /**
	   * @since 1.6.0
	   * @param {Cart} cart
	   * @param {Object} bookingDetails Booking and payment ID/UID.
	   * @return {Promise}
	   */
	  processPayment(cart, bookingDetails) {
	    return Promise.resolve({
	      paypalDetails: this.paypalDetails
	    });
	  }
	}

	/**
	 * @since 1.5.0
	 */
	class GatewayFactory {
	  /**
	   * @since 1.5.0
	   * @since 1.6.0 Added cart parameter
	   *
	   * @param {Object} $paymentGateways
	   * @return {PaymentGateway[]}
	   */
	  static createGateways($paymentGateways, cart) {
	    let activeGateways = {};
	    for (let gatewayId of mpapp().settings().getActiveGateways()) {
	      let $billingFields = $paymentGateways.find('.mpa-' + gatewayId + '-payment-gateway .mpa-billing-fields');
	      let gateway = $billingFields.length !== 0 ? GatewayFactory.createGateway(gatewayId, $billingFields, cart) : null;
	      if (gateway !== null) {
	        activeGateways[gatewayId] = gateway;
	      }
	    }
	    activeGateways['free'] = new FreeGateway({}, cart);
	    return activeGateways;
	  }

	  /**
	   * @since 1.5.0
	   * @since 1.6.0 Added cart parameter
	   * @access protected
	   *
	   * @return {PaymentGateway|null}
	   */
	  static createGateway(gatewayId, $billingFields, cart) {
	    switch (gatewayId) {
	      case 'manual':
	      case 'test':
	      case 'cash':
	      case 'bank':
	        return new PaymentGateway($billingFields, cart);
	      case 'paypal':
	        return new PayPalGateway($billingFields, cart);
	      case 'stripe':
	        return new StripeGateway($billingFields, cart);
	      default:
	        return wp.hooks.applyFilters('mpa_create_gateway', null, gatewayId, $billingFields, cart);
	    }
	  }
	}

	/**
	 * @since 1.5.0
	 */
	class StepPayment extends AbstractStep {
	  /**
	   * @since 1.5.0
	   * @access protected
	   */
	  setupProperties() {
	    super.setupProperties();
	    this.lastCartHash = ''; // Track cart changes

	    this.gatewayId = '';
	    this.gateways = {}; // {Gateway ID: Gateway object}

	    this.bookingDetails = {}; // Booking and payment ID/UID

	    this.$form = this.$element.find('.mpa-checkout-form');
	    this.$order = this.$element.find('.mpa-order');
	    this.$billingSection = this.$element.find('.mpa-billing-details');
	    this.$paymentGateways = this.$billingSection.find('.mpa-payment-gateway');
	    this.$paymentGatewayButtons = this.$paymentGateways.find('input[name="payment_gateway_id"]');
	    this.$message = this.$element.find('.mpa-message').first();
	    this.acceptTerms = false;
	    this.onlinePayment = false;
	    this.isDepositDisabled = false;
	    this.$deposit = this.$element.find('.mpa-deposit-section');
	    this.$depositSwitcher = this.$element.find('input[name="mpa-deposit-switcher"]');
	    this.$depositTable = this.$element.find('#mpa-deposit-table');
	    if (mpapp().settings().getTermsPageIdForAcceptance()) {
	      this.$acceptTerms = this.$element.find('.mpa-accept-terms');
	    }
	    this.couponSection = null;
	  }

	  /**
	   * @since 1.5.0
	   * @access protected
	   *
	   * @return {String}
	   */
	  theId() {
	    return 'payment';
	  }

	  /**
	   * @since 1.5.0
	   * @access protected
	   *
	   * @return {Object} {Property name: Property settings}
	   */
	  propertiesSchema() {
	    return {
	      gatewayId: {
	        type: 'string',
	        default: ''
	      },
	      isDepositDisabled: {
	        type: 'bool',
	        default: false
	      },
	      acceptTerms: {
	        type: 'bool',
	        default: false
	      }
	    };
	  }

	  /**
	   * @param {String} message
	   *
	   * @since 1.19.1
	   */
	  setErrorMessage(message) {
	    this.$message.html(message);
	    this.$message.toggleClass('mpa-hide', !message.trim().length);
	  }

	  /**
	   * @since 1.19.1
	   */
	  clearErrorMessage() {
	    this.setErrorMessage('');
	  }

	  /**
	   * @since 1.14.0
	   */
	  hideDeposit() {
	    this.$deposit.addClass('mpa-hide');
	    this.$depositSwitcher.prop('disabled', true);
	    this.isDepositDisabled = true;
	  }

	  /**
	   * @since 1.14.0
	   */
	  showDeposit() {
	    this.$deposit.removeClass('mpa-hide');
	    this.$depositSwitcher.prop('disabled', false);
	    this.setProperty('isDepositDisabled', this.$depositSwitcher.prop('checked'));
	  }

	  /**
	   * @since 1.14.0
	   */
	  toggleDepositSection() {
	    const order = this.cart.getOrder();
	    const leftToPay = parseFloat(order.total) - parseFloat(order.deposit);
	    if (leftToPay && this.onlinePayment) {
	      this.showDeposit();
	    } else {
	      this.hideDeposit();
	    }
	  }

	  /**
	   * Set payment gateway name to payment details.
	   * Toggle deposit functions If it unavailable for setted gateway
	   *
	   * @param {string} gatewayId Payment gateway name
	   * @param {integer} isOnlinePayment 0 or 1
	   * @since 1.14.0
	   */
	  setGatewayId(gatewayId, isOnlinePayment) {
	    this.setProperty('gatewayId', gatewayId);
	    this.onlinePayment = parseInt(isOnlinePayment);
	    this.toggleDepositSection();
	    this.cart.setPaymentDetails({
	      gateway_id: this.gatewayId,
	      deposit: !this.isDepositDisabled
	    });
	  }

	  /**
	   * @since 1.5.0
	   * @access protected
	   */
	  addListeners() {
	    super.addListeners();

	    // Disable submit
	    this.$form.on('submit', event => false);
	    this.$paymentGatewayButtons.on('change', event => {
	      this.setGatewayId(event.target.value, event.target.dataset.isOnlinePayment);
	    });
	    if (mpapp().settings().getTermsPageIdForAcceptance()) {
	      this.$acceptTerms.on('input', event => this.setProperty('acceptTerms', event.target.checked));
	    }
	    if (this.$depositSwitcher.length > 0) {
	      this.$depositSwitcher.on('input', event => {
	        this.$depositTable.toggleClass('mpa-hide', event.target.checked);
	        this.setProperty('isDepositDisabled', event.target.checked);
	        this.cart.setPaymentDetails({
	          deposit: !this.isDepositDisabled
	        });
	      });
	    }
	    this.$element.on('mpa_booking_step_disable', this.disable.bind(this));
	    this.$element.on('mpa_booking_step_enable', this.enable.bind(this));
	    this.$element.on('mpa_booking_coupon_applied', () => {
	      this.notifyCartChanged();
	      this.updateOrderDetails();
	      this.cart.setPaymentDetails({
	        coupon_code: this.cart.hasCoupon() ? this.cart.coupon.getCode() : ''
	      });
	    });
	  }

	  /**
	   * @since 1.5.0
	   * @access protected
	   *
	   * @return {Promise}
	   */
	  loadEntities() {
	    // show payment step before start loading.
	    // preloader toggling in another place.
	    if (!this.isLoaded) {
	      this.$element.removeClass('mpa-hide');
	    }
	    this.lastCartHash = this.cart.getHash('order');

	    // Initialize coupon section control
	    if (mpapp().settings().isCouponsEnabled()) {
	      this.couponSection = new CouponSection(this.$element.find('.mpa-coupon-details'), this.cart);
	    }

	    // Init/update the order
	    this.updateOrderDetails();

	    // Load gateways
	    let awaitLoading = [];
	    if (this.gatewayId !== 'free') {
	      awaitLoading.push(this.loadGateways());
	    } else {
	      this.loadGateways(); // Just load in the background
	    }

	    // Draft posts
	    awaitLoading.push(this.loadDrafts());
	    return Promise.all(awaitLoading).then(() => {
	      // Actions after loaded all entities and inited gateways

	      // init default gateway by :checked markup received from backend
	      // calling enable() for needle gateway
	      // which mount loaded control element to checkout markup
	      this.initDefaultGateway();
	      return this;
	    });
	  }

	  /**
	   * @since 1.5.0
	   * @return {Promise}
	   * @access protected
	   */
	  reload() {
	    // Clear previous messages
	    if (this.couponSection) {
	      this.couponSection.reset();
	    }
	    this.clearErrorMessage();

	    // Is the coupon still applicable to the cart?
	    if (this.cart.hasCoupon()) {
	      this.cart.testCoupon();
	    }

	    // Init/update the order
	    this.updateOrderDetails();

	    // Maybe notify payment gateways about cart changes
	    if (this.cart.didChange(this.lastCartHash, 'order')) {
	      this.lastCartHash = this.cart.getHash('order');
	      this.notifyCartChanged();

	      // Update booking draft on the backend
	      return this.loadDrafts();
	    }
	    return Promise.resolve(this);
	  }

	  /**
	   * @since 1.6.2
	   */
	  reset() {
	    if (mpapp().settings().getTermsPageIdForAcceptance()) {
	      this.$acceptTerms.prop('checked', false);
	      this.resetProperty('acceptTerms');
	    }
	    this.lastCartHash = '';

	    // Enable default gateway
	    let defaultGateway = mpapp().settings().getDefaultPaymentGateway();
	    this.$paymentGatewayButtons.filter(':checked').prop('checked', false);
	    if (defaultGateway in this.gateways) {
	      this.setProperty('gatewayId', defaultGateway);
	      this.$paymentGatewayButtons.filter('[value="' + defaultGateway + '"]').prop('checked', true);
	    } else {
	      this.resetProperty('gatewayId');
	    }

	    // Reset payment gateways
	    for (let gatewayId in this.gateways) {
	      this.gateways[gatewayId].reset();
	    }

	    // Reset coupon section
	    if (this.couponSection) {
	      this.couponSection.reset();
	    }
	  }

	  /**
	   * @since 1.11.0
	   *
	   * @access protected
	   */
	  notifyCartChanged() {
	    for (let gatewayId in this.gateways) {
	      this.gateways[gatewayId].onCartChange(this.cart);
	    }
	  }

	  /**
	   * @since 1.5.0
	   * @access protected
	   */
	  updateOrderDetails() {
	    this.$order.empty();
	    this.$order.html(mpa_tmpl_order(this.cart.getOrder()));
	    if (this.$depositTable.length > 0) {
	      const depositTableHtml = mpa_tmpl_deposit(this.cart.getOrder());
	      this.$depositTable.html(depositTableHtml);
	      if (this.$paymentGatewayButtons.filter(':checked').length > 0) {
	        this.toggleDepositSection();
	      }
	    }

	    // Bind remove coupon button
	    let $removeCoupon = this.$order.find('.mpa-remove-coupon');
	    if ($removeCoupon.length > 0) {
	      $removeCoupon.on('click', this.removeCoupon.bind(this));
	    }
	    this.toggleAvailablePaymentMethods();
	  }

	  /**
	   * @since 1.11.0
	   *
	   * @access protected
	   *
	   * @param {Event} event
	   */
	  removeCoupon(event) {
	    event.preventDefault();
	    event.stopPropagation();
	    this.cart.removeCoupon();
	    this.couponSection.clearMessage();
	    this.cart.setPaymentDetails({
	      coupon_code: ''
	    });
	    this.notifyCartChanged();
	    this.updateOrderDetails();
	  }

	  /**
	   * Hide unavailable payment methods for order.
	   *
	   * @since 1.14.0
	   * @access protected
	   */
	  toggleAvailablePaymentMethods() {
	    const isFreeOrder = this.cart.getTotalPrice() === 0;
	    if (isFreeOrder) {
	      this.setGatewayId('free', false);
	    } else {
	      const $currentGateway = this.$paymentGatewayButtons.filter(':checked');
	      if ($currentGateway.length > 0) {
	        this.setGatewayId($currentGateway[0].value, $currentGateway[0].dataset.isOnlinePayment);
	      }
	    }
	    this.$billingSection.toggleClass('mpa-hide', isFreeOrder);
	    this.$paymentGatewayButtons.prop('required', !isFreeOrder);
	  }

	  /**
	   * @since 1.5.0
	   * @access protected
	   *
	   * @return {Promise[]}
	   */
	  loadGateways() {
	    let $paymentGateways = this.$billingSection.find('.mpa-payment-gateways');
	    this.gateways = GatewayFactory.createGateways($paymentGateways, this.cart);
	    let awaitGateways = [];
	    for (let gatewayId in this.gateways) {
	      awaitGateways.push(this.gateways[gatewayId].load());
	    }
	    return awaitGateways;
	  }

	  /**
	   * @since 1.5.0
	   * @access protected
	   *
	   * @return {Promise}
	   */
	  loadDrafts() {
	    let cartData = this.cart.toArray();
	    cartData.payment = true;
	    return mpa_rest_post('/bookings/draft', cartData).then(drafts => {
	      this.bookingDetails = drafts;
	      /**
	       * @todo: param paymentDetails[payment_id] need only for backward compatibility with a mpa-woocommerce addon v1.0.0
	       */
	      const paymentDetails = {
	        booking_id: drafts.booking_id,
	        payment_id: drafts.payment_id
	      };
	      this.cart.setPaymentDetails(paymentDetails);
	    }, error => {
	      this.setErrorMessage(error.message);
	    }).then(() => {
	      this.enableGateways();
	      return this;
	    });
	  }

	  /**
	   * @since 1.5.0
	   * @access protected
	   */
	  enableGateways() {
	    this.$paymentGatewayButtons.prop('disabled', false);
	  }

	  /**
	   * @since 1.15.0
	   * @access protected
	   */
	  initDefaultGateway() {
	    let $defaultGateway = this.$paymentGatewayButtons.filter(':checked');
	    if ($defaultGateway.length > 0) {
	      this.gateways[$defaultGateway.val()].enable();
	    }
	  }

	  /**
	   * @since 1.5.0
	   *
	   * @return {Boolean}
	   */
	  isValidInput() {
	    return this.isValidGatewayId() && this.isValidGateway() && this.isValidAcceptTerms();
	  }

	  /**
	   * @since 1.5.0
	   * @access protected
	   *
	   * @return {Boolean} 
	   */
	  isValidGatewayId() {
	    return this.gatewayId !== '';
	  }

	  /**
	   * @since 1.5.0
	   *
	   * @access protected
	   *
	   * @return {Boolean}
	   */
	  isValidGateway() {
	    if (this.gatewayId in this.gateways) {
	      return this.gateways[this.gatewayId].isValid();
	    } else {
	      return true;
	    }
	  }

	  /**
	   * @return {Boolean}
	   *
	   * @access protected
	   *
	   * @since 1.10.2
	   */
	  isValidAcceptTerms() {
	    return !mpapp().settings().getTermsPageIdForAcceptance() || this.acceptTerms;
	  }

	  /**
	   * @since 1.5.0
	   * @access protected
	   *
	   * @param {String} propertyName
	   * @param {*} newValue
	   * @param {*} oldValue
	   */
	  afterUpdate(propertyName, newValue, oldValue) {
	    // Toggle gateways
	    if (oldValue in this.gateways) {
	      this.gateways[oldValue].disable();
	    }
	    if (newValue in this.gateways) {
	      this.gateways[newValue].enable();
	    }
	  }

	  /**
	   * @since 1.5.0
	   * @access protected
	   */
	  react() {
	    super.react();

	    // Always enable submit button to allow validation messages
	    this.$buttonNext.prop('disabled', false);
	  }

	  /**
	   * @since 1.5.0
	   * @access protected
	   *
	   * @return {undefined|Promise}
	   */
	  maybeSubmit() {
	    // Disable coupons section
	    if (this.couponSection) {
	      this.couponSection.disable();
	    }
	    if (this.gatewayId in this.gateways) {
	      let gateway = this.gateways[this.gatewayId];
	      let result = gateway.processPayment(this.cart, this.bookingDetails);

	      // If a Promise
	      if (typeof result === 'object' && typeof result.then === 'function') {
	        result.then(paymentData => {
	          this.cart.setPaymentDetails(paymentData);
	          return paymentData;
	        }, error => {
	          this.setErrorMessage(error.message);
	        }

	        // Leave errors to AbstractStep.submit() or re-throw it, so
	        // AbstractStep may cancel submission
	        );
	      }

	      return result;
	    }
	  }

	  /**
	   * @since 1.11.0
	   *
	   * @access protected
	   */
	  cancelSubmission() {
	    super.cancelSubmission();
	    if (this.couponSection) {
	      this.couponSection.enable();
	    }
	  }
	}

	/**
	 * @param {Object} element jQuery or DOM element.
	 * @param {Object} args
	 * @return {Object}
	 *
	 * @since 1.2.1
	 */
	function mpa_flatpickr(element, args) {
	  let locale = args.locale || mpapp().settings().getFlatpickrLocale();
	  let l10n = flatpickr.l10ns[locale] || locale;

	  // Use first day of the week value from Settings > General > Week Starts On
	  if (typeof l10n == 'object') {
	    l10n.firstDayOfWeek = mpapp().settings().getFirstDayOfWeek();
	  }

	  // Merge args
	  let defaultArgs = {
	    formatDate: mpa_format_date,
	    inline: true,
	    locale: l10n,
	    monthSelectorType: 'static',
	    showMonths: 1
	  };
	  args = jQuery.extend({}, defaultArgs, args);

	  // Create instance
	  let instance = null;
	  if (element instanceof jQuery) {
	    instance = flatpickr(element[0], args);
	  } else {
	    instance = flatpickr(element, args);
	  }
	  return instance;
	}

	/**
	 * @since 1.0
	 */
	class StepPeriod extends AbstractStep {
	  /**
	   * @access protected
	   *
	   * @since 1.0
	   */
	  setupProperties() {
	    super.setupProperties();
	    this.cartItem = null;
	    this.lastHash = ''; // Track cart changes

	    this.monthSlots = {}; // {'YYYY-MM': {'Y-m-d': Time slots}}, where time slots
	    // is {Time period: Array of [Employee ID, Location ID]}.
	    // For example: {'10:00 - 11:00': [[19, 21], [89, 21]], ...}

	    this.date = '';
	    this.time = '';
	    this.datepicker = null;
	    this.$dateWrapper = this.$element.find('.mpa-date-wrapper');
	    this.$dateInput = this.$element.find('.mpa-date');
	    this.$timeWrapper = this.$element.find('.mpa-time-wrapper');
	    this.$times = this.$timeWrapper.find('.mpa-times');

	    /**
	     * Recursion counters
	     * @since 1.19.0
	     */
	    this.selectFirstDateTimeSlotRecursionCounter = 0;
	    this.selectFirstDateTimeSlotRecursionCounterMax = 12;
	    this.isAlreadySelectedFirstDateTimeSlotAfterFirstRenderCalendar = false;
	  }

	  /**
	   * @return {String}
	   *
	   * @access protected
	   *
	   * @since 1.0
	   */
	  theId() {
	    return 'period';
	  }

	  /**
	   * @return {String} 'cart'|'cart item'
	   *
	   * @since 1.9.0
	   */
	  getCartContext() {
	    return 'cart item';
	  }

	  /**
	   * @return {Object}
	   *
	   * @access protected
	   *
	   * @since 1.0
	   */
	  propertiesSchema() {
	    return {
	      date: {
	        type: 'string',
	        default: ''
	      },
	      time: {
	        type: 'string',
	        default: ''
	      }
	    };
	  }

	  /**
	   * @access protected
	   *
	   * @since 1.0
	   */
	  addListeners() {
	    super.addListeners();
	    this.$dateInput.on('change', event => this.setProperty('date', event.target.value));
	  }

	  /**
	   * @return {Promise}
	   *
	   * @access protected
	   *
	   * @since 1.0
	   */
	  loadEntities() {
	    this.cartItem = this.cart.getActiveItem();
	    this.lastHash = this.cartItem.getHash('availability');
	    return Promise.resolve(this);
	  }

	  /**
	   * @access protected
	   *
	   * @since 1.0
	   */
	  reload() {
	    // Did something changed?
	    if (this.cartItem.didChange(this.lastHash, 'availability')) {
	      // Reset all and reload
	      this.$element.removeClass('mpa-loaded');
	      this.resetDate(); // This also resets the time
	      this.readyPromise = this.loadEntities();

	      // Reset saved time slots
	      this.monthSlots = {};

	      // Re-enable days
	      if (this.datepicker != null) {
	        this.setEnabledDays([]);
	        this.readyPromise.finally(() => this.resetEnabledDays());
	      }
	      return this.readyPromise;
	    } else {
	      return Promise.resolve(this);
	    }
	  }

	  /**
	   * Reset step before a new item.
	   *
	   * @since 1.4.0
	   */
	  reset() {
	    this.cartItem = this.cart.getActiveItem();
	    this.lastHash = '';
	    this.monthSlots = {};
	    this.resetDate();
	  }

	  /**
	   * @return {Boolean}
	   *
	   * @since 1.0
	   */
	  isValidInput() {
	    return this.date != '' && this.time != '';
	  }

	  /**
	   * @access protected
	   *
	   * @since 1.0
	   */
	  resetDate() {
	    // Will also reset the time in afterUpdate()
	    this.resetProperty('date');
	  }

	  /**
	   * @access protected
	   *
	   * @since 1.0
	   */
	  resetTime() {
	    this.$times.empty();
	    this.resetProperty('time');
	  }

	  /**
	   * @param {Array}
	   *
	   * @since 1.0
	   */
	  setEnabledDays(allowedDays) {
	    if (!mpa_empty(allowedDays, true)) {
	      this.datepicker.set('enable', allowedDays);
	    } else {
	      // Just a date in the past to disable all days. With [] Flatpickr
	      // allows all dates and disables nothing
	      this.datepicker.set('enable', ['2000-01-01']);
	    }
	  }

	  /**
	   * Executed only when the new value is different from the old one.
	   *
	   * @param {String} propertyName
	   * @param {*} newValue
	   * @param {*} oldValue
	   *
	   * @access protected
	   *
	   * @since 1.0
	   */
	  afterUpdate(propertyName, newValue, oldValue) {
	    if (propertyName == 'date') {
	      if (newValue == '') {
	        this.resetTime();
	      } else {
	        this.resetTimeSlots();
	      }
	    }
	  }

	  /**
	   * @access protected
	   *
	   * @since 1.0
	   */
	  react() {
	    super.react();

	    // Toggle time slots
	    this.$timeWrapper.toggleClass('mpa-hide', this.date == '');
	  }

	  /**
	   * @access protected
	   *
	   * @since 1.0
	   */
	  showReady() {
	    super.showReady();

	    // Show datepicker
	    if (this.datepicker == null) {
	      this.showDatepicker();

	      // Enable days for current month
	      this.resetEnabledDays();
	    }
	  }

	  /**
	   * @access protected
	   *
	   * @since 1.0
	   */
	  showDatepicker() {
	    this.datepicker = mpa_flatpickr(this.$dateInput, this.getDatepickerArgs());
	  }

	  /**
	   * @access protected
	   */
	  getDatepickerArgs() {
	    return {
	      minDate: mpapp().settings().getBusinessDate(),
	      // Don't allow to go to
	      // the previous months
	      onMonthChange: () => this.resetEnabledDays()
	    };
	  }

	  /**
	   * @access protected
	   *
	   * @since 1.0
	   */
	  maybeSubmit() {
	    let cartItem = this.cartItem;
	    cartItem.date = mpa_parse_date(this.date);
	    cartItem.time = new TimePeriod(this.time);

	    // Autoselect employee/location, if needed
	    if (cartItem.employee === null || cartItem.location === null) {
	      let autoselectedIds = this.autoselectIds();
	      let autoEmployeeId = autoselectedIds[0];
	      let autoLocationId = autoselectedIds[1];
	      if (cartItem.employee === null) {
	        cartItem.setEmployee(autoEmployeeId, 'no-reset');
	      }
	      if (cartItem.location === null) {
	        cartItem.setLocation(autoLocationId, 'no-reset');
	      }
	    }
	    document.dispatchEvent(new CustomEvent('mpa_add_to_cart', {
	      detail: {
	        cartItem: cartItem,
	        currencyCode: mpapp().settings().getCurrency()
	      }
	    }));
	    document.dispatchEvent(new CustomEvent('mpa_view_cart', {
	      detail: {
	        cart: this.cart,
	        currencyCode: mpapp().settings().getCurrency()
	      }
	    }));
	  }

	  /**
	   * After loading time slots of month, we set the first available timeslot as the initial value of the calendar.
	   *
	   * @since 1.19.0
	   */
	  selectFirstDateTimeSlot() {
	    let year = this.datepicker.currentYear;
	    let month = this.datepicker.currentMonth;
	    let monthKey = this.getMonthKey(year, month);
	    const slotsForThisMonth = this.monthSlots[monthKey];
	    if (slotsForThisMonth && Object.keys(slotsForThisMonth).length > 0) {
	      // Get the first available date and time
	      const firstDate = Object.keys(slotsForThisMonth)[0];
	      const firstTimeSlot = Object.keys(slotsForThisMonth[firstDate])[0];

	      // Programmatically set the date value for Flatpickr and call the change handler
	      this.datepicker.setDate(firstDate, true);
	      const targetTimeElement = this.$times.children('.mpa-time-period').filter((index, elem) => {
	        return elem.getAttribute('date-time') === firstTimeSlot;
	      });
	      targetTimeElement.trigger('click');
	      this.isAlreadySelectedFirstDateTimeSlotAfterFirstRenderCalendar = true;
	    } else {
	      // Make scroll of calendar for first render after loading
	      // and skip scroll of calendar for calendar scroll by user actions
	      if (this.isAlreadySelectedFirstDateTimeSlotAfterFirstRenderCalendar === true) {
	        return;
	      }

	      // Prevent recursive loop
	      if (this.selectFirstDateTimeSlotRecursionCounter >= this.selectFirstDateTimeSlotRecursionCounterMax) {
	        this.datepicker.changeMonth(-this.selectFirstDateTimeSlotRecursionCounter);
	        this.isAlreadySelectedFirstDateTimeSlotAfterFirstRenderCalendar = true;
	        return;
	      }
	      this.selectFirstDateTimeSlotRecursionCounter += 1;

	      // If no available slots for the current month, move to the next month
	      this.datepicker.changeMonth(1);

	      // Reload timeslots for new month and then again call resetEnabledDays() => selectFirstDateTimeSlot() method to try again with the next month
	      // To be careful. This is recursion.
	      this.reload();
	    }
	  }

	  /**
	   * @return {Number[]} [Employee ID, Location ID]
	   *
	   * @access protected
	   *
	   * @since 1.2.1
	   */
	  autoselectIds() {
	    let ids = [0, 0];
	    let monthKey = this.getCurrentMonthKey();
	    if (this.monthSlots[monthKey] && this.monthSlots[monthKey][this.date]) {
	      let timeSlots = this.monthSlots[monthKey][this.date];

	      // Search for the proper period
	      for (let timeStr in timeSlots) {
	        if (timeStr === this.time) {
	          let employees = timeSlots[timeStr];

	          // Get the first pair
	          ids[0] = employees[0][0]; // Copy values, not
	          ids[1] = employees[0][1]; // the array pointer

	          break;
	        }
	      }
	    }
	    return ids;
	  }

	  /**
	   * @access protected
	   *
	   * @since 1.0
	   */
	  resetEnabledDays() {
	    // Reset date & time
	    this.resetDate(); // This also resets the time

	    // Disable all days
	    this.setEnabledDays([]);

	    // Add preloader
	    this.$dateWrapper.removeClass('mpa-loaded');

	    // Get new enabled days
	    let year = this.datepicker.currentYear;
	    let month = this.datepicker.currentMonth;
	    let monthKey = this.getMonthKey(year, month);

	    // Query time slots
	    let queryPromise = null;
	    if (!this.monthSlots[monthKey]) {
	      // Query slots for new month
	      let serviceId = this.cartItem.service.id;
	      let dateFrom = new Date(year, month, 1);
	      let dateTo = new Date(year, month + 1, 0);
	      queryPromise = mpa_time_slots(serviceId, dateFrom, dateTo, this.getTimeSlotsQueryArgs());
	    } else {
	      // Get already loaded month
	      queryPromise = Promise.resolve(this.monthSlots[monthKey]);
	    }

	    // Update enabled days
	    queryPromise.then(daySlots => {
	      // Save slots for future
	      this.monthSlots[monthKey] = daySlots;
	      this.setEnabledDays(Object.keys(daySlots));
	      this.$dateWrapper.addClass('mpa-loaded');
	      this.selectFirstDateTimeSlot();
	    });
	  }

	  /**
	   * @access protected
	   */
	  getTimeSlotsQueryArgs() {
	    return {
	      employees: this.cartItem.getAvailableEmployeeIds(),
	      locations: this.cartItem.getAvailableLocationIds(),
	      exclude: this.cart.toArray('items')
	    };
	  }

	  /**
	   * @access protected
	   *
	   * @since 1.0
	   */
	  resetTimeSlots() {
	    // Clear time
	    this.resetTime();

	    // Get time slots
	    let timeSlots = {};
	    let monthKey = this.getCurrentMonthKey();
	    if (this.monthSlots[monthKey][this.date] != undefined) {
	      timeSlots = this.monthSlots[monthKey][this.date];
	    }

	    // Add buttons to the $times
	    let slotsAdded = 0;
	    for (let timeStr in timeSlots) {
	      let period = new TimePeriod(timeStr); // '10:00 - 11:00'

	      // '10:00<span class="mpa-period-end-time"> - 11:00</span>', so we
	      // can use CSS to hide second part in narrow columns
	      let periodLabel = period.toString('public', '<span class="mpa-period-end-time"> - ') + '</span>';

	      // Add button
	      let periodButton = mpa_tmpl_button(periodLabel, {
	        'class': 'button button-secondary mpa-time-period',
	        'date-time': timeStr
	      });
	      this.$times.append(periodButton);
	      slotsAdded++;
	    }

	    // Add listeners or error message
	    if (slotsAdded > 0) {
	      this.$times.children('.mpa-time-period').on('click', event => this.onTime(event, event.currentTarget));
	    } else {
	      this.$times.text(__('Sorry, but we were unable to allocate time slots for the date you selected.', 'motopress-appointment'));
	    }
	  }

	  /**
	   * @param {Number} year
	   * @param {Number} month
	   * @return {String}
	   *
	   * @access protected
	   *
	   * @since 1.2.1
	   */
	  getMonthKey(year, month) {
	    if (month <= 8) {
	      // '2021-04'
	      return year + '-0' + (month + 1);
	    } else {
	      // '2021-10'
	      return year + '-' + (month + 1);
	    }
	  }

	  /**
	   * @return {String}
	   *
	   * @access protected
	   *
	   * @since 1.2.1
	   */
	  getCurrentMonthKey() {
	    if (this.date !== '') {
	      let date = mpa_parse_date(this.date);
	      return this.getMonthKey(date.getFullYear(), date.getMonth());
	    } else {
	      return '2000-01';
	    }
	  }

	  /**
	   * @param {Event} event
	   * @param {Button} button Clicked button.
	   *
	   * @access protected
	   *
	   * @since 1.0
	   */
	  onTime(event, button) {
	    // Toggle class ".mpa-time-period-selected"
	    this.$times.children('.mpa-time-period-selected').removeClass('mpa-time-period-selected');
	    button.classList.add('mpa-time-period-selected');

	    // Update time property
	    this.setProperty('time', button.getAttribute('date-time'));
	  }
	}

	/**
	 * @since 1.0
	 */
	class StepServiceForm extends AbstractStep {
	  /**
	   * @access protected
	   *
	   * @since 1.0
	   */
	  setupProperties() {
	    super.setupProperties();
	    this.availability = new AvailabilityService();
	    this.category = '';
	    this.serviceId = 0;
	    this.employeeId = 0;
	    this.locationId = 0;
	    this.isHiddenStep = true;
	    this.$form = this.$element.find('.mpa-service-form');
	    this.$categories = this.$element.find('.mpa-service-category-wrapper');
	    this.$services = this.$element.find('.mpa-service-wrapper');
	    this.$employees = this.$element.find('.mpa-employee-wrapper');
	    this.$locations = this.$element.find('.mpa-location-wrapper');
	    this.$selects = this.$element.find('.mpa-input-wrapper select');
	    this.$categoriesSelect = this.$selects.filter('.mpa-service-category');
	    this.$servicesSelect = this.$selects.filter('.mpa-service');
	    this.$employeesSelect = this.$selects.filter('.mpa-employee');
	    this.$locationsSelect = this.$selects.filter('.mpa-location');
	    this.unselectedServiceText = this.$servicesSelect.children('[value=""]').text();
	    this.unselectedOptionText = this.$selects.filter('.mpa-optional-select').first().find('option:first').text();
	  }

	  /**
	   * @return {String}
	   *
	   * @access protected
	   *
	   * @since 1.0
	   */
	  theId() {
	    return 'service-form';
	  }

	  /**
	   * @return {String} 'cart'|'cart item'
	   *
	   * @since 1.9.0
	   */
	  getCartContext() {
	    return 'cart item';
	  }

	  /**
	   * @return {Object}
	   *
	   * @access protected
	   *
	   * @since 1.0
	   */
	  propertiesSchema() {
	    return {
	      category: {
	        type: 'string',
	        default: ''
	      },
	      serviceId: {
	        type: 'integer',
	        default: 0
	      },
	      employeeId: {
	        type: 'integer',
	        default: 0
	      },
	      locationId: {
	        type: 'integer',
	        default: 0
	      }
	    };
	  }

	  /**
	   * @access protected
	   *
	   * @since 1.0
	   */
	  addListeners() {
	    super.addListeners();
	    this.$form.on('submit', this.submitForm.bind(this));
	    this.$categoriesSelect.on('change', event => this.setProperty('category', event.target.value));
	    this.$servicesSelect.on('change', event => this.setProperty('serviceId', event.target.value));
	    this.$employeesSelect.on('change', event => this.setProperty('employeeId', event.target.value));
	    this.$locationsSelect.on('change', event => this.setProperty('locationId', event.target.value));
	  }
	  isHiddenElementByProp($element) {
	    const isHidden = $element.attr('data-is-hidden');
	    if (typeof isHidden !== 'undefined' && isHidden !== 'false') {
	      return true;
	    }
	    return false;
	  }
	  initCategoriesSelect() {
	    if (this.$categoriesSelect.length == 0) {
	      return; // The select is disabled by parameter show_*
	    }

	    this.updateCategorySchema();
	    let value = this.$categoriesSelect.val();
	    let isHiddenSelect = this.isHiddenElementByProp(this.$servicesSelect);
	    if (this.$categoriesSelect.attr('data-default')) {
	      const defaultValue = this.$categoriesSelect.attr('data-default');
	      if (this.isValidCategoryBySchema(defaultValue)) {
	        value = defaultValue;
	      } else {
	        isHiddenSelect = false;
	      }
	    }
	    this.setProperty('category', value);
	    this.renderCategorySelect();
	    if (!isHiddenSelect) {
	      this.isHiddenStep = false;
	    }
	    this.$categories.toggleClass('mpa-hide', isHiddenSelect);
	  }
	  initServicesSelect() {
	    if (this.$servicesSelect.length == 0) {
	      return; // The select is disabled by parameter show_*
	    }

	    this.updateServiceSchema();
	    let value = this.$servicesSelect.val();
	    let isHiddenSelect = this.isHiddenElementByProp(this.$servicesSelect);
	    if (this.$servicesSelect.attr('data-default')) {
	      const defaultValue = mpa_intval(this.$servicesSelect.attr('data-default'));
	      if (this.isValidServiceBySchema(defaultValue)) {
	        value = defaultValue;
	      } else {
	        isHiddenSelect = false;
	      }
	    }
	    this.setProperty('serviceId', value);
	    this.renderServiceSelect();
	    if (!isHiddenSelect) {
	      this.isHiddenStep = false;
	    }
	    this.$services.toggleClass('mpa-hide', isHiddenSelect);
	  }
	  initEmployeesSelect() {
	    if (this.$employeesSelect.length == 0) {
	      return; // The select is disabled by parameter show_*
	    }

	    this.updateEmployeeSchema();
	    let value = this.$employeesSelect.val();
	    let isHiddenSelect = this.isHiddenElementByProp(this.$employeesSelect);
	    if (this.$employeesSelect.attr('data-default')) {
	      const defaultValue = mpa_intval(this.$employeesSelect.attr('data-default'));
	      if (this.isValidEmployeeBySchema(defaultValue)) {
	        value = defaultValue;
	      } else {
	        isHiddenSelect = false;
	      }
	    }
	    this.setProperty('employeeId', value);
	    this.renderEmployeeSelect();
	    if (!isHiddenSelect) {
	      this.isHiddenStep = false;
	    }
	    this.$employees.toggleClass('mpa-hide', isHiddenSelect);
	  }
	  initLocationsSelect() {
	    if (this.$locationsSelect.length == 0) {
	      return; // The select is disabled by parameter show_*
	    }

	    this.updateLocationSchema();
	    let value = this.$locationsSelect.val();
	    let isHiddenSelect = this.isHiddenElementByProp(this.$locationsSelect);
	    if (this.$locationsSelect.attr('data-default')) {
	      const defaultValue = mpa_intval(this.$locationsSelect.attr('data-default'));
	      if (this.isValidLocationBySchema(defaultValue)) {
	        value = defaultValue;
	      } else {
	        isHiddenSelect = false;
	      }
	    }
	    this.setProperty('locationId', value);
	    this.renderLocationSelect();
	    if (!isHiddenSelect) {
	      this.isHiddenStep = false;
	    }
	    this.$locations.toggleClass('mpa-hide', isHiddenSelect);
	  }

	  /**
	   * @return {Promise}
	   *
	   * @access protected
	   *
	   * @since 1.0
	   */
	  loadEntities() {
	    return this.availability.ready().finally(() => {
	      // Hide other empty selects
	      // or hide selects with the "data-is-hidden" setting, excluding unselected and required selects.
	      this.initServicesSelect();
	      this.initCategoriesSelect(); // needs to be initialized after this.initServicesSelect(), because hiding the field depends on hiding the services select field.
	      this.initEmployeesSelect();
	      this.initLocationsSelect();
	      return this;
	    });
	  }

	  /**
	   * Reset step before a new item.
	   *
	   * @since 1.4.0
	   */
	  reset() {
	    let $selects = {
	      category: this.$categoriesSelect,
	      serviceId: this.$servicesSelect,
	      employeeId: this.$employeesSelect,
	      locationId: this.$locationsSelect
	    };
	    this.preventReact = true;

	    // Set default values
	    for (let propertyName in $selects) {
	      let $select = $selects[propertyName];
	      let defaultValue = $select.attr('data-default');
	      if (defaultValue) {
	        this.setProperty(propertyName, defaultValue);
	      } else {
	        this.resetProperty(propertyName);
	      }
	    }
	    this.preventReact = false;

	    // Render changes if this step is active
	    if (this.isActive) {
	      this.react();
	    }
	  }

	  /**
	   * @return {Boolean}
	   *
	   * @since 1.0
	   */
	  isValidInput() {
	    return this.serviceId != 0;
	  }

	  /**
	   * @since 1.19.0
	   *
	   * Save allowed options for validateProperty()
	   */
	  updateCategorySchema() {
	    const categories = this.availability.getAvailableServiceCategories(this.serviceId);
	    this.schema.category.options = Object.keys(categories);
	  }

	  /**
	   * @since 1.19.0
	   *
	   * Save allowed options for validateProperty()
	   */
	  updateServiceSchema() {
	    const services = this.availability.getAvailableServices(this.category, this.locationId, this.employeeId);
	    this.schema.serviceId.options = Object.keys(services).map(mpa_intval);
	  }

	  /**
	   * @since 1.19.0
	   *
	   * Save allowed options for validateProperty()
	   */
	  updateEmployeeSchema() {
	    const employees = this.availability.getAvailableEmployees(this.serviceId, this.locationId);
	    this.schema.employeeId.options = Object.keys(employees).map(mpa_intval);
	  }

	  /**
	   * @since 1.19.0
	   *
	   * Save allowed options for validateProperty()
	   */
	  updateLocationSchema() {
	    const locations = this.availability.getAvailableLocations(this.serviceId, this.employeeId);
	    this.schema.locationId.options = Object.keys(locations).map(mpa_intval);
	  }

	  /**
	   * @param {String} categorySlug
	   * @return {Boolean}
	   */
	  isValidCategoryBySchema(categorySlug) {
	    return this.schema.category.options.includes(categorySlug);
	  }

	  /**
	   * @param {Number} serviceId
	   * @return {Boolean}
	   */
	  isValidServiceBySchema(serviceId) {
	    return this.schema.serviceId.options.includes(serviceId);
	  }

	  /**
	   * @param {Number} locationId
	   * @return {Boolean}
	   */
	  isValidLocationBySchema(locationId) {
	    return this.schema.locationId.options.includes(locationId);
	  }

	  /**
	   * @param {Number} locationId
	   * @return {Boolean}
	   */
	  isValidEmployeeBySchema(employeeId) {
	    return this.schema.employeeId.options.includes(employeeId);
	  }

	  /**
	   * Executed only when the new value is different from the old one.
	   *
	   * @param {String} propertyName
	   * @param {*} newValue
	   * @param {*} oldValue
	   *
	   * @access protected
	   *
	   * @since 1.0
	   */
	  afterUpdate(propertyName, newValue, oldValue) {
	    this.updateCategorySchema();
	    this.updateServiceSchema();
	    this.updateEmployeeSchema();
	    this.updateLocationSchema();
	  }

	  /**
	   * @access protected
	   *
	   * @since 1.0
	   */
	  react() {
	    super.react();

	    // Update dependent <select>'s
	    this.$categoriesSelect.val(this.category || '');
	    this.$servicesSelect.val(this.serviceId || '');
	    this.$employeesSelect.val(this.employeeId);
	    this.$locationsSelect.val(this.locationId);
	    this.$categoriesSelect.toggleClass('mpa-selected', this.category != '');
	    this.$servicesSelect.toggleClass('mpa-selected', this.serviceId != 0);
	    this.$employeesSelect.toggleClass('mpa-selected', this.employeeId != 0);
	    this.$locationsSelect.toggleClass('mpa-selected', this.locationId != 0);

	    // re-renden select options
	    this.renderCategorySelect();
	    this.renderServiceSelect();
	    this.renderEmployeeSelect();
	    this.renderLocationSelect();

	    // Always enable submit button to allow validation messages
	    this.$buttonNext.prop('disabled', false);
	  }

	  /**
	   * @since 1.19.0
	   * @access protected
	   */
	  renderCategorySelect() {
	    this.preventUpdate = true;
	    update_select_options(this.$categoriesSelect, {
	      '': this.unselectedOptionText
	    }, this.availability.getAvailableServiceCategories(this.serviceId), this.category || '');
	    this.preventUpdate = false;
	  }

	  /**
	   * @since 1.19.0
	   * @access protected
	   */
	  renderServiceSelect() {
	    this.preventUpdate = true;
	    update_select_options(this.$servicesSelect, {
	      '': this.unselectedServiceText
	    }, this.availability.getAvailableServices(this.category, this.locationId, this.employeeId), this.serviceId || '');
	    this.preventUpdate = false;
	  }

	  /**
	   * @since 1.19.0
	   * @access protected
	   */
	  renderEmployeeSelect() {
	    this.preventUpdate = true;
	    update_select_options(this.$employeesSelect, {
	      0: this.unselectedOptionText
	    }, this.availability.getAvailableEmployees(this.serviceId, this.locationId), this.employeeId);
	    this.preventUpdate = false;
	  }

	  /**
	   * @since 1.19.0
	   * @access protected
	   */
	  renderLocationSelect() {
	    this.preventUpdate = true;
	    update_select_options(this.$locationsSelect, {
	      0: this.unselectedOptionText
	    }, this.availability.getAvailableLocations(this.serviceId, this.employeeId), this.locationId);
	    this.preventUpdate = false;
	  }
	  show() {
	    this.$servicesSelect.prop('required', true);
	    super.show();
	  }
	  hide() {
	    super.hide();
	    this.$servicesSelect.prop('required', false);
	  }

	  /**
	   * @access protected
	   *
	   * @since 1.0
	   */
	  enable() {
	    super.enable();

	    // Enable all selects
	    this.$selects.prop('disabled', false);
	  }

	  /**
	   * @access protected
	   *
	   * @since 1.0
	   */
	  disable() {
	    super.disable();

	    // Disable all selects
	    this.$selects.prop('disabled', true);
	  }

	  /**
	   * @param {Event} event
	   *
	   * @access protected
	   *
	   * @since 1.2
	   */
	  submitForm(event) {
	    // Never submit the form, but allow validation
	    if (!this.isActive || this.isValidInput()) {
	      event.preventDefault();
	    }
	  }

	  /**
	   * @access protected
	   *
	   * @since 1.0
	   */
	  maybeSubmit() {
	    let cartItem = this.cart.getActiveItem();
	    if (cartItem === null) {
	      return console.error('Unable to get active cart item in StepServiceForm.maybeSubmit().');
	    }

	    // Save service
	    cartItem.setService(this.availability.getService(this.serviceId, true, () => {
	      document.dispatchEvent(new CustomEvent('mpa_view_item', {
	        detail: {
	          cartItem: cartItem,
	          currencyCode: mpapp().settings().getCurrency()
	        }
	      }));
	    }));
	    cartItem.setServiceCategories(this.availability.getServiceCategories(this.serviceId));

	    // Save employee(-s)
	    if (this.employeeId !== 0) {
	      cartItem.setEmployee(this.availability.getEmployee(this.employeeId));
	    } else {
	      cartItem.setAvailableEmployees(this.availability.filterAvailableEmployees(this.serviceId, this.locationId, 'entities'));
	    }

	    // Save location(-s)
	    if (this.locationId !== 0) {
	      cartItem.setLocation(this.availability.getLocation(this.locationId));
	    } else {
	      let allowedEmployees = this.employeeId || cartItem.getAvailableEmployeeIds();
	      cartItem.setAvailableLocations(this.availability.filterAvailableLocations(this.serviceId, allowedEmployees, 'entities'));
	    }
	  }
	}

	/**
	 * @since 1.0
	 */
	class AppointmentFormShortcode {
	  /**
	   * @since 1.0
	   */
	  constructor($element) {
	    this.$element = $element;
	    this.$message = this.$element.children('.mpa-message');
	    this.cart = new Cart();
	    this.steps = new BookingSteps(this.cart);
	    this.load(); // And show()
	  }

	  /**
	   * @since 1.9.0
	   * @access protected
	   */
	  setupSteps() {
	    this.steps.addStep(new StepServiceForm(this.$element.find('.mpa-booking-step-service-form'), this.cart)).addStep(new StepPeriod(this.$element.find('.mpa-booking-step-period'), this.cart)).addStep(new StepCart(this.$element.find('.mpa-booking-step-cart'), this.cart)).addStep(new StepCheckout(this.$element.find('.mpa-booking-step-checkout'), this.cart));
	    if (mpapp().settings().isPaymentsEnabled()) {
	      this.steps.addStep(new StepPayment(this.$element.find('.mpa-booking-step-payment'), this.cart));
	    }
	    this.steps.addStep(new StepBooking(this.$element.find('.mpa-booking-step-booking'), this.cart));
	    this.steps.mount(this.$element);
	  }

	  /**
	   * @access protected
	   *
	   * @since 1.0
	   */
	  load() {
	    // Create the initial cart item for cart item steps
	    this.cart.createItem();

	    // Check if we have any service to book
	    let availability = new AvailabilityService();
	    Promise.all([availability.ready(), mpapp().settings().ready()]).finally(() => {
	      // Setup steps only when the settings are loaded
	      this.setupSteps();
	      this.show();
	      if (!availability.isEmpty()) {
	        this.steps.goToNextStep(); // Show the first step
	      } else {
	        this.$message.html(__('Sorry, there are no services, employees or locations to book.', 'motopress-appointment'));
	        this.$message.removeClass('mpa-hide');
	      }
	    });
	  }

	  /**
	   * @access protected
	   *
	   * @since 1.0
	   */
	  show() {
	    // Remove loading GIF
	    this.$element.addClass('mpa-loaded');
	  }
	}

	/**
	 *
	 * @param object1
	 * @param object2
	 * @return {boolean}
	 */
	function mpa_objects_is_equal(object1, object2) {
	  if (object1 === object2) {
	    return true;
	  }
	  if (typeof object1 !== 'object' || object1 === null || typeof object2 !== 'object' || object2 === null) {
	    return false;
	  }
	  let keys1 = Object.keys(object1);
	  let keys2 = Object.keys(object2);
	  if (keys1.length !== keys2.length) {
	    return false;
	  }
	  for (let key of keys1) {
	    if (!keys2.includes(key) || !mpa_objects_is_equal(object1[key], object2[key])) {
	      return false;
	    }
	  }
	  return true;
	}

	const {
	  serverSideRender: ServerSideRender$c
	} = wp;
	const {
	  Component: Component$o,
	  Fragment: Fragment$o
	} = wp.element;
	const {
	  Disabled: Disabled$c,
	  Placeholder,
	  Spinner
	} = wp.components;
	const {
	  jQuery: $
	} = window;
	let Edit$c = class Edit extends Component$o {
	  state = {
	    initialized: false
	  };
	  containerRef = React.createRef();
	  observer = null;
	  render() {
	    return wp.element.createElement(Fragment$o, null, wp.element.createElement(Inspector$c, this.props), wp.element.createElement("div", {
	      ref: this.containerRef
	    }, wp.element.createElement(Disabled$c, null, wp.element.createElement(ServerSideRender$c, {
	      block: "motopress-appointment/appointment-form",
	      attributes: this.props.attributes,
	      LoadingResponsePlaceholder: this.handleServerSideRenderLoad
	    }))));
	  }
	  initAppointmentForm = () => {
	    const lastWrapper = $(this.containerRef.current).find('.appointment-form-shortcode').last();
	    if (lastWrapper.length && !lastWrapper.data('initialized')) {
	      new AppointmentFormShortcode(lastWrapper);
	      lastWrapper.data('initialized', true);
	    }
	  };
	  handleAttributesUpdate = () => {
	    this.setState({
	      initialized: false
	    }, this.initAppointmentForm);
	  };
	  componentDidMount() {
	    this.initAppointmentForm();
	    this.observeDOMChanges();
	  }
	  componentDidUpdate(prevProps) {
	    if (!mpa_objects_is_equal(this.props.attributes, prevProps.attributes)) {
	      this.handleAttributesUpdate();
	    }
	  }
	  componentWillUnmount() {
	    if (this.observer) {
	      this.observer.disconnect();
	    }
	  }
	  observeDOMChanges() {
	    const container = this.containerRef.current;
	    this.observer = new MutationObserver(mutations => {
	      mutations.forEach(mutation => {
	        if (mutation.type === 'childList') {
	          this.initAppointmentForm();
	        }
	      });
	    });
	    this.observer.observe(container, {
	      childList: true,
	      subtree: true
	    });
	  }
	  handleServerSideRenderLoad = ({
	    className
	  }) => {
	    setTimeout(this.handleAttributesUpdate, 500);
	    return wp.element.createElement(Placeholder, {
	      className: className
	    }, wp.element.createElement("div", {
	      style: {
	        display: 'flex',
	        justifyContent: 'center',
	        width: '100%'
	      }
	    }, wp.element.createElement(Spinner, null)));
	  };
	};

	const {
	  registerBlockType: registerBlockType$c
	} = wp.blocks;

	/**
	 * Module Constants
	 */
	const blockName$c = 'motopress-appointment/appointment-form';

	/**
	 * Register the block
	 */
	registerBlockType$c(blockName$c, {
	  title: wp_i18n.__('Appointment Form', 'motopress-appointment'),
	  icon: wp.element.createElement("svg", {
	    xmlns: "http://www.w3.org/2000/svg",
	    x: "0px",
	    y: "0px",
	    viewBox: "0 0 24 24"
	  }, wp.element.createElement("path", {
	    d: "M0,18v6h24v-6H0z M22,22H2v-2h20V22z"
	  }), wp.element.createElement("path", {
	    d: "M21,7V1h-3V0h-2v1H8V0H6v1H3v6v9h18V7z M5,3h1v1h2V3h8v1h2V3h1v2H5V3z M5,14V7h14v7H5z"
	  }), wp.element.createElement("rect", {
	    x: "7",
	    y: "8",
	    width: "2",
	    height: "2"
	  }), wp.element.createElement("rect", {
	    x: "11",
	    y: "8",
	    width: "2",
	    height: "2"
	  }), wp.element.createElement("rect", {
	    x: "15",
	    y: "8",
	    width: "2",
	    height: "2"
	  }), wp.element.createElement("rect", {
	    x: "7",
	    y: "11",
	    width: "2",
	    height: "2"
	  }), wp.element.createElement("rect", {
	    x: "11",
	    y: "11",
	    width: "2",
	    height: "2"
	  }), wp.element.createElement("rect", {
	    x: "15",
	    y: "11",
	    width: "2",
	    height: "2"
	  })),
	  category: 'mpa-gutenberg-blocks',
	  keywords: [wp_i18n.__('appointment', 'motopress-appointment')],
	  supports: {
	    anchor: true,
	    customClassName: true
	  },
	  attributes: attributes$c,
	  edit: Edit$c,
	  save: () => {
	    return null;
	  }
	});

	const attributes$b = {
	  show_image: {
	    type: 'boolean',
	    default: true
	  },
	  show_title: {
	    type: 'boolean',
	    default: true
	  },
	  show_excerpt: {
	    type: 'boolean',
	    default: true
	  },
	  show_contacts: {
	    type: 'boolean',
	    default: true
	  },
	  show_social_networks: {
	    type: 'boolean',
	    default: true
	  },
	  show_additional_info: {
	    type: 'boolean',
	    default: true
	  },
	  employees: {
	    type: 'string',
	    default: ''
	  },
	  locations: {
	    type: 'string',
	    default: ''
	  },
	  posts_per_page: {
	    type: 'number',
	    default: 3
	  },
	  columns_count: {
	    type: 'number',
	    default: 3
	  },
	  orderby: {
	    type: 'string',
	    default: 'none'
	  },
	  order: {
	    type: 'string',
	    default: 'desc'
	  }
	};

	/**
	 * WordPress dependencies
	 */
	const {
	  Component: Component$n,
	  Fragment: Fragment$n
	} = wp.element;
	const {
	  SelectControl: SelectControl$3,
	  PanelBody: PanelBody$b,
	  TextControl: TextControl$b,
	  ToggleControl: ToggleControl$3,
	  RangeControl: RangeControl$3
	} = wp.components;
	const {
	  InspectorControls: InspectorControls$b
	} = wp.blockEditor || wp.editor;

	/**
	 * Create an Inspector Controls
	 */
	let Inspector$b = class Inspector extends Component$n {
	  render() {
	    const {
	      show_image,
	      show_title,
	      show_excerpt,
	      show_contacts,
	      show_social_networks,
	      show_additional_info,
	      employees,
	      locations,
	      posts_per_page,
	      columns_count,
	      orderby,
	      order
	    } = this.props.attributes;
	    const {
	      setAttributes
	    } = this.props;
	    return [wp.element.createElement(InspectorControls$b, {
	      key: "inspector"
	    }, wp.element.createElement(Fragment$n, null, wp.element.createElement(PanelBody$b, {
	      title: wp_i18n.__('Settings', 'motopress-appointment'),
	      initialOpen: true
	    }, wp.element.createElement(ToggleControl$3, {
	      label: wp_i18n.__('Show featured image.', 'motopress-appointment'),
	      checked: show_image,
	      onChange: value => {
	        setAttributes({
	          show_image: value
	        });
	      }
	    }), wp.element.createElement(ToggleControl$3, {
	      label: wp_i18n.__('Show post title.', 'motopress-appointment'),
	      checked: show_title,
	      onChange: value => {
	        setAttributes({
	          show_title: value
	        });
	      }
	    }), wp.element.createElement(ToggleControl$3, {
	      label: wp_i18n.__('Show post excerpt.', 'motopress-appointment'),
	      checked: show_excerpt,
	      onChange: value => {
	        setAttributes({
	          show_excerpt: value
	        });
	      }
	    }), wp.element.createElement(ToggleControl$3, {
	      label: wp_i18n.__('Show contact information.', 'motopress-appointment'),
	      checked: show_contacts,
	      onChange: value => {
	        setAttributes({
	          show_contacts: value
	        });
	      }
	    }), wp.element.createElement(ToggleControl$3, {
	      label: wp_i18n.__('Show social networks.', 'motopress-appointment'),
	      checked: show_social_networks,
	      onChange: value => {
	        setAttributes({
	          show_social_networks: value
	        });
	      }
	    }), wp.element.createElement(ToggleControl$3, {
	      label: wp_i18n.__('Show additional information.', 'motopress-appointment'),
	      checked: show_additional_info,
	      onChange: value => {
	        setAttributes({
	          show_additional_info: value
	        });
	      }
	    }), wp.element.createElement(TextControl$b, {
	      label: wp_i18n.__('Employees', 'motopress-appointment'),
	      help: wp_i18n.__('Comma-separated slugs or IDs of employees that will be shown.', 'motopress-appointment'),
	      value: employees,
	      onChange: employees => {
	        setAttributes({
	          employees
	        });
	      }
	    }), wp.element.createElement(TextControl$b, {
	      label: wp_i18n.__('Locations', 'motopress-appointment'),
	      help: wp_i18n.__('Comma-separated slugs or IDs of locations.', 'motopress-appointment'),
	      value: locations,
	      onChange: locations => {
	        setAttributes({
	          locations
	        });
	      }
	    }), wp.element.createElement(RangeControl$3, {
	      label: wp_i18n.__('Posts Per Page', 'motopress-appointment'),
	      value: posts_per_page,
	      onChange: value => setAttributes({
	        posts_per_page: value
	      }),
	      min: -1,
	      max: 100,
	      placeholder: "0"
	    }), wp.element.createElement(RangeControl$3, {
	      label: wp_i18n.__('Columns Count', 'motopress-appointment'),
	      help: wp_i18n.__('The number of columns in the grid.', 'motopress-appointment'),
	      value: columns_count,
	      onChange: value => setAttributes({
	        columns_count: value
	      }),
	      min: 0,
	      max: 100,
	      placeholder: "0"
	    }), wp.element.createElement(SelectControl$3, {
	      label: wp_i18n.__('Order By', 'motopress-appointment'),
	      value: orderby !== undefined ? orderby : 'none',
	      onChange: value => setAttributes({
	        orderby: value
	      }),
	      options: [{
	        value: 'none',
	        label: wp_i18n.__('No order', 'motopress-appointment')
	      }, {
	        value: 'ID',
	        label: wp_i18n.__('Post ID', 'motopress-appointment')
	      }, {
	        value: 'author',
	        label: wp_i18n.__('Post author', 'motopress-appointment')
	      }, {
	        value: 'title',
	        label: wp_i18n.__('Post title', 'motopress-appointment')
	      }, {
	        value: 'name',
	        label: wp_i18n.__('Post name (post slug)', 'motopress-appointment')
	      }, {
	        value: 'date',
	        label: wp_i18n.__('Post date', 'motopress-appointment')
	      }, {
	        value: 'modified',
	        label: wp_i18n.__('Last modified date', 'motopress-appointment')
	      }, {
	        value: 'rand',
	        label: wp_i18n.__('Random order', 'motopress-appointment')
	      }, {
	        value: 'relevance',
	        label: wp_i18n.__('Relevance', 'motopress-appointment')
	      }, {
	        value: 'menu_order',
	        label: wp_i18n.__('Page order', 'motopress-appointment')
	      }, {
	        value: 'menu_order title',
	        label: wp_i18n.__('Page order and post title', 'motopress-appointment')
	      }]
	    }), orderby !== 'none' && wp.element.createElement(SelectControl$3, {
	      label: wp_i18n.__('Order', 'motopress-appointment'),
	      value: order !== undefined ? order : 'desc',
	      onChange: value => setAttributes({
	        order: value
	      }),
	      options: [{
	        value: 'desc',
	        label: wp_i18n.__('DESC', 'motopress-appointment')
	      }, {
	        value: 'asc',
	        label: wp_i18n.__('ASC', 'motopress-appointment')
	      }]
	    }))))];
	  }
	};

	/**
	 * External dependencies
	 */
	const {
	  serverSideRender: ServerSideRender$b
	} = wp;
	const {
	  Component: Component$m,
	  Fragment: Fragment$m
	} = wp.element;
	const {
	  Disabled: Disabled$b
	} = wp.components;

	/**
	 * Create an Component
	 */
	let Edit$b = class Edit extends Component$m {
	  constructor(props) {
	    super(...arguments);
	  }
	  render() {
	    return wp.element.createElement(Fragment$m, null, wp.element.createElement(Inspector$b, this.props), wp.element.createElement(Disabled$b, null, wp.element.createElement(ServerSideRender$b, {
	      block: "motopress-appointment/employees-list",
	      attributes: this.props.attributes
	    })));
	  }
	};

	const {
	  registerBlockType: registerBlockType$b
	} = wp.blocks;

	/**
	 * Module Constants
	 */
	const blockName$b = 'motopress-appointment/employees-list';

	/**
	 * Register the block
	 */
	registerBlockType$b(blockName$b, {
	  title: wp_i18n.__('Employees List', 'motopress-appointment'),
	  icon: wp.element.createElement("svg", {
	    xmlns: "http://www.w3.org/2000/svg",
	    x: "0px",
	    y: "0px",
	    viewBox: "0 0 24 24"
	  }, wp.element.createElement("polygon", {
	    points: "24,21 6,21 6,23 24,23 "
	  }), wp.element.createElement("path", {
	    d: "M2,20c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S3.1,20,2,20L2,20z"
	  }), wp.element.createElement("polygon", {
	    points: "24,15 6,15 6,17 24,17 "
	  }), wp.element.createElement("path", {
	    d: "M2,14c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S3.1,14,2,14L2,14z"
	  }), wp.element.createElement("path", {
	    d: "M14.93,6.7C15.59,5.99,16,5.05,16,4c0-2.21-1.79-4-4-4S8,1.79,8,4c0,1.05,0.41,1.99,1.07,2.7C6.95,7.78,5.5,9.97,5.5,12.5 c0,0.17,0.01,0.33,0.03,0.5H6h1.55h8.9H17h1.47c0.01-0.17,0.03-0.33,0.03-0.5C18.5,9.97,17.05,7.78,14.93,6.7z M12,2 c1.1,0,2,0.9,2,2s-0.9,2-2,2s-2-0.9-2-2S10.9,2,12,2z M12,8c1.95,0,3.6,1.26,4.22,3H7.78C8.4,9.26,10.05,8,12,8z"
	  })),
	  category: 'mpa-gutenberg-blocks',
	  keywords: [wp_i18n.__('appointment', 'motopress-appointment')],
	  supports: {
	    anchor: true,
	    customClassName: true
	  },
	  attributes: attributes$b,
	  edit: Edit$b,
	  save: () => {
	    return null;
	  }
	});

	const attributes$a = {
	  show_image: {
	    type: 'boolean',
	    default: true
	  },
	  show_title: {
	    type: 'boolean',
	    default: true
	  },
	  show_excerpt: {
	    type: 'boolean',
	    default: true
	  },
	  locations: {
	    type: 'string',
	    default: ''
	  },
	  categories: {
	    type: 'string',
	    default: ''
	  },
	  posts_per_page: {
	    type: 'number',
	    default: 3
	  },
	  columns_count: {
	    type: 'number',
	    default: 3
	  },
	  orderby: {
	    type: 'string',
	    default: 'none'
	  },
	  order: {
	    type: 'string',
	    default: 'desc'
	  }
	};

	/**
	 * WordPress dependencies
	 */
	const {
	  Component: Component$l,
	  Fragment: Fragment$l
	} = wp.element;
	const {
	  SelectControl: SelectControl$2,
	  PanelBody: PanelBody$a,
	  TextControl: TextControl$a,
	  ToggleControl: ToggleControl$2,
	  RangeControl: RangeControl$2
	} = wp.components;
	const {
	  InspectorControls: InspectorControls$a
	} = wp.blockEditor || wp.editor;

	/**
	 * Create an Inspector Controls
	 */
	let Inspector$a = class Inspector extends Component$l {
	  render() {
	    const {
	      show_image,
	      show_title,
	      show_excerpt,
	      locations,
	      categories,
	      posts_per_page,
	      columns_count,
	      orderby,
	      order
	    } = this.props.attributes;
	    const {
	      setAttributes
	    } = this.props;
	    return [wp.element.createElement(InspectorControls$a, {
	      key: "inspector"
	    }, wp.element.createElement(Fragment$l, null, wp.element.createElement(PanelBody$a, {
	      title: wp_i18n.__('Settings', 'motopress-appointment'),
	      initialOpen: true
	    }, wp.element.createElement(ToggleControl$2, {
	      label: wp_i18n.__('Show featured image.', 'motopress-appointment'),
	      checked: show_image,
	      onChange: value => {
	        setAttributes({
	          show_image: value
	        });
	      }
	    }), wp.element.createElement(ToggleControl$2, {
	      label: wp_i18n.__('Show post title.', 'motopress-appointment'),
	      checked: show_title,
	      onChange: value => {
	        setAttributes({
	          show_title: value
	        });
	      }
	    }), wp.element.createElement(ToggleControl$2, {
	      label: wp_i18n.__('Show post excerpt.', 'motopress-appointment'),
	      checked: show_excerpt,
	      onChange: value => {
	        setAttributes({
	          show_excerpt: value
	        });
	      }
	    }), wp.element.createElement(TextControl$a, {
	      label: wp_i18n.__('Locations', 'motopress-appointment'),
	      help: wp_i18n.__('Comma-separated slugs or IDs of locations.', 'motopress-appointment'),
	      value: locations,
	      onChange: locations => {
	        setAttributes({
	          locations
	        });
	      }
	    }), wp.element.createElement(TextControl$a, {
	      label: wp_i18n.__('Categories', 'motopress-appointment'),
	      help: wp_i18n.__('Comma-separated slugs or IDs of categories that will be shown.', 'motopress-appointment'),
	      value: categories,
	      onChange: categories => {
	        setAttributes({
	          categories
	        });
	      }
	    }), wp.element.createElement(RangeControl$2, {
	      label: wp_i18n.__('Posts Per Page', 'motopress-appointment'),
	      value: posts_per_page,
	      onChange: value => setAttributes({
	        posts_per_page: value
	      }),
	      min: -1,
	      max: 100,
	      placeholder: "0"
	    }), wp.element.createElement(RangeControl$2, {
	      label: wp_i18n.__('Columns Count', 'motopress-appointment'),
	      help: wp_i18n.__('The number of columns in the grid.', 'motopress-appointment'),
	      value: columns_count,
	      onChange: value => setAttributes({
	        columns_count: value
	      }),
	      min: 0,
	      max: 100,
	      placeholder: "0"
	    }), wp.element.createElement(SelectControl$2, {
	      label: wp_i18n.__('Order By', 'motopress-appointment'),
	      value: orderby !== undefined ? orderby : 'none',
	      onChange: value => setAttributes({
	        orderby: value
	      }),
	      options: [{
	        value: 'none',
	        label: wp_i18n.__('No order', 'motopress-appointment')
	      }, {
	        value: 'ID',
	        label: wp_i18n.__('Post ID', 'motopress-appointment')
	      }, {
	        value: 'author',
	        label: wp_i18n.__('Post author', 'motopress-appointment')
	      }, {
	        value: 'title',
	        label: wp_i18n.__('Post title', 'motopress-appointment')
	      }, {
	        value: 'name',
	        label: wp_i18n.__('Post name (post slug)', 'motopress-appointment')
	      }, {
	        value: 'date',
	        label: wp_i18n.__('Post date', 'motopress-appointment')
	      }, {
	        value: 'modified',
	        label: wp_i18n.__('Last modified date', 'motopress-appointment')
	      }, {
	        value: 'rand',
	        label: wp_i18n.__('Random order', 'motopress-appointment')
	      }, {
	        value: 'relevance',
	        label: wp_i18n.__('Relevance', 'motopress-appointment')
	      }, {
	        value: 'menu_order',
	        label: wp_i18n.__('Page order', 'motopress-appointment')
	      }, {
	        value: 'menu_order title',
	        label: wp_i18n.__('Page order and post title', 'motopress-appointment')
	      }]
	    }), orderby !== 'none' && wp.element.createElement(SelectControl$2, {
	      label: wp_i18n.__('Order', 'motopress-appointment'),
	      value: order !== undefined ? order : 'desc',
	      onChange: value => setAttributes({
	        order: value
	      }),
	      options: [{
	        value: 'desc',
	        label: wp_i18n.__('DESC', 'motopress-appointment')
	      }, {
	        value: 'asc',
	        label: wp_i18n.__('ASC', 'motopress-appointment')
	      }]
	    }))))];
	  }
	};

	/**
	 * External dependencies
	 */
	const {
	  serverSideRender: ServerSideRender$a
	} = wp;
	const {
	  Component: Component$k,
	  Fragment: Fragment$k
	} = wp.element;
	const {
	  Disabled: Disabled$a
	} = wp.components;

	/**
	 * Create an Component
	 */
	let Edit$a = class Edit extends Component$k {
	  constructor() {
	    super(...arguments);
	  }
	  render() {
	    return wp.element.createElement(Fragment$k, null, wp.element.createElement(Inspector$a, this.props), wp.element.createElement(Disabled$a, null, wp.element.createElement(ServerSideRender$a, {
	      block: "motopress-appointment/locations-list",
	      attributes: this.props.attributes
	    })));
	  }
	};

	const {
	  registerBlockType: registerBlockType$a
	} = wp.blocks;

	/**
	 * Module Constants
	 */
	const blockName$a = 'motopress-appointment/locations-list';

	/**
	 * Register the block
	 */
	registerBlockType$a(blockName$a, {
	  title: wp_i18n.__('Locations List', 'motopress-appointment'),
	  icon: wp.element.createElement("svg", {
	    xmlns: "http://www.w3.org/2000/svg",
	    x: "0px",
	    y: "0px",
	    viewBox: "0 0 24 24"
	  }, wp.element.createElement("polygon", {
	    points: "24,21 6,21 6,23 24,23 "
	  }), wp.element.createElement("path", {
	    d: "M2,20c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S3.1,20,2,20L2,20z"
	  }), wp.element.createElement("polygon", {
	    points: "24,15 6,15 6,17 24,17 "
	  }), wp.element.createElement("path", {
	    d: "M2,14c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S3.1,14,2,14L2,14z"
	  }), wp.element.createElement("path", {
	    d: "M12,1C9.79,1,8,2.79,8,5s4,8,4,8s4-5.79,4-8S14.21,1,12,1z M12,7c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S13.1,7,12,7z"
	  })),
	  category: 'mpa-gutenberg-blocks',
	  keywords: [wp_i18n.__('appointment', 'motopress-appointment')],
	  supports: {
	    anchor: true,
	    customClassName: true
	  },
	  attributes: attributes$a,
	  edit: Edit$a,
	  save: () => {
	    return null;
	  }
	});

	const attributes$9 = {
	  show_image: {
	    type: 'boolean',
	    default: true
	  },
	  show_count: {
	    type: 'boolean',
	    default: true
	  },
	  show_description: {
	    type: 'boolean',
	    default: true
	  },
	  parent: {
	    type: 'string',
	    default: ''
	  },
	  categories: {
	    type: 'string',
	    default: ''
	  },
	  exclude_categories: {
	    type: 'string',
	    default: ''
	  },
	  hide_empty: {
	    type: 'boolean',
	    default: true
	  },
	  depth: {
	    type: 'number',
	    default: 3
	  },
	  number: {
	    type: 'number',
	    default: 3
	  },
	  columns_count: {
	    type: 'number',
	    default: 3
	  },
	  orderby: {
	    type: 'string',
	    default: 'none'
	  },
	  order: {
	    type: 'string',
	    default: 'desc'
	  }
	};

	/**
	 * WordPress dependencies
	 */
	const {
	  Component: Component$j,
	  Fragment: Fragment$j
	} = wp.element;
	const {
	  SelectControl: SelectControl$1,
	  PanelBody: PanelBody$9,
	  TextControl: TextControl$9,
	  ToggleControl: ToggleControl$1,
	  RangeControl: RangeControl$1
	} = wp.components;
	const {
	  InspectorControls: InspectorControls$9
	} = wp.blockEditor || wp.editor;

	/**
	 * Create an Inspector Controls
	 */
	let Inspector$9 = class Inspector extends Component$j {
	  render() {
	    const {
	      show_image,
	      show_count,
	      show_description,
	      parent,
	      categories,
	      exclude_categories,
	      hide_empty,
	      depth,
	      number,
	      columns_count,
	      orderby,
	      order
	    } = this.props.attributes;
	    const {
	      setAttributes
	    } = this.props;
	    return [wp.element.createElement(InspectorControls$9, {
	      key: "inspector"
	    }, wp.element.createElement(Fragment$j, null, wp.element.createElement(PanelBody$9, {
	      title: wp_i18n.__('Settings', 'motopress-appointment'),
	      initialOpen: true
	    }, wp.element.createElement(ToggleControl$1, {
	      label: wp_i18n.__('Show featured image.', 'motopress-appointment'),
	      checked: show_image,
	      onChange: value => {
	        setAttributes({
	          show_image: value
	        });
	      }
	    }), wp.element.createElement(ToggleControl$1, {
	      label: wp_i18n.__('Show Services Count?', 'motopress-appointment'),
	      checked: show_count,
	      onChange: value => {
	        setAttributes({
	          show_count: value
	        });
	      }
	    }), wp.element.createElement(ToggleControl$1, {
	      label: wp_i18n.__('Show Description?', 'motopress-appointment'),
	      checked: show_description,
	      onChange: value => {
	        setAttributes({
	          show_description: value
	        });
	      }
	    }), wp.element.createElement(TextControl$9, {
	      label: wp_i18n.__('Parent', 'motopress-appointment'),
	      help: wp_i18n.__('Parent term slug or ID to retrieve direct-child terms from.', 'motopress-appointment'),
	      value: parent,
	      onChange: parent => {
	        setAttributes({
	          parent
	        });
	      }
	    }), wp.element.createElement(TextControl$9, {
	      label: wp_i18n.__('Categories', 'motopress-appointment'),
	      help: wp_i18n.__('Comma-separated slugs or IDs of categories that will be shown.', 'motopress-appointment'),
	      value: categories,
	      onChange: categories => {
	        setAttributes({
	          categories
	        });
	      }
	    }), wp.element.createElement(TextControl$9, {
	      label: wp_i18n.__('Exclude Categories', 'motopress-appointment'),
	      help: wp_i18n.__('Comma-separated slugs or IDs of categories that will not be shown.', 'motopress-appointment'),
	      value: exclude_categories,
	      onChange: exclude_categories => {
	        setAttributes({
	          exclude_categories
	        });
	      }
	    }), wp.element.createElement(ToggleControl$1, {
	      label: wp_i18n.__('Hide Empty', 'motopress-appointment'),
	      help: wp_i18n.__('Hide terms not assigned to any posts.', 'motopress-appointment'),
	      checked: hide_empty,
	      onChange: value => {
	        setAttributes({
	          hide_empty: value
	        });
	      }
	    }), wp.element.createElement(RangeControl$1, {
	      label: wp_i18n.__('Depth', 'motopress-appointment'),
	      help: wp_i18n.__('Display depth of child categories.', 'motopress-appointment'),
	      value: depth,
	      onChange: value => setAttributes({
	        depth: value
	      }),
	      min: -1,
	      max: 100,
	      placeholder: "0"
	    }), wp.element.createElement(RangeControl$1, {
	      label: wp_i18n.__('Number', 'motopress-appointment'),
	      help: wp_i18n.__('Maximum number of categories to show.', 'motopress-appointment'),
	      value: number,
	      onChange: value => setAttributes({
	        number: value
	      }),
	      min: -1,
	      max: 100,
	      placeholder: "0"
	    }), wp.element.createElement(RangeControl$1, {
	      label: wp_i18n.__('Columns Count', 'motopress-appointment'),
	      help: wp_i18n.__('The number of columns in the grid.', 'motopress-appointment'),
	      value: columns_count,
	      onChange: value => setAttributes({
	        columns_count: value
	      }),
	      min: 0,
	      max: 100,
	      placeholder: "0"
	    }), wp.element.createElement(SelectControl$1, {
	      label: wp_i18n.__('Order By', 'motopress-appointment'),
	      value: orderby !== undefined ? orderby : 'none',
	      onChange: value => setAttributes({
	        orderby: value
	      }),
	      options: [{
	        value: 'none',
	        label: wp_i18n.__('No order', 'motopress-appointment')
	      }, {
	        value: 'name',
	        label: wp_i18n.__('Term name', 'motopress-appointment')
	      }, {
	        value: 'slug',
	        label: wp_i18n.__('Term slug', 'motopress-appointment')
	      }, {
	        value: 'term_id',
	        label: wp_i18n.__('Term ID', 'motopress-appointment')
	      }, {
	        value: 'parent',
	        label: wp_i18n.__('Parent ID', 'motopress-appointment')
	      }, {
	        value: 'count',
	        label: wp_i18n.__('Number of associated objects', 'motopress-appointment')
	      }, {
	        value: 'include',
	        label: wp_i18n.__('Keep the order of "IDs" parameter', 'motopress-appointment')
	      }, {
	        value: 'term_order',
	        label: wp_i18n.__('Term order', 'motopress-appointment')
	      }]
	    }), orderby !== 'none' && wp.element.createElement(SelectControl$1, {
	      label: wp_i18n.__('Order', 'motopress-appointment'),
	      value: order !== undefined ? order : 'desc',
	      onChange: value => setAttributes({
	        order: value
	      }),
	      options: [{
	        value: 'desc',
	        label: wp_i18n.__('DESC', 'motopress-appointment')
	      }, {
	        value: 'asc',
	        label: wp_i18n.__('ASC', 'motopress-appointment')
	      }]
	    }))))];
	  }
	};

	/**
	 * External dependencies
	 */
	const {
	  serverSideRender: ServerSideRender$9
	} = wp;
	const {
	  Component: Component$i,
	  Fragment: Fragment$i
	} = wp.element;
	const {
	  Disabled: Disabled$9
	} = wp.components;

	/**
	 * Create an Component
	 */
	let Edit$9 = class Edit extends Component$i {
	  constructor() {
	    super(...arguments);
	  }
	  render() {
	    return wp.element.createElement(Fragment$i, null, wp.element.createElement(Inspector$9, this.props), wp.element.createElement(Disabled$9, null, wp.element.createElement(ServerSideRender$9, {
	      block: "motopress-appointment/service-categories",
	      attributes: this.props.attributes
	    })));
	  }
	};

	const {
	  registerBlockType: registerBlockType$9
	} = wp.blocks;

	/**
	 * Module Constants
	 */
	const blockName$9 = 'motopress-appointment/service-categories';

	/**
	 * Register the block
	 */
	registerBlockType$9(blockName$9, {
	  title: wp_i18n.__('Service Categories', 'motopress-appointment'),
	  icon: wp.element.createElement("svg", {
	    xmlns: "http://www.w3.org/2000/svg",
	    x: "0px",
	    y: "0px",
	    viewBox: "0 0 24 24"
	  }, wp.element.createElement("path", {
	    d: "M7.17,2l1.41,1.41L9.17,4H10h12v18H2V2H7.17 M8,0H0v2v22h24V2H10L8,0L8,0z"
	  }), wp.element.createElement("path", {
	    d: "M17.59,14.18l-1.02-0.8c0.01-0.11,0.02-0.24,0.02-0.38s-0.01-0.27-0.02-0.38l1.02-0.8c0.26-0.21,0.32-0.57,0.16-0.85 l-1.12-1.92c-0.16-0.29-0.51-0.41-0.82-0.3l-1.2,0.48c-0.21-0.15-0.43-0.27-0.65-0.38l-0.18-1.28C13.73,7.24,13.45,7,13.12,7h-2.25 c-0.33,0-0.61,0.24-0.65,0.56l-0.18,1.28C9.81,8.95,9.59,9.08,9.38,9.22l-1.2-0.48c-0.31-0.12-0.65,0-0.81,0.29l-1.13,1.94 c-0.16,0.28-0.09,0.65,0.16,0.85l1.02,0.8C7.41,12.76,7.41,12.88,7.41,13s0,0.24,0.02,0.38l-1.03,0.8 c-0.25,0.21-0.32,0.57-0.16,0.85l1.12,1.92c0.16,0.29,0.51,0.41,0.82,0.29l1.2-0.48c0.21,0.15,0.43,0.27,0.65,0.38l0.18,1.28 c0.04,0.33,0.32,0.57,0.65,0.57h2.25c0.33,0,0.61-0.24,0.65-0.56l0.18-1.28c0.23-0.11,0.45-0.24,0.65-0.38l1.21,0.48 c0.31,0.12,0.65,0,0.81-0.29l1.13-1.95C17.92,14.73,17.85,14.38,17.59,14.18z M12,15.5c-1.38,0-2.5-1.12-2.5-2.5s1.12-2.5,2.5-2.5 s2.5,1.12,2.5,2.5S13.38,15.5,12,15.5z"
	  })),
	  category: 'mpa-gutenberg-blocks',
	  keywords: [wp_i18n.__('appointment', 'motopress-appointment')],
	  supports: {
	    anchor: true,
	    customClassName: true
	  },
	  attributes: attributes$9,
	  edit: Edit$9,
	  save: () => {
	    return null;
	  }
	});

	const attributes$8 = {
	  show_image: {
	    type: 'boolean',
	    default: true
	  },
	  show_title: {
	    type: 'boolean',
	    default: true
	  },
	  show_excerpt: {
	    type: 'boolean',
	    default: true
	  },
	  show_price: {
	    type: 'boolean',
	    default: true
	  },
	  show_duration: {
	    type: 'boolean',
	    default: true
	  },
	  show_capacity: {
	    type: 'boolean',
	    default: true
	  },
	  show_employees: {
	    type: 'boolean',
	    default: true
	  },
	  services: {
	    type: 'string',
	    default: ''
	  },
	  employees: {
	    type: 'string',
	    default: ''
	  },
	  categories: {
	    type: 'string',
	    default: ''
	  },
	  tags: {
	    type: 'string',
	    default: ''
	  },
	  posts_per_page: {
	    type: 'number',
	    default: 3
	  },
	  columns_count: {
	    type: 'number',
	    default: 3
	  },
	  orderby: {
	    type: 'string',
	    default: 'none'
	  },
	  order: {
	    type: 'string',
	    default: 'desc'
	  }
	};

	/**
	 * WordPress dependencies
	 */
	const {
	  Component: Component$h,
	  Fragment: Fragment$h
	} = wp.element;
	const {
	  SelectControl,
	  PanelBody: PanelBody$8,
	  TextControl: TextControl$8,
	  ToggleControl,
	  RangeControl
	} = wp.components;
	const {
	  InspectorControls: InspectorControls$8
	} = wp.blockEditor || wp.editor;

	/**
	 * Create an Inspector Controls
	 */
	let Inspector$8 = class Inspector extends Component$h {
	  render() {
	    const {
	      show_image,
	      show_title,
	      show_excerpt,
	      show_price,
	      show_duration,
	      show_capacity,
	      show_employees,
	      services,
	      employees,
	      categories,
	      tags,
	      posts_per_page,
	      columns_count,
	      orderby,
	      order
	    } = this.props.attributes;
	    const {
	      setAttributes
	    } = this.props;
	    return [wp.element.createElement(InspectorControls$8, {
	      key: "inspector"
	    }, wp.element.createElement(Fragment$h, null, wp.element.createElement(PanelBody$8, {
	      title: wp_i18n.__('Settings', 'motopress-appointment'),
	      initialOpen: true
	    }, wp.element.createElement(ToggleControl, {
	      label: wp_i18n.__('Show featured image.', 'motopress-appointment'),
	      checked: show_image,
	      onChange: value => {
	        setAttributes({
	          show_image: value
	        });
	      }
	    }), wp.element.createElement(ToggleControl, {
	      label: wp_i18n.__('Show post title.', 'motopress-appointment'),
	      checked: show_title,
	      onChange: value => {
	        setAttributes({
	          show_title: value
	        });
	      }
	    }), wp.element.createElement(ToggleControl, {
	      label: wp_i18n.__('Show post excerpt.', 'motopress-appointment'),
	      checked: show_excerpt,
	      onChange: value => {
	        setAttributes({
	          show_excerpt: value
	        });
	      }
	    }), wp.element.createElement(ToggleControl, {
	      label: wp_i18n.__('Show service price.', 'motopress-appointment'),
	      checked: show_price,
	      onChange: value => {
	        setAttributes({
	          show_price: value
	        });
	      }
	    }), wp.element.createElement(ToggleControl, {
	      label: wp_i18n.__('Show service duration.', 'motopress-appointment'),
	      checked: show_duration,
	      onChange: value => {
	        setAttributes({
	          show_duration: value
	        });
	      }
	    }), wp.element.createElement(ToggleControl, {
	      label: wp_i18n.__('Show service capacity.', 'motopress-appointment'),
	      checked: show_capacity,
	      onChange: value => {
	        setAttributes({
	          show_capacity: value
	        });
	      }
	    }), wp.element.createElement(ToggleControl, {
	      label: wp_i18n.__('Show service employees.', 'motopress-appointment'),
	      checked: show_employees,
	      onChange: value => {
	        setAttributes({
	          show_employees: value
	        });
	      }
	    }), wp.element.createElement(TextControl$8, {
	      label: wp_i18n.__('Services', 'motopress-appointment'),
	      help: wp_i18n.__('Comma-separated slugs or IDs of services that will be shown.', 'motopress-appointment'),
	      value: services,
	      onChange: services => {
	        setAttributes({
	          services
	        });
	      }
	    }), wp.element.createElement(TextControl$8, {
	      label: wp_i18n.__('Employees', 'motopress-appointment'),
	      help: wp_i18n.__('Comma-separated slugs or IDs of employees that perform these services.', 'motopress-appointment'),
	      value: employees,
	      onChange: employees => {
	        setAttributes({
	          employees
	        });
	      }
	    }), wp.element.createElement(TextControl$8, {
	      label: wp_i18n.__('Categories', 'motopress-appointment'),
	      help: wp_i18n.__('Comma-separated slugs or IDs of categories that will be shown.', 'motopress-appointment'),
	      value: categories,
	      onChange: categories => {
	        setAttributes({
	          categories
	        });
	      }
	    }), wp.element.createElement(TextControl$8, {
	      label: wp_i18n.__('Tags', 'motopress-appointment'),
	      help: wp_i18n.__('Comma-separated slugs or IDs of tags that will be shown.', 'motopress-appointment'),
	      value: tags,
	      onChange: tags => {
	        setAttributes({
	          tags
	        });
	      }
	    }), wp.element.createElement(RangeControl, {
	      label: wp_i18n.__('Posts Per Page', 'motopress-appointment'),
	      value: posts_per_page,
	      onChange: value => setAttributes({
	        posts_per_page: value
	      }),
	      min: -1,
	      max: 100,
	      placeholder: "0"
	    }), wp.element.createElement(RangeControl, {
	      label: wp_i18n.__('Columns Count', 'motopress-appointment'),
	      help: wp_i18n.__('The number of columns in the grid.', 'motopress-appointment'),
	      value: columns_count,
	      onChange: value => setAttributes({
	        columns_count: value
	      }),
	      min: 0,
	      max: 100,
	      placeholder: "0"
	    }), wp.element.createElement(SelectControl, {
	      label: wp_i18n.__('Order By', 'motopress-appointment'),
	      value: orderby !== undefined ? orderby : 'none',
	      onChange: value => setAttributes({
	        orderby: value
	      }),
	      options: [{
	        value: 'none',
	        label: wp_i18n.__('No order', 'motopress-appointment')
	      }, {
	        value: 'ID',
	        label: wp_i18n.__('Post ID', 'motopress-appointment')
	      }, {
	        value: 'author',
	        label: wp_i18n.__('Post author', 'motopress-appointment')
	      }, {
	        value: 'title',
	        label: wp_i18n.__('Post title', 'motopress-appointment')
	      }, {
	        value: 'name',
	        label: wp_i18n.__('Post name (post slug)', 'motopress-appointment')
	      }, {
	        value: 'date',
	        label: wp_i18n.__('Post date', 'motopress-appointment')
	      }, {
	        value: 'modified',
	        label: wp_i18n.__('Last modified date', 'motopress-appointment')
	      }, {
	        value: 'rand',
	        label: wp_i18n.__('Random order', 'motopress-appointment')
	      }, {
	        value: 'relevance',
	        label: wp_i18n.__('Relevance', 'motopress-appointment')
	      }, {
	        value: 'menu_order',
	        label: wp_i18n.__('Page order', 'motopress-appointment')
	      }, {
	        value: 'menu_order title',
	        label: wp_i18n.__('Page order and post title', 'motopress-appointment')
	      }, {
	        value: 'price',
	        label: wp_i18n.__('Price', 'motopress-appointment')
	      }]
	    }), orderby !== 'none' && wp.element.createElement(SelectControl, {
	      label: wp_i18n.__('Order', 'motopress-appointment'),
	      value: order !== undefined ? order : 'desc',
	      onChange: value => setAttributes({
	        order: value
	      }),
	      options: [{
	        value: 'desc',
	        label: wp_i18n.__('DESC', 'motopress-appointment')
	      }, {
	        value: 'asc',
	        label: wp_i18n.__('ASC', 'motopress-appointment')
	      }]
	    }))))];
	  }
	};

	/**
	 * External dependencies
	 */
	const {
	  serverSideRender: ServerSideRender$8
	} = wp;
	const {
	  Component: Component$g,
	  Fragment: Fragment$g
	} = wp.element;
	const {
	  Disabled: Disabled$8
	} = wp.components;

	/**
	 * Create an Component
	 */
	let Edit$8 = class Edit extends Component$g {
	  constructor() {
	    super(...arguments);
	  }
	  render() {
	    return wp.element.createElement(Fragment$g, null, wp.element.createElement(Inspector$8, this.props), wp.element.createElement(Disabled$8, null, wp.element.createElement(ServerSideRender$8, {
	      block: "motopress-appointment/services-list",
	      attributes: this.props.attributes
	    })));
	  }
	};

	const {
	  registerBlockType: registerBlockType$8
	} = wp.blocks;

	/**
	 * Module Constants
	 */
	const blockName$8 = 'motopress-appointment/services-list';

	/**
	 * Register the block
	 */
	registerBlockType$8(blockName$8, {
	  title: wp_i18n.__('Services List', 'motopress-appointment'),
	  icon: wp.element.createElement("svg", {
	    xmlns: "http://www.w3.org/2000/svg",
	    x: "0px",
	    y: "0px",
	    viewBox: "0 0 24 24"
	  }, wp.element.createElement("polygon", {
	    points: "24,21 6,21 6,23 24,23 "
	  }), wp.element.createElement("path", {
	    d: "M2,20c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S3.1,20,2,20L2,20z"
	  }), wp.element.createElement("polygon", {
	    points: "24,15 6,15 6,17 24,17 "
	  }), wp.element.createElement("path", {
	    d: "M2,14c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S3.1,14,2,14L2,14z"
	  }), wp.element.createElement("path", {
	    d: "M17.59,7.18l-1.02-0.8c0.01-0.11,0.02-0.24,0.02-0.38s-0.01-0.27-0.02-0.38l1.02-0.8c0.26-0.21,0.32-0.57,0.16-0.85 l-1.12-1.92c-0.16-0.29-0.51-0.41-0.82-0.3l-1.2,0.48c-0.21-0.15-0.43-0.27-0.65-0.38l-0.18-1.28C13.73,0.24,13.45,0,13.12,0h-2.25 c-0.33,0-0.61,0.24-0.65,0.56l-0.18,1.28C9.81,1.95,9.59,2.08,9.38,2.22l-1.2-0.48c-0.31-0.12-0.65,0-0.81,0.29L6.24,3.97 C6.08,4.25,6.15,4.62,6.4,4.82l1.02,0.8C7.41,5.76,7.41,5.88,7.41,6s0,0.24,0.02,0.38L6.4,7.18C6.15,7.39,6.08,7.75,6.24,8.03 l1.12,1.92c0.16,0.29,0.51,0.41,0.82,0.29l1.2-0.48c0.21,0.15,0.43,0.27,0.65,0.38l0.18,1.28c0.04,0.33,0.32,0.57,0.65,0.57h2.25 c0.33,0,0.61-0.24,0.65-0.56l0.18-1.28c0.23-0.11,0.45-0.24,0.65-0.38l1.21,0.48c0.31,0.12,0.65,0,0.81-0.29l1.13-1.95 C17.92,7.73,17.85,7.38,17.59,7.18z M12,8.5c-1.38,0-2.5-1.12-2.5-2.5s1.12-2.5,2.5-2.5s2.5,1.12,2.5,2.5S13.38,8.5,12,8.5z"
	  })),
	  category: 'mpa-gutenberg-blocks',
	  keywords: [wp_i18n.__('appointment', 'motopress-appointment')],
	  supports: {
	    anchor: true,
	    customClassName: true
	  },
	  attributes: attributes$8,
	  edit: Edit$8,
	  save: () => {
	    return null;
	  }
	});

	const attributes$7 = {
	  id: {
	    type: 'string',
	    default: ''
	  }
	};

	/**
	 * WordPress dependencies
	 */
	const {
	  Component: Component$f,
	  Fragment: Fragment$f
	} = wp.element;
	const {
	  PanelBody: PanelBody$7,
	  TextControl: TextControl$7
	} = wp.components;
	const {
	  InspectorControls: InspectorControls$7
	} = wp.blockEditor || wp.editor;

	/**
	 * Create an Inspector Controls
	 */
	let Inspector$7 = class Inspector extends Component$f {
	  render() {
	    const {
	      id
	    } = this.props.attributes;
	    const {
	      setAttributes
	    } = this.props;
	    return [wp.element.createElement(InspectorControls$7, {
	      key: "inspector"
	    }, wp.element.createElement(Fragment$f, null, wp.element.createElement(PanelBody$7, {
	      title: wp_i18n.__('Settings', 'motopress-appointment'),
	      initialOpen: true
	    }, wp.element.createElement(TextControl$7, {
	      label: wp_i18n.__('ID', 'motopress-appointment'),
	      help: wp_i18n.__("Post ID of an employee to display content from. Note: this parameter automatically uses the current post ID when a shortcode is inside the employee's post and is required otherwise.", 'motopress-appointment'),
	      value: id,
	      onChange: id => {
	        setAttributes({
	          id
	        });
	      }
	    }))))];
	  }
	};

	/**
	 * External dependencies
	 */
	const {
	  serverSideRender: ServerSideRender$7
	} = wp;
	const {
	  Component: Component$e,
	  Fragment: Fragment$e
	} = wp.element;
	const {
	  Disabled: Disabled$7
	} = wp.components;

	/**
	 * Create an Component
	 */
	let Edit$7 = class Edit extends Component$e {
	  constructor(props) {
	    super(...arguments);
	  }
	  render() {
	    return wp.element.createElement(Fragment$e, null, wp.element.createElement(Inspector$7, this.props), wp.element.createElement(Disabled$7, null, wp.element.createElement(ServerSideRender$7, {
	      block: "motopress-appointment/employee-image",
	      attributes: this.props.attributes
	    })));
	  }
	};

	const {
	  registerBlockType: registerBlockType$7
	} = wp.blocks;

	/**
	 * Module Constants
	 */
	const blockName$7 = 'motopress-appointment/employee-image';

	/**
	 * Register the block
	 */
	registerBlockType$7(blockName$7, {
	  title: wp_i18n.__('Employee Image', 'motopress-appointment'),
	  icon: wp.element.createElement("svg", {
	    xmlns: "http://www.w3.org/2000/svg",
	    x: "0px",
	    y: "0px",
	    viewBox: "0 0 24 24"
	  }, wp.element.createElement("polygon", {
	    points: "24,21 6,21 6,23 24,23 "
	  }), wp.element.createElement("path", {
	    d: "M2,20c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S3.1,20,2,20L2,20z"
	  }), wp.element.createElement("polygon", {
	    points: "24,15 6,15 6,17 24,17 "
	  }), wp.element.createElement("path", {
	    d: "M2,14c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S3.1,14,2,14L2,14z"
	  }), wp.element.createElement("path", {
	    d: "M14.93,6.7C15.59,5.99,16,5.05,16,4c0-2.21-1.79-4-4-4S8,1.79,8,4c0,1.05,0.41,1.99,1.07,2.7C6.95,7.78,5.5,9.97,5.5,12.5 c0,0.17,0.01,0.33,0.03,0.5H6h1.55h8.9H17h1.47c0.01-0.17,0.03-0.33,0.03-0.5C18.5,9.97,17.05,7.78,14.93,6.7z M12,2 c1.1,0,2,0.9,2,2s-0.9,2-2,2s-2-0.9-2-2S10.9,2,12,2z M12,8c1.95,0,3.6,1.26,4.22,3H7.78C8.4,9.26,10.05,8,12,8z"
	  })),
	  category: 'mpa-gutenberg-blocks',
	  keywords: [wp_i18n.__('appointment', 'motopress-appointment')],
	  supports: {
	    anchor: true,
	    customClassName: true
	  },
	  attributes: attributes$7,
	  edit: Edit$7,
	  save: () => {
	    return null;
	  }
	});

	const attributes$6 = {
	  id: {
	    type: 'string',
	    default: ''
	  }
	};

	/**
	 * WordPress dependencies
	 */
	const {
	  Component: Component$d,
	  Fragment: Fragment$d
	} = wp.element;
	const {
	  PanelBody: PanelBody$6,
	  TextControl: TextControl$6
	} = wp.components;
	const {
	  InspectorControls: InspectorControls$6
	} = wp.blockEditor || wp.editor;

	/**
	 * Create an Inspector Controls
	 */
	let Inspector$6 = class Inspector extends Component$d {
	  render() {
	    const {
	      id
	    } = this.props.attributes;
	    const {
	      setAttributes
	    } = this.props;
	    return [wp.element.createElement(InspectorControls$6, {
	      key: "inspector"
	    }, wp.element.createElement(Fragment$d, null, wp.element.createElement(PanelBody$6, {
	      title: wp_i18n.__('Settings', 'motopress-appointment'),
	      initialOpen: true
	    }, wp.element.createElement(TextControl$6, {
	      label: wp_i18n.__('ID', 'motopress-appointment'),
	      help: wp_i18n.__("Post ID of an employee to display content from. Note: this parameter automatically uses the current post ID when a shortcode is inside the employee's post and is required otherwise.", 'motopress-appointment'),
	      value: id,
	      onChange: id => {
	        setAttributes({
	          id
	        });
	      }
	    }))))];
	  }
	};

	/**
	 * External dependencies
	 */
	const {
	  serverSideRender: ServerSideRender$6
	} = wp;
	const {
	  Component: Component$c,
	  Fragment: Fragment$c
	} = wp.element;
	const {
	  Disabled: Disabled$6
	} = wp.components;

	/**
	 * Create an Component
	 */
	let Edit$6 = class Edit extends Component$c {
	  constructor(props) {
	    super(...arguments);
	  }
	  render() {
	    return wp.element.createElement(Fragment$c, null, wp.element.createElement(Inspector$6, this.props), wp.element.createElement(Disabled$6, null, wp.element.createElement(ServerSideRender$6, {
	      block: "motopress-appointment/employee-title",
	      attributes: this.props.attributes
	    })));
	  }
	};

	const {
	  registerBlockType: registerBlockType$6
	} = wp.blocks;

	/**
	 * Module Constants
	 */
	const blockName$6 = 'motopress-appointment/employee-title';

	/**
	 * Register the block
	 */
	registerBlockType$6(blockName$6, {
	  title: wp_i18n.__('Employee Title', 'motopress-appointment'),
	  icon: wp.element.createElement("svg", {
	    xmlns: "http://www.w3.org/2000/svg",
	    x: "0px",
	    y: "0px",
	    viewBox: "0 0 24 24"
	  }, wp.element.createElement("polygon", {
	    points: "24,21 6,21 6,23 24,23 "
	  }), wp.element.createElement("path", {
	    d: "M2,20c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S3.1,20,2,20L2,20z"
	  }), wp.element.createElement("polygon", {
	    points: "24,15 6,15 6,17 24,17 "
	  }), wp.element.createElement("path", {
	    d: "M2,14c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S3.1,14,2,14L2,14z"
	  }), wp.element.createElement("path", {
	    d: "M14.93,6.7C15.59,5.99,16,5.05,16,4c0-2.21-1.79-4-4-4S8,1.79,8,4c0,1.05,0.41,1.99,1.07,2.7C6.95,7.78,5.5,9.97,5.5,12.5 c0,0.17,0.01,0.33,0.03,0.5H6h1.55h8.9H17h1.47c0.01-0.17,0.03-0.33,0.03-0.5C18.5,9.97,17.05,7.78,14.93,6.7z M12,2 c1.1,0,2,0.9,2,2s-0.9,2-2,2s-2-0.9-2-2S10.9,2,12,2z M12,8c1.95,0,3.6,1.26,4.22,3H7.78C8.4,9.26,10.05,8,12,8z"
	  })),
	  category: 'mpa-gutenberg-blocks',
	  keywords: [wp_i18n.__('appointment', 'motopress-appointment')],
	  supports: {
	    anchor: true,
	    customClassName: true
	  },
	  attributes: attributes$6,
	  edit: Edit$6,
	  save: () => {
	    return null;
	  }
	});

	const attributes$5 = {
	  id: {
	    type: 'string',
	    default: ''
	  }
	};

	/**
	 * WordPress dependencies
	 */
	const {
	  Component: Component$b,
	  Fragment: Fragment$b
	} = wp.element;
	const {
	  PanelBody: PanelBody$5,
	  TextControl: TextControl$5
	} = wp.components;
	const {
	  InspectorControls: InspectorControls$5
	} = wp.blockEditor || wp.editor;

	/**
	 * Create an Inspector Controls
	 */
	let Inspector$5 = class Inspector extends Component$b {
	  render() {
	    const {
	      id
	    } = this.props.attributes;
	    const {
	      setAttributes
	    } = this.props;
	    return [wp.element.createElement(InspectorControls$5, {
	      key: "inspector"
	    }, wp.element.createElement(Fragment$b, null, wp.element.createElement(PanelBody$5, {
	      title: wp_i18n.__('Settings', 'motopress-appointment'),
	      initialOpen: true
	    }, wp.element.createElement(TextControl$5, {
	      label: wp_i18n.__('ID', 'motopress-appointment'),
	      help: wp_i18n.__("Post ID of an employee to display content from. Note: this parameter automatically uses the current post ID when a shortcode is inside the employee's post and is required otherwise.", 'motopress-appointment'),
	      value: id,
	      onChange: id => {
	        setAttributes({
	          id
	        });
	      }
	    }))))];
	  }
	};

	/**
	 * External dependencies
	 */
	const {
	  serverSideRender: ServerSideRender$5
	} = wp;
	const {
	  Component: Component$a,
	  Fragment: Fragment$a
	} = wp.element;
	const {
	  Disabled: Disabled$5
	} = wp.components;

	/**
	 * Create an Component
	 */
	let Edit$5 = class Edit extends Component$a {
	  constructor(props) {
	    super(...arguments);
	  }
	  render() {
	    return wp.element.createElement(Fragment$a, null, wp.element.createElement(Inspector$5, this.props), wp.element.createElement(Disabled$5, null, wp.element.createElement(ServerSideRender$5, {
	      block: "motopress-appointment/employee-services-list",
	      attributes: this.props.attributes
	    })));
	  }
	};

	const {
	  registerBlockType: registerBlockType$5
	} = wp.blocks;

	/**
	 * Module Constants
	 */
	const blockName$5 = 'motopress-appointment/employee-services-list';

	/**
	 * Register the block
	 */
	registerBlockType$5(blockName$5, {
	  title: wp_i18n.__('Employee Services List', 'motopress-appointment'),
	  icon: wp.element.createElement("svg", {
	    xmlns: "http://www.w3.org/2000/svg",
	    x: "0px",
	    y: "0px",
	    viewBox: "0 0 24 24"
	  }, wp.element.createElement("polygon", {
	    points: "24,21 6,21 6,23 24,23 "
	  }), wp.element.createElement("path", {
	    d: "M2,20c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S3.1,20,2,20L2,20z"
	  }), wp.element.createElement("polygon", {
	    points: "24,15 6,15 6,17 24,17 "
	  }), wp.element.createElement("path", {
	    d: "M2,14c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S3.1,14,2,14L2,14z"
	  }), wp.element.createElement("path", {
	    d: "M14.93,6.7C15.59,5.99,16,5.05,16,4c0-2.21-1.79-4-4-4S8,1.79,8,4c0,1.05,0.41,1.99,1.07,2.7C6.95,7.78,5.5,9.97,5.5,12.5 c0,0.17,0.01,0.33,0.03,0.5H6h1.55h8.9H17h1.47c0.01-0.17,0.03-0.33,0.03-0.5C18.5,9.97,17.05,7.78,14.93,6.7z M12,2 c1.1,0,2,0.9,2,2s-0.9,2-2,2s-2-0.9-2-2S10.9,2,12,2z M12,8c1.95,0,3.6,1.26,4.22,3H7.78C8.4,9.26,10.05,8,12,8z"
	  })),
	  category: 'mpa-gutenberg-blocks',
	  keywords: [wp_i18n.__('appointment', 'motopress-appointment')],
	  supports: {
	    anchor: true,
	    customClassName: true
	  },
	  attributes: attributes$5,
	  edit: Edit$5,
	  save: () => {
	    return null;
	  }
	});

	const attributes$4 = {
	  id: {
	    type: 'string',
	    default: ''
	  }
	};

	/**
	 * WordPress dependencies
	 */
	const {
	  Component: Component$9,
	  Fragment: Fragment$9
	} = wp.element;
	const {
	  PanelBody: PanelBody$4,
	  TextControl: TextControl$4
	} = wp.components;
	const {
	  InspectorControls: InspectorControls$4
	} = wp.blockEditor || wp.editor;

	/**
	 * Create an Inspector Controls
	 */
	let Inspector$4 = class Inspector extends Component$9 {
	  render() {
	    const {
	      id
	    } = this.props.attributes;
	    const {
	      setAttributes
	    } = this.props;
	    return [wp.element.createElement(InspectorControls$4, {
	      key: "inspector"
	    }, wp.element.createElement(Fragment$9, null, wp.element.createElement(PanelBody$4, {
	      title: wp_i18n.__('Settings', 'motopress-appointment'),
	      initialOpen: true
	    }, wp.element.createElement(TextControl$4, {
	      label: wp_i18n.__('ID', 'motopress-appointment'),
	      help: wp_i18n.__("Post ID of an employee to display content from. Note: this parameter automatically uses the current post ID when a shortcode is inside the employee's post and is required otherwise.", 'motopress-appointment'),
	      value: id,
	      onChange: id => {
	        setAttributes({
	          id
	        });
	      }
	    }))))];
	  }
	};

	/**
	 * External dependencies
	 */
	const {
	  serverSideRender: ServerSideRender$4
	} = wp;
	const {
	  Component: Component$8,
	  Fragment: Fragment$8
	} = wp.element;
	const {
	  Disabled: Disabled$4
	} = wp.components;

	/**
	 * Create an Component
	 */
	let Edit$4 = class Edit extends Component$8 {
	  constructor(props) {
	    super(...arguments);
	  }
	  render() {
	    return wp.element.createElement(Fragment$8, null, wp.element.createElement(Inspector$4, this.props), wp.element.createElement(Disabled$4, null, wp.element.createElement(ServerSideRender$4, {
	      block: "motopress-appointment/employee-schedule",
	      attributes: this.props.attributes
	    })));
	  }
	};

	const {
	  registerBlockType: registerBlockType$4
	} = wp.blocks;

	/**
	 * Module Constants
	 */
	const blockName$4 = 'motopress-appointment/employee-schedule';

	/**
	 * Register the block
	 */
	registerBlockType$4(blockName$4, {
	  title: wp_i18n.__('Employee Schedule', 'motopress-appointment'),
	  icon: wp.element.createElement("svg", {
	    xmlns: "http://www.w3.org/2000/svg",
	    x: "0px",
	    y: "0px",
	    viewBox: "0 0 24 24"
	  }, wp.element.createElement("polygon", {
	    points: "24,21 6,21 6,23 24,23 "
	  }), wp.element.createElement("path", {
	    d: "M2,20c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S3.1,20,2,20L2,20z"
	  }), wp.element.createElement("polygon", {
	    points: "24,15 6,15 6,17 24,17 "
	  }), wp.element.createElement("path", {
	    d: "M2,14c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S3.1,14,2,14L2,14z"
	  }), wp.element.createElement("path", {
	    d: "M14.93,6.7C15.59,5.99,16,5.05,16,4c0-2.21-1.79-4-4-4S8,1.79,8,4c0,1.05,0.41,1.99,1.07,2.7C6.95,7.78,5.5,9.97,5.5,12.5 c0,0.17,0.01,0.33,0.03,0.5H6h1.55h8.9H17h1.47c0.01-0.17,0.03-0.33,0.03-0.5C18.5,9.97,17.05,7.78,14.93,6.7z M12,2 c1.1,0,2,0.9,2,2s-0.9,2-2,2s-2-0.9-2-2S10.9,2,12,2z M12,8c1.95,0,3.6,1.26,4.22,3H7.78C8.4,9.26,10.05,8,12,8z"
	  })),
	  category: 'mpa-gutenberg-blocks',
	  keywords: [wp_i18n.__('appointment', 'motopress-appointment')],
	  supports: {
	    anchor: true,
	    customClassName: true
	  },
	  attributes: attributes$4,
	  edit: Edit$4,
	  save: () => {
	    return null;
	  }
	});

	const attributes$3 = {
	  id: {
	    type: 'string',
	    default: ''
	  }
	};

	/**
	 * WordPress dependencies
	 */
	const {
	  Component: Component$7,
	  Fragment: Fragment$7
	} = wp.element;
	const {
	  PanelBody: PanelBody$3,
	  TextControl: TextControl$3
	} = wp.components;
	const {
	  InspectorControls: InspectorControls$3
	} = wp.blockEditor || wp.editor;

	/**
	 * Create an Inspector Controls
	 */
	let Inspector$3 = class Inspector extends Component$7 {
	  render() {
	    const {
	      id
	    } = this.props.attributes;
	    const {
	      setAttributes
	    } = this.props;
	    return [wp.element.createElement(InspectorControls$3, {
	      key: "inspector"
	    }, wp.element.createElement(Fragment$7, null, wp.element.createElement(PanelBody$3, {
	      title: wp_i18n.__('Settings', 'motopress-appointment'),
	      initialOpen: true
	    }, wp.element.createElement(TextControl$3, {
	      label: wp_i18n.__('ID', 'motopress-appointment'),
	      help: wp_i18n.__("Post ID of an employee to display content from. Note: this parameter automatically uses the current post ID when a shortcode is inside the employee's post and is required otherwise.", 'motopress-appointment'),
	      value: id,
	      onChange: id => {
	        setAttributes({
	          id
	        });
	      }
	    }))))];
	  }
	};

	/**
	 * External dependencies
	 */
	const {
	  serverSideRender: ServerSideRender$3
	} = wp;
	const {
	  Component: Component$6,
	  Fragment: Fragment$6
	} = wp.element;
	const {
	  Disabled: Disabled$3
	} = wp.components;

	/**
	 * Create an Component
	 */
	let Edit$3 = class Edit extends Component$6 {
	  constructor(props) {
	    super(...arguments);
	  }
	  render() {
	    return wp.element.createElement(Fragment$6, null, wp.element.createElement(Inspector$3, this.props), wp.element.createElement(Disabled$3, null, wp.element.createElement(ServerSideRender$3, {
	      block: "motopress-appointment/employee-content",
	      attributes: this.props.attributes
	    })));
	  }
	};

	const {
	  registerBlockType: registerBlockType$3
	} = wp.blocks;

	/**
	 * Module Constants
	 */
	const blockName$3 = 'motopress-appointment/employee-content';

	/**
	 * Register the block
	 */
	registerBlockType$3(blockName$3, {
	  title: wp_i18n.__('Employee Content', 'motopress-appointment'),
	  icon: wp.element.createElement("svg", {
	    xmlns: "http://www.w3.org/2000/svg",
	    x: "0px",
	    y: "0px",
	    viewBox: "0 0 24 24"
	  }, wp.element.createElement("polygon", {
	    points: "24,21 6,21 6,23 24,23 "
	  }), wp.element.createElement("path", {
	    d: "M2,20c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S3.1,20,2,20L2,20z"
	  }), wp.element.createElement("polygon", {
	    points: "24,15 6,15 6,17 24,17 "
	  }), wp.element.createElement("path", {
	    d: "M2,14c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S3.1,14,2,14L2,14z"
	  }), wp.element.createElement("path", {
	    d: "M14.93,6.7C15.59,5.99,16,5.05,16,4c0-2.21-1.79-4-4-4S8,1.79,8,4c0,1.05,0.41,1.99,1.07,2.7C6.95,7.78,5.5,9.97,5.5,12.5 c0,0.17,0.01,0.33,0.03,0.5H6h1.55h8.9H17h1.47c0.01-0.17,0.03-0.33,0.03-0.5C18.5,9.97,17.05,7.78,14.93,6.7z M12,2 c1.1,0,2,0.9,2,2s-0.9,2-2,2s-2-0.9-2-2S10.9,2,12,2z M12,8c1.95,0,3.6,1.26,4.22,3H7.78C8.4,9.26,10.05,8,12,8z"
	  })),
	  category: 'mpa-gutenberg-blocks',
	  keywords: [wp_i18n.__('appointment', 'motopress-appointment')],
	  supports: {
	    anchor: true,
	    customClassName: true
	  },
	  attributes: attributes$3,
	  edit: Edit$3,
	  save: () => {
	    return null;
	  }
	});

	const attributes$2 = {
	  id: {
	    type: 'string',
	    default: ''
	  }
	};

	/**
	 * WordPress dependencies
	 */
	const {
	  Component: Component$5,
	  Fragment: Fragment$5
	} = wp.element;
	const {
	  PanelBody: PanelBody$2,
	  TextControl: TextControl$2
	} = wp.components;
	const {
	  InspectorControls: InspectorControls$2
	} = wp.blockEditor || wp.editor;

	/**
	 * Create an Inspector Controls
	 */
	let Inspector$2 = class Inspector extends Component$5 {
	  render() {
	    const {
	      id
	    } = this.props.attributes;
	    const {
	      setAttributes
	    } = this.props;
	    return [wp.element.createElement(InspectorControls$2, {
	      key: "inspector"
	    }, wp.element.createElement(Fragment$5, null, wp.element.createElement(PanelBody$2, {
	      title: wp_i18n.__('Settings', 'motopress-appointment'),
	      initialOpen: true
	    }, wp.element.createElement(TextControl$2, {
	      label: wp_i18n.__('ID', 'motopress-appointment'),
	      help: wp_i18n.__("Post ID of an employee to display content from. Note: this parameter automatically uses the current post ID when a shortcode is inside the employee's post and is required otherwise.", 'motopress-appointment'),
	      value: id,
	      onChange: id => {
	        setAttributes({
	          id
	        });
	      }
	    }))))];
	  }
	};

	/**
	 * External dependencies
	 */
	const {
	  serverSideRender: ServerSideRender$2
	} = wp;
	const {
	  Component: Component$4,
	  Fragment: Fragment$4
	} = wp.element;
	const {
	  Disabled: Disabled$2
	} = wp.components;

	/**
	 * Create an Component
	 */
	let Edit$2 = class Edit extends Component$4 {
	  constructor(props) {
	    super(...arguments);
	  }
	  render() {
	    return wp.element.createElement(Fragment$4, null, wp.element.createElement(Inspector$2, this.props), wp.element.createElement(Disabled$2, null, wp.element.createElement(ServerSideRender$2, {
	      block: "motopress-appointment/employee-contacts",
	      attributes: this.props.attributes
	    })));
	  }
	};

	const {
	  registerBlockType: registerBlockType$2
	} = wp.blocks;

	/**
	 * Module Constants
	 */
	const blockName$2 = 'motopress-appointment/employee-contacts';

	/**
	 * Register the block
	 */
	registerBlockType$2(blockName$2, {
	  title: wp_i18n.__('Employee Contact Information', 'motopress-appointment'),
	  icon: wp.element.createElement("svg", {
	    xmlns: "http://www.w3.org/2000/svg",
	    x: "0px",
	    y: "0px",
	    viewBox: "0 0 24 24"
	  }, wp.element.createElement("polygon", {
	    points: "24,21 6,21 6,23 24,23 "
	  }), wp.element.createElement("path", {
	    d: "M2,20c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S3.1,20,2,20L2,20z"
	  }), wp.element.createElement("polygon", {
	    points: "24,15 6,15 6,17 24,17 "
	  }), wp.element.createElement("path", {
	    d: "M2,14c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S3.1,14,2,14L2,14z"
	  }), wp.element.createElement("path", {
	    d: "M14.93,6.7C15.59,5.99,16,5.05,16,4c0-2.21-1.79-4-4-4S8,1.79,8,4c0,1.05,0.41,1.99,1.07,2.7C6.95,7.78,5.5,9.97,5.5,12.5 c0,0.17,0.01,0.33,0.03,0.5H6h1.55h8.9H17h1.47c0.01-0.17,0.03-0.33,0.03-0.5C18.5,9.97,17.05,7.78,14.93,6.7z M12,2 c1.1,0,2,0.9,2,2s-0.9,2-2,2s-2-0.9-2-2S10.9,2,12,2z M12,8c1.95,0,3.6,1.26,4.22,3H7.78C8.4,9.26,10.05,8,12,8z"
	  })),
	  category: 'mpa-gutenberg-blocks',
	  keywords: [wp_i18n.__('appointment', 'motopress-appointment')],
	  supports: {
	    anchor: true,
	    customClassName: true
	  },
	  attributes: attributes$2,
	  edit: Edit$2,
	  save: () => {
	    return null;
	  }
	});

	const attributes$1 = {
	  id: {
	    type: 'string',
	    default: ''
	  }
	};

	/**
	 * WordPress dependencies
	 */
	const {
	  Component: Component$3,
	  Fragment: Fragment$3
	} = wp.element;
	const {
	  PanelBody: PanelBody$1,
	  TextControl: TextControl$1
	} = wp.components;
	const {
	  InspectorControls: InspectorControls$1
	} = wp.blockEditor || wp.editor;

	/**
	 * Create an Inspector Controls
	 */
	let Inspector$1 = class Inspector extends Component$3 {
	  render() {
	    const {
	      id
	    } = this.props.attributes;
	    const {
	      setAttributes
	    } = this.props;
	    return [wp.element.createElement(InspectorControls$1, {
	      key: "inspector"
	    }, wp.element.createElement(Fragment$3, null, wp.element.createElement(PanelBody$1, {
	      title: wp_i18n.__('Settings', 'motopress-appointment'),
	      initialOpen: true
	    }, wp.element.createElement(TextControl$1, {
	      label: wp_i18n.__('ID', 'motopress-appointment'),
	      help: wp_i18n.__("Post ID of an employee to display content from. Note: this parameter automatically uses the current post ID when a shortcode is inside the employee's post and is required otherwise.", 'motopress-appointment'),
	      value: id,
	      onChange: id => {
	        setAttributes({
	          id
	        });
	      }
	    }))))];
	  }
	};

	/**
	 * External dependencies
	 */
	const {
	  serverSideRender: ServerSideRender$1
	} = wp;
	const {
	  Component: Component$2,
	  Fragment: Fragment$2
	} = wp.element;
	const {
	  Disabled: Disabled$1
	} = wp.components;

	/**
	 * Create an Component
	 */
	let Edit$1 = class Edit extends Component$2 {
	  constructor(props) {
	    super(...arguments);
	  }
	  render() {
	    return wp.element.createElement(Fragment$2, null, wp.element.createElement(Inspector$1, this.props), wp.element.createElement(Disabled$1, null, wp.element.createElement(ServerSideRender$1, {
	      block: "motopress-appointment/employee-social-networks",
	      attributes: this.props.attributes
	    })));
	  }
	};

	const {
	  registerBlockType: registerBlockType$1
	} = wp.blocks;

	/**
	 * Module Constants
	 */
	const blockName$1 = 'motopress-appointment/employee-social-networks';

	/**
	 * Register the block
	 */
	registerBlockType$1(blockName$1, {
	  title: wp_i18n.__('Employee Social Networks', 'motopress-appointment'),
	  icon: wp.element.createElement("svg", {
	    xmlns: "http://www.w3.org/2000/svg",
	    x: "0px",
	    y: "0px",
	    viewBox: "0 0 24 24"
	  }, wp.element.createElement("polygon", {
	    points: "24,21 6,21 6,23 24,23 "
	  }), wp.element.createElement("path", {
	    d: "M2,20c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S3.1,20,2,20L2,20z"
	  }), wp.element.createElement("polygon", {
	    points: "24,15 6,15 6,17 24,17 "
	  }), wp.element.createElement("path", {
	    d: "M2,14c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S3.1,14,2,14L2,14z"
	  }), wp.element.createElement("path", {
	    d: "M14.93,6.7C15.59,5.99,16,5.05,16,4c0-2.21-1.79-4-4-4S8,1.79,8,4c0,1.05,0.41,1.99,1.07,2.7C6.95,7.78,5.5,9.97,5.5,12.5 c0,0.17,0.01,0.33,0.03,0.5H6h1.55h8.9H17h1.47c0.01-0.17,0.03-0.33,0.03-0.5C18.5,9.97,17.05,7.78,14.93,6.7z M12,2 c1.1,0,2,0.9,2,2s-0.9,2-2,2s-2-0.9-2-2S10.9,2,12,2z M12,8c1.95,0,3.6,1.26,4.22,3H7.78C8.4,9.26,10.05,8,12,8z"
	  })),
	  category: 'mpa-gutenberg-blocks',
	  keywords: [wp_i18n.__('appointment', 'motopress-appointment')],
	  supports: {
	    anchor: true,
	    customClassName: true
	  },
	  attributes: attributes$1,
	  edit: Edit$1,
	  save: () => {
	    return null;
	  }
	});

	const attributes = {
	  id: {
	    type: 'string',
	    default: ''
	  }
	};

	/**
	 * WordPress dependencies
	 */
	const {
	  Component: Component$1,
	  Fragment: Fragment$1
	} = wp.element;
	const {
	  PanelBody,
	  TextControl
	} = wp.components;
	const {
	  InspectorControls
	} = wp.blockEditor || wp.editor;

	/**
	 * Create an Inspector Controls
	 */
	class Inspector extends Component$1 {
	  render() {
	    const {
	      id
	    } = this.props.attributes;
	    const {
	      setAttributes
	    } = this.props;
	    return [wp.element.createElement(InspectorControls, {
	      key: "inspector"
	    }, wp.element.createElement(Fragment$1, null, wp.element.createElement(PanelBody, {
	      title: wp_i18n.__('Settings', 'motopress-appointment'),
	      initialOpen: true
	    }, wp.element.createElement(TextControl, {
	      label: wp_i18n.__('ID', 'motopress-appointment'),
	      help: wp_i18n.__("Post ID of an employee to display content from. Note: this parameter automatically uses the current post ID when a shortcode is inside the employee's post and is required otherwise.", 'motopress-appointment'),
	      value: id,
	      onChange: id => {
	        setAttributes({
	          id
	        });
	      }
	    }))))];
	  }
	}

	/**
	 * External dependencies
	 */
	const {
	  serverSideRender: ServerSideRender
	} = wp;
	const {
	  Component,
	  Fragment
	} = wp.element;
	const {
	  Disabled
	} = wp.components;

	/**
	 * Create an Component
	 */
	class Edit extends Component {
	  constructor(props) {
	    super(...arguments);
	  }
	  render() {
	    return wp.element.createElement(Fragment, null, wp.element.createElement(Inspector, this.props), wp.element.createElement(Disabled, null, wp.element.createElement(ServerSideRender, {
	      block: "motopress-appointment/employee-additional-info",
	      attributes: this.props.attributes
	    })));
	  }
	}

	const {
	  registerBlockType
	} = wp.blocks;

	/**
	 * Module Constants
	 */
	const blockName = 'motopress-appointment/employee-additional-info';

	/**
	 * Register the block
	 */
	registerBlockType(blockName, {
	  title: wp_i18n.__('Employee Additional Information', 'motopress-appointment'),
	  icon: wp.element.createElement("svg", {
	    xmlns: "http://www.w3.org/2000/svg",
	    x: "0px",
	    y: "0px",
	    viewBox: "0 0 24 24"
	  }, wp.element.createElement("polygon", {
	    points: "24,21 6,21 6,23 24,23 "
	  }), wp.element.createElement("path", {
	    d: "M2,20c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S3.1,20,2,20L2,20z"
	  }), wp.element.createElement("polygon", {
	    points: "24,15 6,15 6,17 24,17 "
	  }), wp.element.createElement("path", {
	    d: "M2,14c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S3.1,14,2,14L2,14z"
	  }), wp.element.createElement("path", {
	    d: "M14.93,6.7C15.59,5.99,16,5.05,16,4c0-2.21-1.79-4-4-4S8,1.79,8,4c0,1.05,0.41,1.99,1.07,2.7C6.95,7.78,5.5,9.97,5.5,12.5 c0,0.17,0.01,0.33,0.03,0.5H6h1.55h8.9H17h1.47c0.01-0.17,0.03-0.33,0.03-0.5C18.5,9.97,17.05,7.78,14.93,6.7z M12,2 c1.1,0,2,0.9,2,2s-0.9,2-2,2s-2-0.9-2-2S10.9,2,12,2z M12,8c1.95,0,3.6,1.26,4.22,3H7.78C8.4,9.26,10.05,8,12,8z"
	  })),
	  category: 'mpa-gutenberg-blocks',
	  keywords: [wp_i18n.__('appointment', 'motopress-appointment')],
	  supports: {
	    anchor: true,
	    customClassName: true
	  },
	  attributes,
	  edit: Edit,
	  save: () => {
	    return null;
	  }
	});

})(wp.i18n);
