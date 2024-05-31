import { useEffect, useImperativeHandle, useState } from 'react'
import { Modal, Form, Input, Select, Upload, TreeSelect } from 'antd'
import { message } from '@/utils/AntdGlobal'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface'
import type { UploadChangeParam } from 'antd/es/upload'
import { IAction, IModalProp } from '@/types/modal'
import { Dept, Role, User } from '@/types/api'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()

  useEffect(() => {
    getDeptList()
    getAllRoleList()
  }, [t])

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
        message.success(t('userPanel.createSuccess'))
      } else {
        await api.editUser(params)
        message.success(t('userPanel.editSuccess'))
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
      message.error(t('userPanel.uploadFormat'))
      return false
    }
    const isLt2M = file.size / 1024 / 1024 < 0.5
    if (!isLt2M) {
      message.error(t('userPanel.uploadSize'))
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
      message.error(t('userPanel.uploadFailed'))
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
      title={
        action === 'create'
          ? t('userPanel.createUser')
          : t('userPanel.editUser')
      }
      width={800}
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText={t('userPanel.submit')}
      cancelText={t('userPanel.cancel')}
    >
      <Form form={form} labelCol={{ span: 4 }} labelAlign='right'>
        <Form.Item name='userId' hidden>
          <Input></Input>
        </Form.Item>
        <Form.Item
          label={t('userPanel.userName')}
          name='userName'
          rules={[
            { required: true, message: t('userPanel.enterUserName') },
            {
              min: 3,
              max: 12,
              message: t('userPanel.userNameRequired')
            }
          ]}
        >
          <Input placeholder={t('userPanel.enterUserName')}></Input>
        </Form.Item>
        <Form.Item
          label={t('userPanel.userEmail')}
          name='userEmail'
          rules={[
            { required: true, message: t('userPanel.emailRequired') },
            { type: 'email', message: t('userPanel.emailFormat') },
            {
              // pattern: /^\w+@mars.com$/,
              // message: 'Please enter an email ending with mars.com format'
            }
          ]}
        >
          <Input
            placeholder={t('userPanel.emailRequired')}
            disabled={action === 'edit'}
          ></Input>
        </Form.Item>
        <Form.Item
          label={t('userPanel.mobile')}
          name='mobile'
          rules={[
            {
              validator: (_, value) => {
                if (value && value.length !== 11) {
                  return Promise.reject(
                    new Error(t('userPanel.mobileRequired'))
                  )
                }
                if (value && !/^1[1-9]\d{9}$/.test(value)) {
                  return Promise.reject(new Error(t('userPanel.mobileFormat')))
                }
                return Promise.resolve()
              }
            }
          ]}
        >
          <Input
            type='text'
            placeholder={t('userPanel.mobileRequired')}
          ></Input>
        </Form.Item>
        <Form.Item
          label={t('userPanel.department')}
          name='deptId'
          rules={[
            {
              required: true,
              message: t('userPanel.departmentRequired')
            }
          ]}
        >
          <TreeSelect
            placeholder={t('userPanel.departmentRequired')}
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
        <Form.Item label={t('userPanel.jobPosition')} name='job'>
          <Input placeholder={t('userPanel.jobPositionRequired')}></Input>
        </Form.Item>
        <Form.Item label={t('userPanel.status')} name='state'>
          <Select>
            <Select.Option value={1}>{t('userPanel.employed')}</Select.Option>
            <Select.Option value={2}>{t('userPanel.resigned')}</Select.Option>
            <Select.Option value={3}>
              {t('userPanel.probationary')}
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label={t('userPanel.role')} name='roleList'>
          <Select placeholder={t('userPanel.roleRequired')}>
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
          label={t('userPanel.avatar')}
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
                <div style={{ marginTop: 8 }}>{t('userPanel.upload')}</div>
              </div>
            )}
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateUser
