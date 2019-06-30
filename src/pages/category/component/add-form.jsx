/**
 * Created by LuoQuan on 2019/6/29.
 */

import React from 'react';
import PropTypes from 'prop-types';
import {Form, Select, Input} from 'antd';

const {Item} = Form;
const {Option} = Select;
/*
 添加分类的form组件
 */
class AddForm extends React.Component {

    static propTypes = {
        setForm: PropTypes.func.isRequired,
        categories: PropTypes.array.isRequired,
        parentId: PropTypes.string.isRequired
    }

    componentWillMount() {
        //将form对象通过setForm方法传递给父组件
        this.props.setForm(this.props.form);
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {categories, parentId} = this.props;
        return (
            <Form>
                <Item>
                    {
                        getFieldDecorator('parentId', {
                            initialValue: parentId
                        })(
                            <Select>
                                <Option value='0' selected>一级分类</Option>
                                {
                                    categories.map(item => <Option value={item.id} key={item.id}>{item.name}</Option>)
                                }
                            </Select>
                        )
                    }
                </Item>
                <Item>
                    {
                        getFieldDecorator('name', {
                            initialValue: ''
                        })(
                            <Input placeholder="请输入分类名称"/>
                        )
                    }
                </Item>
            </Form>
        )
    }
}

export default Form.create()(AddForm);