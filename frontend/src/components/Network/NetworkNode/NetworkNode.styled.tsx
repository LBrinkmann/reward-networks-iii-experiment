import styled from '@emotion/styled'
import {NetworkNodeStatus} from "./NetworkNode";

type NetworkNodeProps = {
    status: NetworkNodeStatus;
    fontSize: number;
    wrongClick: boolean;
}

const colors = {
    'disabled': 'rgb(228, 227, 227)',
    'active': 'rgb(155, 155, 155)',
    'invalid-click': 'rgb(221, 44, 0)',
    'starting': 'rgb(193, 145, 207)',
    'normal': 'white'
}

const NetworkNodeStyled = styled('g')<NetworkNodeProps>`
  cursor: ${({status}) => {
    switch (status) {
      case 'disabled':
        return 'not-allowed';
      case 'active':
        return 'not-allowed';
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
               wrongClick
             }) => wrongClick ? colors['invalid-click'] : colors[status] ? colors[status] : colors['disabled']};
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