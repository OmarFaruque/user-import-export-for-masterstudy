import React, {Component, useState, useEffect} from "react"
import style from './Methodlists.scss'
const { __ } = window.wp.i18n;
const Banner = () => {
    return(
        <div className={style.upgradeWindow}>
            <div>
                <a className={style.topUpgrade} href="https://acowebs.com/woocommerce-table-rate-shipping/" target="_blank">
                    {__('Upgrade', 'advanced-table-rate-shipping-for-woocommerce')}
                </a>
                <h2>{__('Upgrade to Pro version Now!', 'advanced-table-rate-shipping-for-woocommerce')}</h2>
                <p>{__('Thanks for using our plugin want more options? Consider Upgrading to our pro version', 'advanced-table-rate-shipping-for-woocommerce')}</p>
                <ul>
                    <li>{__('Unlimited shipping option\'s.', 'advanced-table-rate-shipping-for-woocommerce')}</li>
                    <li>{__('Option to set shipping cost based on category, custom category & tags.', 'advanced-table-rate-shipping-for-woocommerce')}</li>
                    <li>{__('Option to set special discount for special day on individual shipping method.', 'advanced-table-rate-shipping-for-woocommerce')}</li>
                    <li>{__('Import & Export as CSV file.', 'advanced-table-rate-shipping-for-woocommerce')}</li>
                    <li>{__('Option to set shipping cost for time & date range.', 'advanced-table-rate-shipping-for-woocommerce')}</li>
                    <li>{__('Ability to hide other methods if a particular custom shipping method is activated.', 'advanced-table-rate-shipping-for-woocommerce')}</li>
                    <li>{__('And many more...', 'advanced-table-rate-shipping-for-woocommerce')}</li>
                </ul>
                <a href="https://acowebs.com/woocommerce-table-rate-shipping/" target="_blank" >
                    {__('Upgrade now', 'advanced-table-rate-shipping-for-woocommerce')}
                    &nbsp;<span className="dashicons dashicons-arrow-right-alt2"></span>
                </a>
            </div>
        </div>
    )
}

export default Banner