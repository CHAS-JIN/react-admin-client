import React, { Component } from 'react'
import { Form, Input, Select } from 'antd'
import { createRef } from 'react';

const { Item } = Form
const { Option } = Select

export default class AddForm extends Component {
    addFormRef = createRef()

    componentDidMount(){
        this.props.setForm(this.addFormRef.current)
    }

    render() {
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 18 },
        }
        const roles = this.props.roles
        return (
            <Form
                ref={this.addFormRef}
                {...formItemLayout}
            >
                <Item
                    label='用户名'
                    name='username'
                    rules={[
                        {
                            required: true,
                            message: '用户名不能为空！',
                        },
                        {
                            min: 4,
                            message: '用户名最少4位！'
                        },
                        {
                            max: 12,
                            message: '用户名最多12位！'
                        },
                        {
                            pattern: /^[a-zA-Z0-9_]+$/,
                            message: '用户名必须是英文、数字或下划线组成！'
                        }
                    ]}
                >
                    <Input />
                </Item>

                <Item
                    label='密码'
                    name='password'
                    rules={[
                        {
                            required: true,
                            message: '密码不能为空！',
                        },
                        {
                            validator: (_, value) => {
                                if (!value) {
                                    return Promise.reject(new Error('请输入密码！'))
                                } else if (value.length < 4) {
                                    return Promise.reject(new Error('密码最少4位！'))
                                } else if (value.length > 12) {
                                    return Promise.reject(new Error('密码最多12位！'))
                                } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
                                    return Promise.reject(new Error('密码必须是英文、数字或下划线组成！'))
                                }
                                return Promise.resolve()
                            }
                        },
                    ]}
                >
                    <Input type='password'/>
                </Item>

                <Item
                    label='手机号'
                    name='phone'
                    rules={[
                        {
                            required: true,
                            message: "手机号不能为空！"
                        },
                        {
                            pattern: /^1[3456789]\d{9}$/,
                            message: "请输入正确的手机号！"
                        }
                    ]}
                >
                    <Input type='tel' />
                </Item>

                <Item
                    label='邮箱'
                    name='email'
                    rules={[
                        {
                            required: true,
                            message: "邮箱不能为空！"
                        },
                        {
                            pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
                            message: "请输入正确的邮箱！"
                        }
                    ]}
                >
                    <Input type='email' />
                </Item>

                <Item
                    label='角色'
                    name='role_id'
                    rules={[
                        {
                            required: true,
                            message: "所属角色不能为空！"
                        }
                    ]}
                >
                    <Select placeholder='请选择用户所属角色'>
                        {
                            roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)
                        }
                    </Select>
                </Item>
            </Form>
        )
    }
}
