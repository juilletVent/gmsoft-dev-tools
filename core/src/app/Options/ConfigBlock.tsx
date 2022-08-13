import { Card, Form, Button, Input } from "antd";
import { BlockLayout } from "./style";
import { CheckOutlined, DeleteOutlined } from "@ant-design/icons";
import { BtnGroup } from "../style/FormStyle";
import FormItem from "antd/es/form/FormItem";
import { useCallback } from "react";

function ConfigBlock() {
  const [form] = Form.useForm();

  const onSave = useCallback(() => {
    form.validateFields();
  }, [form]);

  return (
    <BlockLayout>
      <Card title="规则明细">
        <Form name="popup" form={form}>
          <FormItem
            label="Cookie Key"
            name="cookiesPettern"
            requiredMark
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input
              placeholder="请输入需要同步的Cookie key，多个使用英文逗号分隔"
              allowClear
            />
          </FormItem>
        </Form>
        <BtnGroup>
          <Button onClick={onSave} type="primary" icon={<CheckOutlined />}>
            保存
          </Button>
          <Button danger icon={<DeleteOutlined />}>
            删除
          </Button>
        </BtnGroup>
      </Card>
    </BlockLayout>
  );
}

export default ConfigBlock;
