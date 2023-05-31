import styled from '@emotion/styled'
import {NetworkNodeStatus} from "./NetworkNode";

type NetworkNodeProps = {
    status: NetworkNodeStatus;
    fontSize: number;
    wrongClick: boolean;
    nextNodeColor?: string;
}

const colors = {
    // neutral 200 from Tailwind
    'disabled': '#e5e5e5',
    // neutral 500 from Tailwind
    'active': '#737373',
    // red 500 from Tailwind
    'invalid-click': '#ef4444',
    'starting': 'rgb(193, 145, 207)',
    'next': 'rgb(193, 145, 207)',
    'normal': 'white'
}

const NetworkNodeStyled = styled('g')<NetworkNodeProps>`
  cursor: ${({status}) => {
    switch (status) {
      case 'disabled':
        return 'not-allowed';
      case 'active':
        return 'default';
      case 'starting':
        return 'not-allowed';
      default:
        return 'pointer';
    }

  }};

  circle {
    stroke-width: 1px;
    stroke: rgba(30, 30, 30, 1);

    fill: ${({
               status,
               wrongClick,
               nextNodeColor
             }) => wrongClick ? colors['invalid-click'] : status === 'next' ? nextNodeColor : colors[status] ? colors[status] : colors['disabled']};
    transition: ${({status}) => {
      switch (status) {
        case 'active':
          return 'fill 0.1s';
        case 'starting':
          return 'fill 0.1s';
        case 'disabled':
          return 'fill 0.1s';
        default:
          return 'fill 0.75s';
      }
    }};
  }

  text {
    font-size: ${({fontSize}) => fontSize};
  }

`

export default NetworkNodeStyled;