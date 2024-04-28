import { Card, List, Button, Popconfirm } from "antd";
import { ImportOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import { BlockLayout } from "../style";
import { ConfigItem } from "./ConfigBlock";
import { BtnGroup } from "../../style/FormStyle";

type Props = {
  configs: ConfigItem[];
  currentKey?: string;
  onConfigAdd: () => void;
  onCopy: (item: ConfigItem) => void;
  onConfigEdit: (item: ConfigItem) => void;
  onConfigDel: (item: ConfigItem) => void;
  onConfigImport: () => void;
  onConfigExport: () => void;
};

function ConfigNavBlock(props: Props) {
  const {
    configs,
    currentKey,
    onConfigAdd,
    onCopy,
    onConfigEdit,
    onConfigDel,
    onConfigImport,
    onConfigExport,
  } = props;

  return (
    <BlockLayout>
      <Card title="⚙️ 配置管理">
        <List
          className="demo-loadmore-list"
          itemLayout="horizontal"
          dataSource={configs}
          renderItem={(item) => (
            <List.Item
              className={currentKey === item.key ? "item-active" : ""}
              actions={[
                <Button
                  onClick={() => onConfigEdit(item)}
                  key="edit"
                  type="link"
                  size="small"
                  title="编辑"
                >
                  ✏️
                </Button>,
                <Button
                  onClick={() => onCopy(item)}
                  key="delete"
                  type="link"
                  size="small"
                  title="复制"
                >
                  📚
                </Button>,
                <Popconfirm
                  placement="top"
                  title="确定删除吗？"
                  onConfirm={() => onConfigDel(item)}
                >
                  <Button key="delete" type="link" size="small" title="删除">
                    ❌
                  </Button>
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta title={item.title} />
            </List.Item>
          )}
        />
        <BtnGroup>
          <Button
            onClick={onConfigAdd}
            type="primary"
            block
            icon={<PlusOutlined />}
          >
            添加
          </Button>
          <Button onClick={onConfigImport} block icon={<ImportOutlined />}>
            导入
          </Button>
          <Button onClick={onConfigExport} block icon={<SaveOutlined />}>
            导出
          </Button>
        </BtnGroup>
      </Card>
    </BlockLayout>
  );
}

export default ConfigNavBlock;
