/**
 * Created by LuoQuan on 2019/6/30.
 */

import React, {Component} from 'react';
import {Card, Form, Input, Cascader, Upload, Button, Icon} from 'antd';

import LinkButton from '../../components/link-button';
import {reqCategories} from '../../api';

const Item = Form.Item;
const TextArea = Input.TextArea;

/*
 Product的添加修改路由组件
 */
class ProductAddUpdate extends Component {

    state = {
        options: []
    }

    /*
     异步获取一/二级分类列表,并显示
     */
    getCategories = async (parentId) => {
        const response = await reqCategories(parentId);
        if (200 === response.status) {
            const categories = response.data.list;
            if ('0' === parentId) {
                this.updateOptions(categories);
            } else {
                return categories;
            }
        }
    }

    updateOptions = async (categories) => {
        const options = categories.map((item) => ({
            value: item.id,
            label: item.name,
            isLeaf: false
        }))

        //如果是一个二级分类商品的更新
        const {isUpdate, product} = this;
        const {paCategoryId} = product;
        if (isUpdate && '0' !== paCategoryId) {
            //获取对应的二级分类列表
            const subCategories = await this.getCategories(paCategoryId);
            //生成二级分类列表
            const subOptions = subCategories.map((item) => ({
                value: item.id,
                label: item.name,
                isLeaf: true
            }));
            //找到当前商品对应的一级option对象
            const targetOption = options.find(option=>option.value === paCategoryId)
            //关联到对应的一级option上
            targetOption.children = subOptions;
        }
        this.setState({options});
    }

    /*
     加载下一级列表的回调函数
     */
    loadData = async selectedOptions => {
        const targetOption = selectedOptions[0];
        targetOption.loading = true;

        //根据选择的分类,获取下级分类(二级)
        const subCategories = await this.getCategories(targetOption.value);
        console.log(subCategories);
        targetOption.loading = false;
        if (subCategories && subCategories.length > 0) {
            const subOptions = subCategories.map((item) => ({
                value: item.id,
                label: item.name,
                isLeaf: true
            }));
            targetOption.children = subOptions;
        } else {
            //当前选中的分类没有二级分类,此时将标志位isLeaf的字段置了true
            targetOption.isLeaf = true;
        }
        this.setState({options: [...this.state.options]})
    };

    submit = () => {
        //进行表单验证,如果通过了,才发送请求
        this.props.form.validateFields((error, values) => {
            if (!error) {
                console.log(values);
                alert('发送ajax请求');
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

    componentWillMount() {
        const product = this.props.history.location.state;
        //是否是更新的标识符,如果不是,则为新增
        this.isUpdate = !!product;
        this.product = product || {};
    }

    componentDidMount() {
        this.getCategories('0');
    }

    render() {
        const {isUpdate, product} = this;
        const {paCategoryId, categoryId} = product;
        //级联分类的初始化数组,更新状态下初始化级联分类信息
        const categoryIds = [];

        if (isUpdate) {
            //商品是一级分类的商品
            if ('0' === paCategoryId) {
                categoryIds.push(categoryId);
            } else {
                //商品是二级分类的商品
                categoryIds.push(paCategoryId, categoryId);
            }
        }

        //指定Item布局的配置对象(antd栅格系统一共是24格)
        const formItemLayout = {
            labelCol: {span: 2},    //左侧label的宽度占6/24
            wrapperCol: {span: 8}   //指定右侧包裹的宽度8/24
        }

        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.goBack()}>
                    <Icon type="arrow-left" style={{fontSize: 20}}/>
                </LinkButton>
                <span>{isUpdate ? '修改商品' : '添加商品'}</span>
            </span>
        );

        const {getFieldDecorator} = this.props.form;
        return (
            <Card title={title}>
                <Form {...formItemLayout}>
                    <Item label='商品名称'>
                        {getFieldDecorator('name', {
                            initialValue: product.name,
                            rules: [
                                {required: true, message: '商品名称必须填写'}
                            ]
                        })(<Input placeholder='商品名称'/>)}
                    </Item>
                    <Item label='商品描述'>
                        {getFieldDecorator('desc', {
                            initialValue: product.desc,
                            rules: [
                                {required: true, message: '商品描述必须填写'}
                            ]
                        })(<TextArea placeholder='商品描述' autosize/>)}
                    </Item>
                    <Item label='商品价格'>
                        {getFieldDecorator('price', {
                            initialValue: product.price,
                            rules: [
                                {required: true, message: '商品价格必须填写'},
                                {validator: this.validatePrice}
                            ]
                        })(<Input type='number' placeholder='商品价格' addonAfter='元'/>)}
                    </Item>
                    <Item label='商品分类'>
                        {
                            getFieldDecorator('categoryIds', {
                                initialValue: categoryIds,
                                rules: [
                                    {required: true, message: '商品分类必须填写'}
                                ]
                            })(
                                <Cascader
                                    placeholder='请指定商品分类信息'
                                    options={this.state.options}    //需要显示的列表数据
                                    loadData={this.loadData}        //当选择某个列表项,加载下一级列表项
                                />
                            )
                        }
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