/**
 * Created by LuoQuan on 2019/6/20.
 */

import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Modal} from 'antd';
import moment from 'moment';

import LinkButton from '../../components/link-button';
import './index.less';
import menuList from '../../config/menuConfig';
import memoryUtils from '../../utils/memoryUtils';
import storageUtils from '../../utils/storageUtils';
import {reqWeather} from '../../api';

/*
 左侧导航组件
 */
class Header extends Component {

    state = {
        currentTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        dayPictureUrl: '',
        weather: ''
    }

    //获取当前时间(每隔1S更新一次),并格式化显示
    getCurrentTime = () => {
        this.intervalId = setInterval(() => {
            this.setState({currentTime: moment().format('YYYY-MM-DD HH:mm:ss')})
        }, 1000)
    }

    //获取天气信息
    getWeather = async (city) => {
        const {dayPictureUrl, weather} = await reqWeather(city);
        this.setState({dayPictureUrl, weather});
    }

    //获取title
    getTitle = () => {
        //得到当前请求路径
        const path = this.props.location.pathname;
        let title = '';
        menuList.forEach(item => {
            if (item.key === path) {
                title = item.title;
            } else if (item.children) {
                const cItem = item.children.find(cItem => cItem.key === path);
                if (cItem)
                    title = cItem.title
            }
        });
        return title;
    }

    logout = () => {
        //显示确认框
        Modal.confirm({
            content: '您确认要退出登录吗',
            onOk: () => {
                //删除保存的user数据
                storageUtils.removeUser();
                memoryUtils.user = {};
                this.props.history.replace('/login');
            }
        })
    }

    componentDidMount() {
        this.getCurrentTime();
        this.getWeather('长沙');
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    render() {
        const {user} = memoryUtils;
        const {currentTime, dayPictureUrl, weather} = this.state;
        const title = this.getTitle();
        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎您，{user.username}</span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                    <span></span>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">
                        {title}
                    </div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt="weather"/>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header);