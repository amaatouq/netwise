import PropTypes from "prop-types";
import React from "react";

const DOT_RADIUS = 5;
const BOARD_SIZE = 500;
const DOT_SPEED = 100;
const DPS = 8; // dots per second
const FPS = 60; // frames per second
const BORDER_WIDTH = 2;

const ARROW_WIDTH = 300;
const ARROW_ASPECT_RATIO = 2.5;
const ARROW_HEIGHT = ARROW_WIDTH / ARROW_ASPECT_RATIO; // 120
const Arrow = (props) => {
  const { angle } = props;

  const style = {
    position: 'absolute',
    left: BOARD_SIZE / 2 - ARROW_WIDTH / 2,
    top: BOARD_SIZE / 2 - ARROW_HEIGHT / 2,
    width: ARROW_WIDTH,
    height: ARROW_HEIGHT,
    transform: `rotate(${angle}rad)`,
    pointerEvents: 'none',
  };
  return (
    <div style={style}>
      <svg viewBox={`0 0 ${90} ${30 /* this should respect aspect ratio */}`}>
        <path transform="translate(48, 0)" fill="#1E201D" d="M21.205,5.007c-0.429-0.444-1.143-0.444-1.587,0c-0.429,0.429-0.429,1.143,0,1.571l8.047,8.047H1.111 C0.492,14.626,0,15.118,0,15.737c0,0.619,0.492,1.127,1.111,1.127h26.554l-8.047,8.032c-0.429,0.444-0.429,1.159,0,1.587 c0.444,0.444,1.159,0.444,1.587,0l9.952-9.952c0.444-0.429,0.444-1.143,0-1.571L21.205,5.007z"/>
      </svg>
    </div>
  );
};

const Dot = (props) => {
  const { data, time } = props;
  const {
    start: { x: startX, y: startY },
    velocity: { x: velX, y: velY },
    startTime,
    endTime,
    color,
  } = data;
  const age = time - startTime;
  const x = startX + velX * age;
  const y = startY + velY * age;

  const style = {
    position: 'absolute',
    left: BOARD_SIZE / 2 + x - DOT_RADIUS,
    top: BOARD_SIZE / 2 + y - DOT_RADIUS,
    backgroundColor: color,
    borderRadius: DOT_RADIUS,
    width: 2 * DOT_RADIUS,
    height: 2 * DOT_RADIUS,
    opacity: 1 - .9 * (age / (1 + endTime - startTime)),
  };
  return (
    <div style={style}>
    </div>
  );
};

const polarVector = (scale, angle) => {
  return {
    x: scale * Math.cos(angle),
    y: scale * Math.sin(angle),
  };
};

const randomAngle = () => Math.random() * Math.PI * 2;

const generateColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue},80%,80%)`;
};


export default class TaskStimulus extends React.Component {
  constructor() {
    super();
    this.state = {
      dots: [],
      time: 0,
    };
  }

  componentDidMount() {
    this.startGame();
  }

  startGame() {
    this.setState({
      dots: this.addDots([], 2)
    });
    setInterval(() => {
      this.step();
    }, 1000 / FPS);
  }

  // "reducer" for addDots
  addDot(dots) {
    const { time } = this.state;
    const posAngle = randomAngle();
    const velAngle = Math.PI + posAngle + (randomAngle() - Math.PI) / 2;
    const speed = DOT_SPEED / FPS;
    const distance = BOARD_SIZE / 2 - DOT_RADIUS;
    const dot = {
      start: polarVector(BOARD_SIZE / 2, posAngle),
      velocity: polarVector(speed, velAngle),
      color: generateColor(),
      id: Math.random(), // todo uuidv4
    };

    // lifetime of the dot depends only on velAngle - posAngle
    dot.startTime = time;
    dot.endTime = Math.floor(time + 2 * distance * Math.cos(velAngle - posAngle + Math.PI) / speed);

    const newDots = [
      ...dots,
      dot,
    ];
    return newDots;
  }

  addDots(dots, count) {
    let newDots = dots;
    for (let i = 0; i < count; i += 1) {
      newDots = this.addDot(newDots);
    }
    return newDots;
  }

  // "reducer" for disposeDots
  disposeDots(dots) {
    const { time } = this.state;
    const newDots = dots.filter(({endTime}) => (
      endTime >= time
    ));
    return newDots;
  }

  step() {
    const { time, dots } = this.state;
    const newTime = time + 1;
    let newDots = this.disposeDots(dots);
    if (Math.random() < DPS / FPS) {
      newDots = this.addDot(newDots);
    }
    this.setState({
      time: newTime,
      dots: newDots,
    });
  }

  renderDots() {
    const { dots, time } = this.state;
    return (
      <div className='dots'>
        {
          dots.map(dot => (
            <Dot
              key={dot.id}
              time={time}
              data={dot}
            />
          ))
        }

      </div>
    );
  }

  updateArrow(x, y) {
    // compute displacement from center of box
    const dx = x - BOARD_SIZE / 2;
    const dy = y - BOARD_SIZE / 2;

    const arrowAngle = Math.atan2(dy, dx);
    this.setState({arrowAngle});
  }

  onMouseDown = (e) => {
    this.down = true;
    this.updateArrow(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  }

  onMouseMove = (e) => {
    if (this.down) {
      this.updateArrow(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    }
    // otherwise, we're just moving mouse -- not dragging
  }

  onMouseUp = () => {
    this.down = false;
  }

  renderBoard() {
    const style = {
      position: 'relative',
      width: BOARD_SIZE + 2 * BORDER_WIDTH,
      height: BOARD_SIZE + 2 * BORDER_WIDTH,
      borderRadius: BOARD_SIZE/2,
      boxSizing: 'border-box',
      border: `${BORDER_WIDTH}px double green`,
    };

    const { arrowAngle } = this.state;
    return (
      <div
        onMouseDown={this.onMouseDown}
        onMouseMove={this.onMouseMove}
        onMouseUp={this.onMouseUp}
        style={style}>
        {this.renderDots()}
        <Arrow
          angle={arrowAngle}
        />
      </div>
    );
  }

  render() {
    const { round, stage, player } = this.props;
    //make the image transparent if it is round outcome
    const classes = ["task-image"];
    if (stage.name==="outcome"){
      classes.push("transparent")
    }
    const taskDifficulty = round.get("task").difficultyPath; //getting the task data
    const taskPath = taskDifficulty[player.get("difficulty")];

    return (
      <div className="task-stimulus">
        {this.renderBoard()}
      </div>
    );
  }
}

TaskStimulus.propTypes = {
  task: PropTypes.object
};
