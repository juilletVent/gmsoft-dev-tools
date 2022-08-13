import { Form, Switch, Select, Card } from "antd";
import { FormGroup, FormItemTitle } from "../style/FormStyle";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { BlockLayout } from "./style";
import { useSwitch } from "../hooks/useSwitch";

const { Item: FormItem } = Form;
const { Option } = Select;

function SwitchBlock() {
  const [form] = Form.useForm();
  const { onValuesChange } = useSwitch(form);

  return (
    <BlockLayout>
      <Card title="功能管理">
        <Form name="popup" form={form} onValuesChange={onValuesChange}>
          <FormGroup>
            <FormItemTitle>拦截开关</FormItemTitle>
            <FormItem name="open" valuePropName="checked">
              <Switch
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                defaultChecked
              />
            </FormItem>
          </FormGroup>
          <FormGroup>
            <FormItemTitle>拦截配置</FormItemTitle>
            <FormItem name="target">
              <Select>
                <Option value="test1-zcj">test1-zcj</Option>
                <Option value="test1-xcj">test1-xcj</Option>
                <Option value="show-zcj">show-zcj</Option>
                <Option value="show-xcj">show-xcj</Option>
              </Select>
            </FormItem>
          </FormGroup>
        </Form>
      </Card>
    </BlockLayout>
  );
}

export default SwitchBlock;
