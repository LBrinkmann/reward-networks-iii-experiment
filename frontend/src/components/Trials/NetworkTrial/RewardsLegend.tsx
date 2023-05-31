import React, {FC} from "react";
import NetworkEdge from "../../Network/NetworkEdge";


interface ILegend {
    showLegend?: boolean;
    size?: { width: number, height: number };
    rewards?: number[];
    colors?: string[];

}

const Legend: FC<ILegend> = (props) => {
    const {
        showLegend = true,
        size = {width: 100, height: 120},
        colors = ['#c51b7d', '#e9a3c9', '#e6f5d0', '#a1d76a', '#4d9221',],
        rewards = [-50, 0, 100, 200, 400]
    } = props;
    return (
        <div >
            <svg width={size.width} height={size.height}>
                <g>
                    {colors.map((color, idx) => {
                        return (
                            <React.Fragment key={"color" + idx}>
                                <NetworkEdge
                                    reward={rewards[idx]}
                                    color={color}
                                    edgeStyle={'normal'}
                                    edgeWidth={4}
                                    idx={1000 + idx}
                                    showRewardText={false}
                                    arc_type={'straight'}
                                    source_x={0}
                                    source_y={idx * 20 + 15}
                                    arc_x={20}
                                    arc_y={idx * 20 + 15}
                                    target_x={30}
                                    target_y={idx * 20 + 15}
                                    key={'legend-edge-' + idx}

                                />
                                <text x={50} y={idx * 20 + 20} fontSize={18} textAnchor="middle">{rewards[idx]}</text>
                            </React.Fragment>
                        )
                    })
                    }
                </g>
            </svg>
        </div>
    );
}

export default Legend;