import React, { Component } from 'react'
import { Form, Input, Select } from 'antd'
import { createRef } from 'react';

const { Item } = Form
const { Option } = Select

export default class UpdateForm extends Component {
    updateFormRef = createRef()

    componentDidMount(){
        this.props.setForm(this.updateFormRef.current)
    }

    render() {
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 18 },
        }
        const { username, phone, email, role_id } = this.props.user
        const roles = this.props.roles
        return (
            <Form
                {...formItemLayout}
                ref={this.updateFormRef}
            >
                <Item
                    label='用户名'
                    name='username'
                    initialValue={username}
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
                    label='手机号'
                    name='phone'
                    initialValue={phone}
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
                    initialValue={email}
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
                    initialValue={role_id}
                >
                    <Select>
                        {
                            roles.map(role =><Option key={role._id} value={role._id}>{role.name}</Option>)
                        }
                    </Select>
                </Item>
            </Form>
        )
    }
}
