import React, { Component } from 'react'
import './index.less'
import logo from "../../assets/images/logo.png"
import { Link, withRouter } from 'react-router-dom';
import { Menu } from 'antd';
import menuList from '../../config/menuConfig';

const { SubMenu } = Menu;
// const iconBC = (name) => {
//     console.log(name);
//     return React.createElement(Icon[name])
// }

class LeftNav extends Component {


    getMenuNodes = (menuList) => {
        const path = this.props.location.pathname
        return menuList.map(item => {
            // 没有子菜单
            if (!item.children) {
                return (
                    <Menu.Item key={item.key} /* icon={iconBC(item.icon)} */>
                        <Link to={item.key}>{item.title}</Link>
                    </Menu.Item>
                )
            } else {
                // 有子菜单

                const cItem = item.children.find(cItem => cItem.key === path)
                if (cItem) {
                    this.openKey = item.key
                }

                return (
                    <SubMenu key={item.key} /* icon={iconBC(item.icon)} */ title={item.title}>
                        {
                            // 递归调用加载子菜单项
                            this.getMenuNodes(item.children)
                        }
                    </SubMenu>
                )
            }
        })
    }

    /*
    在第一次render()之前执行一次
    为第一个render()准备数据(必须同步的)
     */
    UNSAFE_componentWillMount() {
        this.menuNodes = this.getMenuNodes(menuList)
    }

    render() {
        // 当前请求的路由路径
        let path = this.props.location.pathname
        const openKey = this.openKey
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


export default withRouter(LeftNav)