import { Button, Col, Row, Spin, Modal } from "antd";
import React, { useEffect, useState } from "react";
import SquareButton from "./SquareButton";
import {
  isBoardFull,
  calculateWinner,
  twoDArraytoOneD,
  constructSquare,
  suggestMoves,
} from "./GameUtils/UtilFunctions";
import { usePostQuery } from "../../hooks/useAxiosQuery";
import { useHistory } from "react-router-dom";
import position from "../../images/position.png";

// Displays the matrix
const square = constructSquare(3);

/**
 * Component to display the board
 */
const SquaresBoard = () => {
  const history = useHistory();
  console.log(history);
  // state to store value of the squares
  const [squaresValue, setSquaresValue] = useState(Array(9).fill(null));
  // state to store data for request body
  const [engineBody, setEngineBody] = useState([]);
  // store state to highlight rows and columns
  const [highlight, setHighLight] = useState([]);
  // store suggested move
  const [suggestedMove, setSuggestedMove] = useState(null);
  // to show / hide modal for Suggested move
  const [modalVisible, setModalVisible] = useState(false);
  // win/lose/draw status
  const [status, setStatus] = useState(null);

  const { data, error, isLoading, refetch } = usePostQuery(
    "game",
    "game",
    "/engine",
    { board: engineBody },
    { enabled: false }
  );

  // if sessionStorage doesnt have the token or if the AI responds with 401 or 403, logout
  if (
    !sessionStorage.getItem("token") ||
    (error && error.message && (error.message.includes("401") || error.message.includes("403")))
  ) {
    history.push("/logout");
  }

  useEffect(() => {
    if (data) {
      console.log("Data from the game ai engine ", data);
      const aiData = data.board;
      const oneDEngDataArr = twoDArraytoOneD(aiData);
      const winLoseOrDraw = calculateWinner(oneDEngDataArr) || isBoardFull(oneDEngDataArr);
      setStatus(
        winLoseOrDraw === true
          ? "The Game is a draw"
          : winLoseOrDraw
          ? winLoseOrDraw === "X"
            ? "You win"
            : "AI win"
          : ""
      );
      if (!isBoardFull(oneDEngDataArr)) setSquaresValue(oneDEngDataArr);
    }
  }, [data]);

  // when the player selects a vacant square and the state changes, request is sent to ai to fetch the next move
  useEffect(() => {
    if (engineBody && engineBody.length > 0) refetch();
  }, [engineBody, refetch]);

  // for logging
  useEffect(() => {
    console.log("State changes of squares ", squaresValue, highlight);
  }, [squaresValue, highlight]);

  // handle click on the squares
  const handleClick = (index) => {
    console.log("Clicked Button ", index);
    const squares = [...squaresValue];
    // value (X/O) already present in the clicked square or a winner is decided diable the squares
    if (squares[index] || calculateWinner(squaresValue)) return;
    squares[index] = "X";
    const fillNullValuesWithEmptyString = squares;
    let [filledArr, iterator] = [[], 0];
    fillNullValuesWithEmptyString.forEach((value) => {
      value = value === null ? "" : value;
      filledArr[iterator++] = value;
      return value;
    });
    const convertToTwoD = [];
    while (filledArr.length) convertToTwoD.push(filledArr.splice(0, 3));
    console.log("Filled values", fillNullValuesWithEmptyString, convertToTwoD);
    // Because AI needs a 2d array
    setEngineBody(convertToTwoD);
    setSquaresValue(squares);
    //refetch();
  };

  /** OnMouse out after highlighting the rows and columns */
  const onMouseOut = (index) => {
    let arr = Array(9).fill(0);
    setHighLight(arr);
  };

  /** To highlight rows and columns */
  const onMouseOver = (index) => {
    let arr = Array(9).fill(0);
    arr[index] = 1;
    const twoDArray = [];
    while (arr.length) twoDArray.push(arr.splice(0, 3));
    console.log(twoDArray);
    let [rowX, colY] = [0, 0];
    //find the x, y position of the hovered square
    twoDArray.forEach((item, x) => {
      const row = item;
      row.forEach((rowItem, y) => {
        if (rowItem === 1) {
          rowX = x;
          colY = y;
        }
      });
    });
    // find the row and column of the hovered square
    for (let i = 0; i < 3; i++) {
      twoDArray[rowX][i] = 1;
      twoDArray[i][colY] = 1;
    }
    console.log(rowX, colY, twoDArray);
    setHighLight(twoDArraytoOneD(twoDArray));
  };

  /**
   * Display the square on the board
   * @param {number} index
   */
  const displaySquare = (index) => {
    return (
      <SquareButton
        value={squaresValue[index]}
        hover={highlight[index]}
        onClick={() => handleClick(index)}
        onMouseOver={() => onMouseOver(index)}
        onMouseOut={() => onMouseOut(index)}
      />
    );
  };

  // refreshes the page, could be done with resetting the state
  const resetGame = () => {
    window.location.reload();
  };

  return (
    <div className="center-content">
      {error ? (
        <div>ERROR!</div>
      ) : isLoading ? (
        <div>
          <Spin />
        </div>
      ) : (
        <div>
          <div
            style={{ color: "#001818", textAlign: "center", fontStyle: "bold", fontSize: "20px" }}
          >
            {status ? status : ""}
          </div>
          <div>
            <Modal
              title="Suggested Move"
              visible={modalVisible}
              cancelButtonProps={{ style: { display: "none" } }}
              onOk={() => {
                setModalVisible(false);
              }}
              onCancel={() => {
                setModalVisible(false);
              }}
            >
              {suggestedMove ? (
                <div style={{ textAlign: "center" }}>
                  <span>
                    <img src={position} alt="position" width="100px" height="100px" />
                  </span>
                  <span style={{ margin: "20px" }}>Place X in position {suggestedMove} </span>
                </div>
              ) : (
                <div>No Moves to suggest</div>
              )}
            </Modal>
          </div>
          {square.map((x, index) => {
            return (
              <Row key={index}>
                {x.map((y) => {
                  return <Col key={y}>{displaySquare(y)}</Col>;
                })}
              </Row>
            );
          })}
          <div style={{ float: "center", marginTop: "5px" }}>
            <Button
              type="primary"
              style={{
                marginRight: "5px",
                marginLeft: "-3px",
                background: "#FFF",
                color: "#02353c",
                border: "1px solid #2eaf7d",
              }}
              onClick={resetGame}
            >
              Reset Game
            </Button>
            <Button
              type="primary"
              disabled={status}
              style={{ background: "#FFF", color: "#02353c", border: "1px solid #2eaf7d" }}
              onClick={() => {
                if (status) return;
                const suggMove = suggestMoves(squaresValue);
                setSuggestedMove(suggMove);
                setModalVisible(true);
                console.log("suggested move ", suggestedMove);
              }}
            >
              Suggest Move
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SquaresBoard;
