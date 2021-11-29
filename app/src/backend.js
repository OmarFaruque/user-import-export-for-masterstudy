import React from "react"
import {HashRouter, Route, Switch} from 'react-router-dom'
import ReactDOM from "react-dom"
import style from './backend.scss'
import FetchWP from './utils/fetchWP'
import CSVReader from 'react-csv-reader'
import CsvDownloader from 'react-csv-downloader'
import ReactTooltip from "react-tooltip"


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
            upload_complete: false, 
            csvArray: false, 
            csv_columns: [
                {
                    id: 'user_id',
                    displayName: __('User ID', 'user-import-export-mlms')
                }, 
                {
                    id: 'user_name',
                    displayName: __('Username', 'user-import-export-mlms'), 
                }, 
                {
                    id: 'email',
                    displayName: __('Email', 'user-import-export-mlms'), 
                }, 
                {
                    id: 'role',
                    displayName: __('Role', 'user-import-export-mlms'), 
                }, 
                {
                    id: 'first_name',
                    displayName: __('First Name', 'user-import-export-mlms'), 
                },
                {
                    id: 'last_name',
                    displayName: __('Last Name', 'user-import-export-mlms'), 
                }, 
                {
                    id: 'degree',
                    displayName: __('Degree', 'user-import-export-mlms'), 
                }, 
                {
                    id: 'expertise',
                    displayName: __('Expertise', 'user-import-export-mlms'), 
                }, 
                {
                    id: 'submission_date',
                    displayName: __('Submission Date', 'user-import-export-mlms'), 
                }, 
                {
                    id: 'answer_date',
                    displayName: __('Answer Date', 'user-import-export-mlms'), 
                }, 
                {
                    id: 'message',
                    displayName: __('Message', 'user-import-export-mlms'), 
                }, 
                {
                    id: 'password',
                    displayName: __('Password', 'user-import-export-mlms'), 
                }, 
                {
                    id: 'send_reset_link',
                    displayName: __('Send Password Reset Link', 'user-import-export-mlms'), 
                }, 
                {
                    id: 'course_id',
                    displayName: __('Course ID', 'user-import-export-mlms'), 
                }, 
                {
                    id: 'date_of_enrollment',
                    displayName: __('Date of Enrollment', 'user-import-export-mlms'), 
                }, 
                {
                    id: 'course_progress',
                    displayName: __('Course Progress', 'user-import-export-mlms'), 
                },
                {
                    id: 'completed_lesson_id',
                    displayName: __('Course Progress', 'user-import-export-mlms'), 
                }, 
                {
                    id: 'reset_progress',
                    displayName: __('Reset Progress', 'user-import-export-mlms'), 
                }, 
                {
                    id: 'address',
                    displayName: __('Address', 'user-import-export-mlms'), 
                }, 
                {
                    id: 'organization',
                    displayName: __('Organization', 'user-import-export-mlms'), 
                }, 
                {
                    id: 'contact_number',
                    displayName: __('Contact Number', 'user-import-export-mlms'), 
                }, 
                {
                    id: 'order_by',
                    displayName: __('Order By', 'user-import-export-mlms'), 
                }, 
                {
                    id: 'order_no',
                    displayName: __('Order No', 'user-import-export-mlms'), 
                }, 
                {
                    id: 'order_key',
                    displayName: __('Order Key', 'user-import-export-mlms'), 
                },
                {
                    id: 'order_status',
                    displayName: __('Order Status', 'user-import-export-mlms'), 
                }, 
                {
                    id: 'order_date',
                    displayName: __('Order Date', 'user-import-export-mlms'), 
                }, 

            ]
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


    componentDidMount() {
        this.getConfig()
    }

    componentWillUnmount() {}


    getConfig(){
        this.setState({
            loader: true
        });

        this.fetchWP.get('userdata').then(json => {

            this.setState({
                loader: false, 
                csvArray: json
            });
        }).catch(error => {
            console.log('error is: ' , error);
        })
    }

    handleUpdate = () => {
        this.setState({
            loader: true
        });
        const {csv_data} = this.state;

        this.fetchWP.post('save', {data: csv_data}).then(json => {
            this.setState({
                loader: false, 
                upload_complete: true
            });
        }).catch(error => {
            console.log('error is: ' , error);
        })
    }



    render() {
        const {csvArray, upload_complete} = this.state;
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


                {/* Middle Part */}
                <div>
                        <div className={style.right_inner}>
                            <label>{__('Export User Data as CSV:','user-import-export-mlms')}</label>
                            
                            <CsvDownloader 
                                filename="user-import-export-mlms" 
                                datas={csvArray} 
                                // separator=";"
                                wrapColumnChar=""
                                columns={this.state.csv_columns}
                                >
                                <button className={style.export} data-tip data-for="exporttoCSVTip" onClick={ (e)=>{e.preventDefault()} }><span className={style.svgIcon + " dashicons dashicons-database-export"}></span>
                                {__('Export to CSV', 'user-import-export-mlms')}
                                </button>
                                <ReactTooltip id="exporttoCSVTip" place="top" effect="solid">
                                            {__('Table row export to CSV.', 'user-import-export-mlms')}
                                </ReactTooltip>
                            </CsvDownloader>
                        </div>
                </div>

                {/* Right Part */}
                <div>
                        <div className={style.right_inner}>
                            <label>{__('Download CSV Demo File:','user-import-export-mlms')}</label>
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

