<?php

if (!defined('ABSPATH')) {
    exit;
}

class UIEMLMS_Api
{


    /**
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
     * Wp dB 
     * @var     string
     * @access  private
     * 
     */
    private $wpdb;


    public function __construct()
    {
        global $wpdb;
        $this->wpdb = $wpdb;
        $this->token = UIEMLMS_TOKEN;


        add_action( 'wp_head', array($this, 'testF') );

        add_action(
            'rest_api_init',
            function () {
                //Change shipping status from custom page
                register_rest_route(
                    $this->token . '/v1',
                    '/save/',
                    array(
                        'methods' => 'POST',
                        'callback' => array($this, 'uiemlms_save_csv'),
                        'permission_callback' => array($this, 'getPermission'),
                    )
                );

                
                //Delete shipping option from custom page
                register_rest_route(
                    $this->token . '/v1',
                    '/userdata/',
                    array(
                        'methods' => 'GET',
                        'callback' => array($this, 'uiemlms_get_user_data'),
                        'permission_callback' => array($this, 'getPermission'),
                    )
                );
            }
        );

    }



    public function testF(){

        

        // $usersmeta = get_user_meta( 258 );
        // echo 'usermeata 1 <br/><pre>';
        // print_r($usersmeta);
        // echo '</pre>';


        // $usersmeta2 = get_user_meta( 261, 'submission_history', true );
        // echo 'usermeata 2 <br/><pre>';
        // print_r($usersmeta2);
        // echo '</pre>';
    }


    /**
     * GEt user data for export csv
     * @access public
     */
    public function uiemlms_get_user_data(){
        $users = get_users(  );

        $users = array_map(function($v){            
            $instructor_data = get_user_meta( $v->ID, 'become_instructor', true );
            $submission_date = get_user_meta( $v->ID, 'submission_date', true ) ? date('m/d/Y', get_user_meta( $v->ID, 'submission_date', true )) : '';

            $submission_history = get_user_meta( $v->ID, 'submission_history', true );
            $answer_date = $submission_history && isset($submission_history['answer_date']) ? date('m/d/Y', $submission_history['answer_date']) : '';

            $userCourse = stm_lms_get_user_courses($v->ID, '', '', array('course_id', 'start_time', 'progress_percent'));
            $cArray = wp_list_pluck($userCourse, 'course_id');
            $sTime  = wp_list_pluck($userCourse, 'start_time');
            $progress = wp_list_pluck( $userCourse, 'progress_percent' );

            foreach($sTime as $k => $singleTime) $sTime[$k] = date('m/d/Y', $singleTime);
            foreach($progress as $s => $singleProgress){
                if($singleProgress == 100)
                    $progress[$s] = __('Completed', 'user-import-export-mlms');
            }

            $lessonsArray = array();
            foreach($cArray as $sc){
               $lessons = stm_lms_get_user_lessons($sc, array('lesson_id')); 
               if($lessons){
                   $lessons = wp_list_pluck( $lessons, 0);
                   $lessonsArray = array_merge($lessons, $lessonsArray);
               }
            }

            $sTime = implode('-', $sTime);
            
            $cArray = implode('-', $cArray);

            $progress = implode('-', $progress);

            $lessonsArray = implode(',', $lessonsArray);

            
            $address = get_user_meta( $v->ID, 'uiemlms_address', true ) ? get_user_meta( $v->ID, 'uiemlms_address', true ) : '';
            
            $organization = get_user_meta( $v->ID, 'uiemlms_organization', true ) ? get_user_meta( $v->ID, 'uiemlms_organization', true ) : '';

            //Order
            $order = STM_LMS_Order::_user_orders($v->ID);
            $order_ids = $order ? wp_list_pluck($order['posts'], 'id') : array();
            $order_keys = $order ? wp_list_pluck($order['posts'], 'order_key') : array();
            $order_dates = $order ? wp_list_pluck($order['posts'], 'date') : array();
            $order_status = $order ? wp_list_pluck($order['posts'], 'status') : array();

            foreach($order_dates as $sd => $singD) $order_dates[$sd] = date('m/d/Y', $singD);

            return array(
                'user_id' => $v->ID, 
                'user_name' => $v->data->user_login, 
                'email' => $v->data->user_email, 
                'role' => $v->roles[0], 
                'first_name' => get_user_meta( $v->ID, 'first_name', true ),
                'last_name' => get_user_meta( $v->ID, 'last_name', true ), 
                'degree' => $instructor_data ? $instructor_data['degree'] : '', 
                'expertise' => $instructor_data ? $instructor_data['expertize'] : '',
                'submission_date' => $submission_date, 
                'answer_date' => $answer_date, 
                'message' => isset($submission_history['message']) ? $submission_history['message'] : '', 
                'password' => '', 
                'send_reset_link' => '',
                'course_id' => $cArray, 
                'date_of_enrollment' => $sTime, 
                'course_progress' => $progress, 
                'completed_lesson_id' => $lessonsArray, 
                'reset_progress' => '', 
                'address' => $address, 
                'organization' => $organization,
                'contact_number' => get_user_meta( $v->ID, 'uiemlms_contact_number', true ), 
                'order_by' => get_user_meta( $v->ID, 'uiemlms_order_by', true ), 
                'order_no' => implode('-', $order_ids), 
                'order_key' => implode('-', $order_keys), 
                'order_status' => implode('-', $order_status), 
                'order_date' => implode('-', $order_dates)
            );
        }, $users);

        return new WP_REST_Response($users, 200);
    }

    /**
     * Save csv data
    */
    public function uiemlms_save_csv($data){
        $array = $data['data'];
        array_shift($array);
        $csv_import = $this->process_csv_data($array);
        return new WP_REST_Response(array(
            'msg' => 'success',
            'errors' => $csv_import
        ), 200);
    }


    /**
     * @param $data array
     * Procee Single choice Question
     * @return NULL
     **/
    public function process_csv_data($data = array()){
       
        
        $error_msg = array();
        foreach($data as $index => $sdata):
                // update_option( 'testoption', $sdata );
            $user_name          = $sdata[1]; // Required
            $email              = $sdata[2]; // Required
            $role               = strtolower($sdata[3]); // Required

            //Skip if required field are emtpty
            if(empty($user_name)){
                $error_msg[] = sprintf( __('%s. Username are required.', 'user-import-export-mlms'), $index);
                continue;
            }
            
            if(empty($email) || $email == ''){
                $error_msg[] = sprintf( __('%s. Email are required.', 'user-import-export-mlms'), $index);
                continue;
            }
            
            if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
                $error_msg[] = sprintf( __('%s. Email aren\'t valid.', 'user-import-export-mlms'), $index);
                continue;
            }

            if(empty($role)){
                $error_msg[] = sprintf( __('%s. Role are required.', 'user-import-export-mlms'), $index);
                continue;
            }
                


            $first_name         = $sdata[4]; 
            $last_name          = $sdata[5];
            $degree             = $sdata[6];
            $expertise          = $sdata[7];
            $submission_date    = $sdata[8]; 
            $answer_date        = $sdata[9];
            $message            = $sdata[10];
            $password           = $sdata[11];
            $reset_link         = $sdata[12];
            $course_ids         = $sdata[13];
            $date_of_enrollment = $sdata[14];
            $corse_progress     = str_replace(' ', '', $sdata[15]);
            $complete_lesson_id = $sdata[16];
            $reset_progress     = $sdata[17];
            $address            = $sdata[18];
            $organization       = $sdata[19];
            $contact_number     = $sdata[20];
            $order_by           = $sdata[21];
            $order_no           = $sdata[22];
            $order_key          = $sdata[23];
            $order_status       = $sdata[24];
            $order_date         = $sdata[25];



            // Role
            switch($role):
                case 'instructor':
                    $role = 'stm_lms_instructor';
                break; 
                case 'group leader':
                    $role = 'group_leader';
                break; 
                case 'lp instructor':
                    $role = 'lp_teacher';
                break;
                case 'shop manager':
                    $role = 'shop_manager';
                break; 
                default:
                    $role = $role;
            endswitch;

            //Create new user
            $user_id = username_exists( $user_name );
            if ( !$user_id && false == email_exists( $email ) ) {
                $user_id = wp_create_user( 
                    $user_name, 
                    $password, 
                    $email 
                );
                wp_send_new_user_notifications( $user_id, 'user' );
            }

            $user = new WP_User( $user_id );

            // Add role
            if($role != 'stm_lms_instructor')
                $user->add_role( $role );

            // First Name 
            update_user_meta( $user_id, 'first_name', $first_name );

            // Last Name
            update_user_meta( $user_id, 'last_name', $last_name );

            
            //become instructor
            if($role == 'stm_lms_instructor'){
                // Remove role
                $user->remove_role( 'subscriber' );
                
                // Add role
                $user->add_role( $role );
                

                $become_instructor = array(
                    'become_instructor' => true, 
                    'fields_type' => 'default',
                    'degree' => $degree, 
                    'expertize' => $expertise
                ); 
                update_user_meta( $user_id, 'become_instructor', $become_instructor );

                // Submission Date for instructor role 
                if(!empty($submission_date)){
                    $submission_date = strtotime($submission_date);
                    update_user_meta( $user_id, 'submission_date', $submission_date );
                }

                // Answer Date & approve request
                if(!empty($answer_date)){
                    $answer_date = strtotime($answer_date);
                    $submission_history = array(
                        array(
                            'request_date' => isset($submission_date) ? $submission_date : time(), 
                            'request_display_date' => isset($submission_date) ? date('M d, Y - h:i', $submission_date) : date('M d, Y - h:i', time()), 
                            'status' => 'approved', 
                            'message' => $message, 
                            'answer_date' => $answer_date, 
                            'answer_display_date' => date('M d, Y - h:i', $answer_date), 
                            'viewed' => ''
                        )
                    );
                    update_user_meta( $user_id, 'submission_history', $submission_history );
                    update_user_meta( $user_id, 'submission_status', 'approved' );
                }

            }   

            // Send reset password mail 
            if(!empty($reset_link) && strtolower($reset_link) == 'yes'){
                retrieve_password($user->data->user_login);
            }else{
                wp_new_user_notification($user_id);
            }
                
            
            //Enroll from student profile    
            if(!empty($course_ids)){
                $cart_items = array();
                //Course Progress
                
                if(strtolower($corse_progress) == 'completed')
                    $corse_progress = 100;
                

                //Progress reset
                if(!empty($reset_progress) && 'yes' == strtolower($reset_progress))
                    $corse_progress = 0;

                $course_ids = explode('-', $course_ids);
                foreach($course_ids as $sid){
                    if($role == 'stm_lms_instructor'){
                        $arg = array(
                            'ID' => $sid,
                            'post_author' => $user_id,
                        );
                        wp_update_post( $arg );    
                        continue;
                    }

                    $course = array(
                        'user_id' => $user_id, 
                        'status' => 'enrolled', 
                        'progress_percent' => !empty($corse_progress) ? $corse_progress : 0, 
                        'start_time' => !empty($date_of_enrollment) ? strtotime($date_of_enrollment) : time(), 
                        'enterprise_id' => 0, 
                        'bundle_id' => 0, 
                        'instructor_id' => 0,
                        'end_time' => 0,
                        'current_lesson_id' => 0, 
                        'course_id' => $sid
                    );
    
                    if (function_exists('wpml_get_language_information')) {
                        $post_language_information = wpml_get_language_information(null, $sid);
                        $course['lng_code'] = $post_language_information['locale'];
                    } else {
                        $course['lng_code'] = get_locale();
                    }
                    $enrolled = stm_lms_get_user_course($user_id, $sid);
                    
                    if(!$enrolled) stm_lms_add_user_course($course);

                    $itemPrice = get_post_meta( 2280, 'sale_price', true ) ? get_post_meta( $sid, 'sale_price', true ) : get_post_meta( $sid, 'price', true );
                    if($itemPrice > 0){
                        $cart_items[] = array(
                            'item_id' => $sid,
                            'price' => get_post_meta( 2280, 'sale_price', true ) ? get_post_meta( $sid, 'sale_price', true ) : get_post_meta( $sid, 'price', true )
                        );
                    }


                }

                // Completed lesson id
                $lesson_ids = !empty($complete_lesson_id) ? explode(',', $complete_lesson_id) : array();

                
                foreach($lesson_ids as $slesson){

                    $enroll_courses = STM_LMS_Curriculum::get_items_by_item($slesson, array('course_id'));

                    if(!empty($enroll_courses)){
                        $enroll_courses = wp_list_pluck($enroll_courses, 'course_id');
                        foreach($enroll_courses as $sCourseid){
                            $user_course = STM_LMS_Helpers::simplify_db_array(stm_lms_get_user_course($user_id, $sCourseid, array(), $enterprise = ''));
                            if(is_array($user_course) && isset($user_course['user_id']) && $user_id == $user_course['user_id']){
                                $lessonData = array(
                                    'user_id' => $user_id, 
                                    'course_id' => $user_course['course_id'], 
                                    'lesson_id' => $slesson, 
                                    'start_time' => time(), 
                                    'end_time' => time()
                                );
                                stm_lms_add_user_lesson($lessonData);
                            }
                            
                        }
                        
                    }
                    
                }


                /*Create ORDER*/
                if(count($cart_items) > 0 && $role != 'instructor'){
                    $payment_code = 'cash';
                    $cart_total = STM_LMS_Cart::get_cart_totals($cart_items);
                    $symbol = STM_LMS_Options::get_option('currency_symbol', 'none');

                    $invoice = STM_LMS_Order::create_order([
                        "user_id" => $user_id,
                        "cart_items" => $cart_items,
                        "payment_code" => $payment_code,
                        "_order_total" => $cart_total['total'],
                        "_order_currency" => $symbol
                    ], true);
                    $order_status = !empty($order_status) ? strtolower($order_status) : 'pending';
                    $order_date = !empty($order_date) ? strtotime($order_date) : '';

                    if($invoice){
                        update_post_meta( $invoice, 'status', $order_status );
                        update_post_meta( $invoice, 'date', $order_date );
                    }
                    
                }
            }

            // WooCommerce User meta data
            if(!empty($address)){
                update_user_meta( $user_id, 'uiemlms_address', $address );
            }

            if(!empty($organization)){
                update_user_meta( $user_id, 'uiemlms_organization', $organization );
            }

            if(!empty($contact_number)){
                update_user_meta( $user_id, 'uiemlms_contact_number', $contact_number );
            }

            if(!empty($order_by)){
                update_user_meta( $user_id, 'uiemlms_order_by', $order_by );
            }
        endforeach;

        return $error_msg;
    }
 


    /**
     *
     * Ensures only one instance of APIFW is loaded or can be loaded.
     *
     * @param string $file Plugin root path.
     * @return Main APIFW instance
     * @see WordPress_Plugin_Template()
     * @since 1.0.0
     * @static
     */
    public static function instance()
    {
        if (is_null(self::$instance)) {
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    /**
     * Permission Callback
     **/
    public function getPermission()
    {
        if (current_user_can('administrator') || current_user_can('manage_woocommerce')) {
            return true;
        } else {
            return false;
        }
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
