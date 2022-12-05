import styled from '@emotion/styled'

type NetworkEdgeProps = {
    strokeWidth: number;

    color: string;
}


const NetworkEdgeStyled = styled('g')<NetworkEdgeProps>`
  stroke-width: 3px;

  & > .colored-stroke {
    stroke: ${({color}) => color};
    fill: none;
    stroke-width: ${({strokeWidth}) => strokeWidth}px;
  }

  & > .colored-fill {
    fill: ${({color}) => color};
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