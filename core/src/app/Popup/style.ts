import styled from "styled-components";

export const PopupLayout = styled.div`
  min-width: 320px;
`;
export const PopupContentLayout = styled.div`
  padding: 16px 20px;
  min-height: 350px;
`;

const FlexBasic = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
export const PopupHeaderLayout = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0px;
  padding: 16px;
  border-bottom: 1px solid #f3f3f3;
`;
export const PopupHeaderLeft = styled(FlexBasic)`
  user-select: none;
  img {
    pointer-events: none;
  }
`;
export const PopupHeaderRight = styled(FlexBasic)`
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

export const PopupFooterLayout = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  color: #4d4d4d;
  background-color: #f3f3f3;
`;
export const PopupFooterLinks = styled.div`
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
