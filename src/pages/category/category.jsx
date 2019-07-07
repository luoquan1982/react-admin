/**
 * Created by LuoQuan on 2019/6/23.
 * 商品分类路由
 */

import React, {Component} from 'react';
import {Card, Button, Icon, Table, message, Modal} from 'antd';

import LinkButton from '../../components/link-button';
import {reqCategories, reqUpdateCategory, reqAddCategory} from '../../api/index';
import AddForm from './component/add-form';
import UpdateForm from './component/update-form';

export default class Category extends Component {

    state = {
        categories: [],
        subCategories: [],  //二级分类列表
        loading: false,
        parentId: '0',      //当前需要显示的分类列表的parentId
        parentName: '',     //当前显示的table标题信息
        showStatus: 0       //标识添加|更新的确认框是否显示 0:都不显示 1:显示添加 2:显示更新
    }

    /*
     * 初始化分类列表
     */
    initColumns = () => {
        this.columns = [{
            title: '分类名称',
            dataIndex: 'name'
        },
            {
                title: '操作',
                width: 300,
                render: (category) => (
                    <span>
                        <LinkButton onClick={() => {
                            this.showUpdate(category)
                        }}>修改分类</LinkButton>
                        {
                            '0' === this.state.parentId ? <LinkButton onClick={() => {
                                this.showSubCategories(category)
                            }}>查看子分类</LinkButton> : null
                        }
                    </span>
                ),
            }];
    };

    showSubCategories = (category) => {
        this.setState({
            parentId: category.id,
            parentName: category.name
        }, () => {
            this.getCategories();
        });
    }

    showCategories = () => {
        this.setState({
            parentId: '0',
            parentName: '',
            subCategories: []
        });
    }
    /**
     * 获取一二级分类列表显示
     * 如果没有指定id则根据状态中的parentId获取,否则从指定的parentId获取
     * @param parentId 指定的父id,如果没有传,则从状态中的parentId中获取
     * @returns {Promise.<void>}
     */
    getCategories = async (parentId) => {
        this.setState({loading: true});
        parentId = parentId || this.state.parentId;
        const response = await reqCategories(parentId);
        this.setState({loading: false});
        if (response.status === 200) {
            const list = response.data.list;
            '0' === parentId ? this.setState({categories: list}) : this.setState({subCategories: list});
        } else {
            message.error('获取列表数据失败');
        }
    }

    showAdd = () => {
        this.setState({showStatus: 1})
    }

    showUpdate = (category) => {
        this.category = category;
        this.setState({
            showStatus: 2
        })
    }

    closeModal = () => {
        this.setState(({showStatus: 0}));
        //重置表单
        this.form.resetFields();
    }

    handleAdd = () => {
        this.form.validateFields(async (err, values) => {
            if (!err) {
                //1.隐藏添加对话框
                this.setState({showStatus: 0});
                //2.收集数据,并提交添加分类的请求
                const {parentId, name} = values;
                //3.清除表单
                this.form.resetFields();
                const response = await reqAddCategory(name, parentId);
                if (200 === response.status) {
                    //4.刷新当前列表显示
                    //a.当前显示列表和添加的父id相同的时候才有必要刷新列表
                    //b.如果在二级列表下添加一级分类,也需要刷新一级列表
                    if (parentId === this.state.parentId) {
                        this.getCategories();
                    } else if ('0' === parentId) {
                        this.getCategories('0');
                    }
                }
            }
        });
    }

    handleUpdate = () => {
        //前端表单验证,只有通过了才能发送请求
        this.form.validateFields(async (err, values) => {
            if (!err) {
                //1.隐藏更新对话框
                this.setState({showStatus: 0});

                const categoryId = this.category.id;
                //重置表单
                this.form.resetFields();
                const {name} = values;

                //2.发请求更新分类
                const response = await reqUpdateCategory(categoryId, name);

                if (200 === response.status) {
                    //3.更新分类列表
                    this.getCategories();
                }
            }
        });
    }

    componentWillMount() {
        this.initColumns();
    }

    //发异步ajax请求
    componentDidMount() {
        this.getCategories();
    }

    render() {
        const {categories, subCategories, loading, parentId, parentName, showStatus} = this.state;
        const {name} = this.category || {};
        //card的左侧
        const title = '0' === parentId ? '一级分类列表' : (
            <span>
                <LinkButton onClick={this.showCategories}>一级分类列表</LinkButton>
                <Icon type="arrow-right" style={{marginRight: 5}}/>
                <span>{parentName}</span>
            </span>
        );
        //card的右侧
        const extra = (
            <Button type='primary' onClick={this.showAdd}>
                <Icon type="plus"/>
                添加
            </Button>
        );

        return (
            <div>
                <Card title={title} extra={extra}>
                    <Table
                        bordered
                        loading={loading}
                        rowKey='id'
                        dataSource={'0' === parentId ? categories : subCategories}
                        columns={this.columns}
                        pagination={{
                            defaultPageSize: 5,
                            showQuickJumper: true
                        }}
                    />

                    <Modal
                        title="添加分类"
                        visible={1 === showStatus}
                        onOk={this.handleAdd}
                        onCancel={this.closeModal}
                    >
                        <AddForm
                            categories={categories}
                            parentId={parentId}
                            setForm={(form) => this.form = form}
                        />
                    </Modal>

                    <Modal
                        title="更新分类"
                        visible={2 === showStatus}
                        onOk={this.handleUpdate}
                        onCancel={this.closeModal}
                    >
                        <UpdateForm
                            categoryName={name || ''}
                            setForm={(form) => {
                                this.form = form
                            }}
                        />
                    </Modal>
                </Card>
            </div>
        )
    }
}