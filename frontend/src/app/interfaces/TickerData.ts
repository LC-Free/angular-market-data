interface TickerDataRaw {
    dataset: {
        id: number,
        dataset_code: string,
        database_code: string,
        name: string,
        description: string,
        refreshed_at: string,
        newest_available_date: string,
        oldest_available_date: string,
        column_names:  string[],
        frequency: string,
        type: string,
        premium: boolean,
        start_date: string,
        end_date: string,
        data: any[][],
        database_id: number,
    }
};

interface TickerDataParsed {
    start_date: string,
    end_date: string,
    refreshed_at: string,
    data: number[][],
};

export { TickerDataRaw, TickerDataParsed }