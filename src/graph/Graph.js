import React, { Component } from "react";
import "./graph.css";
import { XYPlot, ArcSeries } from "react-vis";

const PI = Math.PI;

export class Graph extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const loss = Math.abs(this.props.loss);
    const gain = this.props.gain;
    const total = loss + gain;
    return (
      <div className="bg">
        <XYPlot
          xDomain={[-10, 10]}
          yDomain={[-10, 10]}
          width={500}
          getAngle={(d) => d.time}
          getAngle0={(d) => 0}
          height={500}
          colorDomain={[0,1]}
          colorRange={["#cd3b54", "#59b953"]}
        >
          <ArcSeries
            animation
            radiusDomain={[0, 3]}
            data={[
              {
                time: (loss / total) * 2 * PI,
                radius0: 1,
                radius: 1.5,
                color: 0,
              },
              {
                time: (gain / total) * 2* PI,
                radius0: 1.6,
                radius: 2.1,
                color: 1,
              },
            ]}
          />
        </XYPlot>
      </div>
    );
  }
}

export default Graph;
