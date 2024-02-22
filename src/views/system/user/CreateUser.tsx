import { Modal, Form, Input, Select, Upload } from 'antd'
import { message } from '@/utils/AntdGlobal'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { useImperativeHandle, useState } from 'react'
import storage from '@/utils/storage'
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface'
import type { UploadChangeParam } from 'antd/es/upload'
import { IAction } from '@/types/modal'
import api from '@/api'

const CreateUser = (props: IModalProp) => {
  const [form] = Form.useForm()
  const [img, setImg] = useState('')
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [action, setAction] = useState<IAction>('create')

  // 暴露子元件open方法
  useImperativeHandle(props.mRef, () => {
    return {
      open
    }
  })

  // 打開彈窗顯示方法
  const open = (type: IAction, data?: User.UserItem) => {
    setVisible(true)
    setAction(type)

    if (type === 'edit' && data) {
      form.setFieldsValue(data)
      setImg(data.userImg)
    }
  }

  // 提交表單
  const handleSubmit = async () => {
    const valid = await form.validateFields()
    if (valid) {
      const params = {
        ...form.getFieldsValue(),
        userImg: img
      }
      if (action === 'create') {
        await api.createUser(params)
        message.success('创建成功')
        props.update()
      } else {
        await api.editUser(params)
        message.success('更新成功')
      }
      handleCancel()
      props.update()
    }
  }

  //
  const handleCancel = () => {
    setVisible(false)
    form.resetFields()
  }

  // 上傳之前，API處理
  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('只能上傳JPG/PNG格式的圖片')
      return false
    }
    const isLt2M = file.size / 1024 / 1024 < 0.5
    if (!isLt2M) {
      message.error('圖片大小不能超過500KB')
    }
    return isJpgOrPng && isLt2M
  }

  // 上傳後，圖片處理
  const handleChange: UploadProps['onChange'] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === 'uploading') {
      setLoading(true)
      return
    }

    if (info.file.status === 'done') {
      setLoading(false)
      const { code, data, msg } = info.file.response

      if (code === 0) {
        setImg(data.file)
      } else {
        message.error(msg)
      }
    } else if (info.file.status === 'error') {
      message.error('伺服器異常，請稍後重試')
    }
  }

  return (
    <Modal
      title='創建用戶'
      width={800}
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText='確定'
      cancelText='取消'
    >
      <Form form={form} labelCol={{ span: 4 }} labelAlign='right'>
        <Form.Item name='userId' hidden>
          <Input></Input>
        </Form.Item>
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
        <Form.Item label='部門' name='deptId'>
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
        <Form.Item label='用戶頭像' name='profile'>
          <Upload
            listType='picture-circle'
            showUploadList={false}
            headers={{
              Authorization: 'Bearer ' + storage.get('token'),
              icode: '775A5C5953C9AEC2'
            }}
            action='/api/users/upload'
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {img ? (
              <img
                src={img}
                alt='avatar'
                style={{ width: '100%', borderRadius: '100%' }}
              />
            ) : (
              <div>
                {loading ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 5 }}>上傳頭像</div>
              </div>
            )}
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateUser