package main

import (
	"encoding/json"
	"log"
	"net/http"
)

type tickerDataRaw struct {
	Dataset struct {
		ID                  int             `json:"id"`
		DatasetCode         string          `json:"dataset_code"`
		DatabaseCode        string          `json:"database_code"`
		Name                string          `json:"name"`
		Description         string          `json:"description"`
		RefreshedAt         string          `json:"refreshed_at"`
		NewestAvailableDate string          `json:"newest_available_date"`
		OldestAvailableDate string          `json:"oldest_available_date"`
		ColumnNames         []string        `json:"column_names"`
		Frequency           string          `json:"frequency"`
		Premium             bool            `json:"premium"`
		StartDate           string          `json:"start_date"`
		EndDate             string          `json:"end_date"`
		Data                [][]interface{} `json:"data"`
		DatabaseID          int             `json:"database_id"`
	} `json:"dataset"`
}

type tickerDataParsed struct {
	StartDate   string      `json:"start_date"`
	EndDate     string      `json:"end_date"`
	RefreshedAt string      `json:"refreshed_at"`
	Data        [][]float64 `json:"data"`
}

func main() {
	http.HandleFunc("/getall", allHandler)
	log.Fatal(http.ListenAndServe(":8000", nil))
}

func allHandler(w http.ResponseWriter, r *http.Request) {
	var urls = []string{
		"https://www.quandl.com/api/v3/datasets/WIKI/AAPL.json",
		"https://www.quandl.com/api/v3/datasets/WIKI/IBM.json",
		"https://www.quandl.com/api/v3/datasets/WIKI/AXP.json",
		"https://www.quandl.com/api/v3/datasets/WIKI/CVS.json",
		"https://www.quandl.com/api/v3/datasets/WIKI/GE.json",
		"https://www.quandl.com/api/v3/datasets/WIKI/MSFT.json",
	}

	rawTickerData := make([]tickerDataRaw, len(urls))
	parsedTickerData := make([]tickerDataParsed, len(urls))

	// loop and request in serial for now
	// quandl also blocks if requests in too quick succession so serial might be preferred anyway
	for i, url := range urls {
		ticker := new(tickerDataRaw)
		res, err := http.Get(url)
		if err != nil {
			log.Fatalf("fetch err: %v\n", err)
		}

		defer res.Body.Close()

		err = json.NewDecoder(res.Body).Decode(ticker)
		if err != nil {
			log.Fatalf("json decode err: %v\n", err)
		}

		rawTickerData[i] = *ticker
	}

	// parse rawTickerData
	for i, ticker := range rawTickerData {
		var data [][]float64
		for _, arr := range ticker.Dataset.Data {
			temp := []float64{}
			for _, item := range arr[1:5] {
				temp = append(temp, item.(float64))
			}
			data = append(data, temp)
		}

		parsedTickerData[i].StartDate = ticker.Dataset.StartDate
		parsedTickerData[i].EndDate = ticker.Dataset.EndDate
		parsedTickerData[i].RefreshedAt = ticker.Dataset.RefreshedAt
		parsedTickerData[i].Data = data
	}

	err := json.NewEncoder(w).Encode(parsedTickerData)
	if err != nil {
		log.Fatalf("json encode error: %v\n", err)
	}

}
