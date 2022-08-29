import styled from '@emotion/styled'

type NetworkEdgeProps = {
    colorClass: string;
    strokeWidth: number;
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
    ${({colorClass}) => {
      switch (colorClass) {
        case 'large-negative':
          return `stroke: ${colors["large-negative"]};`
        case 'negative':
          return `stroke: ${colors["negative"]};`
        case 'positive':
          return `stroke: ${colors["positive"]};`
        case 'large-positive':
          return `stroke: ${colors["large-positive"]};`
      }
    }};
    fill: none;
    stroke-width: ${({strokeWidth}) => strokeWidth}px;
  }

  & > .edge-text {
    font-size: 10px;
    font-weight: 900;
    fill: rgb(0, 0, 0);
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

  & > .colored-fill {
    ${({colorClass}) => {
      switch (colorClass) {
        case 'large-negative':
          return `fill: ${colors["large-negative"]};`
        case 'negative':
          return `fill: ${colors["negative"]};`
        case 'positive':
          return `fill: ${colors["positive"]};`
        case 'large-positive':
          return `fill: ${colors["large-positive"]};`
      }
    }};
  }


`

export default NetworkEdgeStyled;