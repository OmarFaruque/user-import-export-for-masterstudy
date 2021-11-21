<?php
/*
* Helper functions for aco-table-rate-shipping
*/


function uiemlms_debug($data){
    $debugfile = fopen(plugin_dir_path(ACOTRS_FILE) . 'includes/debug_json.json', 'w') or die("can't open file");
	fwrite($debugfile, json_encode($data));
	fclose($debugfile);
}