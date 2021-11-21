import React, {useState, useEffect} from "react";
import style from './Userpermission.scss'
import ReactTooltip from "react-tooltip";
import TextInput from "../components/TextInput";
import SelectInput from "../components/SelectInput";
import {NavLink, withRouter} from "react-router-dom";
import Select, {components} from 'react-select';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { Multiselect } from 'multiselect-react-dropdown';


const { __ } = window.wp.i18n;


const SortableSelect = SortableContainer( props => {
    return(
        <>
        <Select 
            key={props.key} 
            options={props.options} 
            isMulti={props.isMulti}
            className={props.className}
            onChange={props.onChange}
            />
        </>
    )
});


const SortableMultiValue = SortableElement(props => {
    // this prevents the menu from being opened/closed when the user clicks
    // on a value to begin dragging it. ideally, detecting a click (instead of
    // a drag) would still focus the control and toggle the menu, but that
    // requires some magic with refs that are out of scope for this example
    const onMouseDown = e => {
      e.preventDefault();
      e.stopPropagation();
    };
    const innerProps = { onMouseDown };
    return <components.MultiValue {...props} innerProps={innerProps} />;
  });




const ShowRoles = (props) => {
    const [options, setOptions] = useState([]);
    const [selected, setSelected] = useState(props.options);
    const showRoleSelector = () => {

    }

    useEffect( () => {
        var rolesArray = [];
        for(const x of Object.keys(props.roles)){
            rolesArray.push({'role': x, 'label': props.roles[x]});
        }
        setOptions(rolesArray);
        
        
    }, []);

    
    
 
    
    return(
        <>
        {/* Role Selector */}
             <label>{__('Ship to roles','advanced-table-rate-shipping-for-woocommerce')} <span data-tip data-for="shiptoroles" className={style.tooltip + ' dashicons dashicons-editor-help'}>
             <ReactTooltip id="shiptoroles" place="top" effect="solid">
                 {__('Shipping option visiable for specific user of role', 'advanced-table-rate-shipping-for-woocommerce')}
             </ReactTooltip>
             </span></label>

             <div className={style.multiselect + ' ' + (props.options.length <= 0 ? style.error: null) }>
                <Multiselect onSelect={props.onChange} onRemove={props.onRemove} selectedValues={selected} options={options} displayValue="label" />
             </div>
        </>
        )
            
}


class Userpermission extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: false,
            permissions_for: {
                everyone: 'Everyone', 
                specific: 'Specific Roles'
            }, 
            roles: props.roles
        }
    }


    componentDidMount() {
    }




    render() {
        return (
        <div className={style.wrap}>
            {/* Shipping options appear for */}
             <label>{__('Shipping options appear for','advanced-table-rate-shipping-for-woocommerce')} <span data-tip data-for="appearfor" className={style.tooltip + ' dashicons dashicons-editor-help'}>
                <ReactTooltip id="appearfor" place="top" effect="solid">
                    {__('Shipping options appear for...', 'advanced-table-rate-shipping-for-woocommerce')}
                </ReactTooltip>
                </span></label>
            <SelectInput type="select" cmnt="general" name="shipping_option_appear_for" value={this.props.config.general.shipping_option_appear_for} options={this.state.permissions_for} onChange={this.props.handleUpdate}/>
            { 
                this.props.config.general.shipping_option_appear_for == 'specific' ? 
                    <ShowRoles 
                        options={this.props.config.general.ship_to_role} 
                        roles={this.state.roles} 
                        onChange={this.props.handleUpdate} 
                        onRemove={this.props.onRemoveRoles}
                    /> 
                    : 
                    null 
            }
        </div>
        
        )
    }
}


export default Userpermission;
