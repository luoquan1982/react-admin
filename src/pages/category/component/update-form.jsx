/**
 * Created by LuoQuan on 2019/6/29.
 */

import React from 'react';
import PropTypes from 'prop-types';
import {Form, Input} from 'antd';

const {Item} = Form;
/*
 更新分类的form组件
 */
class UpdateForm extends React.Component {
    static protoTypes = {
        categoryName: PropTypes.string.isRequired,
        setForm: PropTypes.func.isRequired
    }

    componentWillMount() {
        //将form对象通过setForm方法传递给父组件
        this.props.setForm(this.props.form);
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {categoryName} = this.props;
        return (
            <Form>
                <Item>
                    {
                        getFieldDecorator('name', {
                            initialValue: categoryName,
                            rules: [
                                {required: true, message: '分类名称必须要填写'}
                            ]
                        })(
                            <Input placeholder="请输入分类名称"/>
                        )
                    }
                </Item>
            </Form>
        )
    }
}

export default Form.create()(UpdateForm);