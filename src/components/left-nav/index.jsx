/**
 * Created by LuoQuan on 2019/6/20.
 */

import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Menu, Icon} from 'antd';

import './index.less';
import logo from '../../assets/images/logo.png';
import menuList from '../../config/menuConfig';

/*
 左侧导航组件
 */
const {SubMenu} = Menu;
class LeftNav extends Component {

    componentWillMount() {
        this.menu = this.getMenu(menuList);
    }

    getMenu = (mList) => {
        const path = this.props.location.pathname;
        return mList.reduce((accumulate, item) => {
            if (!item.children) {
                accumulate.push((
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            <Icon type={item.icon}/>
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                ))
            } else {
                //查找当前menu下有没有子item被选中,如果有,则刷新的时候需要展开此menu
                const cItem = item.children.find(cItem => cItem.key === path);
                if(cItem)
                this.openKey = item.key;
                accumulate.push((
                    <SubMenu key={item.key}
                             title={
                                 <span>
                                     <Icon type={item.icon}/>
                                     <span>{item.title}</span>
                                 </span>
                             }
                    >
                        {this.getMenu(item.children)}
                    </SubMenu>
                ))
            }
            return accumulate;
        }, [])
    };

    render() {
        const {menu} = this;
        //得到当前请求的路由路径
        const path = this.props.location.pathname;
        const openKey = this.openKey;
        return (
            <div>
                <div className="left-nav">
                    <Link to='/' className="left-nav-header">
                        <img src={logo} alt="logo"/>
                        <h1>硅谷后台</h1>
                    </Link>
                </div>
                <Menu mode="inline" theme="dark" selectedKeys={[path]} defaultOpenKeys={[openKey]}>
                    {menu}
                </Menu>
            </div>
        )
    }
}

export default withRouter(LeftNav);