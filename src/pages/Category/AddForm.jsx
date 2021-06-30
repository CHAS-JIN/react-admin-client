import React, { Component, createRef } from 'react';
import { Form, Select, Input } from 'antd'

const Item = Form.Item
const Option = Select.Option

class AddForm extends Component {

    // 组件挂载后获取form下的API传回父组件
    formRef = createRef()
    componentDidMount() {
        this.props.setForm(this.formRef.current);
    }

    render() {
        const { categorys } = this.props
        return (
            <Form ref={this.formRef}>
                <Item
                    name="parentId"
                    rules={[
                        {
                            required: true,
                            message: "请选择要添加的类别"
                        }
                    ]}
                >
                    <Select placeholder='请选择要添加的类别'>
                        <Option value="0">一级分类</Option>
                        {
                            categorys.map(Item => {
                                return (
                                    <Option key={Item._id} value={Item._id}>{Item.name}</Option>
                                )
                            })
                        }
                    </Select>
                </Item>

                <Item
                    name="categoryName"
                    rules={[
                        {
                            required: true,
                            message: "请输入分类名称"
                        }
                    ]}>
                    <Input placeholder='请输入类名' />
                </Item>


            </Form>
        );
    }
}

export default AddForm;
