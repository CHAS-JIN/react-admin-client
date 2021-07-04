import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { Card, Table, Button, Select, Input, Modal, message } from 'antd';
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api/index'
import { PAGE_SIZE } from '../../utils/constant';

const Option = Select.Option

class Home extends Component {

    constructor(props){
        super(props)
        // 初始化列表
        this.initColumns()
    }

    state = {
        loading: false,
        products: [],
        total: 0,
        keyWord: '',
        searchType: 'productName'
    }

    // 加载列信息
    initColumns = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
                width: 180
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
                width: 'auto'
            },
            {
                title: '价格',
                dataIndex: 'price',
                width: 80,
                render: (price) => '￥' + price
            },
            {
                title: '状态',
                dataIndex: 'status',
                width: 80,
                render: (status) => status === 1 ? '在售' : '已下架'

            },
            {
                title: '操作',
                dataIndex: '',
                width: 300,
                render: (product) => {
                    const { status, _id } = product
                    const newStatus = status === 1 ? 2 : 1
                    return (
                        <span>
                            <Button type='link' onClick={() => this.props.history.push('/product/detail',product)}>查看详情</Button>
                            <Button type='primary' style={{ marginRight: 10 }} onClick={() => this.props.history.push('/product/addupdate',product)}>修改分类</Button>
                            <Button type='danger' onClick={() => this.updateStatus(_id, status, newStatus)}>{status === 1 ? '下架' : '上架'}</Button>
                        </span>
                    )
                }
            }
        ];
    }

    // 获取商品列表(搜索)
    getProducts = async (pageNum) => {
        this.pageNum = pageNum // 保存pageNum, 让其它方法可以看到
        this.setState({ loading: true }) // 显示loading

        const { keyWord, searchType } = this.state
        // 如果搜索关键字有值, 说明我们要做搜索分页
        let result
        if (keyWord) {
            result = await reqSearchProducts(pageNum, PAGE_SIZE, searchType, keyWord)
        } else { // 一般分页请求
            result = await reqProducts(pageNum, PAGE_SIZE)
        }

        this.setState({ loading: false }) // 隐藏loading
        if (result.status === 0) {
            // 取出分页数据, 更新状态, 显示分页列表
            const { total, list } = result.data
            this.setState({
                total,
                products: list
            })
        }
    }

    // 更改商品状态
    updateStatus = (_id, status, newStatus) => {
        Modal.confirm({
            title: `确定要${status === 1 ? '下架' : '上架'}这个商品吗？`,
            icon: <ExclamationCircleOutlined />,
            onOk: async () => {
                const result = await reqUpdateStatus(_id, newStatus)
                if (result.status === 0) {
                    message.success(`${status === 1 ? '下架' : '上架'}商品成功`)
                    // 更新当前页面
                    this.getProducts(this.pageNum)
                }
            },
            cancelText: '取消',
            okText: '确认'
        });
    }

    // 显示修改页面
    showUpdate = (product) => {
        this.props.history.push('/product/addupdate')

    }

    // 显示添加页面
    showAdd = () => {
        this.props.history.push('/product/addupdate')
    }







/* 
    UNSAFE_componentWillMount() {
        this.initColumns()
    } */

    componentDidMount() {
        this.getProducts(1)
    }

    render() {
        const { loading, products, total, keyWord, searchType } = this.state
        const title = (
            <span>
                <Select
                    value={searchType}
                    style={{ width: 150 }}
                    onChange={value => this.setState({ searchType: value })}
                >
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <Input
                    placeholder='关键字'
                    style={{ width: 150, margin: '0 15px' }}
                    value={keyWord}
                    onChange={event => this.setState({ keyWord: event.target.value })}
                />
                <Button type='primary' onClick={() => this.getProducts(1)}>搜索</Button>
            </span>
        )
        return (
            <Card
                title={title}
                className='product-card'
                extra={
                    <Button type='primary' icon={<PlusOutlined />} onClick={this.showAdd}>添加</Button>
                }
            >
                <Table
                    dataSource={products}
                    columns={this.columns}
                    bordered
                    rowKey='_id'
                    loading={loading}
                    pagination={{
                        current: this.pageNum,
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper: true,
                        total,
                        onChange: this.getProducts  /* (page) => this.getProducts(page) */
                    }}

                />

            </Card>
        )
    }
}

export default withRouter(Home)