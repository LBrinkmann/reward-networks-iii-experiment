const data = require('../../Network/examples/examples.json');

data.forEach((d: any) => {
    d.nodes.forEach((n: any, inx: number) => {
        if (inx === 0) {
            n.is_starting = true;
        }
    });
});

export default data;
