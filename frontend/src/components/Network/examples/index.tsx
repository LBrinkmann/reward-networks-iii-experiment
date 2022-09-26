const data = require('../../Network/examples/train_viz.json');

data.forEach((n: any) => {
    n.nodes[n.starting_node].starting_node = true;
});

export default data;
