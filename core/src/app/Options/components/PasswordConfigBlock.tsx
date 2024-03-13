import { Form, Card, Input, List, Button } from "antd";
import { FormGroup, FormItemTitle } from "../../style/FormStyle";
import { BlockLayout } from "../style";
import { KeyboardEvent, useCallback, useEffect, useState } from "react";
import { ExtensionsStorageUtils } from "../../../utils/storage";

const { Item: FormItem } = Form;

function PasswordConfigBlock() {
  const [form] = Form.useForm();
  const [pwdList, setPwdList] = useState<string[]>([]);

  const onPwdKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        const pwd = form.getFieldValue("target");
        if (pwd) {
          setPwdList((list) => {
            const nList = [...list, pwd];
            ExtensionsStorageUtils.setConfig({ pwdList: nList });
            return nList;
          });
          form.setFieldsValue({ target: "" });
        }
      }
    },
    [form]
  );

  const onPwdDel = useCallback((pwd: string) => {
    setPwdList((list) => {
      const nList = list.filter((p) => p !== pwd);
      ExtensionsStorageUtils.setConfig({ pwdList: nList });
      return nList;
    });
  }, []);

  useEffect(() => {
    ExtensionsStorageUtils.getConfig().then((config) => {
      setPwdList(config.pwdList || []);
    });
  }, []);

  return (
    <BlockLayout>
      <Card title="密码管理（回车添加）">
        <Form name="pwd" form={form}>
          <FormGroup>
            <FormItemTitle>密码</FormItemTitle>
            <FormItem name="target">
              <Input placeholder="常用密码" onKeyDown={onPwdKeyDown} />
            </FormItem>
          </FormGroup>
        </Form>
        <List>
          {pwdList.map((pwd) => (
            <List.Item
              key={pwd}
              extra={
                <Button type="link" size="small" onClick={() => onPwdDel(pwd)}>
                  删除
                </Button>
              }
            >
              {pwd}
            </List.Item>
          ))}
        </List>
      </Card>
    </BlockLayout>
  );
}

export default PasswordConfigBlock;
