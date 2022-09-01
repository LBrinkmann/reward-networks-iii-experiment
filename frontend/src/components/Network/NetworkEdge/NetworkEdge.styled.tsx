import styled from '@emotion/styled'

type NetworkEdgeProps = {
    colorClass: 'negative' | 'positive' | 'large-negative' | 'large-positive';
    strokeWidth: number;
    nodeSize: number;
}

const colors = {
    'large-negative': '#de0000',
    'negative': '#de6500',
    'positive': '#008585',
    'large-positive': '#00b200'
}

const NetworkEdgeStyled = styled('g')<NetworkEdgeProps>`
  stroke-width: 3px;

  & > .colored-stroke {
    stroke: ${({colorClass}) => colors[colorClass]};
    fill: none;
    stroke-width: ${({strokeWidth}) => strokeWidth}px;
  }

  & > .colored-fill {
    fill: ${({colorClass}) => colors[colorClass]};
  }

  & > .edge-text {
    font-size: ${({strokeWidth}) => strokeWidth > 1 ? 10 + strokeWidth * 2 : strokeWidth * 10}px;
    font-weight: 900;
  }

  & > .edge-text-bg {
    fill: none;
    fill-opacity: 1;
    stroke: #ffffff;
    stroke-width: ${({strokeWidth}) => strokeWidth}px;
    stroke-linecap: butt;
    stroke-linejoin: miter;
    stroke-opacity: 1;
  }

  & > .edge-marker {
    font-size: ${({nodeSize}) => nodeSize < 20 ? nodeSize : 16}px;
  }
`

export default NetworkEdgeStyled;