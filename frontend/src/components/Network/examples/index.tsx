const data = require('../../Network/examples/train_viz.json');

// const nodeLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

data.forEach((net: any) => {
    net.nodes[net.starting_node].starting_node = true;
    // net.nodes.forEach((node: any, inx: number) => {
    //     node.display_name = nodeLabels[inx];
    // });
});

export default data;
