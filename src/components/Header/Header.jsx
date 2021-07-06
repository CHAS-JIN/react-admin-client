import React, { useEffect, useState, useRef } from 'react'
import { withRouter } from 'react-router-dom';
import {connect} from 'react-redux';
import {logout} from '../../redux/actions';

import './index.less'
import { Modal, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons'

import { reqWeather } from '../../api';
import { formateDate } from '../../utils/dateUtils';

// UI 组件
function Header(props) {

    const [currentTime, setCurrentTime] = useState(formateDate(Date.now()))
    const [weather, setWeather] = useState('')
    const intervalRef = useRef()

    // 获取 username
    const username = props.user.username

    // 动态更新时间
    const getTime = () => {
        intervalRef.current = setInterval(() => {
            const currentTime = formateDate(Date.now())
            setCurrentTime(currentTime)
        }, 1000);
    }

    // 动态更新天气
    const getWeather = async () => {
        const weather = await reqWeather()
        setWeather(weather)
    }

    // 动态更新标题
    /* const getTitle = () => {
        const path = props.location.pathname
        let title
        menuList.forEach(item => {
            if (item.key === path) {
                title = item.title
            } else if (item.children) {
                const result = item.children.find(cItem => path.indexOf(cItem.key) === 0) // 子路由标题显示path.indexOf()===0
                if (result) {
                    title = result.title
                }
            }
        })
        return title
    } */
    // 利用redux读取标题
    const title = props.headTitle

    // 退出确认
    function logOut() {
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: '确认退出并回到登录界面吗？',
            okText: '确认',
            cancelText: '取消',
            // 确认退出，删除数据并返回登录界面
            onOk() {
                // 删除数据
                // storageUtils.removeUser()
                // memoryUtils.user = {}
                props.logout()
                // 返回登录界面
                props.history.replace('/login')
            }
        });

    }

    useEffect(() => {
        getTime()
        getWeather()
        // 清除定时器
        return () => clearInterval(intervalRef.current)
    })

    return (
        <div className='header'>
            <div className="header-top">
                <span>欢迎，{username}</span>
                <Button size='small' type='primary' onClick={logOut}>退出</Button>
            </div>

            <div className="header-bottom">
                <div className="header-bottom-left">
                    <span>{title}</span>
                </div>

                <div className="header-bottom-right">
                    <span>{currentTime}</span>
                    <span>{weather}</span>
                </div>
            </div>
        </div>
    )
}

// 容器组件
export default connect(
    state =>({
        headTitle:state.headTitle,
        user:state.user
    }),
    {logout}
)(withRouter(Header))
