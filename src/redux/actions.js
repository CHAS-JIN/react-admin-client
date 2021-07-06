/* 
包含多个action creator 函数的模块
同步action：对象{type:xxx,data:xxx}
异步action：函数 dispatch => {}
*/
import { message } from 'antd'
import { reqLogin } from '../api'
import storageUtils from '../utils/storageUtils'
import { SET_HEAD_TITLE, RECEIVE_USER, RESET_USER } from './action-type'

// 设置头部标题的同步action
export const setHeadTitle = (headTitle) => ({ type: SET_HEAD_TITLE, data: headTitle })

// 接收用户数据的同步action
// export const receiveUser = (user) => ({type: RECEIVE_USER, user})

// 登录的异步action
export const login = (username, password) => {
    return async dispatch => {
        // 1.执行异步ajax请求
        const result = await reqLogin(username, password)
        // 2.1.成功，分发成功的同步action
        if (result.status === 0) {
            // 接收user数据
            const user = result.data
            // 保存到local中
            storageUtils.setUser(user)
            // 分发接收用户的同步action
            dispatch({ type: RECEIVE_USER, user })
            message.success('登录成功！')
        } else if (result.status === 1) { // 登录失败
            message.error(result.msg);
        }
    }
}

// 退出登录的同步action
export const logout = () => {
    storageUtils.removeUser()
    return {type: RESET_USER}
}