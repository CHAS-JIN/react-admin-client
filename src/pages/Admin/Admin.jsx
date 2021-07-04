import React from 'react'
import memoryUtils from '../../utils/memoryUtils';
import { Redirect, Switch, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Header from '../../components/Header/Header';
import LeftNav from '../../components/LeftNav/LeftNav';
import Category from '../Category/Category';
import Home from '../Home/Home';
import Product from '../Product/Product';
import Role from '../Role/Role';
import User from '../User/User';
import Bar from '../Charts/Bar';
import Pie from '../Charts/Pie';
import Line from '../Charts/Line';
import Orders from '../Orders/Orders';
// import NotFound from '../NotFound/NotFound';

const { Content, Footer, Sider } = Layout;

export default function Admin() {

    const user = memoryUtils.user

    // 判断是否已经登录
    if (!user || !user._id) { // 如果内存中没有user ==> 未登录,则跳转至登录界面
        return <Redirect to="/login" />
    }

    return (
        <Layout style={{ minHeight: '100%' }}> {/* minHeight 避免footer和LeftNav高度异常 */}
            <Sider>
                <LeftNav />
            </Sider>
            <Layout>
                <Header />

                <Content style={{ margin: '20px', backgroundColor: 'white' }}>
                    <Switch>
                        <Route path='/home' component={Home} />
                        <Route path='/category' component={Category} />
                        <Route path='/product' component={Product} />
                        <Route path='/user' component={User} />
                        <Route path='/role' component={Role} />
                        <Route path='/charts/bar' component={Bar} />
                        <Route path='/charts/pie' component={Pie} />
                        <Route path='/charts/line' component={Line} />
                        <Route path='/orders' component={Orders} />
                        <Redirect from='/' to="/home" />
                    </Switch>
                </Content>

                <Footer style={{ textAlign: 'center' }}>
                    推荐使用谷歌浏览器，可以获得更佳页面操作体验
                </Footer>
            </Layout>
        </Layout>
    )
}
