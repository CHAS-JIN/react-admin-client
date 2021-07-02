import React, { Component, createRef } from 'react'
import { Card, Input, Form, Cascader, Upload, Button } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { reqCategorys, reqCategoryName } from '../../api/index';

const { Item } = Form
const { TextArea } = Input

export default class AddUpdate extends Component {
    formRef = createRef()

    state = {
        options: []
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
    initOptions = (categorys) => {
        // 根据categorys生成options数组
        const options = categorys.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: false
        }))
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

    onFinish = (values) => {
        console.log(values);
    }

    UNSAFE_componentWillMount() {
        this.getCategorys('0')
    }

    async componentDidMount() {
        // 取出product携带的state，若是添加操作则没值，若是修改则有值
        const product = this.props.location.state
        const {name,desc,price,pCategoryId,categoryId} = product

        // 是否是更新的标识
        this.isUpdate = !!product
        // 保存商品，防止空对象报错
        // this.product = product || {}
        
        // 接收级联分类的数组
        const categoryNames = []
        // debugger
        if (this.isUpdate) {
            // 一级分类
            if (pCategoryId==='0') {
                const categoryName = await reqCategoryName(categoryId)
                categoryNames.push(categoryName)
            } else {
                const categoryName = await reqCategoryName(categoryId)
                const pCagegoryName = await reqCategoryName(pCategoryId)
                categoryNames.push(pCagegoryName.data.name)
                categoryNames.push(categoryName.data.name)
            }
        }

        // 设置表单初始值
        this.formRef.current.setFieldsValue({
            productName: this.isUpdate ? name : '',
            productDesc: this.isUpdate ? desc : '',
            productPrice: this.isUpdate ? price : '',
            productCategory: this.isUpdate ? categoryNames : '',
        })
    }

    render() {
        const { isUpdate } = this
        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 8 },
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
                    >
                        <TextArea
                            placeholder='请输入商品描述'
                            autoSize={{ minRows: 2, maxRows: 8 }}
                        />
                    </Item>

                    <Item
                        label='商品价格'
                        name='productPrice'
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

                    {/* <Item
                        label='商品图片'
                        name='productImage'
                    >
                        <Upload
                            action="/manage/img/upload"
                            listType="picture-card"
                            fileList=''
                        // onChange={onChange}
                        >

                        </Upload>
                    </Item>

                    <Item
                        label='商品详情'
                        name='productDetail'
                    >
                        <Input />
                    </Item>
 */}
                    <Item>
                        <Button type="primary" htmlType="submit">
                            提交
                        </Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}
