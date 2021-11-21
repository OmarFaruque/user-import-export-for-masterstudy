import React, {useState, useEffect} from "react";
import style from './Additionaloptions.scss';
import TextInput from "../components/TextInput";
import SelectInput from "../components/SelectInput";
import {NavLink, withRouter} from "react-router-dom";
import ReactTooltip from "react-tooltip";
import { Multiselect } from 'multiselect-react-dropdown';
import SpecialDays from "../utils/listofinternationaldays.json";

const { __ } = window.wp.i18n;

class Additionaloptions extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            loader: false,
            volume: '', 
            equation: '/', 
            operand: {
                divide: "Divide", 
                multiply: "Multiply"
            }, 
            days: [
                {name: 'monday', label: 'Monday'}, 
                {name: 'tuesday', label: 'Tuesday'}, 
                {name: 'wednesday', label: 'Wednesday'}, 
                {name: 'thursday', label: 'Thursday'}, 
                {name: 'friday', label: 'Friday'}, 
                {name: 'saturday', label: 'Saturday'}, 
                {name: 'sunday', label: 'Sunday'}
            ]
        }, 
        this.handleUpdate = this.handleUpdate.bind(this);  
    }

    handleUpdate = (event) => {
        if(event.target.name == 'operand'){       
            this.setState({
                equation: event.target.value == 'divide' ? '/' : '*'
            });
        }
    }

    componentDidMount() {}

    render() {
        return (
            <>
            <div className={style.wrap}>
                <div className={style.header}>
                    <h2>{__('Additional Settings', 'advanced-table-rate-shipping-for-woocommerce')}</h2>
                </div>
                
            
                {/* Including Tax */}
                <label className={style.d_inline_block}>
                    <TextInput 
                        type="checkbox"  
                        name="ad_includingtax" 
                        cmnt="additional_settings" 
                        value={1} 
                        onChange={this.props.handleUpdate}
                        defaultChecked={ this.props.config.additional_settings.ad_includingtax}
                    />
                    <strong>{ __('Including Tax', 'advanced-table-rate-shipping-for-woocommerce') }</strong>
                    <span data-tip data-for="including_tax" className={style.tooltip + ' dashicons dashicons-editor-help'}>
                            <ReactTooltip id="including_tax" place="top" effect="solid">
                                {__('Calculate shipping based on prices AFTER tax.', 'advanced-table-rate-shipping-for-woocommerce')}
                            </ReactTooltip>
                    </span>
                    <p className={style.note}>{__('Calculate shipping based on prices AFTER tax.', 'advanced-table-rate-shipping-for-woocommerce')}</p>
                </label>
            
            
                {/* Exclude Weight */}
                <label className={style.d_inline_block}>
                    <TextInput 
                        type="checkbox"  
                        name="ad_exclude_weight" 
                        cmnt="additional_settings" 
                        value={1} 
                        onChange={this.props.handleUpdate}
                        defaultChecked={ this.props.config.additional_settings.ad_exclude_weight}
                    />
                    <strong>{ __('Exclude Weight', 'advanced-table-rate-shipping-for-woocommerce') }</strong>
                    <span data-tip data-for="exclude_weight" className={style.tooltip + ' dashicons dashicons-editor-help'}>
                            <ReactTooltip id="exclude_weight" place="top" effect="solid">
                                {__('Calculate shipping without product weight.', 'advanced-table-rate-shipping-for-woocommerce')}
                            </ReactTooltip>
                    </span>
                    <p className={style.note}>{__('Calculate shipping based on prices AFTER tax.', 'advanced-table-rate-shipping-for-woocommerce')}</p>
                </label>


                {/* Include Coupons */}
                <label className={style.d_inline_block}>
                    <TextInput 
                        type="checkbox" 
                        name="ad_include_coupons" 
                        cmnt="additional_settings" 
                        value={1} 
                        onChange={this.props.handleUpdate}
                        defaultChecked={ this.props.config.additional_settings.ad_include_coupons}
                    />
                    <strong>{ __('Include Coupons', 'advanced-table-rate-shipping-for-woocommerce') }</strong>
                    <span data-tip data-for="coupons" className={style.tooltip + ' dashicons dashicons-editor-help'}>
                            <ReactTooltip id="coupons" place="top" effect="solid">
                                {__('Subtotal is calculated based on cart value after coupons.', 'advanced-table-rate-shipping-for-woocommerce')}
                            </ReactTooltip>
                    </span>
                    <p className={style.note}>{__('Subtotal is calculated based on cart value after coupons.', 'advanced-table-rate-shipping-for-woocommerce')}</p>
                </label>


                {/* Round Weight */}
                <label className={style.d_inline_block}>
                    <TextInput 
                        type="checkbox" 
                        name="ad_round_weight" 
                        cmnt="additional_settings" 
                        value={1} 
                        onChange={this.props.handleUpdate}
                        defaultChecked={ this.props.config.additional_settings.ad_round_weight}
                    />
                    <strong>{ __('Round Weight', 'advanced-table-rate-shipping-for-woocommerce') }</strong>
                    <span data-tip data-for="roundsWeight" className={style.tooltip + ' dashicons dashicons-editor-help'}>
                            <ReactTooltip id="roundsWeight" place="top" effect="solid">
                                {__('Rounds weight value up to the next whole number.', 'advanced-table-rate-shipping-for-woocommerce')}
                            </ReactTooltip>
                    </span>
                    <p className={style.note}>{__('Rounds weight value up to the next whole number.', 'advanced-table-rate-shipping-for-woocommerce')}</p>
                </label>
                

                {/* Hide This Method */}
                <label className={style.d_inline_block}>
                    <TextInput 
                        type="checkbox" 
                        name="ad_hide_this_method" 
                        cmnt="additional_settings" 
                        value={1} 
                        onChange={this.props.handleUpdate}
                        defaultChecked={ this.props.config.additional_settings.ad_hide_this_method}
                    />
                    <strong>{ __('Hide this Method', 'advanced-table-rate-shipping-for-woocommerce') }</strong>
                    <span data-tip data-for="hidethismehotd" className={style.tooltip + ' dashicons dashicons-editor-help'}>
                            <ReactTooltip id="hidethismehotd" place="top" effect="solid">
                                {__('Hide this method if free shipping is available.', 'advanced-table-rate-shipping-for-woocommerce')}
                            </ReactTooltip>
                    </span>
                    <p className={style.note}>{__('Hide This Shipping Method When the Free Shipping Method is Available.', 'advanced-table-rate-shipping-for-woocommerce')}</p>
                </label>


                {/* Hide Other Method */}
                {/* Pro Version Features */}
                <label className={style.d_inline_block}>
                    <TextInput 
                        type="checkbox" 
                        name="ad_hide_other_method" 
                        cmnt="additional_settings" 
                        value={1} 
                        onChange={this.props.handleUpdate}
                        defaultChecked={ this.props.config.additional_settings.ad_hide_other_method}
                    />
                    <strong>{ __('Hide Other Method', 'advanced-table-rate-shipping-for-woocommerce') }</strong>
                    <span data-tip data-for="hideothermethod" className={style.tooltip + ' dashicons dashicons-editor-help'}>
                            <ReactTooltip id="hideothermethod" place="top" effect="solid">
                                {__('Hide other method if checkbox is checked.', 'advanced-table-rate-shipping-for-woocommerce')}
                            </ReactTooltip>
                    </span>
                    <p className={style.note}>{__('Hide other method if checkbox is checked.', 'advanced-table-rate-shipping-for-woocommerce')}</p>
                </label>


                {/* Get minimum value from if have multple condition  */}
                {/* Pro Version Features */}
                <label className={style.d_inline_block}>
                    <TextInput 
                        type="checkbox" 
                        name="ad_get_minimum_value_from_condition" 
                        cmnt="additional_settings" 
                        value={1} 
                        onChange={this.props.handleUpdate}
                        defaultChecked={ this.props.config.additional_settings.ad_get_minimum_value_from_condition}
                    />
                    <strong>{ __('Get minimum value from if have multple condition ', 'advanced-table-rate-shipping-for-woocommerce') }</strong>
                    <span data-tip data-for="minimumvalues" className={style.tooltip + ' dashicons dashicons-editor-help'}>
                            <ReactTooltip id="minimumvalues" place="top" effect="solid">
                                {__('Get minimum value from multiple conditions.', 'advanced-table-rate-shipping-for-woocommerce')}
                            </ReactTooltip>
                    </span>
                    <p className={style.note}>{__('This features, allow automitacally set minimum shipping total cost to cart. For unchecked, shipping total should be maximum amount if have multiple condition.', 'advanced-table-rate-shipping-for-woocommerce')}</p>
                </label>
                


                {/* Weekend Days  */}
                {/* Pro Version Features */}
                <label className={style.d_inline_block}>
                    <TextInput 
                        type="checkbox" 
                        name="ad_weekend_days"
                        cmnt="additional_settings"
                        value={1}
                        onChange={this.props.handleUpdate}
                        defaultChecked={ this.props.config.additional_settings.ad_weekend_days }
                    />
                    <strong>{ __('Weekend days', 'advanced-table-rate-shipping-for-woocommerce') }</strong>
                    <span data-tip data-for="weeklyholiday" className={style.tooltip + ' dashicons dashicons-editor-help'}>
                            <ReactTooltip id="weeklyholiday" place="top" effect="solid">
                                {__('Set weekly holiday.', 'advanced-table-rate-shipping-for-woocommerce')}
                            </ReactTooltip>
                    </span>
                </label>
                
                {
                    (() => {
                        if(this.props.config.additional_settings.ad_weekend_days){
                            return(
                                <>
                                <div className={style.note}>
                                    <div className={style.multiselect}>
                                        <Multiselect 
                                            onSelect={(event) => { this.props.handleUpdate(event, false, 'additional_settings_weekend') }} 
                                            onRemove={(event) => { this.props.handleUpdate(event, false, 'additional_settings_weekend') }} 
                                            selectedValues={this.props.config.additional_settings.ad_weekends} 
                                            options={this.state.days} 
                                            displayValue="label" 
                                        />
                                        <small>{__('Shipping delivery day will calculate exclude weekend days.', 'advanced-table-rate-shipping-for-woocommerce')}</small>
                                    </div>
                                </div>
                                </>
                            )
                        }
                    })()
                }



                {/* Free shipping on Special day  */}
                {/* Pro Version Features */}
                <label className={style.d_inline_block}>
                    <TextInput
                        type="checkbox" 
                        name="ad_free_shipping_on_special_day"
                        cmnt="additional_settings"
                        value={1}
                        onChange={this.props.handleUpdate}
                        defaultChecked={ this.props.config.additional_settings.ad_free_shipping_on_special_day }
                    />
                    <strong>{ __('Free shipping on Special days', 'advanced-table-rate-shipping-for-woocommerce') }</strong>
                    <span data-tip data-for="specialday" className={style.tooltip + ' dashicons dashicons-editor-help'}>
                            <ReactTooltip id="specialday" place="top" effect="solid">
                                {__('Free shipping on special days.', 'advanced-table-rate-shipping-for-woocommerce')}
                            </ReactTooltip>
                    </span>
                </label>
                {
                    (() => {
                        if(this.props.config.additional_settings.ad_free_shipping_on_special_day){
                                var specialdays = [];
                                for(const x of Object.keys(SpecialDays)){
                                    specialdays.push({'date': x, 'event': SpecialDays[x]});
                                }
                            return(
                                <>
                                <div className={style.note}>
                                    <div className={style.multiselect}>
                                        <Multiselect 
                                            onSelect={(event) => { this.props.handleUpdate(event, false, 'additional_settings') }} 
                                            onRemove={(event) => { this.props.handleUpdate(event, false, 'additional_settings') }} 
                                            selectedValues={this.props.config.additional_settings.ad_special_days} 
                                            options={specialdays} 
                                            displayValue="event" 
                                        />
                                        <small>{__('Add international days from above list for free delivery.', 'advanced-table-rate-shipping-for-woocommerce')}</small>
                                    </div>
                                </div>


                                {/* Persentage on Special Days */}
                                <div className={style.note}>
                                            <TextInput type="number" 
                                                placeholder={__('Number of persentage', 'advanced-table-rate-shipping-for-woocommerce')} 
                                                name="ad_special_day_persent"
                                                cmnt="additional_settings" 
                                                max="100"
                                                min="0"
                                                onChange={this.props.handleUpdate}
                                                value={this.props.config.additional_settings.ad_special_day_persent}
                                            />
                                            <small>{__('Discount on total shipping cost for above selected special day\'s. Free shipping are desable if persentage > 0 for special day\'s', 'advanced-table-rate-shipping-for-woocommerce')}</small>
                                </div>

                                </>
                            )
                        }
                    })()
                }



                {/* Set Delivery date automatically  */}
                {/* Pro Version Features */}
                <label className={style.d_inline_block}>
                    <TextInput 
                        type="checkbox" 
                        name="ad_set_delivery_date_automatically" 
                        cmnt="additional_settings" 
                        value={1} 
                        onChange={this.props.handleUpdate}
                        defaultChecked={ this.props.config.additional_settings.ad_set_delivery_date_automatically}
                    />
                    <strong>{ __('Set Delivery date automatically ', 'advanced-table-rate-shipping-for-woocommerce') }</strong>
                    <span data-tip data-for="deliverydayautomacally" className={style.tooltip + ' dashicons dashicons-editor-help'}>
                            <ReactTooltip id="deliverydayautomacally" place="top" effect="solid">
                                {__('Set Delivery date automatically.', 'advanced-table-rate-shipping-for-woocommerce')}
                            </ReactTooltip>
                    </span>
                    <p className={style.note}>{__('Using this features, set your delivery date automatically and show delivery date in cart.', 'advanced-table-rate-shipping-for-woocommerce')}</p>
                </label>
                


                {
                    (() => {
                        if(this.props.config.additional_settings.ad_set_delivery_date_automatically){
                            return(
                                <>
                                    {/* Delivery after order  */}
                                    {/* Pro Version Features */}
                                    <div className={style.note}>
                                            <TextInput type="number" 
                                                placeholder={__('Number of days', 'advanced-table-rate-shipping-for-woocommerce')} 
                                                name="ad_set_delivery_date"
                                                cmnt="additional_settings" 
                                                onChange={this.props.handleUpdate}
                                                value={this.props.config.additional_settings.ad_set_delivery_date}
                                            />
                                            <small>{__('Number of days delivery after order. It will work if delivery day empty on Table rate options', 'advanced-table-rate-shipping-for-woocommerce')}</small>
                                    </div>
                                </>
                            );
                        }

                    })()
                }


                {/* Single Class Only */}
                <label className={style.d_inline_block}>
                    <div className={style.note}>
                        <strong>{__('Single Class Only', 'advanced-table-rate-shipping-for-woocommerce')}</strong>
                        <SelectInput 
                            value={this.props.config.additional_settings.ad_single_class_only} 
                            type="select" 
                            options={{
                                disabled: __('Disabled', 'advanced-table-rate-shipping-for-woocommerce'),
                                priority: __('Highest Priority', 'advanced-table-rate-shipping-for-woocommerce'),
                                cost_high: __('Highest Costing Class', 'advanced-table-rate-shipping-for-woocommerce'),
                                cost_low: __('Lowest Costing Class', 'advanced-table-rate-shipping-for-woocommerce'),
                            }} 
                            onChange={this.props.handleUpdate} 
                            name="ad_single_class_only" 
                            cmnt="additional_settings" 
                        /> 
                    </div>
                </label>



                {
                        (()=>{
                            if(this.props.config.general.title != ''){
                                return(
                                    <>
                                        <NavLink className={style.navlink} onClick={(e) => {this.props.saveHandler(e)}} exact activeClassName={style.active} to={`/${this.props.instance_id}/table_of_rates`}>   
                                            {__('Next', 'advanced-table-rate-shipping-for-woocommerce')}
                                        </NavLink>
                                    </>
                                )
                            }else{
                                return(
                                    <>
                                    <button onClick={this.props.saveHandler} disabled >
                                        {__('Next', 'advanced-table-rate-shipping-for-woocommerce')}
                                    </button>
                                    </>
                                )
                            }
                        })()
                    }
            </div>
            </>
        )
    }
}
export default Additionaloptions;