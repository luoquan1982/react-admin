/**
 * Created by LuoQuan on 2019/6/23.
 * 商品分类路由
 */

import React, {Component} from 'react';
import {Card, Button, Icon, Table} from 'antd';

import LinkButton from '../../components/link-button';

export default class Category extends Component {
    render() {
        //card的左侧
        const title = '一级分类列表';
        //card的右侧
        const extra = (
            <Button type='primary'>
                <Icon type="plus"/>
                添加
            </Button>
        );

        const dataSource = [
            {
                _id: '1',
                name: '胡彦斌',
                age: 32,
                address: '西湖区湖底公园1号',
            },
            {
                _id: '2',
                name: '胡彦祖',
                age: 42,
                address: '西湖区湖底公园1号',
            },
        ];

        const columns = [{
            title: '分类名称',
            dataIndex: 'name'
        },
            {
                title: '操作',
                width: 300,
                render: () => (
                    <span>
                        <LinkButton>修改分类</LinkButton>
                        <LinkButton>查看子分类</LinkButton>
                    </span>
                ),
            }];

        return (
            <div>
                <Card title={title} extra={extra}>
                    <Table dataSource={dataSource} columns={columns} bordered rowKey='_id'/>
                </Card>
            </div>
        )
    }
}