/**
 * Created by LuoQuan on 2019/6/9.
 * 封装axios
 * 函数的返回值是promise对象
 */

import axios from "axios";
import {message} from 'antd';

export default function ajax(url, data = {}, type = 'GET') {

    let promise;
    return new Promise((resolve, reject) => {
        if ('GET' === type) {
            promise = axios.get(url, {
                params: data
            });
        } else {
            promise = axios.post(url, data);
        }

        promise.then((response) => {
            resolve(response);
        }).catch(error => {
            message.error(error);
        });
    });

}