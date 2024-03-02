import { Modal, Form, TreeSelect, Input, InputNumber, Radio } from 'antd'
import { IAction, IModalProp } from '@/types/modal'
import { useImperativeHandle, useState } from 'react'
import { Menu } from '@/types/api'
import { useForm } from 'antd/es/form/Form'
import api from '@/api'
import { message } from '@/utils/AntdGlobal'
import { InfoCircleOutlined } from '@ant-design/icons'

function CreateMenu(props: IModalProp<Menu.EditParams>) {
  const [form] = useForm()
  const [action, setAction] = useState<IAction>('create')
  const [visible, setVisible] = useState(false)
  const [menuList, setMenuList] = useState<Menu.MenuItem[]>([])

  const getMenuList = async () => {
    const data = await api.getMenuList()
    setMenuList(data)
  }

  useImperativeHandle(props.mRef, () => {
    return { open }
  })

  const open = (
    type: IAction,
    data?: Menu.EditParams | { parentId: string }
  ) => {
    setAction(type)
    setVisible(true)
    getMenuList()
    if (data) {
      form.setFieldsValue(data)
    }
  }

  // Submit the form
  const handleSubmit = async () => {
    const value = await form.validateFields()
    if (value) {
      if (action === 'create') {
        await api.createMenu(form.getFieldsValue())
      } else {
        await api.editMenu(form.getFieldsValue())
      }
      message.success('操作成功')
      handleCancel()
      props.update()
    }
  }

  // Close and reset the modal
  const handleCancel = () => {
    setVisible(false)
    form.resetFields()
  }

  return (
    <Modal
      title={action === 'create' ? '創建菜單' : '編輯菜單'}
      width={800}
      open={visible}
      okText='確定'
      cancelText='取消'
      onOk={handleSubmit}
      onCancel={handleCancel}
    >
      <Form
        form={form}
        labelAlign='right'
        labelCol={{ span: 4 }}
        initialValues={{ menuType: 1, menuState: 1 }}
      >
        <Form.Item label='菜單ID' name='_id' hidden>
          <Input disabled />
        </Form.Item>

        <Form.Item label='上級菜單' name='parentId'>
          <TreeSelect
            placeholder='請選擇上級菜單'
            allowClear
            treeDefaultExpandAll
            fieldNames={{ label: 'menuName', value: '_id' }}
            treeData={menuList}
          ></TreeSelect>
        </Form.Item>

        <Form.Item label='菜單類型' name='menuType'>
          <Radio.Group>
            <Radio value={1}>菜單</Radio>
            <Radio value={2}>按鈕</Radio>
            <Radio value={3}>頁面</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label='菜單名稱'
          name='menuName'
          rules={[{ required: true, message: '請輸入菜單名稱' }]}
        >
          <Input placeholder='請輸入菜單名稱' />
        </Form.Item>

        <Form.Item noStyle shouldUpdate>
          {() => {
            return form.getFieldValue('menuType') === 2 ? (
              <Form.Item label='權限標示' name='menuCode'>
                <Input placeholder='請輸入權限標示' />
              </Form.Item>
            ) : (
              <>
                <Form.Item label='菜單圖標' name='icon'>
                  <Input placeholder='請輸入菜單圖標' />
                </Form.Item>

                <Form.Item label='路由地址' name='path'>
                  <Input placeholder='請輸入路由地址' />
                </Form.Item>
              </>
            )
          }}
        </Form.Item>

        <Form.Item label='組件名稱' name='component'>
          <Input placeholder='請輸入組件名稱' />
        </Form.Item>

        <Form.Item
          label='排序'
          name='orderBy'
          tooltip={{
            title: '排序值越大越靠後',
            icon: <InfoCircleOutlined rev={undefined} />
          }}
        >
          <InputNumber placeholder='請輸入排序值' />
        </Form.Item>

        <Form.Item label='菜單狀態' name='menuState'>
          <Radio.Group>
            <Radio value={1}>啟用</Radio>
            <Radio value={2}>停用</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateMenu
