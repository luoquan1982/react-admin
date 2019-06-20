/**
 * Created by LuoQuan on 2019/6/7
 * 入口js
 */
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import store from './utils/storageUtils';
import memoryUtils from './utils/memoryUtils';

//读取local中保存的user,保存到内存中
const user = store.getUser();
memoryUtils.user = user;

ReactDOM.render(<App/>,document.querySelector('#root'));