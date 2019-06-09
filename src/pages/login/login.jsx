/**
 * Created by LuoQuan on 2019/6/8.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    Form,
    Icon,
    Input,
    Button
} from 'antd';

import './login.less';
import logo from './images/logo.png';
import {reqLogin} from '../../api';

const Item = Form.Item;  //不能写在import之前

class Login extends Component {
    handleSubmit = (event) => {
        //对所有的表单字段进行验证
        this.props.form.validateFields((err, values) => {
            //校验成功
            const {username, password} = values;
            if (!err) {
                //请求登录
                reqLogin(username, password).then(response => {
                    console.log('成功了', response.data);
                }).catch(error => {
                    console.log(error);
                })
            } else {
                console.log('校验失败');
            }
        });
        event.preventDefault();
    };

    /*
     验证密码
     */
    validatePwd = (rule, value, callback) => {
        if (!value) {
            callback('密码不能为空');
        } else if (value.length < 4) {
            callback('密码长度不能小于4');
        } else if (value.length > 12) {
            callback('密码长度不能大于12');
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            callback('密码必须是英文,数字或下划线');
        } else {
            callback();
        }
    };

    render() {
        const {form} = this.props;
        const {getFieldDecorator} = form;
        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo"/>
                    <h1>React项目:后台管理系统</h1>
                </header>
                <section className="login-content">
                    <h2>用户登录</h2>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Item>
                            {
                                getFieldDecorator('username', {
                                    rules: [{required: true, message: '用户名必须输入'},
                                        {min: 4, message: '用户名至少4位'},
                                        {max: 12, message: '用户名不能超过12位'},
                                        {pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文名,数字或下划线组成'}
                                    ],
                                })(
                                    <Input
                                        prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                        placeholder="用户名"
                                    />)}
                        </Item>
                        <Item>
                            {
                                getFieldDecorator('password', {
                                    rules: [{
                                        validator: this.validatePwd
                                    }]
                                })(
                                    <Input
                                        prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                        type="password"
                                        placeholder="密码"
                                    />
                                )
                            }
                        </Item>
                        <Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Item>
                    </Form>
                </section>
            </div>
        )
    }
}

const WrapLogin = Form.create()(Login);
export default WrapLogin;