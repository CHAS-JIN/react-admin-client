import React, { Component } from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import ProductAddUpdate from './AddUpdate'
import ProductHome from './Home'
import ProductDetail from './Detail'

class index extends Component {
    render() {
        return (
            <Switch>
                <Route exact path='/product' component={ProductHome}/> {/* 完全匹配 */}
                <Route path='/product/addupdate' component={ProductAddUpdate}/>
                <Route path='/product/detail' component={ProductDetail}/>
                <Redirect to="/product" />
            </Switch>
        );
    }
}

export default index;
