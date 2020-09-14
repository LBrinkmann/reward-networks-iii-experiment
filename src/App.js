import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import I from 'immutable';
import {hot} from "react-hot-loader";

import './App.css';

function say(...args) {
  console.log(...args);
}

function Node({i, pos, begin_node_move}) {
  return (
    <circle
      data-i={i}
      cx={pos.x}
      cy={pos.y}
      r={8 / 600}
      stroke="#555"
      strokeWidth={ 5 / 600 }
      fill="#ddd"
      onPointerDown={begin_node_move}/>);
}

function Nodes({node_positions, begin_node_move}) {
  return node_positions.map(function (pos, i) {
    return <Node
             key={"" + i}
             i={i}
             pos={pos}
             begin_node_move={begin_node_move}/>;
  });
}

function Anchor({i, a, pos, begin_anchor_move}) {
  return (
    <circle
      data-i={i}
      data-a={a}
      cx={pos.x}
      cy={pos.y}
      r={ 6 / 600 }
      stroke="#888"
      strokeWidth={ 5 / 600 }
      fill="#ffffff"
      onPointerDown={begin_anchor_move}/>);
}

function Anchors({anchor_positions, begin_anchor_move}) {
  return anchor_positions.map(function (point, i) {
    return (
      <React.Fragment key={i}>
        <Anchor
          key={"L" + i}
          i={i}
          a={0}
          pos={point.get(0)}
          begin_anchor_move={begin_anchor_move}/>,
        <Anchor
          key={"R" + i}
          i={i}
          a={1}
          pos={point.get(1)}
          begin_anchor_move={begin_anchor_move}/>,
      </React.Fragment>
    );
  });
}

function AnchorLines({n_nodes, node_positions, anchor_positions}) {
  return (
    <React.Fragment>
      {range(n_nodes, function (i) {
        const node = node_positions.get(i);
        const anchor1 = anchor_positions.get(i).get(0);
        const anchor2 = anchor_positions.get(i).get(1);

        const dashed_line = "0.01 0.01";

        return [
          <line
            key={"L" + i}
            x1={node.x}
            y1={node.y}
            x2={anchor1.x}
            y2={anchor1.y}
            stroke="#888"
            strokeWidth={ (1 / 600) + "px" }
            strokeDasharray={dashed_line}/>,
          <line
            key={"R" + i}
            x1={node.x}
            y1={node.y}
            x2={anchor2.x}
            y2={anchor2.y}
            stroke="#888"
            strokeWidth={ (1 / 600) + "px" }
            strokeDasharray={dashed_line}/>
        ];
      })}
    </React.Fragment>
  );
}

function keep_within(x, bound) {
  return Math.min(Math.max(x, 0), bound);
}

function range(n, f) {
  const result = [];
  for (let i = 0; i < n; ++i) {
    result.push(f(i));
  }
  return result;
}

function curve(node_positions, anchor_positions, n_nodes, n) {
  const c0 = node_positions.get(n);
  const c1 = node_positions.get((n + 1) % n_nodes);
  const a0 = anchor_positions.get(n).get(1);
  const a1 = anchor_positions.get((n + 1) % n_nodes).get(0);

  return `M ${c0.x} ${c0.y} C ${a0.x} ${a0.y} ${a1.x} ${a1.y} ${c1.x} ${c1.y}`;
}

function curves(node_positions, anchor_positions, n_nodes) {
  return (
    range(n_nodes, function (i) {
      return curve(node_positions, anchor_positions, n_nodes, i);
    })
    .join(" "));
}

function CurvePath({n_nodes, node_positions, anchor_positions}) {
  return (
    <path
      id="airfoil"
      d={curves(node_positions, anchor_positions, n_nodes)}
      stroke="#555"
      strokeWidth={ (4 / 600) + "px"}
      fill="none"/>
  );
}

function trace_airfoil_points(n_points) {
  const airfoil = document.getElementById("airfoil");
  const length = airfoil.getTotalLength();
  return (
    range(n_points, function (i) {
      const point = airfoil.getPointAtLength((i / n_points) * length);
      return {x: point.x, y: point.y};
    }));
}

function airfoil_dot_circles(airfoil_points) {
  return airfoil_points.map(function ({x, y}, i) {
    return (
      <circle
        key={"" + i}
        cx={x}
        cy={y}
        r={2 / 600}
        fill="red"/>);
  });
}

function initial_node_positions(n_nodes) {
  return I.List(range(n_nodes, function (i) {
    return {
      x: 0.5 + 200 / 600 * Math.cos(2 * Math.PI * (i / n_nodes)),
      y: 0.5 + 200 / 600 * Math.sin(2 * Math.PI * (i / n_nodes))
    };
  }));
}

function initial_anchor_positions(n_nodes) {
  return I.List(range(n_nodes, function (i) {
    return I.List([
      {
        x: 0.5 + 210 / 600 * Math.cos(2 * Math.PI * ((i - 0.1) / n_nodes)),
        y: 0.5 + 210 / 600 * Math.sin(2 * Math.PI * ((i - 0.1) / n_nodes))
      },
      {
        x: 0.5 + 210 / 600 * Math.cos(2 * Math.PI * ((i + 0.1) / n_nodes)),
        y: 0.5 + 210 / 600 * Math.sin(2 * Math.PI * ((i + 0.1) / n_nodes))
      }
    ]);
  }));
}


function Drawing(props) {
  const [moving_node, set_moving_node] = useState(null);
  const [moving_anchor, set_moving_anchor] = useState(null);

  const {
    airfoil_points,
    change_airfoil_points,
    update_airfoil_points,
    set_update_airfoil_points
  } = props;

  function begin_node_move(e) {
    e.target.setPointerCapture(e.pointerId);
    set_moving_node(e.target.getAttribute("data-i"));
  }

  function begin_anchor_move(e) {
    e.target.setPointerCapture(e.pointerId);
    set_moving_anchor([
      e.target.getAttribute("data-i"),
      e.target.getAttribute("data-a")
    ]);
  }

  function end_node_move() {
    set_moving_node(null);
  }

  function end_anchor_move() {
    set_moving_anchor(null);
  }

  useEffect(
    function () {
      if (update_airfoil_points) {
        change_airfoil_points(trace_airfoil_points(props.n_airfoil_points));
        set_update_airfoil_points(false);
      }
    },
    [update_airfoil_points, set_update_airfoil_points, change_airfoil_points, props.n_airfoil_points]);

  function end_move(e) {
    if (moving_node)
      end_node_move();
    else if (moving_anchor)
      end_anchor_move();
    set_update_airfoil_points(true);
  }

  const airfoil_dots =
    (props.show_trace && airfoil_points) ? airfoil_dot_circles(airfoil_points) : [];

  const svg = useRef(null);

  function svg_to_screen(svg_pos) {
    const pt = svg.current.createSVGPoint();
    pt.x = svg_pos.x;
    pt.y = svg_pos.y;
    return pt.matrixTransform(svg.current.getScreenCTM());
  }

  function screen_to_svg(screen_pos) {
    const pt = svg.current.createSVGPoint();
    pt.x = screen_pos.x;
    pt.y = screen_pos.y;
    return pt.matrixTransform(svg.current.getScreenCTM().inverse());
  }

  function move_circle(event) {
    const pos = props.node_positions.get(moving_node);

    const {x: screen_x, y: screen_y} = svg_to_screen(pos);

    const new_screen_x = screen_x + event.movementX;
    const new_screen_y = screen_y + event.movementY;

    const {x, y} = screen_to_svg({x: new_screen_x, y: new_screen_y});

    props.set_node_positions(
      props.node_positions.set(
        moving_node,
        {x: keep_within(x, 1.0),
         y: keep_within(y, 1.0)}));
  }

  function move_anchor(event) {
    const pos = props.anchor_positions.get(moving_anchor[0]).get(moving_anchor[1]);
    const {x: screen_x, y: screen_y} = svg_to_screen(pos);
    const new_screen_x = screen_x + event.movementX;
    const new_screen_y = screen_y + event.movementY;
    const {x, y} = screen_to_svg({x: new_screen_x, y: new_screen_y});

    props.set_anchor_positions(
      props.anchor_positions.set(
        moving_anchor[0],
        props.anchor_positions.get(moving_anchor[0]).set(
          moving_anchor[1],
          {
            x: keep_within(x, 1.0),
            y: keep_within(y, 1.0)
          })));
  }

  function on_pointer_move(e) {
    if (moving_node)
      move_circle(e);
    else if (moving_anchor)
      move_anchor(e);
  }

  return (
    <svg ref={svg}
         xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 1 1"
         className="absolute"
         height={props.svg_size + "px"}
         width={props.svg_size + "px"}
         onPointerUp={end_move}
         onPointerMove={on_pointer_move}
         style={{outline: "1px solid gray"}}>
      <CurvePath
        n_nodes={props.n_nodes}
        node_positions={props.node_positions}
        anchor_positions={props.anchor_positions}/>
      <AnchorLines
        n_nodes={props.n_nodes}
        node_positions={props.node_positions}
        anchor_positions={props.anchor_positions}/>
      <Nodes
        node_positions={props.node_positions}
        begin_node_move={begin_node_move}/>
      <Anchors
        anchor_positions={props.anchor_positions}
        begin_anchor_move={begin_anchor_move}/>
      {airfoil_dots}
    </svg>
  );
}

function Admin(props) {
  function update_show_trace(event) {
    props.set_show_trace(event.target.checked);
  }

  function update_nnodes(event) {
    const n = parseInt(event.target.value);
    if (isNaN(n))
      return;
    props.set_number_of_nodes(n);
  }

  function update_npoints(event) {
    const n = parseInt(event.target.value);
    if (isNaN(n))
      return;
    props.set_number_of_airfoil_points(n);
  }

  function blur_on_enter(event) {
    if (event.key === 'Enter') {
      event.target.blur();
    }
  }

  const NumberOfNodes = (
    <div className="flex flex-row items-center">
      <div className="">
        <label className="block text-black font-bold text-right mb-1 mb-0 pr-4" htmlFor="nnodes">
          Number of Nodes
        </label>
      </div>
      <div className="">
        <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 w-16 text-right" id="nnodes" type="text" defaultValue={props.n_nodes} onBlur={update_nnodes} onKeyDown={blur_on_enter}/>
      </div>
    </div>
  );

  const NumberOfAirfoilPoints = (
    <div className="flex flex-row items-center ml-8">
      <div className="">
        <label className="block text-black font-bold text-right mb-1 mb-0 pr-4" htmlFor="npoints">
          Number of Airfoil Points
        </label>
      </div>
      <div className="">
        <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 w-16 text-right" id="npoints" type="text" defaultValue={props.n_airfoil_points} onBlur={update_npoints} onKeyDown={blur_on_enter}/>
      </div>
    </div>
  );

  const ShowTrace = (
    <div className="flex flex-row items-center ml-8">
      <div className="">
        <label className="block text-black font-bold text-right mb-1 mb-0 pr-4" htmlFor="show-trace">
          Show Airfoil Points
        </label>
      </div>
      <div className="">
        <input id="show-trace" type="checkbox" onChange={update_show_trace}/>
      </div>
    </div>
  );

  return (
    <div className="m-4">
      <h1>Admin (not shown to user)</h1>
      <div className="w-full mt-4 flex flex-row">
        {NumberOfNodes}
        {NumberOfAirfoilPoints}
        {ShowTrace}
      </div>
    </div>);
}


function SvgContainer(props) {
  const [svg_size, set_svg_size] = useState(100);

  const svg_container = useRef(null);

  useLayoutEffect(
    function () {
      const element = svg_container.current

      const ro = new ResizeObserver(function (entries) {
        const rect = entries[0].contentRect;
        const size = Math.min(rect.height, rect.width);
        set_svg_size(size - 10);
      });
      ro.observe(element);
      return function () {
        ro.unobserve(element);
      };
    },
    []);

  return (
    <div ref={svg_container} className="flex-1 flex justify-center items-center relative w-full h-full">
      <Drawing svg_size={svg_size} {...props}/>
    </div>
  );
}


function DebugOutput({coordinates, result}) {
  return (
    <div className="bg-gray-300 p-8">
      <div className="flex flow-row">
        <div className="border border-black">
          <pre className="p-2">
            {coordinates}
          </pre>
        </div>
        <div className="border border-black">
          <pre className="p-2" style={{whiteSpace: "pre-wrap"}}>
            {result && (result.error || JSON.stringify({ lift: result.lift, drag: result.drag, performance: result.performance}, null, 2))}
          </pre>
        </div>
      </div>

      <div className="p-2 mt-4 border border-black">
        <p>airfoil.log</p>
        <pre>{result && result.airfoil_log}</pre>
      </div>

      <div className="p-2 mt-4 border border-black">
        <p>xfoil output</p>
        <pre>{result && result.xfoil_output}</pre>
      </div>

  </div>
  );
}

function Workspace(props) {
  const [airfoil_points, set_airfoil_points] = useState(null);

  const [coordinates, set_coordinates] = useState(null);

  const [result, set_result] = useState(null);

  function change_airfoil_points(points) {
    set_airfoil_points(points);

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const coordinates_as_array = points.map(
      ({x, y}) => [x, 0.5 - y]);

    set_coordinates(coordinates_as_array.map(([x, y]) => x + " " + y).join("\n"));

    // result will contain `airfoil_log`, `xfoil_output`, and
    // either `error` or `lift`, `drag`, and `performance`.

    set_result(null);

    fetch(
      'https://airfoil-scoring.eks-test-default.mpg-chm.com/compute_coeff',
      {
        method: 'POST',
        headers,
        cache: 'no-store',
        body: JSON.stringify(coordinates_as_array)
      })
    .then(function (response) {
      return response.json();
    })
    .then(function (result) {
      set_result(result)
    });
  }

  return (
    <div>
      <div style={{height: "600px"}}>
        <SvgContainer
          airfoil_points={airfoil_points}
          change_airfoil_points={change_airfoil_points}
          {...props}/>
      </div>

      <DebugOutput coordinates={coordinates} result={result}/>
    </div>
  );
}

function App() {
  const [n_nodes, set_nnodes] = useState(10);

  const [n_airfoil_points, set_n_airfoil_points] = useState(100);

  const [node_positions, set_node_positions] = useState(
    initial_node_positions(n_nodes));

  const [anchor_positions, set_anchor_positions] = useState(
    initial_anchor_positions(n_nodes));

  const [update_airfoil_points, set_update_airfoil_points] = useState(true);

  function set_number_of_nodes(n) {
    set_nnodes(n);
    set_node_positions(initial_node_positions(n));
    set_anchor_positions(initial_anchor_positions(n));
    set_update_airfoil_points(true);
  }

  function set_number_of_airfoil_points(n) {
    set_n_airfoil_points(n);
    set_update_airfoil_points(true);
  }

  const [show_trace, set_show_trace] = useState(false);

  return (
    <div className="h-screen w-screen flex flex-col">
      <div className="flex-none bg-gray-400">
        <Admin
          n_nodes={n_nodes}
          set_number_of_nodes={set_number_of_nodes}
          show_trace={show_trace}
          set_show_trace={set_show_trace}
          n_airfoil_points={n_airfoil_points}
          set_number_of_airfoil_points={set_number_of_airfoil_points}/>
      </div>
      <div className="flex-1">
        <Workspace
          n_nodes={n_nodes}
          node_positions={node_positions}
          set_node_positions={set_node_positions}
          anchor_positions={anchor_positions}
          set_anchor_positions={set_anchor_positions}
          update_airfoil_points={update_airfoil_points}
          set_update_airfoil_points={set_update_airfoil_points}
          show_trace={show_trace}
          n_airfoil_points={n_airfoil_points}/>
      </div>
    </div>);
}

export default hot(module)(App);
