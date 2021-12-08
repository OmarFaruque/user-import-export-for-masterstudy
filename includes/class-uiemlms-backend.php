<?php

/**
 * Load Backend related actions
 *
 * @class   UIEMLMS_Backend
 */

if (!defined('ABSPATH')) {
    exit;
}


class UIEMLMS_Backend
{


    /**
     * Class intance for singleton  class
     *
     * @var    object
     * @access  private
     * @since    1.0.0
     */
    private static $instance = null;

    /**
     * The version number.
     *
     * @var     string
     * @access  public
     * @since   1.0.0
     */
    public $version;

    /**
     * The token.
     *
     * @var     string
     * @access  public
     * @since   1.0.0
     */
    public $token;

    /**
     * The main plugin file.
     *
     * @var     string
     * @access  public
     * @since   1.0.0
     */
    public $file;

    /**
     * The main plugin directory.
     *
     * @var     string
     * @access  public
     * @since   1.0.0
     */
    public $dir;

    /**
     * The plugin assets directory.
     *
     * @var     string
     * @access  public
     * @since   1.0.0
     */
    public $assets_dir;

    /**
     * Suffix for Javascripts.
     *
     * @var     string
     * @access  public
     * @since   1.0.0
     */
    public $script_suffix;

    /**
     * The plugin assets URL.
     *
     * @var     string
     * @access  public
     * @since   1.0.0
     */
    public $assets_url;
    /**
     * The plugin hook suffix.
     *
     * @var     array
     * @access  public
     * @since   1.0.0
     */
    public array $hook_suffix = array();


    /**
     * Constructor function.
     *
     * @access  public
     * @param string $file plugin start file path. f
     * @since   1.0.0
     */
    public function __construct($file = '')
    {
        $this->version = UIEMLMS_VERSION;
        $this->token = UIEMLMS_TOKEN;
        $this->file = $file;
        $this->dir = dirname($this->file);
        $this->assets_dir = trailingslashit($this->dir) . 'assets';
        $this->assets_url = esc_url(trailingslashit(plugins_url('/assets/', $this->file)));
        $this->script_suffix = defined('SCRIPT_DEBUG') && SCRIPT_DEBUG ? '' : '.min';
        $plugin = plugin_basename($this->file);

        // add action links to link to link list display on the plugins page.
        add_filter("plugin_action_links_$plugin", array($this, 'pluginActionLinks'));

        // reg activation hook.
        register_activation_hook($this->file, array($this, 'install'));
        // reg deactivation hook.
        register_deactivation_hook($this->file, array($this, 'deactivation'));

        if($this->uiemlsms_is_masterstudy_activated() == true){
            // reg admin menu.
            add_action('admin_menu', array($this, 'uiemlms_register_root_page'), 30);

            // enqueue scripts & styles.
            add_action('admin_enqueue_scripts', array($this, 'adminEnqueueScripts'), 10, 1);
            add_action('admin_enqueue_scripts', array($this, 'adminEnqueueStyles'), 10, 1);
        }else{
            // Admin notice if MasterStudy in inactive 
            add_action('admin_notices', array($this, 'noticeNeedMasterStudy'));
        }
    }




    /**
     * Check if learnpress is activated
     *
     * @access  public
     * @return  boolean woocommerce install status
     */
    public function uiemlsms_is_masterstudy_activated()
    {
        if (in_array('masterstudy-lms-learning-management-system/masterstudy-lms-learning-management-system.php', apply_filters('active_plugins', get_option('active_plugins')))) {
            return true;
        }
        if (is_multisite()) {
            $plugins = get_site_option('active_sitewide_plugins');
            if (isset($plugins['masterstudy-lms-learning-management-system/masterstudy-lms-learning-management-system.php'])) {
                return true;
            }
        }
        return false;
    }


    /**
     * Ensures only one instance of Class is loaded or can be loaded.
     *
     * @param string $file plugin start file path.
     * @return Main Class instance
     * @since 1.0.0
     * @static
     */
    public static function instance($file = '')
    {
        if (is_null(self::$instance)) {
            self::$instance = new self($file);
        }
        return self::$instance;
    }


    /**
     * Show action links on the plugin screen.
     *
     * @param mixed $links Plugin Action links.
     *
     * @return array
     */
    public function pluginActionLinks($links)
    {
        $action_links = array(
            'settings' => '<a href="' . admin_url('tools.php?page=' . $this->token . '-settings') . '">'
                . __('Configure', 'user-import-export-mlms') . '</a>'
        );

        return array_merge($action_links, $links);
    }


    /**
     * Installation. Runs on activation.
     *
     * @access  public
     * @return  void
     * @since   1.0.0
     */
    public function install()
    {
    }

    /**
     * WooCommerce not active notice.
     *
     * @access  public
     * @return void Fallack notice.
     */
    public function noticeNeedMasterStudy()
    {
        
        if (in_array('masterstudy-lms-learning-management-system/masterstudy-lms-learning-management-system.php', apply_filters('active_plugins', get_option('active_plugins')))) {
            return true;
        }

        $error = sprintf(
        /* translators: %s: Plugin Name. */
            __(
                '%s requires <a href="https://wordpress.org/plugins/masterstudy-lms-learning-management-system/">MasterStudy LMS – WordPress Course Plugin</a> to be installed & activated!',
                'user-import-export-mlms'
            ),
            UIEMLMS_PLUGIN_NAME
        );

        echo ('<div class="error"><p>' . $error . '</p></div>');
    }

    /**
     * Creating admin pages
     */
    public function uiemlms_register_root_page()
    {

        $this->hook_suffix[] = add_management_page( 
            __('User Import & Export'), 
            __('User Import & Export'), 
            'manage_options',
            $this->token . '-settings', 
            array($this, 'adminUi'), 
            8
        );
    }

    /**
     * Calling view function for admin page components
     */
    public function adminUi()
    {

        echo (
            '<div id="' . $this->token . '_ui_root">
                <div class="' . $this->token . '_loader"><p>' . __('Loading User Interface...', 'user-import-export-mlms') . '</p></div>
            </div>'
        );
    }


    /**
     * Load admin CSS.
     *
     * @access  public
     * @return  void
     * @since   1.0.0
     */
    public function adminEnqueueStyles()
    {
        wp_register_style($this->token . '-admin', esc_url($this->assets_url) . 'css/backend.css', array(), $this->version);
        wp_enqueue_style($this->token . '-admin');
    }

    /**
     * Load admin Javascript.
     *
     * @access  public
     * @return  void
     * @since   1.0.0
     */
    public function adminEnqueueScripts()
    {
        if (!isset($this->hook_suffix) || empty($this->hook_suffix)) {
            return;
        }

        $screen = get_current_screen();

        

        if (in_array($screen->id, $this->hook_suffix, true)) {
            // Enqueue WordPress media scripts.
            if (!did_action('wp_enqueue_media')) {
                wp_enqueue_media();
            }

            if (!wp_script_is('wp-i18n', 'registered')) {
                wp_register_script('wp-i18n', esc_url($this->assets_url) . 'js/i18n.min.js', array(), $this->version, true);
            }
            // Enqueue custom backend script.
            wp_enqueue_script($this->token . '-backend', esc_url($this->assets_url) . 'js/backend.js', array('wp-i18n'), $this->version, true);
            // Localize a script.
            wp_localize_script(
                $this->token . '-backend',
                $this->token . '_object',
                array(
                    'api_nonce' => wp_create_nonce('wp_rest'),
                    'root' => rest_url($this->token . '/v1/'),
                    'assets_url' => $this->assets_url,
                )
            );
        }
    }

    /**
     * Deactivation hook
     */
    public function deactivation()
    {
    }

    /**
     * Cloning is forbidden.
     *
     * @since 1.0.0
     */
    public function __clone()
    {
        _doing_it_wrong(__FUNCTION__, __('Cheatin&#8217; huh?'), $this->_version);
    }

    /**
     * Unserializing instances of this class is forbidden.
     *
     * @since 1.0.0
     */
    public function __wakeup()
    {
        _doing_it_wrong(__FUNCTION__, __('Cheatin&#8217; huh?'), $this->_version);
    }
}
