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
        message.success('Create success')
      } else {
        await api.editUser(params)
        message.success('Edit success')
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
      message.error('Only support JPG or PNG file!')
      return false
    }
    const isLt2M = file.size / 1024 / 1024 < 0.5
    if (!isLt2M) {
      message.error('Image must smaller than 0.5MB!')
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
      message.error('Upload failed!')
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
      title={action === 'create' ? 'Create User' : 'Edit User'}
      width={800}
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText='Submit'
      cancelText='Cancel'
    >
      <Form form={form} labelCol={{ span: 4 }} labelAlign='right'>
        <Form.Item name='userId' hidden>
          <Input></Input>
        </Form.Item>
        <Form.Item
          label='User Name'
          name='userName'
          rules={[
            { required: true, message: 'Please enter the username' },
            {
              min: 3,
              max: 12,
              message:
                'Username must be at least 3 characters and maximum 12 characters'
            }
          ]}
        >
          <Input placeholder='Please enter the username'></Input>
        </Form.Item>
        <Form.Item
          label='User Email'
          name='userEmail'
          rules={[
            { required: true, message: 'Please enter user email' },
            { type: 'email', message: 'Please enter a valid email format' },
            {
              // pattern: /^\w+@mars.com$/,
              // message: 'Please enter an email ending with mars.com format'
            }
          ]}
        >
          <Input
            placeholder='Please enter user email'
            disabled={action === 'edit'}
          ></Input>
        </Form.Item>
        <Form.Item
          label='Mobile'
          name='mobile'
          rules={[
            { len: 11, message: 'Please enter an 11-digit phone number' },
            {
              pattern: /1[1-9]\d{9}/,
              message: 'Please enter a phone number starting with 1'
            }
          ]}
        >
          <Input type='number' placeholder='Please enter mobile number'></Input>
        </Form.Item>
        <Form.Item
          label='Department'
          name='deptId'
          rules={[
            {
              required: true,
              message: 'Please select the department'
            }
          ]}
        >
          <TreeSelect
            placeholder='Please select the department'
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
        <Form.Item label='Job Position' name='job'>
          <Input placeholder='Please enter the job position'></Input>
        </Form.Item>
        <Form.Item label='Status' name='state'>
          <Select>
            <Select.Option value={1}>Employed</Select.Option>
            <Select.Option value={2}>Resigned</Select.Option>
            <Select.Option value={3}>Probationary</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label='Role List' name='roleList'>
          <Select placeholder='Please select a role'>
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
          label='Avatar'
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
                <div style={{ marginTop: 8 }}>Upload Avatar</div>
              </div>
            )}
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateUser
