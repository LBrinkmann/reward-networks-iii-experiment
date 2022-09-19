const data = require('../../Network/examples/train.json');

data.forEach((d: any) => {
    d.nodes.forEach((n: any, inx: number) => {
        n.x = (Math.cos(36 * n.node_num * (Math.PI / 180)) + 1) / 3 + 0.1;
        n.y = (Math.sin(36 * n.node_num * (Math.PI / 180)) + 1) / 3 + 0.1;
        if (inx === 0) {
            n.is_starting = true;
        }
    });
});

export default data;
