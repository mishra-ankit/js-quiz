import { useMemo, useState, useRef } from "react";
import "./styles.css";
import SyntaxHighlighter from "react-syntax-highlighter";
import data from "./data";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

const INITIAL_SELECTION = -1;
const options = ["A", "B", "C", "D"];
const regex = /^(.*?)\. /gm;

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getValues() {
  return shuffleArray(data).slice(0, 2);
}

const Component = () => {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [selected, setSelected] = useState(INITIAL_SELECTION);
  const [score, setScore] = useState(0);
  const quizData = useRef(getValues());
  const shuffledData = useMemo(() => quizData.current, [quizData]);
  const { code, ques, opt, ans, details } = shuffledData[index];
  const isAnswered = useMemo(() => selected !== INITIAL_SELECTION, [selected]);

  const selectOption = (index) => {
    setSelected(index);
    const isCorrect = ans === options[index];
    if (isCorrect) {
      setScore((s) => s + 1);
    }
  };

  if (done) {
    return (
      <div className="result_box">
        <h2>Well Done!</h2>
        <h2>
          You scored {score} of {shuffledData.length}
        </h2>
        <button
          className="restart_button"
          onClick={() => {
            quizData.current = getValues();
            setSelected(INITIAL_SELECTION);
            setIndex(0);
            setScore(0);
            setDone(false);
          }}
        >
          Restart
        </button>
      </div>
    );
  }

  return (
    <>
      <h3>
        {`${index + 1}/${shuffledData.length} `}
        {ques.replace(regex, "")}
      </h3>
      <div
        class="time_line"
        style={{
          width: ((index + 1) / shuffledData.length) * 100 + "%"
        }}
      ></div>
      {code && (
        <SyntaxHighlighter language="javascript" style={a11yDark}>
          {code}
        </SyntaxHighlighter>
      )}
      <section>
        {opt.map((o, optionIndex) => {
          const isSelected = selected === optionIndex;
          const isCorrect = options.indexOf(ans) === optionIndex;
          return (
            <div
              onClick={() => {
                if (!isAnswered) selectOption(optionIndex);
              }}
              key={ques + optionIndex}
              className={`option ${isAnswered ? "answered" : ""} ${
                isSelected ? "selected" : ""
              } ${isCorrect ? "correct" : "wrong"}`}
            >
              <input
                type="radio"
                id={`ans-${optionIndex}`}
                name="ans"
                value={optionIndex}
                checked={isSelected}
                disabled={isAnswered}
              />
              <label
                for={`ans-${optionIndex}`}
                dangerouslySetInnerHTML={{ __html: o.slice(3) }}
              />
            </div>
          );
        })}
      </section>
      {/* <button
        onClick={() => {
          setIndex(index - 1);
          setSelected(INITIAL_SELECTION);
        }}
      >
        Prev
      </button> */}
      {isAnswered && (
        <>
          <details
            style={{
              marginBottom: "5rem"
            }}
          >
            <summary>Explaination</summary>
            {/* <h3>{ans}</h3> */}
            <div dangerouslySetInnerHTML={{ __html: details.join("") }}></div>
          </details>
          <footer>
            <button
              className="next"
              onClick={() => {
                if (index + 1 < shuffledData.length) {
                  setIndex(index + 1);
                  setSelected(INITIAL_SELECTION);
                } else {
                  setDone(true);
                }
              }}
            >
              Next >>
            </button>
          </footer>
        </>
      )}
    </>
  );
};

export default function App() {
  return (
    <div className="App">
      <Component />
    </div>
  );
}
