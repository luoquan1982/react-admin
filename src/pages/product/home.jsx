/**
 * Created by LuoQuan on 2019/6/30.
 */

import React, {Component} from 'react';
import {Card, Select, Input, Button, Icon, Table, message} from 'antd';

import LinkButton from '../../components/link-button';
import {reqProductsByPage, reqSearchProduct, reqUpdateStatus} from '../../api';
import {PAGE_SIZE} from '../../utils/constants';

/*
 Product的默认子路由组件
 */
const {Option} = Select;

export default class ProductHome extends Component {

    state = {
        loading: false,
        total: 0,
        page: 1,
        searchName: '',                //搜索的关键字
        searchType: 'productName',     //搜索的类型,枚举值.只能为productName|productDesc之一
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
            render: (product) => {
                const {id, status} = product;
                return (
                    <span>
                        <Button
                            type={status ? 'primary' : 'danger'}
                            onClick={() => this.updateStatus(id, !status)}
                        >
                            {status ? '下架' : '上架'}
                        </Button>
                        <span>{status ? '在售' : '下架'}</span>
                    </span>
                )
            }
        }, {
            title: '操作',
            width: 100,
            render: (product) => (
                <span>
                    <LinkButton onClick={() => this.props.history.push('/product/detail', {product})}>详情</LinkButton>
                    <LinkButton onClick={() => this.props.history.push('/product/addupdate', product)}>修改</LinkButton>
                </span>
            )
        }]
    }

    /*
     获取指定页码的列表数据显示
     */
    getProducts = async (page) => {
        this.setState({loading: true});
        const {searchName, searchType} = this.state;
        let response;
        if (searchName) {
            //搜索分页
            response = await reqSearchProduct({page, pageSize: PAGE_SIZE, searchName, searchType});
        } else {
            //一般分页
            response = await reqProductsByPage(page, PAGE_SIZE);
        }
        this.page = page;
        if (200 === response.status) {
            //取出分页数据,更新状态
            const {total, pageNum, list} = response.data;
            this.setState({total, page: pageNum, products: list})
        }
        this.setState({loading: false});
    }

    updateStatus = async (productId, status) => {
        const response = await reqUpdateStatus(productId, status);
        if (200 === response.status) {
            //更新成功
            message.success("更新商品状态成功");
            this.getProducts(this.page);
        }

    }

    /*
     生命周期函数,只会在组件创建之前调用一次
     */
    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getProducts(1);
    }

    render() {
        const {products, loading, page, total, searchType, searchName} = this.state;

        const title = (
            <span>
                <Select value={searchType} style={{width: 150}} onChange={value => this.setState({searchType: value})}>
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <Input
                    placeholder='关键字'
                    style={{width: 150, margin: '0 20px'}}
                    value={searchName}
                    onChange={e => this.setState({searchName: e.target.value})}
                />
                <Button type='primary' onClick={() => this.getProducts(1)}>搜索</Button>
            </span>
        )

        const extra = (
            <Button type='primary' onClick={() => this.props.history.push('/product/addupdate')}>
                <Icon type='plus'/>
                添加商品
            </Button>
        )
        return (
            <Card title={title} extra={extra}>
                <Table
                    bordered
                    rowKey='id'
                    loading={loading}
                    dataSource={products}
                    columns={this.columns}
                    pagination={{
                        showQuickJumper: true,
                        defaultPageSize: PAGE_SIZE,
                        current: page,
                        total,
                        onChange: this.getProducts
                    }}
                />
            </Card>
        )
    }
}