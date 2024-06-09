import { Modal, Form, TreeSelect, Input, InputNumber, Radio } from 'antd'
import { IAction, IModalProp } from '@/types/modal'
import { useImperativeHandle, useState, useEffect } from 'react'
import { Menu } from '@/types/api'
import { useForm } from 'antd/es/form/Form'
import { message } from '@/utils/AntdGlobal'
import { InfoCircleOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import api from '@/api'

function CreateMenu(props: IModalProp<Menu.EditParams>) {
  const { t } = useTranslation()
  const [form] = useForm()
  const [action, setAction] = useState<IAction>('create')
  const [visible, setVisible] = useState(false)
  const [menuList, setMenuList] = useState<Menu.MenuItem[]>([])

  useEffect(() => {}, [t])

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
      message.success(t('menuPanel.createSuccess'))
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
      title={action === 'create' ? 'Create Menu' : 'Edit Menu'}
      width={800}
      open={visible}
      okText='Save'
      cancelText='Cancel'
      onOk={handleSubmit}
      onCancel={handleCancel}
    >
      <Form
        form={form}
        labelAlign='right'
        labelCol={{ span: 4 }}
        initialValues={{ menuType: 1, menuState: 1 }}
      >
        <Form.Item label='Menu ID' name='_id' hidden>
          <Input disabled />
        </Form.Item>

        <Form.Item label={t('menuPanel.upperMenu')} name='parentId'>
          <TreeSelect
            placeholder={t('menuPanel.selectUpperMenu')}
            allowClear
            treeDefaultExpandAll
            fieldNames={{ label: 'menuName', value: '_id' }}
            treeData={menuList}
          ></TreeSelect>
        </Form.Item>

        <Form.Item label={t('menuPanel.menuType')} name='menuType'>
          <Radio.Group>
            <Radio value={1}>{t('menuPanel.menu')}</Radio>
            <Radio value={2}>{t('menuPanel.button')}</Radio>
            <Radio value={3}>{t('menuPanel.page')}</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label={t('menuPanel.menuName')}
          name='menuName'
          rules={[{ required: true, message: t('menuPanel.enterMenuName') }]}
        >
          <Input placeholder={t('menuPanel.enterMenuName')} />
        </Form.Item>

        <Form.Item noStyle shouldUpdate>
          {() => {
            return form.getFieldValue('menuType') === 2 ? (
              <Form.Item label='Permission' name='menuCode'>
                <Input placeholder='Please enter permission' />
              </Form.Item>
            ) : (
              <>
                <Form.Item label={t('menuPanel.menuIcon')} name='icon'>
                  <Input placeholder={t('menuPanel.enterMenuIcon')} />
                </Form.Item>

                <Form.Item label={t('menuPanel.routePath')} name='path'>
                  <Input placeholder={t('menuPanel.enterRoutePath')} />
                </Form.Item>
              </>
            )
          }}
        </Form.Item>

        <Form.Item label={t('menuPanel.componentName')} name='component'>
          <Input placeholder={t('menuPanel.enterComponentName')} />
        </Form.Item>

        <Form.Item
          label={t('menuPanel.order')}
          name='orderBy'
          tooltip={{
            title: t('menuPanel.orderDescription'),
            icon: <InfoCircleOutlined rev={undefined} />
          }}
        >
          <InputNumber
            style={{ width: 120 }}
            placeholder={t('menuPanel.enterOrderValue')}
          />
        </Form.Item>

        <Form.Item label={t('menuPanel.menuStatus')} name='menuState'>
          <Radio.Group>
            <Radio value={1}>{t('menuPanel.enable')}</Radio>
            <Radio value={2}>{t('menuPanel.disable')}</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateMenu
