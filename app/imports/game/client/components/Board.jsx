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
  const { disabled, color, angle, size = 1 } = props;

  const width = ARROW_WIDTH * size;
  const height = ARROW_HEIGHT * size;
  const style = {
    position: 'absolute',
    left: BOARD_SIZE / 2 - width / 2,
    top: BOARD_SIZE / 2 - height / 2,
    width: width,
    height: height,
    transform: `rotate(${angle}rad)`,
    pointerEvents: 'none',
    opacity: disabled ? 0.3 : 1,
  };

  return (
    <div style={style}>
      <svg viewBox={`0 0 ${90} ${30 /* this should respect aspect ratio */}`}>
        <path transform="translate(45, 2)" fill={color} d="M21.205,5.007c-0.429-0.444-1.143-0.444-1.587,0c-0.429,0.429-0.429,1.143,0,1.571l8.047,8.047H1.111 C0.492,14.626,0,15.118,0,15.737c0,0.619,0.492,1.127,1.111,1.127h26.554l-8.047,8.032c-0.429,0.444-0.429,1.159,0,1.587 c0.444,0.444,1.159,0.444,1.587,0l9.952-9.952c0.444-0.429,0.444-1.143,0-1.571L21.205,5.007z"/>
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

export default class Board extends React.Component {
  constructor() {
    super();
    this.state = {
      dots: [],
      time: 0,
      startedGuessing: false,
    };
  }

  componentDidMount() {
    this.startGame();
  }

  componentWillUnmount() {
    this.stopGame();
  }

  // =======================
  // Event Handlers

  handleMouse = (x, y) => {
    if (this.props.isOutcome) {
      // outcome: readonly mode
      return;
    }
    this.state.startedGuessing = true;
    // compute displacement from center of box
    const dx = x - BOARD_SIZE / 2;
    const dy = y - BOARD_SIZE / 2;

    const guess = Math.atan2(dy, dx);
    const { updateArrow } = this.props.actions;
    updateArrow(guess);
  }

  onMouseDown = (e) => {
    this.down = true;
    this.handleMouse(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  }

  onMouseMove = (e) => {
    if (this.down) {
      this.handleMouse(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    }
  }

  onMouseUp = () => {
    this.down = false;
  }

  // =======================
  // Scene Logic

  generateAngle() {
    const { taskData : { answer, answerProportion } } = this.props;
    if (Math.random() < answerProportion) {
      return answer;
    } else {
      return randomAngle();
    }
  }

  // A "reducer" for addDots
  addDot(dots) {
    const { time } = this.state;
    const velAngle = this.generateAngle();
    const posAngle = Math.PI + velAngle + (randomAngle() - Math.PI) / 2;
    const speed = this.props.taskData.dotSpeed / FPS;
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

  // =======================
  // Animation Logic

  startGame() {
    this.setState({
      dots: this.addDots([], 2)
    });
    this.running = setInterval(() => {
      this.step();
    }, 1000 / FPS);
  }

  stopGame() {
    clearInterval(this.running);
    this.running = undefined;
  }

  step() {
    if (!this.running) return;
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

  // =======================
  // Color assignment to players by id
  // Basically, memoize a random color generator
  getColor = ((store = {}) => {
    return (id) => {
      if (!(id in store)) {
        store[id] = generateColor();
      }
      return store[id];
    };
  })()

  // =======================
  // Render Logic

  renderInstructions() {
    return (
      <div className='instructions'>
        <p> Click anywhere inside the circle to make your guess! </p>
      </div>
    );
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

  renderGuess() {
    if (!this.state.startedGuessing) {  // before the first guess, don't show the arrow
      return;
    }
    const { guess, isOutcome } = this.props;
    const color = "#1E201D";
    return (
      <Arrow
        key={`guess`}
        disabled={isOutcome}
        angle={guess}
        color={color}
      />
    );
  }

  renderAlterGuess = (guess, i) => {
    const color = this.getColor(i);
    return (
      <Arrow
        key={`alter${i}`}
        size={0.5}
        angle={guess}
        color={color}
      />
    );
  }

  renderAnswer() {
    const { guess, isOutcome, taskData: { answer } } = this.props;
    if (!isOutcome) return;
    const color = "green";
    return (
      <Arrow
        key={`answer`}
        size={1.2}
        angle={answer}
        color={color}
      />
    );
  }

  render() {
    const { alterGuesses } = this.props;

    const style = {
      position: 'relative',
      width: BOARD_SIZE + 2 * BORDER_WIDTH,
      height: BOARD_SIZE + 2 * BORDER_WIDTH,
      borderRadius: BOARD_SIZE/2,
      boxSizing: 'border-box',
      border: `${BORDER_WIDTH}px double green`,
    };

    return (
      <div>
        {this.state.startedGuessing ? null : this.renderInstructions()}
        <div className='dot-task'
          onMouseDown={this.onMouseDown}
          onMouseMove={this.onMouseMove}
          onMouseUp={this.onMouseUp}
          style={style}>
          {this.renderDots()}
          {this.renderGuess()}
          {alterGuesses.map(this.renderAlterGuess)}
          {this.renderAnswer()}
        </div>
      </div>
    );
  }
};

Board.propTypes = {
  isOutcome: PropTypes.bool,
  guess: PropTypes.number,
  alterGuesses: PropTypes.arrayOf(PropTypes.number),
  taskData: PropTypes.shape({
    answer: PropTypes.number,
    dotSpeed: PropTypes.number,
  }),
  isAnimating: PropTypes.bool,
  actions: PropTypes.shape({
    updateArrow: PropTypes.func.isRequired,
  }).isRequired,
};
