import React, {Component, useState, useEffect} from "react"
import style from './General.scss'
import {NavLink, withRouter} from "react-router-dom"
import ReactTooltip from "react-tooltip"
import TextInput from "../components/TextInput"
import SelectInput from "../components/SelectInput"
import Userpermission from "../pages/Userpermission"

import FetchWP from '../utils/fetchWP'


const { __ } = window.wp.i18n;

class General extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        
        this.state = {

            title: props.config.general.title, 
            taxs: {
                'taxable': 'Taxable' , 
                'non-taxable': 'Non-Taxable'
            }, 
            roles: props.roles, 
            rules: {
                "per_order": "Per Order",
                "per_item": "Per Item",
                "per_line_item": "Per Line Item",
                "per_class": "Per Class",
                "per_order": "Per Order"            
            },
            refresh: false
        };

        this.fetchWP = new FetchWP({
            restURL: window.acotrs_object.root,
            restNonce: window.acotrs_object.api_nonce,
        });

      }
      


    /**
     * React Ready event
     */
     componentDidMount() {
        this._isMounted = true;
        this.getConfig()
    }
 

    getConfig = () => {
        this.setState({
            loader: true,
            refresh: true
        });
        
        this.fetchWP.get('listsof_zones/')
            .then(
                (json) => {
                    this.setState({
                        loader: false, 
                        zones: json.zones, 
                        instance_id: false, 
                        refresh: false
                    })
                })
                .catch(function(error) {
                    console.log('error', error);
                });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render(){
        const {refresh, zones} = this.state
        return (
        <div className={style.wrap}>
            <div className={style.header}>
                <h2>{__('General Settings', 'advanced-table-rate-shipping-for-woocommerce')}</h2>
            </div>

            {/* Method Title */}
            <label>{__('Method Title','advanced-table-rate-shipping-for-woocommerce')} <span className={style.tooltip + ' dashicons dashicons-editor-help'}></span></label>
            <TextInput type="text" customClass={ this.props.config.general.title.length <= 0 ? 'error' : null } value={this.props.config.general.title} name="title" cmnt="general" onChange={this.props.handleUpdate}/>

            {/* Shipping Zone */}
            <label>{__('Shipping Zone','advanced-table-rate-shipping-for-woocommerce')} <span data-tip data-for="shippingzone" className={style.tooltip + ' dashicons dashicons-editor-help'}>
                <ReactTooltip id="shippingzone" place="top" effect="solid">
                    {__('Shipping Zone', 'advanced-table-rate-shipping-for-woocommerce')}
                </ReactTooltip>
                </span></label>
                {
                    typeof zones != 'undefined' && (
                        <>
                            <SelectInput 
                                type="select"  
                                name="selected_zone" 
                                value={this.props.zone_id} 
                                refresh={refresh}
                                options={zones} 
                                onClick={this.getConfig}
                                onChange={this.props.onChange} 
                            />
                        </>
                    )
                }


            {/* Taxs */}
            <label>{__('Tax Status','advanced-table-rate-shipping-for-woocommerce')} <span data-tip data-for="registerTip" className={style.tooltip + ' dashicons dashicons-editor-help'}>
                <ReactTooltip id="registerTip" place="top" effect="solid">
                    {__('Shipping Tax Status (Taxable / Non-Taxable)', 'advanced-table-rate-shipping-for-woocommerce')}
                </ReactTooltip>
                </span></label>
            <SelectInput type="select"  name="tax_status" value={this.props.config.general.tax_status} cmnt="general" options={this.state.taxs} onChange={this.props.handleUpdate}/>


            {/* Base Table Rules */}
            <label>{__('Base Table Rules','advanced-table-rate-shipping-for-woocommerce')} <span data-tip data-for="baseTableRow" className={style.tooltip + ' dashicons dashicons-editor-help'}>
                <ReactTooltip id="baseTableRow" place="top" effect="solid">
                    {__('Advance Shipping default rules', 'advanced-table-rate-shipping-for-woocommerce')}
                </ReactTooltip>
                </span></label>
            <SelectInput type="select" options={this.state.rules} name="base_rule" value={this.props.config.general.base_rule} cmnt="general" onChange={this.props.handleUpdate}/>


            {/* Handling Fee */}
            <label>{__('Handling fee','advanced-table-rate-shipping-for-woocommerce')} <span data-tip data-for="handlingfee" className={style.tooltip + ' dashicons dashicons-editor-help'}>
                <ReactTooltip id="handlingfee" place="top" effect="solid">
                    {__('Product Handling Fee', 'advanced-table-rate-shipping-for-woocommerce')}
                </ReactTooltip>
            </span></label>
            <TextInput type="number" value={this.props.config.general.handlingfree} cmnt="general" name="handlingfree" onChange={this.props.handleUpdate}/>

            {/* Flat Rate */}
            <label>{__('Flat Rate','advanced-table-rate-shipping-for-woocommerce')} <span data-tip data-for="flatrate" className={style.tooltip + ' dashicons dashicons-editor-help'}>
                <ReactTooltip id="flatrate" place="top" effect="solid">
                    {__('Flat rate should be applicable while table rates are return empty.', 'advanced-table-rate-shipping-for-woocommerce')}
                </ReactTooltip>
                </span></label>
            <TextInput type="number" min="0" step="0.01" value={this.props.config.general.flatrate} name="flatrate" cmnt="general" placeholder="00.00" onChange={this.props.handleUpdate}/>


            <Userpermission 
                handleUpdate={this.props.handleUpdate} 
                config={this.props.config} 
                roles={this.state.roles} 
                onRemoveRoles={this.props.onRemoveRoles}
                />

                {
                    this.props.config.general.title.length <= 0 || (this.props.config.general.shipping_option_appear_for == 'specific' && this.props.config.general.ship_to_role.length <= 0)
                    ?
                        <button onClick={this.props.saveHandler} disabled >
                            {__('Next', 'advanced-table-rate-shipping-for-woocommerce')}
                        </button>
                    :
                    <NavLink className={style.navlink} onClick={(e) => {this.props.saveHandler(e)}} exact activeClassName={style.active} to={`/${this.props.instance_id}/shipping_by_city`}>
                        {__('Next', 'advanced-table-rate-shipping-for-woocommerce')}
                    </NavLink>
                }

        </div>

    )
    }

}

export default General;


