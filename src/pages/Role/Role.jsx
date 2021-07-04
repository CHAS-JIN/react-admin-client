import React, { Component, createRef } from 'react';
import { Button, Card, message, Table, Modal, Input, Form } from 'antd';
import { PAGE_SIZE } from '../../utils/constant';
import { reqAddRole, reqRoles, reqUpdateRole } from '../../api';
import AuthForm from './AuthForm'
import memoryUtils from '../../utils/memoryUtils';
import {formateDate} from '../../utils/dateUtils'

const { Item } = Form
class Role extends Component {

    authFormRef = createRef()

    constructor(props) {
        super(props)
        this.initColumns()
    }

    addRoleRef = createRef()

    state = {
        roles: [],      // 所有角色的列表
        role: {},        // 选中的角色
        loading: false,  // 加载中？
        visible: 0       // Modal可见？0都不可，1创建角色，2设置角色权限
    }

    // 初始化列表
    initColumns = (params) => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name',
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render: formateDate
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: formateDate
            },
            {
                title: '授权人',
                dataIndex: 'auth_name',
            }
        ]
    }

    // 获取角色列表
    getRoles = async () => {
        this.setState({ loading: true })
        const result = await reqRoles()
        const { data: roles } = result
        this.setState({ loading: false })
        if (result.status === 0) {
            this.setState({ roles })
        } else {
            message.error('获取角色列表失败！')
        }
    }

    // 点击行的回调函数
    onRow = role => {
        return {
            onClick: event => {
                this.setState({ role })
            }
        }
    }

    // 添加角色
    addRole = async () => {
        const roleName = this.addRoleRef.current.getFieldValue('roleName')
        const result = await reqAddRole(roleName)
        if (result.status === 0) {
            message.success('创建角色成功！')
            this.setState({ visible: 0 })
            this.getRoles()
        } else {
            message.error('创建角色失败！')
        }
    }

    // 更新角色
    updateRole = async () => {
        const menus = this.authFormRef.current.state.checkedKeys
        const _id = this.state.role._id
        const auth_name = memoryUtils.user.username
        const auth_time = new Date().getTime()
        const result = await reqUpdateRole(_id, menus, auth_time, auth_name)
        if (result.status === 0) {
            message.success('更新角色成功！')
            this.setState({ visible: 0 })
            this.getRoles()
        } else {
            message.error('更新角色失败！')
        }
    }

    componentDidMount() {
        this.getRoles()
    }

    render() {
        const { roles, role, loading, visible } = this.state
        const title = (
            <>
                <Button
                    type='primary'
                    style={{ marginRight: '10px' }}
                    onClick={() => this.setState({ visible: 1 })}
                >
                    创建角色
                </Button>

                <Button
                    type='primary'
                    disabled={!role._id}
                    onClick={() => this.setState({ visible: 2 })}
                >
                    设置角色权限
                </Button>
            </>
        )

        return (
            <Card
                title={title}
            >
                <Table
                    dataSource={roles}
                    columns={this.columns}
                    pagination={{ defaultPageSize: PAGE_SIZE }}
                    rowKey='_id'
                    loading={loading}
                    onRow={this.onRow}
                    rowSelection={{
                        type: 'radio',
                        selectedRowKeys: [role._id]
                    }}
                />

                <Modal
                    title="创建角色"
                    centered
                    visible={visible === 1 ? true : false}
                    onOk={this.addRole}
                    onCancel={() => this.setState({ visible: 0 })}
                    width={500}
                    okText='确认'
                    cancelText='取消'
                    destroyOnClose={true}
                >
                    <Form
                        ref={this.addRoleRef}
                    >
                        <Item
                            label='角色名称'
                            name="roleName"
                            rules={[
                                {
                                    required: true,
                                    message: "请输入角色名称！"
                                }
                            ]}>
                            <Input placeholder='请输入角色名称' />
                        </Item>
                    </Form>
                </Modal>

                <Modal
                    title="设置角色权限"
                    centered
                    visible={visible === 2 ? true : false}
                    onOk={this.updateRole}
                    onCancel={() => this.setState({ visible: 0 })}
                    width={500}
                    okText='确认'
                    cancelText='取消'
                    destroyOnClose={true}
                >
                    <AuthForm ref={this.authFormRef} role={role} />
                </Modal>

            </Card>
        );
    }
}

export default Role;
