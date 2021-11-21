import React, {useState, useEffect} from "react";
import style from './MethodConditions.scss'
import TextInput from "../components/TextInput";
import SelectInput from "../components/SelectInput";
import {NavLink, withRouter} from "react-router-dom";
import Select, {components} from 'react-select';
import Volumetricsettings from '../pages/Volumetricsettings';
import { Multiselect } from 'multiselect-react-dropdown';

import Modal from 'react-awesome-modal';

import SpecialDays from '../utils/listofinternationaldays.json';


import DayPicker from 'react-day-picker';

import MomentLocaleUtils, {
    formatDate
  } from 'react-day-picker/moment';


import 'react-day-picker/lib/style.css';

const { __ } = window.wp.i18n;


const Closeicon = () => {
    return(
        <>
            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-x-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path fillRule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
        </>
    );
}


const ShowConditions = (props) => {
    const [type, setType] = useState(props.type);
    const [options, setOptions] = useState(props.options);
    

    useEffect( () => {
        setType(props.type);
        setOptions(props.options);
    });


    return(
        
        <>
        {/* Role Selector */}
        
        <SelectInput value={props.value} type="select" options={options} onChange={props.onChange} name="compair" cmnt="method" index={props.index}/> 
        </>
        )
            
}


const Singlecondition = (props) => {
    const [conditionallowdfor, setConditionallowdfor] = useState({...props.conditionallowdfor, ...props.wc.taxonomy});
    const [options, setOptions] = useState(props.options);
    const [conditiontype, setConditiontype] = useState(props.conditiontype);
    const [includetypes, setIncludetypes] = useState(['product', 'dates', 'times', 'dayweek', 'coupon', ...Object.keys(props.wc.taxonomy)]);
    const [modal, setModal] = useState(false);
    const [days, setDays] = useState([
        {name: 'monday', label: 'Monday'}, 
        {name: 'tuesday', label: 'Tuesday'}, 
        {name: 'wednesday', label: 'Wednesday'}, 
        {name: 'thursday', label: 'Thursday'}, 
        {name: 'friday', label: 'Friday'}, 
        {name: 'saturday', label: 'Saturday'}, 
        {name: 'sunday', label: 'Sunday'}
    ]);


    
    

    useEffect(() => {        
    },[]);

    const modalHandler = (e) =>{
        e.preventDefault();
        setModal(false);
    }

    const selectionRange = {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
      }


    const displayDayRangePopUP = () => {
          setModal(true);
    }



      
    return(
        
        <>
        <div className={includetypes.includes(props.config.condition) ? style.singleCondition + ' ' + style.multiSelect : style.singleCondition}>
            <SelectInput type="select" value={props.config.condition} options={conditionallowdfor} onChange={props.handleUpdate} name="condition" index={props.index}  cmnt="method" /> 
            {
                includetypes.includes(props.config.condition) 
                ? 
                <>
                    {
                        (() => {
                            switch(props.config.condition){
                                case 'times':
                                    return(
                                        <>
                                            <SelectInput type="select" options={{
                                            before: __('Before', 'advanced-table-rate-shipping-for-woocommerce'), 
                                            after: __('After', 'advanced-table-rate-shipping-for-woocommerce')}} 
                                            onChange={props.handleUpdate} 
                                            index={props.index} 
                                            value={props.config.compair} 
                                            cmnt="method" 
                                            name="compair" 
                                            />
                                        </>
                                    )
                                break;
                                default:
                                    return(
                                        <>
                                            <SelectInput type="select" options={{
                                            includes: 'Includes', 
                                            excludes: 'Excludes'}} 
                                            onChange={props.handleUpdate} 
                                            index={props.index} 
                                            value={props.config.compair} 
                                            cmnt="method" 
                                            name="compair" 
                                          />
                                        </>
                                    )
                            }
                        })()
                    }
                    <div className={style.multiselectItems}>
                        {
                            
                                (() => {
                                    switch(props.config.condition){
                                        case "product":
                                            return(
                                                <>
                                                    <div className={style.multiselect}>
                                                        <Multiselect 
                                                            onSelect={(event) => props.handleUpdate(event, props.index, 'wc_products')} 
                                                            onRemove={(selectedList, removeItem) => props.onRemove(selectedList, removeItem, 'products', props.index)} 
                                                            selectedValues={props.config.cvalue[0] && typeof props.config.cvalue[0].id != 'undefined' ? props.config.cvalue : null} 
                                                            options={props.wc.products} 
                                                            displayValue="title" 
                                                        />
                                                    </div>
                                                </>
                                            )
                                        break;
                                        case "dates":
                                            const from = typeof props.config.cvalue.from != 'undefined' ? new Date(props.config.cvalue.from) : undefined;
                                            const to = typeof props.config.cvalue.to != 'undefined' ? new Date(props.config.cvalue.to) : undefined;
                                            const modifiers = { start: from, end: to };

                                            return(
                                                <>
                                                    <Modal visible={modal} width="900" height="370" effect="fadeInLeft" onClickAway={modalHandler}>
                                                       <div className={style.datePickerWrap}>
                                                            <DayPicker
                                                                className={style.Selectable}
                                                                numberOfMonths={3}
                                                                selectedDays={[from, { from, to }]}
                                                                modifiers={modifiers}
                                                                onDayClick={ (day) => props.handleUpdate(day, props.index, 'date_range')}
                                                            />
                                                            
                                                             <div className={style.buttonGroup}>
                                                                <button className={style.resetBtn} onClick={(e) => props.resetDatePicker(e, props.index)} type="button">{__('Reset', 'advanced-table-rate-shipping-for-woocommerce')}</button>
                                                                <button onClick={modalHandler} type="button">{__('Apply', 'advanced-table-rate-shipping-for-woocommerce')}</button>
                                                             </div>
                                                             <a className={style.closeBtn} href="#" onClick={modalHandler}>
                                                                <span>
                                                                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-x" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                                        <path fillRule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                                                                    </svg>
                                                                </span>
                                                            </a>
                                                       </div>
                                                    </Modal>
                                                    <TextInput
                                                        type="text"
                                                        onClick={displayDayRangePopUP}
                                                        value={typeof from != 'undefined' && typeof to != 'undefined' ? formatDate(from, 'MMMM Do YYYY') + ' - ' + formatDate(to, 'MMMM Do YYYY') : ''}
                                                        readOnly='readOnly'
                                                    />
                                                </>
                                            )
                                        break;
                                        case 'times':
                                            return(
                                                <>
                                                    <TextInput
                                                        type="time"
                                                        onChange={props.handleUpdate}
                                                        name="cvalue"
                                                        cmnt="method"
                                                        value={props.config.cvalue}
                                                        index={props.index}
                                                    />
                                                </>
                                            )
                                        break;
                                        case 'dayweek':
                                            return(
                                                <> 
                                                    <Multiselect 
                                                        onSelect={(event) => props.handleUpdate(event, props.index, 'dayweek')} 
                                                        onRemove={(selectedList, removeItem) => props.onRemove(selectedList, removeItem, 'wc_cat', props.index)} 
                                                        selectedValues={props.config.cvalue[0] && typeof props.config.cvalue[0].label != 'undefined' ? props.config.cvalue: null} 
                                                        options={days} 
                                                        displayValue="label" 
                                                    />
                                                </>
                                            )
                                        break;
                                        case 'coupon':
                                            return(
                                                <> 
                                                    <Multiselect 
                                                        onSelect={(event) => props.handleUpdate(event, props.index, 'coupon')} 
                                                        onRemove={(selectedList, removeItem) => props.onRemove(selectedList, removeItem, 'wc_cat', props.index)} 
                                                        selectedValues={props.config.cvalue[0] && typeof props.config.cvalue[0].id != 'undefined' ? props.config.cvalue: null} 
                                                        options={props.wc.coupons} 
                                                        displayValue="title" 
                                                    />
                                                </>
                                            )
                                        break;
                                        default:
                                            
                                            return(
                                                <> 
                                                    <Multiselect 
                                                        onSelect={(event) => props.handleUpdate(event, props.index, props.config.condition)} 
                                                        onRemove={(selectedList, removeItem) => props.onRemove(selectedList, removeItem, 'wc_cat', props.index)} 
                                                        selectedValues={props.config.cvalue[0] && typeof props.config.cvalue[0].term_id != 'undefined' ? props.config.cvalue: null} 
                                                        options={props.wc.terms[props.config.condition]} 
                                                        displayValue="name" 
                                                    />
                                                </>
                                            )
                                    }
    
                                })() 
                                

                        }
                    </div>
                </>
                :
                <>
                    <ShowConditions value={props.config.compair} type={conditiontype} options={options} onChange={props.handleUpdate} index={props.index} />
                    <TextInput value={props.config.cvalue} type="number" onChange={props.handleUpdate} index={props.index} name="cvalue" cmnt="method" />
                </>
            }
            
            
            <span onClick={() => props.handleClose(props.index)} ><Closeicon /></span>
        </div>
        </>

    );
}


class Methodconditions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: false,
            conditionAllowdFor: {
                subtotal: 'Subtotal', 
                quantity: 'Quantity',
                weight: 'Weight', 
                height: 'Height', 
                width: 'Width', 
                length: 'Length', 
                area: 'Surface Area', 
                volume: 'Volume', 
                product: 'Products', 
                dates: 'Date Range', 
                times: 'Times', 
                dayweek: 'Day of Week', 
                coupon: 'Coupon'
            }, 
            showCondition: false, 
            conditiontype: false, 
            options: {
                "greater_than": "Greater than (>=)", 
                "less_than": "Less than (<=)", 
                "equal_to": "Equal to"
            }, 
            addNew: false, 
            type: []
        }

        
        this.singleConditionSelector = this.singleConditionSelector.bind(this);  
        this.addNewCondition = this.addNewCondition.bind(this);
    }


    componentDidMount() {
    }

    singleConditionSelector = (event) => {
        this.setState({
            showCondition: true, 
            conditiontype: event.target.value
        });

        switch(event.target.value){
            default:
                this.state.options = {
                    "greater_than": "Greater than (>=)", 
                    "less_than": "Less than (<=)", 
                    "equal_to": "Equal to"
                }
        }
    }

    addNewCondition = () => {
        this.setState({type: [...this.state.type, ""]})
    }


    render() {
        return (
        <>
        <div className={style.wrap}>
            <Volumetricsettings config={this.props.config.method} handleUpdate={this.props.handleUpdate} />
             <div className={style.headerAdditional}>
                <h2>{__('Method Conditions', 'advanced-table-rate-shipping-for-woocommerce')}</h2>
                <p className={style.text_left}>{__('These optional conditions will be required in order for any shipping options below to be returned. They are applied to the order as a whole regardless to your \'Base Table Rates\' selection above.', 'advanced-table-rate-shipping-for-woocommerce')}</p>
            </div>
                {
                    this.props.config.method.method_condtion.map((v, index) => {
                            return(
                                    <Singlecondition 
                                    index={index}
                                    key={index} 
                                    conditionallowdfor={this.state.conditionAllowdFor} 
                                    singleconditionselector={this.state.singleConditionSelector} 
                                    options={this.state.options} 
                                    conditiontype={this.state.conditiontype} 
                                    handleUpdate={this.props.handleUpdate}
                                    handleClose={this.props.handleClose}
                                    config={v}
                                    wc={this.props.wc}
                                    onRemove={this.props.onRemove}
                                    resetDatePicker={this.props.resetDatePicker}
                                />
                            );
                    })
                }
               
               {/* Add New Condition */}
               <div className={style.text_center}>
                   <button className={style.addNewCondition} onClick={this.props.addnew} type="button">
                       {__('Add New Condition', 'advanced-table-rate-shipping-for-woocommerce')}
                   </button>
               </div>

                {
                    (()=>{
                        if(this.props.config.general.title != ''){
                            return(
                                <>
                                    <NavLink className={style.navlink} onClick={(e) => {this.props.saveHandler(e)}} exact activeClassName={style.active} to={`/${this.props.instance_id}/additional_options`} > 
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


export default Methodconditions;
