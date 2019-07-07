/**
 * Created by LuoQuan on 2019/6/30.
 */

import React, {Component} from 'react';
import {Card, Form, Input, Cascader, Upload, Button, Icon} from 'antd';

import LinkButton from '../../components/link-button';

const Item = Form.Item;
const TextArea = Input.TextArea;

const options = [
    {
        value: 'zhejiang',
        label: 'Zhejiang',
        isLeaf: false,
    }, {
        value: 'jiangsu',
        label: 'Jiangsu',
        isLeaf: false,
    }
];

/*
 Product的添加修改路由组件
 */
class ProductAddUpdate extends Component {

    state = {
        options: options
    }

    /*
     加载下一级列表的回调函数
     */
    loadData = selectedOptions => {
        const targetOption = selectedOptions[0];
        targetOption.loading = true;

        // load options lazily
        setTimeout(() => {
            targetOption.loading = false;
            targetOption.children = [
                {
                    label: `${targetOption.label} Dynamic 1`,
                    value: 'dynamic1',
                    isLeaf: true
                },
                {
                    label: `${targetOption.label} Dynamic 2`,
                    value: 'dynamic2',
                    isLeaf: true
                },
            ];
            this.setState({
                options: [...this.state.options], //最好以这种结构的方式书写
            });
        }, 1000);
    };

    submit = () => {
        //进行表单验证,如果通过了,才发送请求
        this.props.form.validateFields((error, values) => {
            if (!error) {
                alert('发送ajax请求')
            }
        })
    }

    /*
     验证价格的自定义验证器
     */
    validatePrice = (rule, value, callback) => {
        if (value * 1 > 0) {            //小技巧,将数字字符串转换为数字
            callback();                 //验证通过
        } else {
            callback('价格必须大于0')     //验证未通过
        }
    }

    render() {

        //指定Item布局的配置对象(antd栅格系统一共是24格)
        const formItemLayout = {
            labelCol: {span: 2},    //左侧label的宽度占6/24
            wrapperCol: {span: 8}   //指定右侧包裹的宽度8/24
        }

        const title = (
            <span>
                <LinkButton>
                    <Icon type="arrow-left" style={{fontSize: 20}}/>
                </LinkButton>
                <span>添加商品</span>
            </span>
        );

        const {getFieldDecorator} = this.props.form;
        return (
            <Card title={title}>
                <Form {...formItemLayout}>
                    <Item label='商品名称'>
                        {getFieldDecorator('name', {
                            initialValue: '',
                            rules: [
                                {required: true, message: '商品名称必须填写'}
                            ]
                        })(<Input placeholder='商品名称'/>)}
                    </Item>
                    <Item label='商品描述'>
                        {getFieldDecorator('desc', {
                            initialValue: '',
                            rules: [
                                {required: true, message: '商品描述必须填写'}
                            ]
                        })(<TextArea placeholder='商品描述' autosize/>)}
                    </Item>
                    <Item label='商品价格'>
                        {getFieldDecorator('price', {
                            initialValue: '',
                            rules: [
                                {required: true, message: '商品价格必须填写'},
                                {validator: this.validatePrice}
                            ]
                        })(<Input type='number' placeholder='商品价格' addonAfter='元'/>)}
                    </Item>
                    <Item label='商品分类'>
                        <Cascader
                            options={this.state.options}    //需要显示的列表数据
                            loadData={this.loadData}        //当选择某个列表项,加载下一级列表项
                        />
                    </Item>
                    <Item label='商品图片'>
                        <div>商品图片</div>
                    </Item>
                    <Item label='商品详情'>
                        <div>商品详情</div>
                    </Item>
                    <Item>
                        <Button type='primary' onClick={this.submit}>提交</Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}

export default Form.create()(ProductAddUpdate);