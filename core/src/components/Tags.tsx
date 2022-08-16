import React, { useEffect, useRef, useState } from "react";
import { InputRef, Input, Tag, Tooltip } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import styled from "styled-components";

const TagLayout = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  .ant-input {
    min-width: 200px;
    width: auto;
  }
  .ant-tag {
    margin: 0;
  }
  .site-tag-plus {
    cursor: pointer;
  }
`;

interface Props {
  value?: string[];
  onChange?: (val: string[]) => void;
}

function Tags(props: Props) {
  const { value, onChange } = props;
  const inputRef = useRef<InputRef>(null);
  const editInputRef = useRef<InputRef>(null);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState("");
  const handleClose = (removedTag: string) => {
    const newTags = value?.filter((tag) => tag !== removedTag);
    if (onChange) {
      onChange(newTags || []);
    }
  };
  const showInput = () => {
    setInputVisible(true);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  const handleInputConfirm = () => {
    const vals = value || [];
    if (inputValue && vals.indexOf(inputValue) === -1) {
      if (onChange) {
        onChange([...vals, inputValue]);
      }
    }
    setInputVisible(false);
    setInputValue("");
  };
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditInputValue(e.target.value);
  };

  const handleEditInputConfirm = () => {
    const newTags = [...(value || [])];
    newTags[editInputIndex] = editInputValue;
    if (onChange) {
      onChange(newTags);
    }
    setEditInputIndex(-1);
    setInputValue("");
  };

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  return (
    <TagLayout>
      {value?.map((tag, index) => {
        if (editInputIndex === index) {
          return (
            <Input
              ref={editInputRef}
              key={tag}
              size="small"
              className="tag-input"
              value={editInputValue}
              onChange={handleEditInputChange}
              onBlur={handleEditInputConfirm}
              onPressEnter={handleEditInputConfirm}
            />
          );
        }

        const isLongTag = tag.length > 20;

        const tagElem = (
          <Tag
            className="edit-tag"
            key={tag}
            closable
            onClose={() => handleClose(tag)}
          >
            <span
              onDoubleClick={(e) => {
                if (index !== 0) {
                  setEditInputIndex(index);
                  setEditInputValue(tag);
                  e.preventDefault();
                }
              }}
            >
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </span>
          </Tag>
        );
        return isLongTag ? (
          <Tooltip title={tag} key={tag}>
            {tagElem}
          </Tooltip>
        ) : (
          tagElem
        );
      })}
      {inputVisible && (
        <Input
          ref={inputRef}
          type="text"
          size="small"
          className="tag-input"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      )}
      {!inputVisible && (
        <Tag className="site-tag-plus" onClick={showInput} color="#1890ff">
          <PlusOutlined /> 添加
        </Tag>
      )}
    </TagLayout>
  );
}

export default Tags;
