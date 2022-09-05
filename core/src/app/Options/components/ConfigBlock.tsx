import { Card, Form, Button, Input, List, Empty, message } from "antd";
import { CheckOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import FormItem from "antd/es/form/FormItem";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { BtnGroup } from "../../style/FormStyle";
import { BlockLayout } from "../style";
import Tags from "../../../components/Tags";
import { set, uniqueId } from "lodash";

const ConfigBlockLayout = styled.div`
  .ant-list-item-action {
    position: absolute;
    right: -16px;
  }
  .ant-form-item {
    flex: auto;
  }
  .ant-list {
    margin-top: 50px;
    padding-top: 30px;
    border-top: 1px dashed #e9e9e9;
  }
`;
const RuleLayout = styled.div`
  display: flex;
  flex-direction: column;
  flex: auto;
`;
const layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 20 },
};

export type RuleItem = {
  key: string;
  /** 目标域名 */
  domain: string;
  /** 接口匹配模式组 */
  pattern: string[];
};

export type ConfigItem = {
  key: string;
  /** 配置名 */
  title: string;
  /** Cookie keys */
  cookiesPettern: string[];
  /** 接口匹配组 */
  rules: RuleItem[];
};

function renderItem<T extends RuleItem>(item: T, onDel: (item: T) => void) {
  return (
    <List.Item
      actions={[
        <Button
          onClick={() => onDel(item)}
          key="delete"
          shape="circle"
          type="primary"
          danger
        >
          <DeleteOutlined />
        </Button>,
      ]}
    >
      <RuleLayout>
        <FormItem
          label="目标域名"
          name={["rules", item.key, "domain"]}
          requiredMark
          initialValue={item.domain}
          rules={[
            {
              required: true,
              message: "空起咩？？？",
            },
            {
              max: 100,
              message: "太长了！！！",
            },
          ]}
        >
          <Input placeholder="请输入目标域名" allowClear />
        </FormItem>
        <FormItem
          label="目标接口"
          name={["rules", item.key, "pattern"]}
          requiredMark
          initialValue={item.pattern}
          rules={[
            {
              required: true,
              message: "空起咩？？？",
            },
          ]}
        >
          <Tags />
        </FormItem>
      </RuleLayout>
    </List.Item>
  );
}

type Props = {
  config?: ConfigItem;
  onConfigSave: (vals: any) => void;
};

function ConfigBlock(props: Props) {
  const { config, onConfigSave } = props;
  const [rules, setRules] = useState<RuleItem[]>(config?.rules || []);
  const [form] = Form.useForm();
  const onRuleAdd = useCallback(() => {
    setRules([
      ...rules,
      { key: `item-${Date.now()}-${uniqueId()}`, domain: "", pattern: [] },
    ]);
  }, [rules]);
  const onRuleDel = useCallback(
    (target: RuleItem) => {
      if (rules.length <= 1) {
        message.info("一条规则都没得，玩儿个毛线");
        return;
      }
      setRules(rules.filter((item) => item.key !== target.key));
    },
    [rules]
  );
  const onSave = useCallback(() => {
    form.validateFields().then(
      (vals) => {
        onConfigSave({
          ...vals,
          cookiesPettern: vals.cookiesPettern.map((i: string) => i.trim()),
          key: config?.key,
        });
      },
      () => {}
    );
  }, [config?.key, form, onConfigSave]);

  useEffect(() => {
    if (!config) {
      return;
    }
    setRules(config.rules);

    const rulesVal: any = {};
    config.rules.forEach((item) => {
      set(rulesVal, [item.key, "pattern"], item.pattern);
      set(rulesVal, [item.key, "domain"], item.domain);
    });
    const formVals = {
      title: config.title,
      cookiesPettern: config.cookiesPettern,
      rules: rulesVal,
    };
    form.resetFields(["rules"]);
    form.setFieldsValue(formVals);
  }, [config, form]);

  if (!config) {
    return (
      <BlockLayout>
        <ConfigBlockLayout>
          <Card title="配置明细">
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </Card>
        </ConfigBlockLayout>
      </BlockLayout>
    );
  }

  return (
    <BlockLayout>
      <ConfigBlockLayout>
        <Card title="配置明细">
          <Form name="popup" form={form} {...layout}>
            <FormItem
              label="标题"
              name="title"
              requiredMark
              initialValue={config.title}
              rules={[
                {
                  required: true,
                  message: "空起咩？？？",
                },
                {
                  max: 20,
                  message: "太长了！！！",
                },
              ]}
            >
              <Input placeholder="请输入标题" allowClear />
            </FormItem>
            <FormItem
              label="Cookie Key"
              name="cookiesPettern"
              requiredMark
              initialValue={config.cookiesPettern}
              rules={[
                {
                  required: true,
                  message: "空起咩？？？",
                },
              ]}
            >
              <Tags />
            </FormItem>
            <List<RuleItem>
              itemLayout="horizontal"
              dataSource={rules}
              renderItem={(item) => renderItem(item, onRuleDel)}
            />
          </Form>
          <BtnGroup>
            <Button onClick={onRuleAdd} icon={<PlusOutlined />} type="dashed">
              添加域名配置
            </Button>
            <Button onClick={onSave} type="primary" icon={<CheckOutlined />}>
              保存
            </Button>
          </BtnGroup>
        </Card>
      </ConfigBlockLayout>
    </BlockLayout>
  );
}

export default ConfigBlock;
