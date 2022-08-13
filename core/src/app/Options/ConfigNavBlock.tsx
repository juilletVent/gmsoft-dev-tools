import { Card, List, Button } from "antd";
import { BlockLayout } from "./style";
import { PlusOutlined } from "@ant-design/icons";

function ConfigNavBlock() {
  const data = ["test1-zcj", "test1-xcj", "show-zcj", "show-xcj"];

  return (
    <BlockLayout>
      <Card title="配置管理">
        <List
          className="demo-loadmore-list"
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button key="edit" type="link" size="small">
                  编辑
                </Button>,
                <Button key="delete" type="link" size="small">
                  删除
                </Button>,
              ]}
            >
              <List.Item.Meta title={item} />
            </List.Item>
          )}
        />
        <Button type="dashed" block icon={<PlusOutlined />}>
          添加配置
        </Button>
      </Card>
    </BlockLayout>
  );
}

export default ConfigNavBlock;
