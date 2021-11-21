import React, {Component} from "react"
import Modal from 'react-awesome-modal'
import FetchWP from '../utils/fetchWP'
import style from './Methodlists.scss'
import Acoloader from '../utils/acoloader'
import TextInput from "../components/TextInput"
import SelectInput from "../components/SelectInput" 
// import { Redirect, Router } from "react-router"
import { Redirect, Route, HashRouter, Switch, NavLink } from "react-router-dom"
import ReactTooltip from "react-tooltip"

const { __ } = window.wp.i18n;




const Singlemethod = (props) => {
    return(
        <>
            <div className={style.tr}>
                <div>
                    <TextInput
                        type="checkbox"
                        name="item_select"
                        value={props.index}
                        onChange={props.changeHandler}
                        defaultChecked={props.selected.includes(props.index.toString()) ? true : false}
                    />
                </div>
                <div>
                    <NavLink className={style.titleNav} exact activeClassName={style.active} to={`/${props.method.instance_id}/general`}>
                        {props.method.title}
                    </NavLink>
                </div>
                <div>
                    {props.method.no_of_options}
                </div>
                <div>
                    {props.method.zone_name}
                </div>
                <div>
                    <label className={style.switch}>
                        <input type="checkbox" 
                            defaultChecked={props.method.enabled == 'yes' ? true : false} 
                            value={1} 
                            name="enabled" 
                            onClick={(e) => props.changeHandler(e, props.index)} 
                            />
                        <span className={style.slider}></span>
                    </label>
                </div>
                <div>
                    <HashRouter>
                        <NavLink data-tip data-for="quickEdit" className="dashicons dashicons-edit-large" exact activeClassName={style.active} to={`/${props.method.instance_id}/general`}>
                        </NavLink>
                        <ReactTooltip id="quickEdit" place="bottom" effect="solid">
                                    {__('Quick Edit.', 'advanced-table-rate-shipping-for-woocommerce')}
                        </ReactTooltip>
                    </HashRouter>

                    <span onClick={(e) => props.deleteThis(e, props.index)} data-tip data-for="deleteMethod" className="dashicons dashicons-trash"></span>
                        <ReactTooltip id="deleteMethod" place="bottom" effect="solid">
                                    {__('Delete this Options.', 'advanced-table-rate-shipping-for-woocommerce')}
                        </ReactTooltip>
                </div>
            </div>
        </>
    )
}

const Blankmethods = (props) => {
    return(
        <>
         <div className={style.tr}>
            <div className={style.optionBody}>
                <div className={`${style.d_flex} ${style.blankRow}`}>
                    <div className={style.blankItem}>
                        <div className={style.icon}>
                            <span></span>
                        </div>
                        <p>{__('No shipping method have been added yet.', 'advanced-table-rate-shipping-for-woocommerce')}</p>
                        <button  onClick={props.addNewMethod}>
                            <span className="dashicons dashicons-plus-alt2"></span>
                            {__('Add New Method', 'advanced-table-rate-shipping-for-woocommerce')}
                        </button>
                    </div>
                </div>
            </div>
         </div>
        </>
    )
}

//Modal List Wrap 
export default class ModallistWrap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            config: false, 
            refresh: false,
            methods: [], 
            instance_id: false, 
            zone_modal: false,
            selected: [], 
            loader: false,
            zones: {},
            selected_zone: 0
        };

        this.fetchWP = new FetchWP({
            restURL: window.acotrs_object.root,
            restNonce: window.acotrs_object.api_nonce,
        });

        
        this.changeHandler = this.changeHandler.bind(this)
        this.deleteSelectedZone = this.deleteSelectedZone.bind(this)
        this.addNewMethod = this.addNewMethod.bind(this)
    }

    

    componentDidMount() {
        this.fetchData();
    }

    fetchData = () => {
        this.getConfig()
    }



    /**
     * 
     * @param {default event} e 
     * @return success message
     */
     deleteSelectedZone = (e) => {
        e.preventDefault()
        let {selected, methods} = this.state
        selected.sort(function(a, b){return b-a})

        let post_methods = selected.map((k, v) => {
            return methods[k].instance_id
        })


        let data = {
            instance_id: post_methods
        }

        this.fetchWP.post('delete_methods/', data)
            .then(
                (json) => {
                    if(typeof json.msg != 'undefined' && json.msg == 'success'){                        
                        selected.map((k, v) => {
                            methods.splice(k, 1)
                        })
                        this.setState({
                            methods: methods
                        })
                    }
            })
            .catch(function(error) {
                    console.log('error', error);
            })
        
    }




    changeHandler = (e, index = false) => {
        let {methods, selected} = this.state
        
        switch(e.target.name){
            case 'enabled':
                methods[index].enabled = methods[index].enabled == 'yes' ? 'no' : 'yes'
                let data = {
                    instance_id: methods[index].instance_id, 
                    enabled: methods[index].enabled
                }

                this.fetchWP.post('change_shipping_option_status/', data)
                .then(
                    (json) => {
                        if(json == 'success'){
                            this.setState({
                                methods:methods
                            })
                        }
                })
                .catch(function(error) {
                    console.log('error', error);
                });
            break;
            case 'select_all':
                selected = selected.length <  methods.length ? Object.keys(methods) : []
                this.setState({selected:selected})
            break;
            case 'item_select':
                selected.includes(e.target.value) ? selected.splice(selected.indexOf(e.target.value), 1) :  selected.push(e.target.value)
                this.setState({selected:selected})
            break;
        }
    }
    //Initial config
    getConfig = () =>{
        this.setState({
            loader: true
        })
        
        const data = {
            method_id: acotrsshipping_settings.method_id
        }
        
        this.fetchWP.post('listsof_zone_methods/', data)
            .then(
                (json) => {
                    this.setState({
                        loader: false, 
                        zones: json.zones, 
                        instance_id: false,
                        methods: json.lists
                    })
                    
                })
                .catch(function(error) {
                    console.log('error', error);
                });
    }




    refreshMethodLists = (e) => {
        this.setState({
            refresh: true
        })
        
        this.fetchWP.get('listsof_zones/')
            .then(
                (json) => {
                    this.setState({
                        zones: json.zones,
                        refresh: false
                    })
                })
                .catch(function(error) {
                    console.log('error', error);
                });
    }


    /**
     * 
     * @param {default event} e 
     * return bullian
     */
    openEditZoneModule = (e) => {
        let {zone_modal} = this.state
        this.setState({
            zone_modal: zone_modal ? false : true
        })
    }



    /**
     * @param {default event} e
     * Add New methods
     */
    addNewMethod = (e) => {
        e.preventDefault();
        let {selected_zone} = this.props
        const data = {
            method_id : acotrsshipping_settings.method_id, 
            zone_id: selected_zone
        }


        this.fetchWP.post('add_new_method/', data)
            .then(
                (json) => {
                    if(typeof json.msg != 'undefined' && json.msg == 'success'){
                        this.setState({
                            instance_id: json.instance_id,
                            loader: false,
                            zone_modal: false
                        })
                    }
            })
            .catch(function(error) {
                    console.log('error', error);
            })
    }




    /**
     * 
     * @param {Default Event} e 
     * @return true/false
     */
    selectShippingZone = (e) => {
        e.preventDefault()
        let {zone_modal, zones} = this.state
        this.setState({
            zone_modal: zone_modal ? false : true,
            selected_zone: Object.keys(zones)[0] 
        })
        
    }


    /**
      * 
      * @param {default event} e 
      * @param {instance_id} id 
      * @purpose   delete specific shipping option by id
      */
    deleteThis = (e, index = false) => {
        let {methods} = this.state

        let data = {
            instance_id: methods[index].instance_id
        }

        
        this.fetchWP.post('delete_shipping_option/', data)
            .then(
                (json) => {
                    if(typeof json.msg != 'undefined' && json.msg == 'success'){
                        methods.splice(index, 1)
                        
                        this.setState({
                            methods: methods
                        })
                        
                    }
            })
            .catch(function(error) {
                    console.log('error', error);
            })
     }

    
    

    render(){
        let {loader, zone_modal, methods, zones, refresh, instance_id, selected} = this.state
        if(loader === true) return <Acoloader />
        
        return(
            <>
            
            <Route exact path="/" render={() => (
                instance_id ? <Redirect to={`/${instance_id}/general`}  /> : (
                    <>
                        {/* New Method & title edit modal */}
                        <div className={style.modalWrap}>
                            <Modal visible={zone_modal} width="500" height="300" effect="fadeInUp"  onClickAway={this.openEditZoneModule}>
                                <div className={style.text_left}>
                                    <div>
                                        <h2>{__('Add New Shipping Method', 'advanced-table-rate-shipping-for-woocommerce')}
                                            <a href="#" onClick={this.openEditZoneModule}>
                                                <span>
                                                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-x" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                                                    </svg>
                                                </span>
                                            </a>
                                        </h2>
                                        <p>{__('Select Shipping Zone', 'advanced-table-rate-shipping-for-woocommerce')}</p>
                
                                        {
                                            typeof zones != 'undefined' && (
                                                <>
                                                    <SelectInput 
                                                        type="select"
                                                        name="selected_zone"
                                                        onClick={this.refreshMethodLists}
                                                        options={zones}
                                                        refresh={refresh}
                                                        onChange={this.props.onChange}
                                                    />
                                                </>
                                            )
                                        }
                
                
                                        <a target='_blank' href={`${window.acotrs_object.base_url}admin.php/?page=wc-settings&tab=shipping&zone_id=new`} className={style.addNewShingMethod} >
                                            {__('Add New Shipping Zone', 'advanced-table-rate-shipping-for-woocommerce')}
                                        </a>
                
                                        <button onClick={this.addNewMethod}>
                                            {__('Done', 'advanced-table-rate-shipping-for-woocommerce')}
                                        </button>
                                    </div>
                                </div>
                            </Modal>
                        </div>
                
                        <div className={style.methodListsWrap}>
                            <div>
                                <div>
                                    <div className={style.header}>
                                        <div>
                                            <h2>{__('Shipping Methods', 'advanced-table-rate-shipping-for-woocommerce')}</h2>
                                        </div>
                                        <div>
                                            
                                            {
                                                (selected.length > 0) && (
                                                    <button className={style.deleteAll} onClick={(e) => this.deleteSelectedZone(e)}>
                                                        <span className="dashicons dashicons-trash"></span>
                                                        {__('Delete Selected', 'advanced-table-rate-shipping-for-woocommerce')}
                                                    </button>
                                                )
                                            }
                
                                            <button onClick={this.selectShippingZone}>
                                                <span className="dashicons dashicons-plus-alt2"></span>
                                                {__('New Method', 'advanced-table-rate-shipping-for-woocommerce')}
                                            </button>
                                        </div>
                                    </div>
                
                                    <div className={style.listbody}>
                                        <div className={style.table}>
                                            <div className={style.thead}>
                                                <div className={style.tr}>
                                                    <div>
                                                        <TextInput
                                                            type="checkbox"
                                                            name="select_all"
                                                            onChange={(e) => this.changeHandler(e)}
                                                            defaultChecked={methods.length == selected.length ? true : false}
                                                        />
                                                    </div>
                                                    <div>{__('Method Title', 'advanced-table-rate-shipping-for-woocommerce')}</div>
                                                    <div>{__('No. of Options', 'advanced-table-rate-shipping-for-woocommerce')}</div>
                                                    <div>{__('Zone', 'advanced-table-rate-shipping-for-woocommerce')}</div>
                                                    <div>{__('Status', 'advanced-table-rate-shipping-for-woocommerce')}</div>
                                                    <div></div>
                                                </div>
                                            </div>
                
                                            <div className={style.tbody}>
                                                {
                                                (() => {
                                                    if(methods.length > 0){
                                                            return(
                                                                <>
                                                                {
                                                                    methods.map((k, v) => {
                                                                        return(
                                                                            <Singlemethod 
                                                                                key={v} 
                                                                                index={v}
                                                                                method={k} 
                                                                                changeHandler={this.changeHandler}
                                                                                deleteThis={this.deleteThis}
                                                                                selected={selected}
                                                                            />
                                                                        )
                                                                    })
                                                                }
                                                                </>
                                                            )
                                                    }else{
                                                            return(
                                                                <>
                                                                    <Blankmethods addNewMethod={this.selectShippingZone} />
                                                                </>
                                                            ) 
                                                    }
                                                })()
                                                } 
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Banner */}
                            </div>
                        </div>
                    </>
                )
            )} />
                
            
             
            </>
        )
    }
}
