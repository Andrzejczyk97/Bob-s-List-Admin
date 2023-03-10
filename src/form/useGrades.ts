import { useState } from "react";

export const useGrades = (initialGrades: number[]) => {
    const [grades, setGrades] = useState(initialGrades);

    const addGrade = (newGrade: number) => {
        setGrades([...grades, newGrade]);
    };
    const removeGrade = (index: number) => {
        const newGrades = [...grades];
        newGrades.splice(index, 1);
        setGrades(newGrades);
    };

    return { grades, addGrade, removeGrade };
};
