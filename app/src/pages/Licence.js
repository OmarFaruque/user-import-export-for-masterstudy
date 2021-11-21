import React from 'react';
import style from './Licence.scss';
import TextInput from '../components/TextInput';

const { __ } = window.wp.i18n;

class Licence extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div className={style.licenceWrap}>
                <div>
                    {
                        (() => {
                            if(this.props.error_msg != ''){
                                return(
                                    <>
                                        <div className={style.error}>
                                            <div>
                                                <h5>{this.props.error_msg}</h5>
                                            </div>
                                        </div>
                                    </>
                                )
                            }
                        })()
                    }
                    <TextInput
                        value={this.props.licence_key}
                        type="text"
                        onChange={this.props.setLicenceKey}
                        placeholder={__('Activation Key', 'advanced-table-rate-shipping-for-woocommerce')}
                    />
                    <button onClick={this.props.saveLicenceKey}>
                        {__('Active', 'advanced-table-rate-shipping-for-woocommerce')}
                    </button>
                </div>
            </div>
        );
    }
}

export default Licence;