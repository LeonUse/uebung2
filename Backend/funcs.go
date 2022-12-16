package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
)
var err error
var DB *sql.DB

type Option struct {
	ID        int     `json:"id"`
	OptionID     int `json:"optionId"`
	Value     string `json:"value"`
}

type PollFrontend struct {
	ID        string     `json:"id"`
	Poll     string  `json:"poll"`
	Options   []string 
}

type Poll struct {
	ID        string     `json:"id"`
	IDPoll        string     `json:"idPoll"`
	OptionID     int `json:"optionId"`
	Poll     string  `json:"poll"`
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
	id := getMaxId()
	fmt.Println("Body:", polls, "id", id)
	
	_,err := DB.Exec("INSERT INTO poll (idPoll, optionId, poll) VALUES(?,?,?)", polls.ID, id, polls.Poll)
	if err != nil {
		log.Println("Fehler bei createPoll:", polls, err)
		RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	for i := 0; i < len(polls.Options); i++ {
		_, err := DB.Exec("INSERT INTO options (optionID, value) VALUES(?,?)", id, polls.Options[i])
	if err != nil {
		log.Println("Fehler bei createPoll:", polls, err)
		RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}
	}
	RespondWithJSON(w, http.StatusOK, err)
}

func getPoll(w http.ResponseWriter, r *http.Request) {
	fmt.Println("getPoll wurde aufgerufen")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE")
	params := mux.Vars(r)
	id:= params["id"] 
	idTest:= "\"" + id + "\""
	poll := Poll{}
	response:= PollFrontend{}
	query:= "SELECT * FROM poll WHERE idPoll = " + idTest
	fmt.Println("Query:", query)
	err := DB.QueryRow(query).Scan(&poll.ID, &poll.IDPoll, &poll.OptionID, &poll.Poll)
	if err != nil {
		log.Println("Fehler bei getPoll:", poll, err)
		RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}
	response.ID=poll.IDPoll
	response.Poll=poll.Poll
	rows, err := DB.Query("SELECT * FROM options WHERE optionId = ?", poll.OptionID)
	if err != nil {
		fmt.Println("Fehler bei getRezepte:", err)
		RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	option := Option{}
	for rows.Next() {
		if err := rows.Scan(&option.ID,&option.OptionID ,&option.Value); err != nil {
			RespondWithError(w, http.StatusInternalServerError, err.Error())
			return
		}
		response.Options = append(response.Options, option.Value)
	}
	fmt.Println("response", response)
	RespondWithJSON(w, http.StatusOK, response)
}


func getMaxId() int{
	var id int
	 err := DB.QueryRow("SELECT MAX(Id) FROM poll").Scan(&id)
	if err != nil {
		return 0
	}
	return id
}

