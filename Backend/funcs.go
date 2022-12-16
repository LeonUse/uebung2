package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	_ "github.com/go-sql-driver/mysql"
)

var err error
var DB *sql.DB

type Poll struct {
	ID        int     `json:"id"`
	IDPoll      string  `json:"idPoll"`
	OptionID     int `json:"optionId"`
	Poll    string `json:"poll"`
}

type Option struct {
	ID        int     `json:"id"`
	OptionID     int `json:"optionId"`
	Value     string `json:"value"`
}

type PollFrontend struct {
	ID        string     `json:"id"`
	Poll     string  `json:"poll"`
	OptionID     int `json:"optionId"`
	Options   []string 
}

func ConnectDB() {
	db, err := sql.Open("mysql", fmt.Sprintf("root:leon@tcp(%s:3306)/uebung2", os.Getenv("DB_HOST")))
	if err != nil {
		log.Println("Error Connecting Database")
		panic(err)
	}
	log.Println("Sucessfully connected to Database")
	DB = db
	pingErr := db.Ping()
	if pingErr != nil {
		log.Fatal(pingErr)
	}
}

func RespondWithError(w http.ResponseWriter, code int, msg string) error {
	log.Println("Responding with error", msg)
	return RespondWithJSON(w, code, map[string]string{"error": msg})
}

func RespondWithJSON(w http.ResponseWriter, code int, payload interface{}) error {
	response, err := json.Marshal(payload)
	if err != nil {
		return err
	}
	SetCors(w)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(response)
	return nil

}

func SetCors(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE, UPDATE")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, token, X-Requested-With")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
}

func HandleOptions(w http.ResponseWriter, r *http.Request) {
	SetCors(w)
	w.WriteHeader(200)
}

func createPoll(w http.ResponseWriter, r *http.Request) {
	fmt.Println("create wurde aufgerufen")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE")
	polls := PollFrontend{}
	json.NewDecoder(r.Body).Decode(&polls)
	fmt.Println("Body:", polls)
	fmt.Println("polls",polls)
	err = nil
	_, err := DB.Exec("INSERT INTO poll (idPoll, optionId, poll) VALUES(?,?,?)", polls.ID, polls.OptionID, polls.Poll)
	if err != nil {
		log.Println("Fehler bei createPoll:", polls, err)
		RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}
	for i := 0; i < len(polls.Options); i++ {
		_, err := DB.Exec("INSERT INTO options (optionID, value) VALUES(?,?)", polls.OptionID, polls.Options[i])
	if err != nil {
		log.Println("Fehler bei createPoll:", polls, err)
		RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}
	}

	RespondWithJSON(w, http.StatusOK, err)
}

