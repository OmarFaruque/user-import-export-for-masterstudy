<?php

/**
 * Plugin Name: User Import Export for MasterStudy LMS
 * Version: 1.0.0
 * Description: "User Import Export for MasterStudy LMS" is a "MasterStudy LMS" addons and it's easy to use. We don't like to user with tons of settings and options so we implemented very clean and easy understable setting panel where user can easily import and export as CSV.
 * Author: Omar Faruque
 * Author URI: https://www.linkedin.com/in/omarfaruque2020/
 * Requires at least: 4.4.0
 * Tested up to: 5.8.2
 * Text Domain: user-import-export-mlms
 * WC requires at least: 3.0.0
 * WC tested up to: 5.7.1
 */

define('UIEMLMS_TOKEN', 'uiemlms');
define('UIEMLMS_VERSION', '1.0.0');
define('UIEMLMS_FILE', __FILE__);
define('UIEMLMS_PLUGIN_NAME', 'User Import Export for MasterStudy LMS');



// Helpers.
require_once realpath(plugin_dir_path(__FILE__)) . DIRECTORY_SEPARATOR . 'includes/helpers.php';

// Init.
add_action('plugins_loaded', 'uiemlms_init');
if (!function_exists('uiemlms_init')) {
    /**
     * Load plugin text domain
     *
     * @return  void
     */
    function uiemlms_init()
    {
        $plugin_rel_path = basename(dirname(__FILE__)) . '/languages'; /* Relative to WP_PLUGIN_DIR */
        load_plugin_textdomain('user-import-export-mlms', false, $plugin_rel_path);
    }
}

// Loading Classes.
if (!function_exists('UIEMLMS_autoloader')) {

    function UIEMLMS_autoloader($class_name)
    {
        if (0 === strpos($class_name, 'UIEMLMS')) {
            $classes_dir = realpath(plugin_dir_path(__FILE__)) . DIRECTORY_SEPARATOR . 'includes' . DIRECTORY_SEPARATOR;
            $class_file = 'class-' . str_replace('_', '-', strtolower($class_name)) . '.php';
            require_once $classes_dir . $class_file;
        }
    }
}
spl_autoload_register('UIEMLMS_autoloader');

// Backend UI.
if (!function_exists('UIEMLMS_Backend')) {
    function UIEMLMS_Backend()
    {
        return UIEMLMS_Backend::instance(__FILE__);
    }
}



/**
 * Backend 
 */
if (is_admin()) {
    UIEMLMS_Backend();
}

/**
 * API
 */
new UIEMLMS_Api();

