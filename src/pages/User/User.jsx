import React, { Component } from 'react'
import { Card, Modal, Button, Table, message } from 'antd';
import { formateDate } from '../../utils/dateUtils';
import { reqUsers, reqDeleteUser, reqRoles, reqAddUser, reqUpdateUser } from '../../api/index'
import { PAGE_SIZE } from '../../utils/constant';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import UpdateForm from './UpdateForm';
import AddForm from './AddForm';

export default class User extends Component {


    constructor(props) {
        super(props)
        // 初始化列表
        this.initColumns()
        // 获取角色列表
        this.getRoles()
    }

    state = {
        users: [],
        user: {},    // 当前选中的user
        roles: [],   // 存放角色列表，匹配用户所属角色
        visible: 0, // Modal显示状态，0都不，1添加，2修改
    }


    // 设置列表
    initColumns = () => {
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username',
            },
            {
                title: '邮箱',
                dataIndex: 'email',
            },
            {
                title: '电话',
                dataIndex: 'phone',
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                render: formateDate
            },
            {
                title: '所属角色',
                dataIndex: 'role_id',
                render: (role_id) => {
                    const { roles } = this.state
                    const result = roles.find(item => item._id === role_id)
                    return result.name
                }
            },
            {
                title: '操作',
                dataIndex: '',
                render: (user) => (
                    <span>
                        <Button type='link' onClick={() => this.showUpdate(user)}>修改</Button>
                        <Button type='link' onClick={() => this.deleteUser(user)}>删除</Button>
                    </span>
                )
            }
        ]
    }

    // 获取用户列表
    getUsers = async () => {
        const result = await reqUsers()
        if (result.status === 0) {
            const users = result.data.users
            this.setState({ users })
        }
    }

    // 获取角色列表，匹配用户所属角色
    getRoles = async () => {
        const result = await reqRoles()
        const { data: roles } = result
        if (result.status === 0) {
            this.setState({ roles })
        }
    }

    // 删除用户
    deleteUser = (user) => {
        const { _id: userId, username } = user
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: `确认删除${username}吗？`,
            okText: '确认',
            cancelText: '取消',
            // 确认退出，删除数据并返回登录界面
            onOk: async () => {
                const result = await reqDeleteUser(userId)
                if (result.status === 0) {
                    message.success('删除成功！')
                    this.getUsers()
                }
            }
        });

    }

    // 显示添加Modal
    showAdd = () => {
        this.setState({ visible: 1 })

    }

    // 添加用户
    addUser = () => {
        this.form.validateFields().then(async values => {
            const { username, password, phone, email, role_id } = values
            const user = { username, password, phone, email, role_id }
            // 发请求添加
            const result = await reqAddUser(user)
            if (result.status === 0) {
                message.success('添加成功！')
                this.getUsers()
                // 隐藏窗口
                this.setState({ visible: 0 })
            }
        }).catch(e => {
            message.error('添加失败！')
        })
    }

    // 显示修改Modal
    showUpdate = (user) => {
        this.setState({
            visible: 2,
            user
        })
    }

    // 修改用户
    updateUser = () => {
        this.form.validateFields().then(async values => {
            const { username, phone, email, role_id } = values
            const {_id} = this.state.user
            const user = { _id, username, phone, email, role_id }
            // 发请求修改
            const result = await reqUpdateUser(user)
            if (result.status === 0) {
                message.success('修改成功！')
                this.getUsers()
                // 隐藏窗口
                this.setState({ visible: 0 })
            }
        }).catch(e => {
            message.error('修改失败！')
        })
    }

    componentDidMount() {
        this.getUsers()
    }

    render() {
        const { users, visible, user, roles } = this.state
        const title = (
            <Button type='primary' onClick={this.showAdd}>创建用户</Button>
        )
        return (
            <Card
                title={title}
            >
                <Table
                    rowKey='_id'
                    columns={this.columns}
                    dataSource={users}
                    pagination={{ defaultPageSize: PAGE_SIZE }}
                />

                <Modal
                    title="创建新用户"
                    centered
                    visible={visible === 1 ? true : false}
                    onOk={this.addUser}
                    onCancel={() => this.setState({ visible: 0 })}
                    width={500}
                    okText='确认'
                    cancelText='取消'
                    destroyOnClose={true}
                >
                    <AddForm setForm={form => this.form = form} roles={roles} />
                </Modal>

                <Modal
                    title="修改用户信息"
                    centered
                    visible={visible === 2 ? true : false}
                    onOk={this.updateUser}
                    onCancel={() => this.setState({ visible: 0 })}
                    width={500}
                    okText='确认'
                    cancelText='取消'
                    destroyOnClose={true}
                >
                    <UpdateForm setForm={form => this.form = form} user={user} roles={roles} />
                </Modal>
            </Card>
        )
    }
}
