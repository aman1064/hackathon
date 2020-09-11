import React, {PureComponent} from "react";
import "./style.css";

class WhiteBoard extends PureComponent {
    #plots;
    #isActive;

    constructor(props) {
        super(props);
        this.#isActive = false;
        this.#plots = [];
        this.canvasRef = React.createRef();
    }

    drawOnCanvas = plots => {
        const ctx = this.canvasRef.current.getContext('2d');
        ctx.lineWidth = 1;
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.moveTo(plots[0].x + 0.5, plots[0].y);

        for (let i = 1; i < plots.length; i++) {
            ctx.lineTo(plots[i].x + 0.5, plots[i].y);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }

    getMousePos = (canvas, evt) => {
        const rect = canvas.getBoundingClientRect(),
            scaleX = canvas.width / rect.width,
            scaleY = canvas.height / rect.height;
        return {
            x: (evt.clientX - rect.left) * scaleX,
            y: (evt.clientY - rect.top) * scaleY
        };
    }

    mouseMoveHandler = e => {
        if (!this.#isActive) return;
        const canvas = this.canvasRef.current;
        const coordinates = this.getMousePos(canvas, e);
        this.#plots.push({x: coordinates.x, y: coordinates.y});
        this.drawOnCanvas(this.#plots);
    }


    mouseDownHandler = () => {
        this.#isActive = true;
    }

    mouseUpHandler = () => {
        this.#isActive = false;
        this.#plots = [];
    }


    render() {
        return (
            <div className="white-board-container">
                <canvas ref={this.canvasRef}
                        width={800}
                        height={400}
                        onMouseDown={this.mouseDownHandler}
                        onMouseMove={this.mouseMoveHandler}
                        onMouseUp={this.mouseUpHandler}/>
            </div>
        );
    }
}

export default WhiteBoard;