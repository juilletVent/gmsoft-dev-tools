import styled from "styled-components";

export const OptionLayout = styled.div`
  min-height: 100vh;
`;

const FlexBasic = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const OptionHeaderLayout = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0px;
  padding: 16px;
  border-bottom: 1px solid #e9e9e9;
`;
export const OptionHeaderLeft = styled(FlexBasic)`
  user-select: none;
  img {
    pointer-events: none;
  }
`;
export const OptionHeaderRight = styled(FlexBasic)`
  justify-content: flex-end;
`;

export const Logo = styled.img`
  width: 30px;
  object-fit: cover;
`;
export const Title = styled.h3`
  margin: 0;
  color: #333;
`;

export const HeaderLinks = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  img {
    width: 25px;
    border: 1px solid transparent;
    border-radius: 200px;
    cursor: pointer;
    transition: 0.3s;
    &:hover {
      border-color: #1890ff;
    }
  }
`;

export const BlockLayout = styled.div`
  margin-bottom: 20px;
  .ant-list-item-meta-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .ant-list-item-action {
    margin-left: 5px;
    button {
      padding: 0;
    }
  }
`;

export const ContentLayout = styled.div`
  position: relative;
  width: 1000px;
  margin: 20px auto;
`;

const width = 280;
export const NavLayout = styled.div`
  position: absolute;
  margin-left: -${width + 20}px;
  width: ${width}px;
`;
export const ConfigLayout = styled.div``;
