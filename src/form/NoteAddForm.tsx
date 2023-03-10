import React, { useState, useEffect, useCallback } from "react";
import { GradesInput } from "./GradesInput";
import { TranslateText } from "../lang/TranslateText";
import { Note } from "../types";
import "./NoteAddForm.css";
import { useGrades } from "./useGrades";
import { useRequest, isResponseError } from "../network/useRequest";
import { NetworkHandler } from "../network/NetworkHandler";
import { LoadingOverlay } from "../loading-overlay/LoadingOverlay";
import { POSITIVE_SOUND_ID, NEGATIVE_SOUND_ID } from "../sound/SoundsContainer";

interface NoteAddFormProps {
    setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
}

export const NoteAddForm: React.FC<NoteAddFormProps> = ({ setNotes }) => {
    const [newNote, setNewNote] = useState({ id: "", city: "", date: "", favouriteDish: { name: "" }, grades: [1, 2] });
    const { makeRequest, response, isLoading } = useRequest(() => NetworkHandler.addNote(newNote));
    const { grades, addGrade, removeGrade } = useGrades([]);
    const [noteChanged, setNoteChanged] = useState(false);
    const [isFormComplete, setIsFormComplete] = useState(false);
    const [inputValues, setInputValues] = useState({ city: "", dish: "", note: "", date: "" });
    const positiveSound: HTMLAudioElement = document.getElementById(POSITIVE_SOUND_ID) as HTMLAudioElement;
    const negativeSound: HTMLAudioElement = document.getElementById(NEGATIVE_SOUND_ID) as HTMLAudioElement;

    const getInputValues = useCallback((): void => {
        const cityInput = document.querySelector<HTMLInputElement>('[data-test="form-city"]')?.value;
        const dishInput = document.querySelector<HTMLInputElement>('[data-test="form-dish"]')?.value;
        const noteInput = document.querySelector<HTMLTextAreaElement>('[data-test="form-dish-note"]')?.value;
        const dateInput = document.querySelector<HTMLInputElement>('[data-test="form-date"]')?.value;
        setInputValues({ city: cityInput || "", dish: dishInput || "", note: noteInput || "", date: dateInput || "" });
    }, []);
    const createNote = (): Note => {
        let dateInput = inputValues.date;
        if (dateInput) {
            const dateParts = dateInput.split("-");
            dateInput = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
        }
        return {
            id: "",
            city: inputValues.city,
            date: dateInput,
            favouriteDish: {
                name: inputValues.dish,
                note: inputValues.note,
            },
            grades: grades,
        };
    };
    const checkFormForCompleteness = (): void => {
        if (inputValues.city === "") {
            setIsFormComplete(false);
        } else if (inputValues.date === "") {
            setIsFormComplete(false);
        } else if (inputValues.dish === "") {
            setIsFormComplete(false);
        } else if (grades.length < 1) {
            setIsFormComplete(false);
        } else {
            setIsFormComplete(true);
        }
    };
    const clearForm = (): void => {
        const cityInput = document.querySelector<HTMLInputElement>('[data-test="form-city"]');
        const dishInput = document.querySelector<HTMLInputElement>('[data-test="form-dish"]');
        const noteInput = document.querySelector<HTMLTextAreaElement>('[data-test="form-dish-note"]');
        const dateInput = document.querySelector<HTMLInputElement>('[data-test="form-date"]');
        const gradeInput = document.getElementById("grades-field") as HTMLInputElement;
        if (cityInput) {
            cityInput.value = "";
        }
        if (dishInput) {
            dishInput.value = "";
        }
        if (noteInput) {
            noteInput.value = "";
        }
        if (dateInput) {
            dateInput.value = "";
        }
        if (gradeInput) {
            gradeInput.value = "";
        }
    };
    const handleNoteChange = useCallback((): void => {
        const newNoteValues: Note = createNote();
        setNewNote(newNoteValues);
        setNoteChanged(!noteChanged);
    }, [inputValues]);

    useEffect(() => {
        checkFormForCompleteness();
    }, [inputValues, grades]);
    useEffect(() => {
        if (noteChanged) {
            makeRequest();
            setNoteChanged(!noteChanged);
        }
    }, [newNote]);
    useEffect(() => {
        if (response && !isResponseError(response)) {
            positiveSound.play();
            setNotes(response);
            clearForm();
        } else if (isResponseError(response)) {
            negativeSound.play();
        }
    }, [response]);

    return (
        <div data-test="note-add-form">
            <h3 data-test="form-header">
                <TranslateText translationKey="form.header.add" />
            </h3>
            <label htmlFor="city-name">
                <TranslateText translationKey="form.label.city" />
            </label>
            <input
                data-test="form-city"
                type="text"
                placeholder="Kyiv"
                id="city-name"
                onChange={getInputValues}
            />
            <label htmlFor="city-name">
                <TranslateText translationKey="form.label.favouriteDish" />
            </label>
            <input
                data-test="form-dish"
                type="text"
                placeholder="Chicken Kyiv"
                id="favourite-dish"
                onChange={getInputValues}
            />
            <label htmlFor="note-field">
                <TranslateText translationKey="form.label.notes" />
            </label>
            <textarea
                data-test="form-dish-note"
                style={{ resize: "vertical" }}
                placeholder="Dear Slim, I wrote you but you still ain't callin'"
                id="note-field"
            />
            <label htmlFor="grades-field">
                <TranslateText translationKey="form.label.grades" />
            </label>
            <GradesInput grades={grades} addGrade={addGrade} removeGrade={removeGrade} />
            <label htmlFor="visit-date">
                <TranslateText translationKey="form.label.date" />
            </label>
            <input
                data-test="form-date"
                type="date"
                id="visit-date"
                onChange={getInputValues}
            />
            <div className="submit-button-container">
                {isResponseError(response) ? (
                    <div className="form-error" data-test="form-error">
                        <TranslateText translationKey="form.error" />
                    </div>
                ) : null}
                <button
                    data-test="form-save-button"
                    className="button-primary disabled"
                    type="submit"
                    value="Save note"
                    onClick={handleNoteChange}
                    disabled={!isFormComplete}
                >
                    <TranslateText translationKey="form.button.save" />
                </button>
            </div>
            <LoadingOverlay isVisible={isLoading} />
        </div>
    );
};
