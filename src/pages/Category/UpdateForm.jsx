import React, { Component, createRef } from 'react';
import { Form, Input } from 'antd'

const Item = Form.Item

class AddForm extends Component {

    // 组件挂载后获取form下的API传回父组件
    formRef = createRef()
    componentDidMount() {
        this.props.setForm(this.formRef.current);
    }

    render() {
        // 获取父组件传来的类名
        const { categoryName } = this.props
        return (
            <Form ref={this.formRef}>
                <Item
                    name="categoryName"
                    rules={[
                        {
                            required: true,
                            message: "请输入分类名称"
                        }
                    ]}>
                    <Input placeholder={categoryName} />
                </Item>
            </Form>
        );
    }
}

export default AddForm;
