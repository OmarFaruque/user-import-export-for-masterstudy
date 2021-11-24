import React from "react"
import {HashRouter, Route, Switch} from 'react-router-dom'
import ReactDOM from "react-dom"
import style from './backend.scss'
import FetchWP from './utils/fetchWP'
import CSVReader from 'react-csv-reader'


import Csvloader from './utils/csvloader'

const { __ } = window.wp.i18n;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: false,
            saving: false,
            config: {
                general: {title: ''},
                page2: {title: ''}
            }, 
            csv_data: false, 
            type: 'single_choice_question', 
            assets_url: window.uiemlms_object.assets_url, 
            upload_complete: false
        }

        this.fetchWP = new FetchWP({
            restURL: window.uiemlms_object.root,
            restNonce: window.uiemlms_object.api_nonce,

        });
        
        this.onChangeHandler = this.onChangeHandler.bind(this);
    }


    onChangeHandler = (e) => {
        this.setState({
            type: e.target.value
        });
    }

    csvUploadHandler = (data, fileInfo) => {
        this.setState({
            csv_data: data
        })
    }


    componentDidMount() {}

    componentWillUnmount() {}

    handleUpdate = () => {
        this.setState({
            loader: true
        });
        const {csv_data} = this.state;

        this.fetchWP.post('save', {data: csv_data}).then(json => {


            console.log('after success: ', json)
            this.setState({
                loader: false, 
                upload_complete: true
            });
        }).catch(error => {
            console.log('error is: ' , error);
        })
    }



    render() {
        const {config, upload_complete} = this.state;
        return (
            <div className={style.bgWhite}>
                {this.state.loader ? <Csvloader /> : null}

                <div className={style.test_class}>
                    {/* Left Part */}
                <div>
                        
                        <label>{__('Select a CSV file','user-import-export-mlms')}</label>

                        <div className={style.uploader}>
                            <CSVReader onFileLoaded={this.csvUploadHandler} />
                        </div>
                        {
                            upload_complete ? <div className={style.msgS}>
                                <span>{__('CSV upload complete.', 'user-import-export-mlms')}</span>
                            </div> : null
                        }
                        <button onClick={this.handleUpdate}>{__('Process  CSV', 'user-import-export-mlms')}</button>

                </div>

                {/* Right Part */}
                <div>
                        <div className={style.right_inner}>
                            <label>{__('Download CSV File:','user-import-export-mlms')}</label>
                            <a href={this.state.assets_url + '/csv/msstudy-import-export-template.csv'} download >{__('Download CSV Sample', 'user-import-export-mlms')}</a>
                        </div>
                </div>
                </div>

            </div>
        )
    }

}


if (document.getElementById("uiemlms_ui_root")) {
    ReactDOM.render(<App/>, document.getElementById("uiemlms_ui_root"));
}

