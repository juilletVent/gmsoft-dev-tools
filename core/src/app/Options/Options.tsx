import { ConfigLayout, ContentLayout, NavLayout, OptionLayout } from "./style";
import OptionHeader from "./OptionHeader";
import SwitchBlock from "./SwitchBlock";
import ConfigNavBlock from "./ConfigNavBlock";
import ConfigBlock from "./ConfigBlock";

interface Props {}

function Options(props: Props) {
  console.log(chrome);

  return (
    <OptionLayout>
      <OptionHeader />
      <ContentLayout>
        <NavLayout>
          <SwitchBlock />
          <ConfigNavBlock />
        </NavLayout>
        <ConfigLayout>
          <ConfigBlock />
        </ConfigLayout>
      </ContentLayout>
    </OptionLayout>
  );
}

export default Options;
