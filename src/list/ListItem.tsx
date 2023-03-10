import React from "react";
import { ItemActions } from "./ItemActions";
import { Note } from "../types";

interface ListItemProps {
    note: Note;
    setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
}
export const ListItem: React.FC<ListItemProps> = ({ note, setNotes }) => {
    const grades = note.grades.join(", ");
    return (
        <tr data-test="list-item" data-id={note.id}>
            <td data-test="list-item-city">{note.city}</td>
            <td data-test="list-item-date">{note.date}</td>
            <td data-test="list-item-dish">{note.favouriteDish.name}</td>
            <td data-test="list-item-grades">{grades}</td>
            <td data-test="list-item-actions"><ItemActions id={note.id} setNotes={setNotes} /></td>
        </tr>
    );
};
