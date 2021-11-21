import React, { Component } from 'react';
import Loader from 'react-loader-spinner';
import style from './acoloader.scss';


export default class Acoloader extends Component {

    render(){
        return (
            <div className={style.loader}>
                <Loader
                    type="Bars"
                    color="#1A78F2"
                    height={100}
                    width={100}
                />
            </div>
        )
    }
    
}