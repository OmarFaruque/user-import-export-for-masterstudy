<?php

/**
 * Plugin Name: Advanced table rate shipping for WooCommerce - Pro
 * Version: 1.0.2
 * Description: Advanced table rate shipping is a WooCommerce addons in WooCommerce store and it's easy to use. We don't like to user with tons of settings and options so we implemented very clean and easy understable setting panel where user can easily calculate shipping cost.
 * Author: Acowebs
 * Author URI: http://acowebs.com
 * Requires at least: 4.4.0
 * Tested up to: 5.8.1
 * Text Domain: advanced-table-rate-shipping-for-woocommerce
 * WC requires at least: 3.0.0
 * WC tested up to: 5.7.1
 */

define('ACOTRS_TOKEN', 'acotrs');
define('ACOTRS_VERSION', '1.0.0');
define('ACOTRS_FILE', __FILE__);
define('ACOTRS_PLUGIN_NAME', 'Advanced table rate shipping for WooCommerce');
define('ACOTRS_ITEM_ID', 183121);
define('ACOTRS_STORE_URL', 'https://api.acowebs.com');


// Helpers.
require_once realpath(plugin_dir_path(__FILE__)) . DIRECTORY_SEPARATOR . 'includes/helpers.php';

// Init.
add_action('plugins_loaded', 'acotrs_init');
if (!function_exists('acotrs_init')) {
    /**
     * Load plugin text domain
     *
     * @return  void
     */
    function acotrs_init()
    {
        $plugin_rel_path = basename(dirname(__FILE__)) . '/languages'; /* Relative to WP_PLUGIN_DIR */
        load_plugin_textdomain('advanced-table-rate-shipping-for-woocommerce', false, $plugin_rel_path);
    }
}

// Loading Classes.
if (!function_exists('ACOTRS_autoloader')) {

    function ACOTRS_autoloader($class_name)
    {
        if (0 === strpos($class_name, 'ACOTRS')) {
            $classes_dir = realpath(plugin_dir_path(__FILE__)) . DIRECTORY_SEPARATOR . 'includes' . DIRECTORY_SEPARATOR;
            $class_file = 'class-' . str_replace('_', '-', strtolower($class_name)) . '.php';
            require_once $classes_dir . $class_file;
        }
    }
}
spl_autoload_register('ACOTRS_autoloader');

// Backend UI.
if (!function_exists('ACOTRS_Backend')) {
    function ACOTRS_Backend()
    {
        if ( !in_array( 'woocommerce/woocommerce.php', apply_filters( 'active_plugins', get_option( 'active_plugins' ) ) ) ){
            add_action( 'admin_notices', 'acoTableAdminErrorNotification' );
            return false;
        }
        
        return ACOTRS_Backend::instance(__FILE__);
    }
}


if (!function_exists('ACOTRS_Public')) {
    function ACOTRS_Public()
    {
        return ACOTRS_Public::instance(__FILE__);
    }
}


/**
 * Front-end Callback
 */
ACOTRS_Public();


/**
 * Backend 
 */
if (is_admin()) {
    ACOTRS_Backend();
}

/**
 * API
 */
new ACOTRS_Api();


/**
 * Compatibility
 */
new ACOTRS_Compatibility();


/**
* Register all of the hooks related to the admin area functionality
* of the plugin.
*
* @since    1.0.0
* @access   private
*/   
if(!function_exists('acotrs_shipping_methods_filter')){
    add_filter( 'woocommerce_shipping_methods', 'acotrs_shipping_methods_filter', 10, 1 );
    function acotrs_shipping_methods_filter($methods){
                $methods['acotrs_shipping'] = ACOTRS_Shipping::class;
                // $methods[] = ACOTRS_Settingsinfo::class; 
                return $methods;
    }
}