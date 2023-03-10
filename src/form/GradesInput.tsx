import React, { useState, useCallback } from "react";
import { Grade } from "./Grade";
import "./GradesInput.css";
import { TranslateText } from "../lang/TranslateText";
import { POSITIVE_SOUND_ID, NEGATIVE_SOUND_ID } from "../sound/SoundsContainer";

interface GradesInputProps {
    grades: number[];
    addGrade: (grade: number) => void;
    removeGrade: (id: number) => void;
}
export const GradesInput: React.FC<GradesInputProps> = ({ grades, addGrade, removeGrade }) => {
    const [disabled, setDisabled] = useState(false);
    const positiveSound: HTMLAudioElement = document.getElementById(POSITIVE_SOUND_ID) as HTMLAudioElement;
    const negativeSound: HTMLAudioElement = document.getElementById(NEGATIVE_SOUND_ID) as HTMLAudioElement;
    const [gradeValue, setGradeValue] = useState<string>("");
    const onGradeRemove = useCallback((index: number): void => {
        removeGrade(index);
        negativeSound.play();
    }, [grades]);

    const handleAddGrade = useCallback((): void => {
        positiveSound.play();
        const input = document.getElementById("grades-field") as HTMLInputElement;
        if (gradeValue !== "") {
            const value = parseFloat(gradeValue);
            addGrade(value);
            input.value = "";
        }
    }, [gradeValue]);

    const gradeInputCheck = useCallback((): void => {
        const input = document.getElementById("grades-field") as HTMLInputElement;
        if (Number(input.value) > 10) {
            setDisabled(true);
            return;
        }
        if (Number(input.value) < 0.1) {
            setDisabled(true);
            return;
        }
        if (input.value.includes(".")) {
            if (input.value.split(".")[1].length > 2) {
                setDisabled(true);
                return;
            }
        }
        setDisabled(false);
        setGradeValue(input.value);
    }, []);
    return (
        <div>
            <div className="grades-input-container">
                <input
                    id="grades-field"
                    data-test="add-grade-input"
                    className="grades-input"
                    type="number"
                    step={1}
                    onChange={gradeInputCheck}
                />
                <button onClick={handleAddGrade} disabled={disabled} data-test="add-grade-button">
                    <TranslateText translationKey="form.button.addGrade" />
                </button>
            </div>
            <div className="grades-list">
                {grades.map((grade, index) =>
                    <Grade key={index} index={index} value={grade} onRemove={onGradeRemove} />,
                )}
            </div>
        </div>
    );
};
