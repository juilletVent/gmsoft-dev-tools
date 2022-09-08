import { Card, Form, Button, Input, List, Empty, message, Alert } from "antd";
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
  .desc ul {
    padding-left: 0;
  }
  ol li {
    margin: 5px 0;
  }
  .ant-alert {
    margin-bottom: 20px;
  }
  .code {
    display: inline-block;
    padding: 1px 8px;
    background: #f9f9f9;
    border: 1px solid #d9d9d9;
    border-radius: 3px;
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
  /** 参数替换模式组，使用$$分隔匹配模式换替换值，前者为匹配模式，后者为替换值 */
  replaceParams: string[];
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
        <FormItem
          label="参数替换"
          name={["rules", item.key, "replaceParams"]}
          initialValue={item.replaceParams}
          // rules={[
          //   {
          //     required: true,
          //     message: "空起咩？？？",
          //   },
          // ]}
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
      {
        key: `item-${Date.now()}-${uniqueId()}`,
        domain: "",
        pattern: [],
        replaceParams: [],
      },
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
          <Alert
            showIcon
            closable
            type="info"
            message="配置样例"
            description={
              <div className="desc">
                <ul>
                  <li>
                    Cookie Key（匹配逻辑为正则表达式）：
                    <span className="code">Auth</span>
                  </li>
                  <li>
                    目标接口（匹配逻辑为includes判定，非正则表达式）：
                    <span className="code">/xcj-gateway</span>
                  </li>
                  <li>
                    参数替换（使用&nbsp;<strong>#$$#</strong>
                    &nbsp;分隔匹配模式与替换值），匹配模式为正则，并且认定为全局匹配（带有g标志位），请格外注意想要匹配的目标值是否存在URL转码或者转义：
                    <ol>
                      <li>
                        <span className="code">name(?=Other)#$$#title</span>
                      </li>
                      <li>
                        <span className="code">
                          localhost((:|%3A)\d+)?#$$#www.cqzcjshow.com
                        </span>
                      </li>
                      <li>
                        <span className="code">aaaaa#$$#bbbbb</span>
                      </li>
                    </ol>
                  </li>
                </ul>
              </div>
            }
          />
          <BtnGroup>
            <Button onClick={onRuleAdd} icon={<PlusOutlined />}>
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
