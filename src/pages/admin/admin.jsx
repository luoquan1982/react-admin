/**
 * Created by LuoQuan on 2019/6/8.
 */

import React from 'react';
import {Redirect} from 'react-router-dom'

import {Layout} from 'antd';

import memoryUtils from '../../utils/memoryUtils';
import LeftNav from '../../components/left-nav';
import Header from '../../components/header';

const {Content, Footer, Sider} = Layout;

export default class Admin extends React.Component {
    render() {
        const user = memoryUtils.user;
        if (!user || !user.id) {
            console.log(user);
            return <Redirect to='/login'/>
        } else {
            return (
                <Layout style={{height: '100%'}}>
                    <Sider>
                        <LeftNav/>
                    </Sider>
                    <Layout>
                        <Header>Header</Header>
                        <Content style={{backgroundColor: '#fff'}}>Content</Content>
                        <Footer style={{textAlign: 'center', color: '#cccccc'}}>推荐使用谷歌浏览器,可以获得更佳页面操作体验</Footer>
                    </Layout>
                </Layout>
            )
        }
    }
}