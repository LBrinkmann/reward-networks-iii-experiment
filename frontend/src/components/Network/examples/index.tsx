const data = require('../../Network/examples/examples.json');

data.forEach((d: any) => {
    d.nodes.forEach((n: any, inx: number) => {
        if (inx === 0) {
            n.is_starting = true;
        }
        n.x = n.x + 100;
        n.y = n.y * -1 + 100;
    });
    d.edges.forEach((e: any) => {
        e.source_x = e.source_x + 100;
        e.source_y = e.source_y * -1 + 100;
        e.target_x = e.target_x + 100;
        e.target_y = e.target_y * -1 + 100;
        e.arc_x = e.arc_x + 100;
        e.arc_y = e.arc_y * -1 + 100;
    });

});

export default data;
