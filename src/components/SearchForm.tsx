import { Form, Space, Button } from 'antd'

/**
 * 搜索表單容器組件封裝
 * @param props
 * @returns
 */
function SearchForm(props: any) {
  return (
    <Form
      className='search-form'
      form={props.form}
      layout='inline'
      initialValues={props.initialValues}
    >
      {
        // 遍歷搜索表單元素
        props.children
      }
      <Form.Item>
        <Space>
          <Button type='primary' onClick={props.submit}>
            搜索
          </Button>
          <Button type='default' onClick={props.reset}>
            重置
          </Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default SearchForm
