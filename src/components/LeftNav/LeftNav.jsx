import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

import { setHeadTitle } from '../../redux/actions';

import './index.less'
import logo from "../../assets/images/logo.png"
import { Menu } from 'antd';
import * as Icon from '@ant-design/icons';

import menuList from '../../config/menuConfig';

const { SubMenu } = Menu;

class LeftNav extends Component {

    constructor(props) {
        super(props)
        // 初始化菜单栏
        this.menuNodes = this.getMenuNodes(menuList)
    }

    // 判断当前登录用户的权限
    hasAuth = (item) => {
        const { key, isPublic } = item

        const menus = this.props.user.role.menus
        const username = this.props.user.username
        /*
        1. 如果当前用户是admin
        2. 如果当前item是公开的
        3. 当前用户有此item的权限: key有没有menus中
         */
        if (username === 'admin' || isPublic || menus.indexOf(key) !== -1) {
            return true
        } else if (item.children) { // 4. 如果当前用户有此item的某个子item的权限
            this.hasAuth(item.children)
        }

        return false
    }

    getMenuNodes = (menuList) => {
        const path = this.props.location.pathname
        return menuList.map(item => {
            // 是否有该页面权限
            if (this.hasAuth(item)) {
                // 没有子菜单
                if (!item.children) {
                    // 该菜单是否是当前菜单（刷新后保持）
                    if (item.key===path || path.indexOf(item.key) === 0) {
                        // 更新redux中的headTitle状态，设置标题
                        this.props.setHeadTitle(item.title)
                    }

                    return (
                        <Menu.Item key={item.key} icon={React.createElement(Icon[item.icon])}>
                            {/* onClick 利用 redux 调用 setHeadTitle 设置标题 */}
                            <Link to={item.key} onClick={() => this.props.setHeadTitle(item.title)}>{item.title}</Link>
                        </Menu.Item>
                    )
                } else {
                    // 有子菜单
                    const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)// 在子路由界面时打开子菜单
                    if (cItem) {
                        this.openKey = item.key
                    }

                    return (
                        <SubMenu key={item.key} icon={React.createElement(Icon[item.icon])} title={item.title}>
                            {
                                // 递归调用加载子菜单项
                                this.getMenuNodes(item.children)
                            }
                        </SubMenu>
                    )
                }
            } else {
                return null
            }

        })
    }

    /*
    在第一次render()之前执行一次
    为第一个render()准备数据(必须同步的)
     */
    // UNSAFE_componentWillMount() {
    //     this.menuNodes = this.getMenuNodes(menuList)
    // }

    render() {
        // 当前请求的路由路径
        let path = this.props.location.pathname
        // 当前请求的是商品或其子路由界面
        if (path.indexOf('/product') === 0) {
            path = '/product'
        }
        const openKey = this.openKey || path

        return (
            <div className='left-nav'>

                <Link to={'/home'} className='left-nav-header'>
                    <img src={logo} alt="logo" />
                    <h1>谷粒后台</h1>
                </Link>

                <Menu
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                    mode="inline"
                    theme="dark"
                >
                    {
                        this.menuNodes
                    }
                </Menu>
            </div>
        );
    }
}


export default connect(
    state => ({user:state.user}),
    { setHeadTitle }
)(withRouter(LeftNav))