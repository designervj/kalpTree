import { generateSpacingCSS } from "../CustomSpacing";
import { generateBorderCSS } from "../CustomBorder";
import { generateBoxShadowCSS } from "../CustomBoxShadow";
import { generateLayoutCSS } from "../CustomLayout";
import { generateCSS } from "../CustomSIzing";

export function AccordionComponentNew({
  sizing,
  spacing,
  border,
  boxShadow,
  layout,
  content: Content,
}: any) {
  const containerStyle: React.CSSProperties = {
    ...generateCSS(sizing),
    ...generateSpacingCSS(spacing),
    ...generateBorderCSS(border),
    ...generateBoxShadowCSS(boxShadow),
    ...generateLayoutCSS(layout),
  };

  return <Content style={containerStyle} />;
}
