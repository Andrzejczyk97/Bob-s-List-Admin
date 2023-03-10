import React, { useCallback, useEffect } from "react";
import "./ItemActions.css";
import { TranslateText } from "../lang/TranslateText";
import { useRequest, isResponseError } from "../network/useRequest";
import { NetworkHandler } from "../network/NetworkHandler";
import { Note } from "../types";
import { NEGATIVE_SOUND_ID } from "../sound/SoundsContainer";
import { LoadingOverlay } from "../loading-overlay/LoadingOverlay";

interface ItemActionsProps {
    id: string;
    setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
}
export const ItemActions: React.FC<ItemActionsProps> = ({ id, setNotes }) => {
    const negativeSound: HTMLAudioElement = document.getElementById(NEGATIVE_SOUND_ID) as HTMLAudioElement;
    const { makeRequest, isLoading, response } = useRequest(() => NetworkHandler.removeNote(id));

    const handleNoteRemove = useCallback(async () => {
        negativeSound.play();
        makeRequest();
    }, []);
    useEffect(() => {
        if (response && !isResponseError(response)) {
            setNotes(response);
        }
    }, [response]);

    return (
        <div className="item-actions">
            <button data-test="edit-item-button" className="button button-small" disabled={true}>
                <TranslateText translationKey="actions.edit" />
            </button>
            <button data-test="remove-item-button" className="button button-small" onClick={handleNoteRemove}>
                <TranslateText translationKey="actions.remove" />
            </button>
            <LoadingOverlay isVisible={isLoading} />
        </div>
    );
};
