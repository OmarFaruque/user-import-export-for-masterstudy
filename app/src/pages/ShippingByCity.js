import React from "react";
import style from './ShippingByCity.scss'
import ReactTooltip from "react-tooltip";
import TextInput from "../components/TextInput";
import SelectInput from "../components/SelectInput";
import {NavLink, withRouter} from "react-router-dom";


const { __ } = window.wp.i18n;

class ShippingByCity extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: false,
            region: {
                including: 'Including Cities', 
                excluding: 'Excluding Cities'
            }
        }
    }


    componentDidMount() {
        
    }

    render() {
        return (
        <div className={style.wrap}>
            {/* Enable Shipping by City */}
            <div className={style.d_flex}>
                <div>
                    <h3>{__('Enable Shipping by City', 'advanced-table-rate-shipping-for-woocommerce')}</h3>
                </div>

                {/* Rounded switch */}
                <div className={style.ml_auto}>
                    <label className={style.switch}>
                        <input type="checkbox" 
                            defaultChecked={this.props.config.shipping_by_city.enable} 
                            value={1} 
                            name="enable" 
                            cmnt="shipping_by_city" 
                            onChange={this.props.handleUpdate} 
                            />
                        <span className={style.slider}></span>
                    </label>
                </div>
            </div>
            {

                (() => {
                    if(this.props.config.shipping_by_city.enable){
                        return(
                            <>
                            {/* Region is.. */}
                            <label>{__('Region is...','advanced-table-rate-shipping-for-woocommerce')} <span data-tip data-for="regionis" className={style.tooltip + ' dashicons dashicons-editor-help'}>
                                <ReactTooltip id="regionis" place="top" effect="solid">
                                {__('Set Including or Excluding City.', 'advanced-table-rate-shipping-for-woocommerce')}
                                </ReactTooltip>
                            </span></label>
                            <SelectInput type="select" value={this.props.config.shipping_by_city.region_is} name="region_is" cmnt="shipping_by_city" options={this.state.region} onChange={this.props.handleUpdate}/>

                            {/* Allowed City */}
                            <label>{__('Allowed City','advanced-table-rate-shipping-for-woocommerce')} <span data-tip data-for="allowedCity" className={style.tooltip + ' dashicons dashicons-editor-help'}>
                                <ReactTooltip id="allowedCity" place="top" effect="solid">
                                {__('Set list of city. List one city per line.', 'advanced-table-rate-shipping-for-woocommerce')}
                                </ReactTooltip>
                            </span></label>
                            <TextInput type="textarea" customClass={ this.props.config.shipping_by_city.allowed_city.length <= 0 ? 'error':null } rows={10} value={this.props.config.shipping_by_city.allowed_city} name="allowed_city" cmnt="shipping_by_city" placeholder={__('List one city name per line', 'advanced-table-rate-shipping-for-woocommerce')} onChange={this.props.handleUpdate}/>



                             {/* Disable other methods */}
                            <div className={style.d_flex + ' mt-2'}>
                                <div>
                                    <h3>{__('Disable Other Methods', 'advanced-table-rate-shipping-for-woocommerce')}
                                        <span data-tip data-for="desableOther" className={style.tooltip + ' dashicons dashicons-editor-help'}>
                                                    <ReactTooltip id="desableOther" place="top" effect="solid">
                                                    {__('Applicable only for selected city.', 'advanced-table-rate-shipping-for-woocommerce')}
                                                    </ReactTooltip>
                                        </span>
                                    </h3>
                                </div>

                                {/* Rounded switch */}
                                <div className={style.ml_auto}>
                                    <label className={style.switch}>
                                        <input type="checkbox" defaultChecked={this.props.config.shipping_by_city.desable_other} value={1} cmnt="shipping_by_city" name="desable_other" onChange={this.props.handleUpdate} />
                                        <span className={style.slider}></span>
                                    </label>
                                </div>
                            </div>
                            

                            </>
                        )
                    }
                })()
            }

            {
                (this.props.config.shipping_by_city.enable && this.props.config.shipping_by_city.allowed_city.length <= 0) || this.props.config.general.title == ''
                ? 
                <button onClick={this.props.saveHandler} disabled >
                    {__('Next', 'advanced-table-rate-shipping-for-woocommerce')}
                </button>
                : 
                
                <NavLink className={style.navlink} onClick={(e) => {this.props.saveHandler(e)}} exact activeClassName={style.active} to={`/${this.props.instance_id}/method_condition`}>    
                        {__('Next', 'advanced-table-rate-shipping-for-woocommerce')}
                </NavLink>
                
                
            }

        </div>
        
        )
    }
}


export default ShippingByCity;
