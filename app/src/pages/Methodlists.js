import React, {Component} from "react"
import FetchWP from '../utils/fetchWP'
import App from '../pages/App'
import { Route, HashRouter, Switch } from "react-router-dom"
import ModallistWrap from './ModallistWrap'


const { __ } = window.wp.i18n;


class Methodlists extends Component {

    constructor(props) {
        super(props);
        this.state = {
            config: false, 
            refresh: false,
            methods: [], 
            instance_id: false, 
            zone_modal: false,
            selected: [], 
            selected_zone: 0
        };

        this.fetchWP = new FetchWP({
            restURL: window.acotrs_object.root,
            restNonce: window.acotrs_object.api_nonce,
        });
    }

 
    /**
     * React Ready event
     */
    componentDidMount() {}


    /**
     * @param {default event} e
     * Input handler
     */
    methodZoneController = (e) => {
        this.setState({
            selected_zone: e.target.value
        })
    }


    render(){
        let {methods, instance_id, selected, refresh, selected_zone} = this.state
        return (
        <>
        <HashRouter>
            <Switch>
                <Route
                    path="/"
                    exact
                    render={props =>
                        <ModallistWrap
                            selected={selected}
                            methods={methods}
                            refreshMethodLists={this.refreshMethodLists}
                            onChange={this.methodZoneController}
                            selected_zone={selected_zone}
                        />
                    }
                />

                <Route 
                    path="/:instance_id/*"
                    render={props =>
                        <App 
                            instance_id={instance_id} 
                            zone_id={selected_zone} 
                            refresh={refresh} 
                            onClick={this.refreshMethodLists} 
                            onChange={this.methodZoneController} 
                            {...props}
                        />
                    }
                />
            </Switch>
        </HashRouter>
        </>
    )
    }
}

export default Methodlists;


