/**
 * Created by LuoQuan on 2019/6/30.
 */

import React, {Component} from 'react';
import {Card, Select, Input, Button, Icon, Table} from 'antd';

import LinkButton from '../../components/link-button';

/*
 Product的默认子路由组件
 */
const {Option} = Select;

export default class ProductHome extends Component {

    state = {
        products: []
    }

    /*
     初始化表格列的数组
     */
    initColumns = () => {
        this.columns = [{
            title: '商品名称',
            dataIndex: 'name'
        }, {
            title: '商品描述',
            dataIndex: 'desc'
        }, {
            title: '价格',
            dataIndex: 'price',
            render: (price) => `￥${price}`

        }, {
            title: '状态',
            width: 100,
            dataIndex: 'state',
            render: (status) => (
                <span>
                    <Button type='primary'>下架</Button>
                    <span>在售</span>
                </span>
            )
        }, {
            title: '操作',
            width: 100,
            render: (product) => (
                <span>
                    <LinkButton>详情</LinkButton>
                    <LinkButton>修改</LinkButton>
                </span>
            )
        }]
    }

    /*
     生命周期函数,只会在组件创建之前调用一次
     */
    componentWillMount() {
        this.initColumns()
    }

    render() {

        const {products} = this.state;

        const title = (
            <span>
                <Select value='0' style={{width: 150}}>
                    <Option value='0'>按名称搜索</Option>
                    <Option value='1'>按描述搜索</Option>
                </Select>
                <Input placeholder='关键字' style={{width: 150, margin: '0 20px'}}/>
                <Button type='primary'>搜索</Button>
            </span>
        )

        const extra = (
            <Button type='primary'>
                <Icon type='plus'/>
                添加商品
            </Button>
        )
        return (
            <Card title={title} extra={extra}>
                <Table
                    bordered
                    rowKey='id'
                    dataSource={products}
                    columns={this.columns}
                />
            </Card>
        )
    }
}