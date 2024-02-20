import { Modal, Form, Input, Select } from 'antd'

function CreateUser() {
  const [form] = Form.useForm()

  const handleSubmit = async () => {
    const vaild = await form.validateFields()
    console.log(vaild)
  }

  const handleCancel = () => {}

  return (
    <Modal
      title='創建用戶'
      width={800}
      open={true}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText='確定'
      cancelText='取消'
    >
      <Form form={form} labelCol={{ span: 4 }} labelAlign='right'>
        <Form.Item
          label='用戶名稱'
          name='userName'
          rules={[{ required: true, message: '請輸入用戶名稱' }]}
        >
          <Input placeholder='請輸入用戶名稱'></Input>
        </Form.Item>
        <Form.Item
          label='用戶信箱'
          name='userEmail'
          rules={[{ required: true, message: '請輸入用戶信箱' }]}
        >
          <Input placeholder='請輸入用戶信箱'></Input>
        </Form.Item>
        <Form.Item label='手機' name='mobile'>
          <Input type='number' placeholder='請輸入手機'></Input>
        </Form.Item>
        <Form.Item
          label='部門'
          name='deptId'
          rules={[{ required: true, message: '請輸入部門' }]}
        >
          <Input placeholder='請輸入部門'></Input>
        </Form.Item>
        <Form.Item label='崗位' name='job'>
          <Input placeholder='請輸入崗位'></Input>
        </Form.Item>
        <Form.Item label='狀態' name='state'>
          <Select>
            <Select.Option value={1}>在職</Select.Option>
            <Select.Option value={2}>離職</Select.Option>
            <Select.Option value={3}>試用期</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label='角色' name='roleList'>
          <Input placeholder='請輸入角色'></Input>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateUser
