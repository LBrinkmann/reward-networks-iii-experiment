import React, { useState } from "react";
import ReactDOM from "react-dom";

function App() {
  const [count, set_count] = useState(0);

  function on_click() {
    set_count(count + 1);
  }

  return (
    <div style={{margin: "2em"}}>
      <p><button onClick={on_click}>Click Me</button></p>

      <p>You clicked {count} times.</p>
    </div>
  );
}

ReactDOM.render(<App/>, document.getElementById("app"));
