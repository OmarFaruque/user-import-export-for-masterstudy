import React from "react";
import ReactDOM from "react-dom";

import FetchWP from './utils/fetchWP';
import Acoloader from './utils/acoloader';
import Licence from './pages/Licence';
import Methodlists from './pages/Methodlists'


const { __ } = window.wp.i18n;

class Backend extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: true, 
            instance_id: false, 
            zone_id: false
        }

        this.fetchWP = new FetchWP({
            restURL: window.acotrs_object.root,
            restNonce: window.acotrs_object.api_nonce,
        });
    }


    /**
     * React Ready event
     */
    componentDidMount() {
        this.fetchData();
    }


    /**
     * Get configaration from DB
     */
    getConfig(){
        this.setState({
            loader: true,
        });
      
        const {config} = this.state;
        
        this.fetchWP.get('initial_config/')
            .then(
                (json) => {
                    this.setState({
                            loader: false,
                            licenced: json.licenced
                        });   
                })
                .catch(function(error) {
                    console.log('error', error);
                });
    }



    /**
     * Get Configaration And User role from DB
     */
    fetchData() {
        this.getConfig();
    }




    /**
     * 
     * @param {default event} e 
     * Set Licence Key
     */
    setLicenceKey = (e) => {
        this.setState(
            {
                licence_key: e.target.value
            }
        )
    }


    /**
     * 
     * @param {default} e 
     * Save Licence key to DB
     */
    saveLicenceKey = (e) => {
        e.preventDefault();
        let data = {
            licence_key : this.state.licence_key
        }
        this.fetchWP.post('update_licence_key/', data)
        .then(
            (json) => {
                this.setState(
                    {
                        licenced: json.licenced, 
                        error_msg: json.msg
                    }
                )
            }
        );    
    }


    /**
     * Render main component
     */
    render() {
        const {licenced, error_msg, zone_id} = this.state;

        if(typeof licenced == 'undefined'){
            return(
                <Acoloader />
            )
        }
        

        if(typeof licenced != 'undefined' && !licenced){
            return(
                <Licence setLicenceKey={this.setLicenceKey} error_msg={error_msg} licence_key={this.state.licence_key} saveLicenceKey={this.saveLicenceKey} />
            )
        } 

        return <Methodlists />
    }
}

if (document.getElementById("acotrs_ui_root")) {
    ReactDOM.render(<Backend/>, document.getElementById("acotrs_ui_root"));
}

