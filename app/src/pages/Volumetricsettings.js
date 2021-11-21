import React, {useState, useEffect} from "react";
import style from './Volumetricsettings.scss';
import TextInput from "../components/TextInput";
import SelectInput from "../components/SelectInput";
import ReactTooltip from "react-tooltip";


const { __ } = window.wp.i18n;

class Volumetricsettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: false,
            volume: '', 
            operand: {
                "/": __("Divide", "advanced-table-rate-shipping-for-woocommerce"), 
                "*": __("Multiply", "advanced-table-rate-shipping-for-woocommerce")
            }
        }
    }

    /**
     * Initial function
     */
    componentDidMount() {}

    render() {
        return (
        <>
        <div className={style.wrap}>
             <div className={style.header}>
                <h2>{__('Volumetric Settings', 'advanced-table-rate-shipping-for-woocommerce')}</h2>
            </div>
            

            {/* Volume Number */}
            <label>{__('Volume Number','advanced-table-rate-shipping-for-woocommerce')} <span data-tip data-for="appearfor" className={style.tooltip + ' dashicons dashicons-editor-help'}>
                <ReactTooltip id="appearfor" place="top" effect="solid">
                    {__('Tooltip for the register button', 'advanced-table-rate-shipping-for-woocommerce')}
                </ReactTooltip>
                </span></label>
                <div className={style.numberformate}>
                    <TextInput 
                        value={ typeof this.props.config != 'undefined' ? this.props.config.volume : null }
                        cmnt="method"
                        name="volume"
                        type="number"
                        onChange={this.props.handleUpdate}
                        placeholder={__('Number', 'advanced-table-rate-shipping-for-woocommerce')}
                    />
                </div>
                <small>{__('Equation: ( LxWxH ) ', 'advanced-table-rate-shipping-for-woocommerce') + this.props.config.operand + __(' Volumetric Number', 'advanced-table-rate-shipping-for-woocommerce')}</small>
                

            {/* Operand */}
            <label>{__('Operand','advanced-table-rate-shipping-for-woocommerce')} <span data-tip data-for="appearfor" className={style.tooltip + ' dashicons dashicons-editor-help'}>
                <ReactTooltip id="appearfor" place="top" effect="solid">
                    {__('Tooltip for the register button', 'advanced-table-rate-shipping-for-woocommerce')}
                </ReactTooltip>
                </span>
            </label>
            <SelectInput 
                    type="select" 
                    name="operand"
                    options={this.state.operand} 
                    cmnt="method"
                    value={this.props.config.operand}
                    onChange={this.props.handleUpdate}
            />


            {/* Exclude Weight */}
            <label className={style.d_inline_block}>
                <TextInput type="checkbox" 
                    onChange={this.props.handleUpdate} 
                    name="exclude_weight"
                    cmnt="method"
                    value={1}
                    defaultChecked={this.props.config.exclude_weight}
                />
                <strong>{ __('Exclude Weight', 'advanced-table-rate-shipping-for-woocommerce') }</strong>
            </label>
            <p className={style.note}>{__('Do not compare product weight to calculated volumetric weight. Weight condition should always equal the volumetric weight.', 'advanced-table-rate-shipping-for-woocommerce')}</p>

        </div>
        </>
        )
    }
}

export default Volumetricsettings;