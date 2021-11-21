import React from "react";
import {HashRouter, NavLink, Route, Switch, BrowserRouter} from 'react-router-dom'
import ReactDOM from "react-dom";

import FetchWP from '../utils/fetchWP';

import General from "../pages/General";

import ShippingByCity from "../pages/ShippingByCity";
import Methodconditions from "../pages/Methodconditions";
import Additionaloptions from "../pages/Additionaloptions";
import Tableofrates from "../pages/Tableofrates";
import Acoloader from '../utils/acoloader';
import Licence from '../pages/Licence';
import Methodlists from '../pages/Methodlists'

import Tabs from "../components/Tabs";
import style from "./App.scss";

const { __ } = window.wp.i18n;


class App extends React.Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            loader: true,
            saving: false,
            action_delete: false,
            uplodable_csv_data:[],
            licence_key: '',
            config: {
                general: {
                    title: 'Title', 
                    tax_status: '', 
                    base_rule: '', 
                    handlingfree: 0, 
                    flatrate: 0, 
                    shipping_option_appear_for: 'everyone', 
                    ship_to_role: ''
                }, 
                shipping_by_city: {
                    enable: 0, 
                    desable_other: 0, 
                    region_is: 'excluding', 
                    allowed_city: ''
                }, 
                method:{
                    volume: '', 
                    operand: '/', 
                    exclude_weight: 0,
                    method_condtion: []
                }, 
                additional_settings:{
                    ad_exclude_weight: 0, 
                    ad_include_coupons: 0, 
                    ad_round_weight: 0, 
                    ad_hide_this_method: 0, 
                    ad_hide_other_method: 0, 
                    ad_set_delivery_date_automatically: 0, 
                    ad_get_minimum_value_from_condition: 0,
                    ad_single_class_only: 'disabled'
                }, 
                table_of_rates: [
                    {
                        title: 'first title', 
                        rows: [], 
                        option_id: 1
                    }
                ]
            }, 
            roles: false, 
            count: 2,
            rates: [
                {
                    title: __('Shipping Option', 'advanced-table-rate-shipping-for-woocommerce')
                }
            ], 
            activeIndex: 0, 
            csv_modal: false, 
            json_modal: false,
            deleterows: [], 
            wc:[],
            instance_id: false
        }

        this.fetchWP = new FetchWP({
            restURL: window.acotrs_object.root,
            restNonce: window.acotrs_object.api_nonce,
        });

        this.addNewTableRateRow = this.addNewTableRateRow.bind(this);
        this.addNewCondition = this.addNewCondition.bind(this);
        this.addNewCosts = this.addNewCosts.bind(this);
        this.deleteCondition = this.deleteCondition.bind(this);
        this.deleteSelected = this.deleteSelected.bind(this);
        this.delAction = this.delAction.bind(this);
        this.saveHandler = this.saveHandler.bind(this);
    }


     

    /**
     * 
     * @param {Clicked tab index} index 
     */
    tabActiveIndex = (index) => {
        if(typeof index.target.attributes.order == 'undefined')
            return false
        this.setState({activeIndex: index.target.attributes.order.nodeValue});
    }


    saveHandler = (e) =>{
        if(e.target.type == 'submit') e.preventDefault();
        
        this.setState({
            loader: true
        });
        this.updateWPDB(this.state.config);
    }

    /**
     * 
     * @param {Default event} event 
     * Add new table rates by button click
     */
    addNewRates = (event) => {
        event.preventDefault();
        const config = this.state.config;
        let newNumber = parseInt(config.table_of_rates.length) + 1;
        config.table_of_rates[config.table_of_rates.length] = {
            title: __('Shipping Option #', 'advanced-table-rate-shipping-for-woocommerce') + newNumber, 
            option_id: newNumber
        }
        this.setState(
            {
                config: config
            }
        );
    }



    /**
     * 
     * @param {default event} e 
     * Table rates left checkbox click handler
     */
    delAction = (e) => {
        // e.preventDefault();
        const item = e.target.attributes.row_index.nodeValue;
        
        switch(item){
            case "all":
                var deleterows = [];
                if(e.target.checked){
                    this.state.config.table_of_rates[this.state.activeIndex].rows.map((v, index) => {
                        deleterows.push(String(index));
                    });      
                }
            break;
            default:
                var deleterows = this.state.deleterows;
                if(e.target.checked){
                    deleterows.push(item);
                }else{
                    const newArray = [] 
                    const index = deleterows.indexOf(parseInt(item));
                    deleterows.forEach(function(k, v){
                        if(k != parseInt(item)) newArray.push(k);
                    });
                   deleterows = newArray;
                }
        }

        this.setState({
            deleterows: deleterows
        });
    }



    /**
     * 
     * @param {default click event} e 
     * Add new Table rows for table rates
     */

    addNewTableRateRow = (e) => {
        // Add New Table rate row in "Table of Rates"
        e.preventDefault();
        const config = this.state.config;
        const index = e.target.attributes.index.nodeValue;
        if( typeof config.table_of_rates[index].rows == 'undefined' ) config.table_of_rates[index].rows = [];
        config.table_of_rates[index].rows.push({
            costs: [{cost_unit: '', cost: 0}],
            conditions: [{condition: 'subtotal', delivery_day: 0, compair: 'greater_than', cvalue: 0}]
        });
        
        this.setState({
            config: config
        });
    }



    /**
     * 
     * @param {default element event} e 
     */
    addNewCondition = (e) =>{
        // Add New Condition to Contions column in "Table of Rates"        
        e.preventDefault();
        const index = e.target.attributes.index.nodeValue, 
        row_index = e.target.attributes.row_index.nodeValue, 
        config = this.state.config;
        if(typeof config.table_of_rates[index].rows[row_index].conditions == 'undefined') config.table_of_rates[index].rows[row_index].conditions = [];
        config.table_of_rates[index].rows[row_index].conditions.push({condition: 'subtotal', compair: 'greater_than', cvalue: 0});
        this.setState({config: config});
    }




    /**
     * 
     * @param {index number} index 
     * @param {row index number} row_index 
     * @param {order number} order 
     * @param {column name} colmn 
     */
    deleteCondition = (index, row_index, order, colmn) => {
        // Delete Each condition from "table of rates" tab
        const config = this.state.config;
        if(colmn == 'cost'){
            config.table_of_rates[index].rows[row_index].costs.splice(order,1); // remove index number element from conditions
        }else{
            config.table_of_rates[index].rows[row_index].conditions.splice(order,1); // remove index number element from conditions
        }
        
        this.setState({config: config});
        this.updateWPDB(config);
    }


    /**
     * 
     * @param {default event} e 
     * @param {list of delete rows index} deleterows 
     */
    deleteSelected = (e, deleterows) => {
        e.preventDefault();
        const tabindex = this.state.activeIndex;
        const config = this.state.config;

        deleterows.sort(function(a, b){return b-a});
        deleterows.map((k, v) => {
            config.table_of_rates[tabindex].rows.splice(parseInt(k), 1); // remove index number element from conditions
        });
        this.setState(
            {
                config: config, 
                action_delete: true, 
                deleterows: []
            }
        );
        this.updateWPDB(config);
    }





    /**
     * React Ready event
     */
    componentDidMount() {
        this._isMounted = true;
        if(this._isMounted){
            this.fetchData();
        }
        
        
        var scrollpos = window.scrollY;
        var header = document.querySelector("#acotrs_ui_root");
        var adminbar = document.querySelector('#wpadminbar');

        
        function add_class_on_scroll() {
                header.classList.add("fixed-header--active");
        }
        
        function remove_class_on_scroll() {
                header.classList.remove("fixed-header--active");
        }
        
        window.addEventListener('scroll', function(){ 
            let scrollpos = window.scrollY;
            let topHeight = scrollpos - adminbar.offsetHeight;

            if(topHeight > header.offsetTop){
                add_class_on_scroll();
            }
            else {
                remove_class_on_scroll();
            }
        });
       
    }


    /**
     * Reset Date Picker Range
    */
    resetDatePicker = (e, event_index) => {
        e.preventDefault();
        let config = this.state.config;
        config['method']['method_condtion'][event_index].cvalue = {};
        this.setState({config: config});
    }


    /**
     * 
     * @param {Default Event} event 
     * Update data by onchange input type
     */
    handleUpdate = (event, event_index = false, event_type = false, order_index = false ) => {
        
        let config = this.state.config;

        

        if(order_index !== false){
            if(event_type === 'row_date_range' ){
                if(typeof config.table_of_rates[this.state.activeIndex].rows[event_index].conditions[order_index].cvalue.from != 'undefined') config.table_of_rates[this.state.activeIndex].rows[event_index].conditions[order_index].cvalue.from = new Date(config.table_of_rates[this.state.activeIndex].rows[event_index].conditions[order_index].cvalue.from);
                if(typeof config.table_of_rates[this.state.activeIndex].rows[event_index].conditions[order_index].cvalue.to != 'undefined') config.table_of_rates[this.state.activeIndex].rows[event_index].conditions[order_index].cvalue.to = new Date(config.table_of_rates[this.state.activeIndex].rows[event_index].conditions[order_index].cvalue.to);
                const range = DateUtils.addDayToRange(event, config.table_of_rates[this.state.activeIndex].rows[event_index].conditions[order_index].cvalue);

                config.table_of_rates[this.state.activeIndex].rows[event_index].conditions[order_index].cvalue = range;
            }else{
                config.table_of_rates[this.state.activeIndex].rows[event_index].conditions[order_index].cvalue = event;
            }

        }else{
            if(event[0] && typeof event[0].role != "undefined" && event_type == false){
                config['general']['ship_to_role'] = event;
            }
            
            // Update product state / Category State
            else if(event[0] && event_type != false && event_type != 'additional_settings' && event_type != 'additional_settings_weekend'){
                config['method']['method_condtion'][event_index].cvalue = event;
            }

            // Update specific days from additional tab
            else if(event_type == 'additional_settings'){
                config[event_type]['ad_special_days'] = event;
            }

            // Update weekend from additional tab
            else if(event_type == 'additional_settings_weekend'){
                config['additional_settings']['ad_weekends'] = event;
            }
            
            // Date Range
            else if(event && event_type == 'date_range'){
                if(typeof config['method']['method_condtion'][event_index].cvalue.from != 'undefined') config['method']['method_condtion'][event_index].cvalue.from = new Date(config['method']['method_condtion'][event_index].cvalue.from);
                if(typeof config['method']['method_condtion'][event_index].cvalue.to != 'undefined') config['method']['method_condtion'][event_index].cvalue.to = new Date(config['method']['method_condtion'][event_index].cvalue.to);
                const range = DateUtils.addDayToRange(event, config['method']['method_condtion'][event_index].cvalue);
            
                config['method']['method_condtion'][event_index].cvalue = range;
            }

            else{
                let tab = event.target.attributes.cmnt.nodeValue;
                switch(tab){
                    case "table_of_rates":
                        switch(event.target.type){
                            case "checkbox":
                                config[tab][event.target.attributes.index.nodeValue][event.target.name] = config[tab][event.target.attributes.index.nodeValue][event.target.name] ==0 || typeof config[tab][event.target.attributes.index.nodeValue][event.target.name] == 'undefined' ? 1 : 0;
                            break;
                            default: 
                                if(typeof event.target.attributes.order != 'undefined'){
                                    const order = event.target.attributes.order.nodeValue, 
                                    row_index = event.target.attributes.row_index.nodeValue;
                                        if(typeof config[tab][event.target.attributes.index.nodeValue].rows[row_index].id == 'undefined'){
                                            config[tab][event.target.attributes.index.nodeValue].rows[row_index].id = row_index.toString();
                                        }
                                        switch(event.target.name){
                                            case "cost":
                                            case "cost_unit":
                                            case "cost_multipliedby":
                                            case "cost_forevery_unit":
                                            case "cost_forevery_condition":
                                            case "cost_forevery_extra_secondary":
                                                if(typeof config[tab][event.target.attributes.index.nodeValue].rows[parseInt(row_index)].costs == 'undefined'){
                                                    config[tab][event.target.attributes.index.nodeValue].rows[parseInt(row_index)].costs = [];
                                                    config[tab][event.target.attributes.index.nodeValue].rows[parseInt(row_index)].costs.push({});
                                                } 
                                                config[tab][event.target.attributes.index.nodeValue].rows[parseInt(row_index)].costs[parseInt(order)][event.target.name] = event.target.value;

                                            break;
                                            
                                            default:
                                                config[tab][event.target.attributes.index.nodeValue].rows[parseInt(row_index)].conditions[parseInt(order)][event.target.name] = event.target.value;
                                        }
                                    
                                    
                                }else{
                                    switch(event.target.name){
                                        case "description": 
                                            const row_index = event.target.attributes.row_index.nodeValue;
                                            config[tab][event.target.attributes.index.nodeValue].rows[parseInt(row_index)].description = event.target.value;
                                        break;
                                        default: 
                                            config[tab][event.target.attributes.index.nodeValue][event.target.name] = event.target.value;
                                    }
                                    
                                }
                                
                                
                        }
                        
                    break;
                    default:   
                    
                        if(typeof config[tab] == 'undefined'){
                            config[tab] = {}
                        }

                        switch(event.target.type){
                            case "checkbox":
                                config[tab][event.target.name] = config[tab][event.target.name] == 0 ? 1 : 0;
                            break;
                            default:
                                if(
                                    event.target.name == 'condition'
                                    || event.target.name == 'compair'
                                    || event.target.name == 'cvalue'
                                ){
                                    
                                    if( 
                                        !config[tab]['method_condtion'][parseInt(event.target.attributes.index.nodeValue)] 
                                        || typeof config[tab]['method_condtion'][parseInt(event.target.attributes.index.nodeValue)] != 'object' 
                                    )
                                    {
                                        // New Condition
                                        config[tab]['method_condtion'][parseInt(event.target.attributes.index.nodeValue)] = {};
                                    }
                                    
                                    config[tab]['method_condtion'][parseInt(event.target.attributes.index.nodeValue)][event.target.name] = event.target.value;
                                }else{
                                    config[tab][event.target.name] = event.target.value;
                                }
                                
                        }
                }
            }
        }

        // Update config
        this.setState({config: config});     
    }



    /**
     * 
     * @param {Update to DB} config 
     * Update rendered data to DB
     */
    updateWPDB = (config) => {
        //Update Value to WP DB
        let data = {
            instance_id: typeof this.props.match != 'undefined' ? this.props.match.params.instance_id : acotrsshipping_settings.instance_id,
            shipping_id: typeof acotrsshipping_settings.id != 'undefined' ? acotrsshipping_settings.id : acotrsshipping_settings.method_id,
            zone_id: this.props.zone_id,
            config: config
        }

        this.fetchWP.post('updatedata/', data)
        .then(
            (json) => {
                
                this.setState({loader: false})
            }
        );  
    }



    /**
     * 
     * @param {Index Number} index 
     * Remove method conditions by index number
     */
    handleClose = (index) => {
        let condition = this.state.config;
        condition['method']['method_condtion'].splice(index,1); // remove index number element from method_condition
        this.setState(
            {
                config: condition
            }
        );

        // this.updateWPDB(condition);    
    }



    /**
     * Add New Method condition
     */
    addNewMethodCondition = () => {
        // Add new method condition
        let condition = this.state.config;
        condition['method']['method_condtion'][condition['method']['method_condtion'].length] = {
            compair: 'greater_than', 
            cvalue: '', 
            condition: 'subtotal'
        };
        this.setState({
                config: condition
            }
        );
    }




    /**
     * 
     * @param {Drg and drop event} result 
     * Drag and drop by react-butifi-DND
     */
    dragNdropEvent = (result) => {

        let source = result.source.index;
        let config = this.state.config;
        let destination = result.destination.index;
        let tem = config.table_of_rates[this.state.activeIndex].rows[source];
        
        config.table_of_rates[this.state.activeIndex].rows.splice(source, 1);
        
        config.table_of_rates[this.state.activeIndex].rows.splice(destination, 0, tem);

        
        this.setState({
            config: config
        });
        // this.updateWPDB(config); 
    }


    /**
     * 
     * @param {Selected user role list from General Tab} selectedList 
     * @param {Removed item} removeItem 
     * Remove user role from General Tab
     */
    onRemoveMultipleSelectVal = (selectedList, removeItem, event_type = false, index = false, order=false) =>{
       let config = this.state.config;
        switch(event_type){
            case "products":
            case "wc_cat":
                config['method']['method_condtion'][index].cvalue = selectedList;
            break;
            case 'table_of_rates': 
                config.table_of_rates[this.state.activeIndex].rows[index].conditions[order].cvalue = selectedList;
            break;
            default:
                config.general.ship_to_role = selectedList;
        }

       this.setState({
           config: config
       });
    }



    /**
     * 
     * @param {CSV file data as array} data 
     * @param {CSV file information} fileInfo 
     * CSV file upload & store to state
     */
    csvFileForUpload = (data, fileInfo) => {
        this.setState(
            {uplodable_csv_data: data}
        );
    }



    /**
     * 
     * @param {Default element event} e 
     * State CSV data store to DB
     */
    handleCSVUpload = (e) => {
        e.preventDefault();
        let config = this.state.config; 
        
        let obj = {};

        this.state.uplodable_csv_data.forEach(function(element, index){
            if(index != 0 && element.length > 1 && element[1] != ''){
                element[0] = element[0] == '' ? '0' : element[0];
                index = parseInt(element[0]), obj[index] ? obj[index].push(element) : (obj[index] = [element]);
            }
        });

        
        
        for(var key in obj){
            let newItem = {};
            newItem.conditions = [];
            newItem.costs = [];
            newItem.description = '';
            
            obj[key].forEach((e, i) => {
                

                let cvalue = e[3];
                cvalue = cvalue.split(',');
                
                //If Product
                switch(e[1]){
                    case 'product':
                        let temp_cvalue = [];
                        cvalue.map((s) => {
                            let cvArray = this.state.wc.products.filter(obj=>obj.title === s.trim());
                            temp_cvalue.push( cvArray[0] );
                        });
                        cvalue = temp_cvalue;
                    case 'coupon':
                        let temp_copons = [];
                        cvalue.map((s) => {
                            let cvArray = this.state.wc.coupons.filter(obj=>obj.title === s.trim());
                            temp_copons.push( cvArray[0] );
                        });
                        cvalue = temp_copons;
                    break;
                    case 'dates':
                        cvalue = {
                            from: cvalue[0].trim(), 
                            to: cvalue[1].trim()
                        }
                    break;
                    case 'dayweek':
                        cvalue = cvalue.map((v) => {
                            return {
                                name: v,
                                label: v
                            }
                        });

                    break;
                    default:
                        if(e[1] in this.state.wc.terms){
                            let temp_terms = [];
                            cvalue.map((s) => {
                                let temArray = this.state.wc.terms[e[1]].filter(obj=>obj.name === s.trim());
                                temp_terms.push( temArray[0] );
                            });
                            cvalue = temp_terms;
                        }
                }

                newItem.conditions.push({
                        condition: e[1], 
                        compair: e[2], 
                        delivery_day: e[4], 
                        cvalue: cvalue
                    });
                newItem.costs.push({
                    cost: e[5], 
                    cost_unit: e[6], 
                    cost_multipliedby: e[7], 
                    cost_forevery_unit: e[8], 
                    cost_forevery_condition: e[9], 
                    cost_forevery_extra_secondary: e[10], 
                });
                if(e[11] != ''){
                    newItem.description = e[11]
                }

            });
            
            config.table_of_rates[this.state.activeIndex].rows.push(newItem);
        }
        
        this.setState({
            config: config, 
            csv_modal: false
        });
        this.updateWPDB(config); 
    }


    /**
     * 
     * @param {Add new cost on table rates} e 
     */
    addNewCosts = (e) => {
        e.preventDefault();
        
        const index = e.target.attributes.index.nodeValue,
        row_index = e.target.attributes.row_index.nodeValue,
        config = this.state.config;
        if(typeof config.table_of_rates[index].rows[row_index].costs == 'undefined') config.table_of_rates[index].rows[row_index].costs = [];
        config.table_of_rates[index].rows[row_index].costs.push({});
        this.setState({config: config});
    }


    /**
     * 
     * @param {DEFAULT} event 
     * Open CSV modal for import rows via csv
     */
    modalHandler = (e) =>{
        e.preventDefault();
        this.setState(
            {
                csv_modal: this.state.csv_modal ? false : true
            }
        );
    }
 

    /**
     * 
     * @param {Number of table rows} e 
     * Delete table rates option permanently
     */
    deleteThisOption = (e) => {
        let config = this.state.config;
        config.table_of_rates.splice(e, 1);
        this.setState(
            {
                config: config
            }
        );
        this.updateWPDB(config); 
    }



    /**
     * Get configaration from DB
     */
    getConfig(){
        this.setState({
            loader: true,
        });


        const data = {
            instance_id: typeof this.props.match != 'undefined' ? this.props.match.params.instance_id : acotrsshipping_settings.instance_id,
            shipping_id: typeof acotrsshipping_settings.id != 'undefined' ? acotrsshipping_settings.id : acotrsshipping_settings.method_id
        }
        const {config} = this.state;

        
        this.fetchWP.post('config/', data)
            .then(
                (json) => {

                    this.setState({
                            loader: false,
                            config: !json.config.error ? json.config : config,
                            wc: {
                                products: json.products, 
                                cat: json.cat, 
                                sclass: json.shipping_class, 
                                coupons: json.coupons, 
                                taxonomy: json.taxonomy, 
                                terms: json.terms
                            }, 
                            licenced: json.licenced, 
                            instance_id: data.instance_id
                        });   
                })
                .catch(function(error) {
                    console.log('error', error);
                });
    }



    get_user_role(){
        // Get User roles
        this.fetchWP.get('user-roles/')
        .then(
            (json) => {
                this.setState(
                    {
                        loader: false,
                        roles: json
                    }
                )
            }
        )
    }


    /**
     * Get Configaration And User role from DB
     */
    fetchData() {
        this.getConfig();
        this.get_user_role();

    }


    importSettingsFromJson = (e) => {
        e.preventDefault();
        this.setState(
            {
                json_modal: this.state.json_modal ? false : true
            }
        );
    }

    /**
     * 
     * @param {Default Event} e 
     * Purpose: Handle json upload for settings
     */
    settingUploadHandlerFromJson = (e) =>{
        const fileReader = new FileReader();
        fileReader.readAsText(e.target.files[0], "UTF-8");

        fileReader.onload = e => {
            this.updateWPDB(JSON.parse(e.target.result));
            this.setState(
                {
                    config: JSON.parse(e.target.result), 
                    json_modal: false
                }
            )
        }
    }


    /**
     * 
     * @param {default event} e 
     * Set Licence Key
     */
    setLicenceKey = (e) => {
        this.setState(
            {
                licence_key: e.target.value
            }
        )
    }


    /**
     * 
     * @param {default} e 
     * Save Licence key to DB
     */
    saveLicenceKey = (e) => {
        e.preventDefault();
        let data = {
            licence_key : this.state.licence_key
        }
        this.fetchWP.post('update_licence_key/', data)
        .then(
            (json) => {
                this.setState(
                    {
                        licenced: json.licenced, 
                        error_msg: json.msg
                    }
                )
            }
        );    
    }


    /**
     * 
     * @param {event} e 
     * @description is delivery day field visiable or not
     */
    addDaliveryDays = (e) => {
        e.preventDefault()
        let {config} = this.state, 
        row_index = e.target.attributes.row_index.nodeValue
        
        config.table_of_rates[this.state.activeIndex].rows[row_index].conditions[0].deliver_day_status = !config.table_of_rates[this.state.activeIndex].rows[row_index].conditions[0].deliver_day_status ? true : false
        this.setState({
            config: config
        })
    }



    componentWillUnmount() {
        this._isMounted = false;
    }


    /**
     * Render main component
     */
    render() {
        const {config, roles, deleterows, wc, licenced, licence_key, error_msg, instance_id, activeIndex} = this.state;
        const {refresh, onClick, onChange, zone_id} = this.props
       
        
        if(!config.general) return <Acoloader/>;
        if(!roles) return <Acoloader/>;

        
        return (
            <>
            <div className={style.topbar}>
                <div>
                    <HashRouter>
                        <NavLink className={style.buttona} exact to="/" > 
                            <span className="dashicons dashicons-arrow-left-alt"></span>
                            {__('Back', 'advanced-table-rate-shipping-for-woocommerce')}
                        </NavLink>
                    </HashRouter>
                    
                    {
                        (() => {
                            if(typeof config.general != 'undefined' && typeof config.general.title != 'undefined'){
                                return(
                                    <h4>{config.general.title}</h4>
                                )
                            }else{
                                return(
                                    <h4>{__('Table Rate Shipping', 'advanced-table-rate-shipping-for-woocommerce')}</h4>
                                )
                            }
                        })()
                    }
                </div>
                <div>
                    {/* <a href="#">
                        <span className="dashicons dashicons-star-filled"></span>
                        {__('Check Premium Options', 'advanced-table-rate-shipping-for-woocommerce')}
                    </a> */}
                </div>
            </div>
            <div className={style.bgWhite}>
                { this.state.loader ? <Acoloader /> : null}

                <HashRouter>
                    <Tabs instance_id={instance_id} />
                    <Switch>
                        <Route
                            path="/:instance_id/general"
                            exact
                            render={props =>
                                <General 
                                    config={config} 
                                    handleUpdate={this.handleUpdate} 
                                    roles={roles}
                                    onClick={onClick}
                                    onRemoveRoles={this.onRemoveMultipleSelectVal}
                                    saveHandler={this.saveHandler}
                                    zone_id = {zone_id}
                                    onChange={onChange}
                                    refresh={refresh}
                                    instance_id={instance_id}
                                />
                            }
                        />

                        <Route
                            exact
                            path="/:instance_id/shipping_by_city"
                            render={props =>
                                <ShippingByCity 
                                    config={config} 
                                    handleUpdate={this.handleUpdate} 
                                    saveHandler={this.saveHandler}
                                    instance_id={instance_id}
                                />
                            }
                        />

                        <Route
                            exact
                            path="/:instance_id/method_condition"
                            render={props =>
                                <Methodconditions 
                                    config={config} 
                                    addnew={this.addNewMethodCondition} 
                                    handleUpdate={this.handleUpdate} 
                                    handleClose={this.handleClose}
                                    saveHandler={this.saveHandler}
                                    onRemove={this.onRemoveMultipleSelectVal}
                                    resetDatePicker={this.resetDatePicker}
                                    wc={wc}
                                    instance_id={instance_id}
                                />
                            }
                        />

                        <Route
                            exact
                            path="/:instance_id/additional_options"
                            render={props =>
                                <Additionaloptions 
                                    config={config}
                                    handleUpdate={this.handleUpdate} 
                                    saveHandler={this.saveHandler}
                                    instance_id={instance_id}
                                />
                            }
                        />

                        <Route
                            exact
                            path="/:instance_id/table_of_rates"
                            render={props =>
                                <Tableofrates 
                                    addNewRates={this.addNewRates}
                                    tabActiveIndex={this.tabActiveIndex}
                                    config={config}
                                    activeIndex={activeIndex}
                                    handleUpdate={this.handleUpdate} 
                                    addNewRow={this.addNewTableRateRow}
                                    addNewCondition={this.addNewCondition}
                                    addNewCosts={this.addNewCosts}
                                    deleteCondition={this.deleteCondition}
                                    deleteSelected={this.deleteSelected}
                                    action_delete={this.state.action_delete}
                                    dragNdropEvent={this.dragNdropEvent}
                                    deleteThisOption={this.deleteThisOption}
                                    csvFileForUpload={this.csvFileForUpload}
                                    addDaliveryDays={this.addDaliveryDays}
                                    handleCSVUpload={this.handleCSVUpload}
                                    modalHandler={this.modalHandler}
                                    csv_modal={this.state.csv_modal}
                                    deleterows={deleterows}
                                    delAction={this.delAction}
                                    saveHandler={this.saveHandler}
                                    importFromJson={this.importSettingsFromJson}
                                    json_modal={this.state.json_modal}
                                    settingUploadHandlerFromJson={this.settingUploadHandlerFromJson}
                                    wc={wc}
                                    onRemove={this.onRemoveMultipleSelectVal}
                                    />
                            }
                        />
                    </Switch>
                </HashRouter>
            </div>
            </>
        )
    }
}
export default App;