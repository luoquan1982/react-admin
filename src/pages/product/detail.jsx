/**
 * Created by LuoQuan on 2019/6/30.
 */

import React, {Component} from 'react';
import {Card, Icon, List} from 'antd';

import {reqCategoryName} from '../../api';
import LinkButton from '../../components/link-button';
// import {BASE_IMG_URL} from '../../utils/constants';         //图片路径前缀

const Item = List.Item;
/*
 Product的详情页路由组件
 */
export default class ProductDetail extends Component {

    state = {
        pCategoryName: '',  //一级分类名称
        categoryName: ''    //二级分类名称
    }

    async componentDidMount() {
        const {paCategoryId, categoryId} = this.props.location.state.product;
        if ('0' === paCategoryId) {
            //一级分类下的商品,再无需查找父分类
            const response = await reqCategoryName(categoryId);
            const categoryName = response.data.categoryName;
            this.setState({categoryName});
        } else {
            //二级分类列表下的商品,还需要查找父分类
            /* const responseP = await reqCategoryName(paCategoryId);
             const response = await reqCategoryName(categoryId);
             const pCategoryName = responseP.data.list[0];
             const categoryName = response.data.list[0];
             this.setState({pCategoryName, categoryName});*/

            //调优 合并多个ajax请求的发送 Promise.all
            const values = await Promise.all([reqCategoryName(paCategoryId), reqCategoryName(categoryId)]);
            const pCategoryName = values[0].data.list[0];
            const categoryName = values[1].data.list[0];
            this.setState({pCategoryName, categoryName});
        }
    }

    render() {
        //读取路由跳转过来的状态数据
        const {name, desc, price, detail} = this.props.location.state.product;
        const {pCategoryName, categoryName} = this.state;
        const title = (
            <span>
                <LinkButton>
                    <Icon
                        type='arrow-left'
                        style={{marginRight: 10, fontSize: 20}}
                        onClick={() => this.props.history.goBack()}
                    />
                </LinkButton>
                <span>商品详情</span>
            </span>
        );
        return (
            <div>
                <Card title={title} className="product-detail">
                    <List>
                        <Item>
                            <span className="left">商品名称:</span>
                            <span>{name}</span>
                        </Item>
                        <Item>
                            <span className="left">商品描述:</span>
                            <span>{desc}</span>
                        </Item>
                        <Item>
                            <span className="left">商品价格:</span>
                            <span>{price}元</span>
                        </Item>
                        <Item>
                            <span className="left">所属分类:</span>
                            <span>{pCategoryName} {categoryName ? `-->${categoryName}` : null}</span>
                        </Item>
                        <Item>
                            <span className="left">商品图片:</span>
                            <span>
                                <img
                                    className="product-img"
                                    src="https://2d.zol-img.com.cn/product/188_320x240/471/ceHVyfxcdEXVw.jpg"
                                    alt=""
                                />
                            </span>
                        </Item>
                        <Item>
                            <span className="left">商品详情:</span>
                            <span dangerouslySetInnerHTML={{__html: detail}}/>
                        </Item>
                    </List>
                </Card>
            </div>
        )
    }
}