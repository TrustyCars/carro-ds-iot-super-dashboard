import { Hint } from "react-vis";
import styled from "styled-components";

const TimeSeriesHint = styled(Hint)<{
  hintPosition: {
    left?: string;
    right?: string;
    top?: string;
    bottom?: string;
  };
  [key: string]: any;
}>`
  left: ${p => p.hintPosition.left};
  right: ${p => p.hintPosition.right};
  top: ${p => p.hintPosition.top};
  bottom: ${p => p.hintPosition.bottom};
`;

export const Styled = {
  TimeSeriesHint,
};
