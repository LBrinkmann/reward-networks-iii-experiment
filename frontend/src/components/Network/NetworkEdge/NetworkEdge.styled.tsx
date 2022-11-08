import styled from '@emotion/styled'

type NetworkEdgeProps = {
    colorClass: 'negative' | 'positive' | 'neutral' | 'large-negative' | 'large-positive';
    strokeWidth: number;
}

const colors = {
    'large-negative': '#7b3294',
    'negative': '#c2a5cf',
    'neutral': '#e1e1e1',
    'positive': '#a6dba0',
    'large-positive': '#008837'
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
    font-size: 16px;
  }
`

export default NetworkEdgeStyled;