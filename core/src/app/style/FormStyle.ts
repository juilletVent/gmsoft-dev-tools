import styled from "styled-components";

export const FormGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  .ant-form-item {
    margin: 0;
    flex: 1 1 150px;
  }
  margin-bottom: 24px;
`;
export const FormItemTitle = styled.div`
  &::after {
    content: "：";
  }
`;

export const BtnGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
`;
