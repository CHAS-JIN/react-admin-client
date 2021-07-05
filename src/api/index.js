// 包含应用中所有接口的函数模块
import jsonp from 'jsonp'
import ajax from './ajax'
import { message } from 'antd'

// 登录接口
export const reqLogin = (username, password) => ajax('/login', { username, password }, 'POST')

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

// 更新商品状态
export const reqUpdateStatus = (productId,status) => ajax('/manage/product/updateStatus', {productId,status}, 'POST')

// 获取类名
export const reqCategoryName = (categoryId) => ajax('/manage/category/info',{categoryId})

// 更新商品
// export const reqUpdateProduct = (product) => ajax('/manage/product/update', product, 'POST')
// 添加商品
// export const reqAddProduct = (product) => ajax('/manage/product/update', product, 'POST')

// 添加或更新商品
export const reqAddOrUpdateProduct = (product) => ajax('/manage/product/' + (product._id?'update':'add'), product, 'POST')






// 获取角色列表
export const reqRoles = () => ajax('/manage/role/list',{})

// 添加角色
export const reqAddRole = (roleName) => ajax('/manage/role/add', {roleName}, 'POST')

// 更新角色
export const reqUpdateRole = (_id,menus,auth_time,auth_name) => ajax('/manage/role/update', {_id,menus,auth_time,auth_name}, 'POST')






// 获取用户列表
export const reqUsers = () => ajax('/manage/user/list',{})

// 删除用户
export const reqDeleteUser = (userId) => ajax('/manage/user/delete',{userId},'POST')

// 添加用户
export const reqAddUser = (user) => ajax('/manage/user/add', user, 'POST')

// 修改用户
export const reqUpdateUser = (user) => ajax('/manage/user/update', user, 'POST')


