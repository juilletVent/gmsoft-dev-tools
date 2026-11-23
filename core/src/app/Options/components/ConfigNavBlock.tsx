import { useCallback } from "react";
import { Card, List, Button, Popconfirm } from "antd";
import {
  HolderOutlined,
  ImportOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { BlockLayout } from "../style";
import { ConfigItem } from "./ConfigBlock";
import { BtnGroup } from "../../style/FormStyle";

type ItemHandlers = {
  onConfigEdit: (item: ConfigItem) => void;
  onCopy: (item: ConfigItem) => void;
  onConfigDel: (item: ConfigItem) => void;
};

type SortableConfigItemProps = ItemHandlers & {
  item: ConfigItem;
  active: boolean;
};

function SortableConfigItem(props: SortableConfigItemProps) {
  const { item, active, onConfigEdit, onCopy, onConfigDel } = props;
  const { listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.key });

  return (
    <List.Item
      ref={setNodeRef}
      className={active ? "item-active" : ""}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : undefined,
        position: "relative",
        zIndex: isDragging ? 1 : undefined,
      }}
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
      <span className="drag-handle" title="拖动排序" {...listeners}>
        <HolderOutlined />
      </span>
      <List.Item.Meta title={item.title} />
    </List.Item>
  );
}

type Props = ItemHandlers & {
  configs: ConfigItem[];
  currentKey?: string;
  onConfigAdd: () => void;
  onConfigReorder: (activeKey: string, overKey: string) => void;
  onConfigImport: () => void;
  onConfigExport: () => void;
};

function ConfigNavBlock(props: Props) {
  const {
    configs,
    currentKey,
    onConfigAdd,
    onConfigReorder,
    onConfigImport,
    onConfigExport,
    ...itemHandlers
  } = props;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  );

  const onDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      if (over && active.id !== over.id) {
        onConfigReorder(String(active.id), String(over.id));
      }
    },
    [onConfigReorder],
  );

  return (
    <BlockLayout>
      <Card title="⚙️ 配置管理">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={onDragEnd}
        >
          <SortableContext
            items={configs.map((config) => config.key)}
            strategy={verticalListSortingStrategy}
          >
            <List
              className="demo-loadmore-list"
              itemLayout="horizontal"
              dataSource={configs}
              renderItem={(item) => (
                <SortableConfigItem
                  item={item}
                  active={currentKey === item.key}
                  {...itemHandlers}
                />
              )}
            />
          </SortableContext>
        </DndContext>
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
