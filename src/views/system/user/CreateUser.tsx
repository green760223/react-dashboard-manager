import { useEffect, useImperativeHandle, useState } from 'react'
import { Modal, Form, Input, Select, Upload, TreeSelect } from 'antd'
import { message } from '@/utils/AntdGlobal'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface'
import type { UploadChangeParam } from 'antd/es/upload'
import { IAction, IModalProp } from '@/types/modal'
import { Dept, Role, User } from '@/types/api'
import roleApi from '@/api/roleApi'
import api from '@/api'
import storage from '@/utils/storage'

const CreateUser = (props: IModalProp) => {
  const [form] = Form.useForm()
  const [img, setImg] = useState('')
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [action, setAction] = useState<IAction>('create')
  const [deptList, setDeptList] = useState<Dept.DeptItem[]>([])
  const [roleList, setRoleList] = useState<Role.RoleItem[]>([])

  useEffect(() => {
    getDeptList()
    getAllRoleList()
  }, [])

  // 獲取部門列表
  const getDeptList = async () => {
    const list = await api.getDeptList()
    setDeptList(list)
  }

  const getAllRoleList = async () => {
    const list = await roleApi.getAllRoleList()
    setRoleList(list)
  }

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
        message.success('創建成功')
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
    setImg('')
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

  // 上傳圖片格式處理
  const normFile = (e: any) => {
    console.log('Upload event:', e)
    if (Array.isArray(e)) {
      return e
    }
    return e && e.fileList
  }

  return (
    <Modal
      title={action === 'create' ? '創建用戶' : '編輯用戶'}
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
          rules={[
            { required: true, message: '請輸入用戶名稱' },
            {
              min: 3,
              max: 12,
              message: '用戶名稱最小3個字符，最大12字符'
            }
          ]}
        >
          <Input placeholder='請輸入用戶名稱'></Input>
        </Form.Item>
        <Form.Item
          label='用戶信箱'
          name='userEmail'
          rules={[
            { required: true, message: '請輸入用戶信箱' },
            { type: 'email', message: '請輸入正確的信箱格式' },
            {
              pattern: /^\w+@mars.com$/,
              message: '請輸入格式為mars.com結尾的信箱'
            }
          ]}
        >
          <Input
            placeholder='請輸入用戶信箱'
            disabled={action === 'edit'}
          ></Input>
        </Form.Item>
        <Form.Item
          label='手機'
          name='mobile'
          rules={[
            { len: 11, message: '請輸入11位手機號' },
            { pattern: /1[1-9]\d{9}/, message: '請輸入為1開頭的手機號' }
          ]}
        >
          <Input type='number' placeholder='請輸入手機'></Input>
        </Form.Item>
        <Form.Item
          label='部門'
          name='deptId'
          rules={[
            {
              required: true,
              message: '請選擇部門'
            }
          ]}
        >
          <TreeSelect
            placeholder='請選擇部門'
            allowClear
            treeDefaultExpandAll
            showCheckedStrategy={TreeSelect.SHOW_ALL}
            treeData={deptList}
            fieldNames={{
              label: 'deptName',
              value: '_id'
            }}
          />
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
        <Form.Item label='系統角色' name='roleList'>
          <Select placeholder='請選擇角色'>
            {roleList.map(item => {
              return (
                <Select.Option key={item._id} value={item._id}>
                  {item.roleName}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>
        <Form.Item
          label='用戶頭像'
          name='profile'
          valuePropName='fileList'
          getValueFromEvent={normFile}
        >
          <Upload
            listType='picture-circle'
            showUploadList={false}
            action='/api/users/upload'
            beforeUpload={beforeUpload}
            onChange={handleChange}
            headers={{
              Authorization: 'Bearer ' + storage.get('token'),
              icode: '775A5C5953C9AEC2'
            }}
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
                <div style={{ marginTop: 8 }}>上傳頭像</div>
              </div>
            )}
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateUser
