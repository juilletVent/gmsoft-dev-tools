import React, { useCallback } from "react";
import authorImg from "../../imgs/author.jpeg";
import githubImg from "../../imgs/Github.svg";
import { PopupFooterLayout, PopupFooterLinks } from "./style";

interface Prop {}

function PopupFooter(props: Prop) {
  const onProjectInfoOpen = useCallback(() => {
    window.open("https://github.com/juilletVent/gmsoft-dev-tools");
  }, []);
  const onAuthorInfoOpen = useCallback(() => {
    window.open("https://github.com/juilletVent");
  }, []);

  return (
    <PopupFooterLayout>
      <span>大家软件前端开发辅助工具</span>
      <PopupFooterLinks>
        <img
          onClick={onProjectInfoOpen}
          src={githubImg}
          alt="project"
          title="Github项目地址"
        />
        <img
          onClick={onAuthorInfoOpen}
          src={authorImg}
          alt="author"
          title="Github作者地址"
        />
      </PopupFooterLinks>
    </PopupFooterLayout>
  );
}

export default PopupFooter;
