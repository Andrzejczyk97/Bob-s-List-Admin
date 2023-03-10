import React from "react";

export interface UseRequest<R> {
    response: R | Error | null;
    isLoading: boolean;
    makeRequest: () => void;
}

export function isResponseError<R>(response: R | Error | null): response is Error {
    return response instanceof Error;
}

export function useRequest<Response>(request: () => Promise<Response>): UseRequest<Response> {
    const [response, setResponse] = React.useState<Response | Error | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);

    const makeRequest = async () => {
        setIsLoading(true);

        await request().then(result => {
            setResponse(result);
        }).catch(error => {
            setResponse(error);
            console.log("Request failed:", error);
        });
        setIsLoading(false);
    };
    return {
        response: response,
        isLoading: isLoading,
        makeRequest: makeRequest,
    };
}
