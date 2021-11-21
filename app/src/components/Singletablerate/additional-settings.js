import React from "react";
import style from './Additional-settings.scss';

const { __ } = window.wp.i18n;


const AdditionalSettings = (props) => {
    return(
        <div className={style.additionalSettings}>
        <div className={style.AdditionalInner}>
            <h5>{ __('Additional Settings', 'advanced-table-rate-shipping-for-woocommerce') }</h5>

            {/* Single Sittings */}
            <div className={style.d_flex}>
                <div>
                    <p>{__('Default Selection', 'advanced-table-rate-shipping-for-woocommerce')}</p>
                </div>
                <div className={style.ml_auto}>
                    <label className={style.switch}>
                        <input 
                            type="checkbox" 
                            index={props.index}
                            onChange={props.onChangeValue} 
                            name="default_selection"
                            cmnt="table_of_rates"
                            value={1}
                            defaultChecked={props.t_rates.default_selection}
                        />
                        <span className={style.slider}></span>
                    </label>
                </div>
            </div>


            {/* Single Sittings */}
            <div className={style.d_flex}>
                <div>
                    <p>{__('Hide Other Options', 'advanced-table-rate-shipping-for-woocommerce')}</p>
                </div>
                <div className={style.ml_auto}>
                    <label className={style.switch}>
                        <input 
                            type="checkbox" 
                            index={props.index}
                            onChange={props.onChangeValue} 
                            name="hide_other_options"
                            cmnt="table_of_rates"
                            value={1}
                            defaultChecked={props.t_rates.hide_other_options}
                        />
                        <span className={style.slider}></span>
                    </label>
                </div>
            </div>

            {/* Single Sittings */}
            <div className={style.d_flex}>
                <div>
                    <p>{__('Disable Option', 'advanced-table-rate-shipping-for-woocommerce')}</p>
                </div>
                <div className={style.ml_auto}>
                    <label className={style.switch}>
                        <input 
                            type="checkbox" 
                            index={props.index}
                            onChange={props.onChangeValue} 
                            name="disable_option"
                            cmnt="table_of_rates"
                            value={1}
                            defaultChecked={props.t_rates.disable_option}
                        />
                        <span className={style.slider}></span>
                    </label>
                </div>
            </div>

            {/* Single Sittings */}
            <div className={style.d_flex}>
                <div>
                    <p>{__('Combine Descriptions', 'advanced-table-rate-shipping-for-woocommerce')}</p>
                </div>
                <div className={style.ml_auto}>
                    <label className={style.switch}>
                        <input 
                            type="checkbox" 
                            index={props.index}
                            onChange={props.onChangeValue} 
                            name="combine_descriptions"
                            cmnt="table_of_rates"
                            value={1}
                            defaultChecked={props.t_rates.combine_descriptions}
                        
                        />
                        <span className={style.slider}></span>
                    </label>
                </div>
            </div>
        </div>

        {/* Delete This Options */}
        {/* <div className={style.deleteThis}>
            
            {
                (() => {
                    if(this.props.length > 1){
                        return(
                            <>
                                <button type="button" onClick={()=>this.props.deleteThisOption(props.index)}>
                                    <span className="dashicons dashicons-trash"></span>&nbsp;
                                    <span>{__('Delete This Shipping Option', 'advanced-table-rate-shipping-for-woocommerce')}</span>
                                </button>
                            </>
                        )
                    }else{
                        return(
                            <>
                                <button type="button" disabled className={style.desabled} >
                                    <span className="dashicons dashicons-trash"></span>&nbsp;
                                    <span>{__('Delete This Shipping Option', 'advanced-table-rate-shipping-for-woocommerce')}</span>
                                </button>
                            </>
                        )
                    }
                })()
            }
        </div> */}



        </div>
    )
}

export default AdditionalSettings