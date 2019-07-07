/**
 * Created by LuoQuan on 2019/6/9.
 * 包含应用中所有接口请求函数的模块
 * 每个函数的返回值都是promise
 */
import jsonp from 'jsonp';
import {message} from 'antd';

import ajax from './ajax';

const weatherUrl = 'http://api.map.baidu.com/telematics/v3/weather?output=json&ak=3p49MVra6urFRGOT9s8UBWr2';

/*
 用户登录
 */
export const reqLogin = (username, password) => ajax('/login', {username, password}, 'POST');

/*
 添加用户
 */
export const reqAddUser = (user) => ajax('/manage/user/add', user, 'POST');

/*
 查询分类(前端分页)
 */
export const reqCategories = (parentId) => ajax('/manage/category/list', {parentId});

/*
 添加分类
 */
export const reqAddCategory = (name, parentId) => ajax('/manage/category/add', {
    name,
    parentId
}, 'POST');

/*
 更新分类
 */
export const reqUpdateCategory = (categoryId, categoryName) => ajax('/manage/category/update', {
    categoryId,
    categoryName
}, 'POST');

/*
 获取分类名称(根据分类id)
 */
export const reqCategoryName = (categoryId) => ajax('/manage/category/categoryName', {categoryId});

/*
 更新商品的状态(上架|下架)
 */
export const reqUpdateStatus = (productId, status) => ajax('/manage/product/updateStatus', {productId, status}, 'POST');

/*
 获取商品分页列表(后端分页)
 */
export const reqProductsByPage = (page, pageSize) => ajax('/manage/product/list', {page, pageSize});

/*
 搜索商品分页列表 searchType:搜索类型,productName,productDesc
 */
export const reqSearchProduct = ({page, pageSize, searchName, searchType}) => ajax('/manage/product/search', {
    page,
    pageSize,
    [searchType]: searchName
});


/*
 jsonp接口请求函数,查询天气
 */
export const reqWeather = (city) => {
    return new Promise((resolve) => {
        jsonp(`${weatherUrl}&location=${city}`, {}, (error, data) => {
            if (!error && 'success' === data.status) {
                const {dayPictureUrl, weather} = data.results[0].weather_data[0];
                resolve({dayPictureUrl, weather});
            } else {
                message.error('获取天气数据失败');
            }
        })
    });
}
