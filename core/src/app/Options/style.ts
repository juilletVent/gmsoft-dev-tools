import styled from "styled-components";
import optBg from "../../imgs/opt-bg.png";

export const OptionLayout = styled.div`
  min-width: 1250px;
  background: url(${optBg});
  background-attachment: fixed;
  .ant-card {
    background: #ffffff3f;
    backdrop-filter: blur(10px);
  }
`;

const FlexBasic = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const OptionHeaderLayout = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  z-index: 1;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0px;
  padding: 16px;
  border-bottom: 1px solid #e9e9e9;
  background: #fffefbfa;
  box-shadow: 0 0 5px #f1f1f1;
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
  .item-active {
    position: relative;
    &::before {
      content: "🚩";
      position: absolute;
      display: block;
      left: -20px;
      top: 0px;
      font-size: 22px;
    }
  }
`;

export const ContentLayout = styled.div`
  position: relative;
  padding: 20px;
  display: flex;
  gap: 20px;
`;

export const NavLayout = styled.div`
  width: 300px;
`;
export const ConfigLayout = styled.div`
  flex: none;
  width: 900px;
`;
