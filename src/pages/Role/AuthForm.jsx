import React, { Component } from 'react'
import { Tree, Input, Form } from 'antd';
import menuList from '../../config/menuConfig';

const { Item } = Form

export default class UpdateRole extends Component {

    constructor(props) {
        super(props)
        // 初始化树
        // debugger
        let treeData = this.getTreeData(menuList)
        const menus = props.role.menus
        treeData = [{
            title: '平台权限',
            key:'00',
            children:treeData
        }]
        this.state = {
            checkedKeys: menus,
            selectedKeys: [],
            treeData
        }
    }

    // 获取树节点
    getTreeData = (menuList) => {
        return menuList.reduce((pre, item) => {
            if (item.children) {
                pre.push(
                    {
                        title: item.title,
                        key: item.key,
                        children: item.children
                    }
                )
            } else {
                pre.push(
                    {
                        title: item.title,
                        key: item.key
                    }
                )
            }
            return pre
        }, [])

    }

    onCheck = (checkedKeysValue) => {
        this.setState({ checkedKeys: checkedKeysValue })
    }

    render() {
        const { name } = this.props.role
        const { treeData,checkedKeys,selectedKeys } = this.state
        return (
            <>
                <Item label='角色名称'>
                    <Input value={name} disabled />
                </Item>
                <Item>
                    <Tree
                        checkable
                        onExpand={this.onExpand}
                        onCheck={this.onCheck}
                        checkedKeys={checkedKeys}
                        onSelect={this.onSelect}
                        selectedKeys={selectedKeys}
                        treeData={treeData}
                        defaultExpandAll={true}
                    />
                </Item>
            </>
        )
    }
}
