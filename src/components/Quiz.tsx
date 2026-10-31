import { useState } from "react";
import { CheckCircle2, Lightbulb } from "lucide-react";
import { Question } from "../course";
export default function Quiz({
  q,
  id,
  onAnswer,
}: {
  q: Question;
  id: string;
  onAnswer: (id: string, correct: boolean) => void;
}) {
  const [choice, setChoice] = useState<number>(),
    [checked, setChecked] = useState(false);
  return (
    <section className="quiz panel">
      <span className="eyebrow">
        <Lightbulb size={14} /> PREDICT BEFORE YOU RUN
      </span>
      <h3>{q.prompt}</h3>
      <fieldset>
        <legend className="sr-only">Choose an answer</legend>
        {q.options.map((o, i) => (
          <label
            key={o}
            className={
              "quiz-option " +
              (choice === i ? "selected " : "") +
              (checked && i === q.answer ? "correct" : "")
            }
          >
            <input
              type="radio"
              name={id}
              checked={choice === i}
              onChange={() => {
                setChoice(i);
                setChecked(false);
              }}
            />
            <span>{String.fromCharCode(65 + i)}</span>
            {o}
          </label>
        ))}
      </fieldset>
      <button
        className="button primary"
        disabled={choice === undefined}
        onClick={() => {
          setChecked(true);
          onAnswer(id, choice === q.answer);
        }}
      >
        Check my prediction
      </button>
      {checked && (
        <div className="callout" role="status">
          <CheckCircle2 size={18} />
          <div>
            <strong>
              {choice === q.answer
                ? "You reasoned it out."
                : "Let’s unpack that."}
            </strong>
            <p>{q.explain}</p>
          </div>
        </div>
      )}
    </section>
  );
}
