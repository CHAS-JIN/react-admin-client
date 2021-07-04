import React, { Component, createRef } from 'react'
import { Card, Input, Form, Cascader, Button, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { reqCategorys, reqAddOrUpdateProduct } from '../../api/index';
import PicturesWall from './PicturesWall';
import RichTextEditor from './RichTextEditor';

const { Item } = Form
const { TextArea } = Input

export default class AddUpdate extends Component {

    constructor(props) {
        super(props)
        // 取出product携带的state，若是添加操作则没值，若是修改则有值
        const product = this.props.location.state

        this.product = product || {}

        // 是否是更新的标识
        this.isUpdate = !!product
    }

    formRef = createRef()
    picRef = createRef()
    detailRef = createRef()

    state = {
        options: [],
    }

    // 获取分类列表
    getCategorys = async (parentId) => {
        const result = await reqCategorys(parentId)
        if (result.status === 0) {
            const categorys = result.data
            if (parentId === '0') {
                this.initOptions(categorys)
            } else {
                // 返回二级列表 ==> 当前 async函数返回的promise就会成功且value为categorys
                return categorys
            }
        }
    }

    // 初始options
    initOptions = async (categorys) => {
        // 根据categorys生成options数组
        const options = categorys.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: false
        }))

        // 如果是一个二级分类商品的更新
        const { isUpdate, product } = this
        const { pCategoryId } = product
        if (isUpdate && pCategoryId !== '0') {
            // 获取对应的二级分类列表
            const subCategorys = await this.getCategorys(pCategoryId)
            // 生成二级下拉列表的options
            const childOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true
            }))

            // 找到当前商品对应的一级option对象
            const targetOption = options.find(option => option.value === pCategoryId)

            // 关联对应的一级option上
            targetOption.children = childOptions
        }

        this.setState({
            options
        })
    }

    // 异步显示级联选择数据
    loadData = async selectedOptions => {
        // 得到选择的 option 对象
        const targetOption = selectedOptions[0];
        // 显示 loading
        targetOption.loading = true;
        // 根据选中的分类请求二级列表
        const subCategorys = await this.getCategorys(targetOption.value)
        // 隐藏 loading
        targetOption.loading = false;
        if (subCategorys && subCategorys.length > 0) {
            // 生成一个二级列表的options
            const childOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true
            }))
            // 关联到当前的option上
            targetOption.children = childOptions
        } else {
            // 当前选中的分类没有二级列表
            targetOption.isLeaf = true
        }

        // 更新 options 状态
        this.setState({
            options: [...this.state.options],
        })

    }

    onFinish = async (values) => {
        // 1.收集数据，并封装成product对象

        // 通过ref使用子组件函数获取子组件传递的值
        const imgs = this.picRef.current.getImgs()
        const detail = this.detailRef.current.getDetail()
        // 解构表单数据并重命名
        const { productName: name, productDesc: desc, productPrice: price, productCategory } = values
        let categoryId, pCategoryId
        if (productCategory.length === 1) {
            categoryId = productCategory[0]
        } else if (productCategory.length === 2) {
            pCategoryId = productCategory[0]
            categoryId = productCategory[1]
        }
        const product = { name, desc, price, categoryId, pCategoryId, imgs, detail }

        // 如果是更新, 需要添加_id
        if (this.isUpdate) {
            product._id = this.product._id
        }

        // 2.调用接口请求函数去添加、更新
        const result = await reqAddOrUpdateProduct(product)

        // 3.根据结果提示
        if (result.status === 0) {
            message.success(`${this.isUpdate ? '更新' : '添加'}商品成功!`)
            this.props.history.goBack()
        } else {
            message.error(`${this.isUpdate ? '更新' : '添加'}商品失败!`)
        }
    }

/*     UNSAFE_componentWillMount() {
        // 取出product携带的state，若是添加操作则没值，若是修改则有值
        const product = this.props.location.state

        this.product = product || {}

        // 是否是更新的标识
        this.isUpdate = !!product

    } */

    componentDidMount() {
        this.getCategorys('0')
    }

    render() {

        const { isUpdate, product } = this
        const { name, desc, price, pCategoryId, categoryId } = product

        // 接收级联分类的数组
        const categoryNames = []
        if (this.isUpdate) {
            if (pCategoryId === '0') {
                categoryNames.push(categoryId)
            } else {
                categoryNames.push(pCategoryId)
                categoryNames.push(categoryId)
            }
            // 设置表单初始值
            /* this.formRef.current.setFieldsValue({
                productName: name,
                productDesc: desc,
                productPrice: price,
                productCategory: [...categoryNames],
            }) */
        }
        let detail
        if (isUpdate) {
            detail = product.detail
        }
        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 9 },
        }

        const title = (
            <span>
                <Button type='link' icon={<ArrowLeftOutlined style={{ fontSize: 18 }} />} onClick={() => this.props.history.goBack()} />
                <span>{isUpdate ? '修改商品' : '添加商品'}</span>
            </span>
        )

        return (
            <Card
                title={title}
                className='addupdate-card'
            >
                <Form
                    ref={this.formRef}
                    className='addupdate-form'
                    {...formItemLayout}
                    onFinish={this.onFinish}
                >
                    <Item
                        label='商品名称'
                        name='productName'
                        rules={[
                            {
                                required: true,
                                message: '请输入商品名称！'
                            }
                        ]}
                        initialValue={name}
                    >
                        <Input placeholder='请输入商品名称' />
                    </Item>

                    <Item
                        label='商品描述'
                        name='productDesc'
                        rules={[
                            {
                                required: true,
                                message: '请输入商品描述！'
                            }
                        ]}
                        initialValue={desc}
                    >
                        <TextArea
                            placeholder='请输入商品描述'
                            autoSize={{ minRows: 2, maxRows: 8 }}
                        />
                    </Item>

                    <Item
                        label='商品价格'
                        name='productPrice'
                        initialValue={price}
                        rules={[
                            {
                                required: true,
                                message: '请输入商品价格！'
                            },
                            {
                                validator: (_, value) => {
                                    if (value * 1 < 0) {
                                        return Promise.reject(new Error('价格必须大于0！'))
                                    }
                                    return Promise.resolve()
                                }
                            }
                        ]}
                    >
                        <Input
                            type='number'
                            addonAfter='单位：元'
                            placeholder='请输入商品价格'
                        />
                    </Item>

                    <Item
                        label='商品分类'
                        name='productCategory'
                        initialValue={categoryNames}
                        rules={[
                            {
                                required: true,
                                message: '请选择商品分类！'
                            }
                        ]}
                    >
                        <Cascader
                            options={this.state.options}
                            loadData={this.loadData}
                            changeOnSelect
                            placeholder='请选择商品分类'

                        />
                    </Item>

                    <Item
                        label='商品图片'
                    // name='productImage'
                    >
                        <PicturesWall ref={this.picRef} imgs={this.product.imgs} />
                    </Item>

                    <Item
                        label='商品详情'
                        name='productDetail'
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 18 }}
                    >
                        <RichTextEditor ref={this.detailRef} details={detail} />
                    </Item>

                    <Item label=' ' colon={false}>
                        <Button size='large' type="primary" htmlType="submit">
                            提交
                        </Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}
