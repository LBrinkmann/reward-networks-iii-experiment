import styled from '@emotion/styled'

type NetworkNodeProps = {
    status: 'disabled' | 'invalid-click' | 'active' | 'starting';
    fontSize: number;
}

const colors = {
    'disabled': 'rgb(228, 227, 227)',
    'active': 'rgb(155, 155, 155)',
    'invalid-click': 'rgb(221, 44, 0)',
    'starting': 'rgb(193, 145, 207)'
}

const NetworkNodeStyled = styled('g')<NetworkNodeProps>`
  cursor: ${({status}) => status != "disabled" && "pointer"};
  
  circle {
    stroke-width: 1px;
    stroke: rgba(30, 30, 30, 1);
    
    fill: ${({status}) => colors[status] ? colors[status] : colors['disabled']};
    transition: ${({status}) => {
      switch (status) {
        case 'active':
          return 'fill 0.1s';
        case 'invalid-click':
          return 'fill 0.01s';
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