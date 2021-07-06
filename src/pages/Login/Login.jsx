import React from 'react'
// 解决history不能跳转问题
import { withRouter, Redirect } from 'react-router-dom';
import {connect} from 'react-redux';

import {login} from '../../redux/actions'

import './index.less';
import logo from '../../assets/images/logo.png'
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

function Login(props) {

    const hasUser = props.user

    // 如果已经登录，跳转到Admin
    if (hasUser && hasUser._id) {
        return <Redirect to="/home" />
    }

    // 提交表单并登录
    const onFinish = /* async */ (values) => {
        const { username, password } = values
        props.login(username,password)
        // 简化Promise对象使用，以同步编码方式(没有回调函数)实现异步流程
        // 得到Promise异步执行成功的Value
        /* const result = await reqLogin(username, password)
        if (result.status === 0) { // 登录成功
            message.success('登录成功！')
            const user = result.data
            // 保存到内存中
            memoryUtils.user = user
            // 保存到缓存中
            storageUtils.setUser(user)
            // 跳转到管理界面
            props.history.replace('/home')
        } else if (result.status === 1) { // 登录失败
            message.error(result.msg);
        } */
    };

    return (
        <div className='login'>
            <header className='login-header'>
                <img src={logo} alt="logo" />
                <span>谷粒后台管理系统</span>
            </header>

            <section className='login-content'>
                <h1>用户登录</h1>
                <Form
                    name="normal_login"
                    className="login-form"
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        // 声明式验证
                        rules={[
                            {
                                required: true,
                                message: '请输入用户名！',
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
                        <Input
                            prefix={<UserOutlined className="site-form-item-icon" />}
                            placeholder="用户名"
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        // 自定义验证
                        rules={[
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
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="密码"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            登录
                        </Button>
                    </Form.Item>
                </Form>

            </section>
        </div>
    )
}

export default connect(
    state => ({user:state.user}),
    {login}
)(withRouter(Login))