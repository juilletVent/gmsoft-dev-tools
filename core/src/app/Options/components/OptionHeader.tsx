import {
  HeaderLinks,
  Logo,
  OptionHeaderLayout,
  OptionHeaderLeft,
  OptionHeaderRight,
  Title,
} from "../style";
import { useLinks } from "../../hooks/useLinks";
import logoImg from "../../../imgs/cookie.png";
import authorImg from "../../../imgs/author.jpeg";
import githubImg from "../../../imgs/Github.svg";

interface Props {}

function OptionHeader(props: Props) {
  const { onProjectInfoOpen, onAuthorInfoOpen } = useLinks();

  return (
    <OptionHeaderLayout>
      <OptionHeaderLeft>
        <Logo src={logoImg} />
        <Title>Gmsoft-Dev-Tools</Title>
      </OptionHeaderLeft>
      <OptionHeaderRight>
        <HeaderLinks>
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
        </HeaderLinks>
      </OptionHeaderRight>
    </OptionHeaderLayout>
  );
}

export default OptionHeader;
