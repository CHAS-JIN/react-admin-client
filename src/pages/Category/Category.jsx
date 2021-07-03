import React, { Component } from 'react'
import { Card, Button, Table, message, Modal } from 'antd';
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { reqCategorys, reqAddCategory, reqUpdateCategory } from '../../api';
import AddForm from './AddForm';
import UpdateForm from './UpdateForm';

export default class Category extends Component {

    state = {
        categorys: [],      // 一级列表
        parentId: '0',      // 当前需要显示的列表父列表ID
        parentName: '',     // 当前需要显示的列表父列表名称
        subCategorys: [],   // 二级分类列表
        loading: false,     // 是否正在获取数据中
        showStatus: 0,      // 添加、更新的确认框是否显示，0：都不，1：添加，2：更新
        confirmLoading: false,
    }

    // 加载列信息
    initColumns = () => {
        this.columns = [
            {
                title: '类别',
                dataIndex: 'name',
                width: '70%'
            },
            {
                title: '操作',
                dataIndex: '',
                width: '30%',
                render: (category) => (
                    <span>
                        <Button type='link' onClick={() => this.showUpdate(category)}>修改分类</Button>
                        {
                            this.state.parentId === '0' ? <Button type='link' onClick={() => this.showSubCategorys(category)}>查看子分类</Button> : null
                        }
                    </span>
                )
            }
        ];
    }

    // 获取列表数据
    getCategorys = async (parentId) => {
        // 在发请求前，显示loading
        this.setState({ loading: true })
        parentId = parentId || this.state.parentId
        const result = await reqCategorys(parentId)
        this.setState({ loading: false })
        if (result.status === 0) {
            // 取出分类数组(可能是一级也可能二级的)
            const categorys = result.data
            if (parentId === '0') {
                // 更新一级分类状态
                this.setState({ categorys })
            } else {
                // 更新二级分类状态
                this.setState({ subCategorys: categorys })
            }
        } else {
            message.error('获取分类列表失败')
        }
    }

    // 显示指定一级列表的二级列表
    showSubCategorys = (category) => {
        this.setState(
            {
                parentId: category._id,
                parentName: category.name
            },
            () => { // 在状态更新且重新render后执行
                // 获取二级列表
                this.getCategorys()
            }
        )
    }

    // 显示指定一级列表
    showCategorys = () => {
        this.setState({
            parentId: '0',
            parentName: '',
            subCategorys: []
        })
    }

    // 显示添加对话框
    showAdd = () => {
        this.setState({ showStatus: 1 })
    }

    // 显示修改对话框
    showUpdate = (category) => {
        // 保存分类对象
        this.category = category

        // 更新状态
        this.setState({ showStatus: 2 })
    }

    // 对话框取消按钮回调函数
    handleCancel = () => {
        this.setState({ showStatus: 0 })
    }

    // 添加分类
    addCategory = () => {
        // 触发表单验证，表单值保存在返回的value中
        this.form.validateFields().then(async values => {
            const { categoryName, parentId } = values

            // 发请求添加
            const result = await reqAddCategory(categoryName, parentId)
            if (result.status === 0) {
                // 重新显示列表
                if (parentId === this.state.parentId) {
                    // 如果添加的是当前分类下的列表，则刷新，其他分类的不刷新
                    this.getCategorys();
                } else if (parentId === "0") {
                    // 在二级分类列表下添加一级分类，重新获取一级分类列表，但不需要显示
                    this.getCategorys("0");
                }
            }
            // 隐藏窗口
            this.setState({ showStatus: 0 })
        }).catch(e => {
            message.error('添加失败')
        })
    }

    // 修改分类
    updateCategory = () => {
        // 触发表单验证，表单值保存在返回的value中
        this.form.validateFields().then(async values => {
            const categoryId = this.category._id
            const { categoryName } = values

            // 发请求更新
            const result = await reqUpdateCategory({ categoryName, categoryId })
            if (result.status === 0) {
                // 重新显示列表
                this.getCategorys()
            }
            // 隐藏窗口
            this.setState({ showStatus: 0 })
        }).catch(e => {
            message.error('修改失败')
        })
    }

    UNSAFE_componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        // 获取一级列表
        this.getCategorys()
    }

    render() {
        const { categorys, loading, parentId, subCategorys, parentName, showStatus, confirmLoading } = this.state
        const title = parentId === '0' ? '一级分类列表' : (
            <span>
                <Button type='link' onClick={() => this.showCategorys()}>一级分类列表</Button>
                <ArrowRightOutlined style={{ marginRight: '10px' }} />
                {parentName}
            </span>
        )
        const category = this.category || {}
        return (
            <Card
                title={title}
                className='category-card'
                extra={
                    <Button type='primary' icon={<PlusOutlined />} onClick={this.showAdd}>添加</Button>
                }
            >
                <Table
                    dataSource={parentId === '0' ? categorys : subCategorys}
                    columns={this.columns}
                    bordered
                    rowKey='_id'
                    pagination={{ defaultPageSize: 5}}
                    loading={loading}
                />

                <Modal
                    title="添加分类"
                    visible={showStatus === 1 ? true : false}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                    confirmLoading={confirmLoading}
                    okText='确认'
                    cancelText='取消'
                    cancelButtonProps={{ danger: true, type: 'primary' }}
                    destroyOnClose={true}
                >
                    <AddForm categorys={categorys} setForm={form => this.form = form} />
                </Modal>

                <Modal
                    title="修改分类"
                    visible={showStatus === 2 ? true : false}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                    confirmLoading={confirmLoading}
                    okText='确认'
                    cancelText='取消'
                    cancelButtonProps={{ danger: true, type: 'primary' }}
                    destroyOnClose={true}
                >
                    <UpdateForm categoryName={category.name} setForm={form => this.form = form} />
                </Modal>
            </Card>
        )
    }
}
