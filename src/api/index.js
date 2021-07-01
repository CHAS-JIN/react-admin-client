// 包含应用中所有接口的函数模块
import jsonp from 'jsonp'
import ajax from './ajax'
import { message } from 'antd'

// 登录接口
export const reqLogin = (username, password) => ajax('/login', { username, password }, 'POST')

// 添加用户接口
export const reqAddUser = (user) => ajax('/manage/user/add', user, 'POST')

// 获取一级/二级分类列表
export const reqCategorys = (parentId) => ajax('/manage/category/list', {parentId})

// 添加分类
export const reqAddCategory = (categoryName, parentId) => ajax('/manage/category/add', {categoryName,parentId}, 'POST')

// 更新分类
export const reqUpdateCategory = ({categoryName, categoryId}) => ajax('/manage/category/update', {categoryName,categoryId}, 'POST')

// 获取商品列表
export const reqProducts = (pageNum,pageSize) => ajax('/manage/product/list', {pageNum,pageSize})

// 搜索商品
export const reqSearchProducts = (pageNum,pageSize,searchType,keyWord) => ajax('/manage/product/search', {pageNum,pageSize,[searchType]:keyWord})

// 添加商品
export const reqAddProduct = () => ajax('/manage/product/add', {}, 'POST')

// 更新商品
export const reqUpdateProduct = () => ajax('/manage/product/update', {}, 'POST')

// 更新商品状态
export const reqUpdateProductStatus = () => ajax('/manage/product/updateStatus', {}, 'POST')

// 获取天气
export const reqWeather = () => {

    return new Promise((resolve, reject) => {
        const url = `https://restapi.amap.com/v3/weather/weatherInfo?key=64041e2a8db8c0048743d03700b1351f&city=330381&extensions=base&output=JSON`
        jsonp(url, {}, (err, res) => {
            if (res.status === '1') {
                const weather = (res.lives[0].weather)
                resolve(weather)
            } else {
                message.error('获取天气失败')
            }
        })
    })


}