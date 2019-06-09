/**
 * Created by LuoQuan on 2019/6/9.
 * 封装axios
 * 函数的返回值是promise对象
 */

import axios from 'axios';
import {message} from 'antd';

export default function ajax(url, data = {}, type = 'GET') {
    if ('GET' === type) {
        return axios.get(url, {
            params: data
        });
    } else {
        return axios.post(url, data);
    }
}