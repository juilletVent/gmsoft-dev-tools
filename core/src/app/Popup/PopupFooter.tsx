import React from "react";
import authorImg from "../../imgs/author.jpeg";
import githubImg from "../../imgs/Github.svg";
import { useLinks } from "../hooks/useLinks";
import { PopupFooterLayout, PopupFooterLinks } from "./style";

interface Prop {}

function PopupFooter(props: Prop) {
  const { onProjectInfoOpen, onAuthorInfoOpen } = useLinks();

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
          title="Vme50"
        />
      </PopupFooterLinks>
    </PopupFooterLayout>
  );
}

export default PopupFooter;
