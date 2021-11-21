import React from 'react'
import {NavLink, withRouter} from "react-router-dom";
import style from './style.scss'
const { __ } = window.wp.i18n;

const Tabs = (props) => {

    return (
        <div className={style.wrap + ' ' + style.headertab}>
            <ul>
                <li>
                    <NavLink exact activeClassName={style.active} to={`/${props.instance_id}/general`} >
                        <span className={style.tabindex}></span>
                        {__('General Settings', 'advanced-table-rate-shipping-for-woocommerce')}
                    </NavLink>
                </li>
                <li>
                    <NavLink exact activeClassName={style.active} to={`/${props.instance_id}/shipping_by_city`} >
                        <span className={style.tabindex} ></span>
                        {__('City Settings', 'advanced-table-rate-shipping-for-woocommerce')}
                    </NavLink>
                </li>
                
                <li>
                    <NavLink exact activeClassName={style.active} to={`/${props.instance_id}/method_condition`} >
                        <span className={style.tabindex}></span>
                        {__('Method & Volumetric Settings', 'advanced-table-rate-shipping-for-woocommerce')}
                    </NavLink>
                </li>
              
                <li>
                    <NavLink exact activeClassName={style.active} to={`/${props.instance_id}/additional_options`} >
                        <span className={style.tabindex}></span>
                        {__('Additional Options', 'advanced-table-rate-shipping-for-woocommerce')}
                    </NavLink>
                </li>
                <li>
                    <NavLink exact activeClassName={style.active} to={`/${props.instance_id}/table_of_rates`} >
                        <span className={style.tabindex}></span>
                        {__('Table of Rates', 'advanced-table-rate-shipping-for-woocommerce')}
                    </NavLink>
                </li>
            </ul>
        </div>
    )
}

export default withRouter(Tabs);
