package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func handleRequests() {
	r := mux.NewRouter().StrictSlash(true)
	r.Methods("OPTIONS").HandlerFunc(HandleOptions)
	r.HandleFunc("/createPoll", createPoll).Methods("POST")
	r.HandleFunc("/getPoll/{id}", getPoll).Methods("GET")
	r.Walk(func(route *mux.Route, router *mux.Router, ancestors []*mux.Route) error {
		t, _ := route.GetPathTemplate()
		m, _ := route.GetMethods()
		name := route.GetName()
		log.Printf("%-6v %v (%v)\n", m, t, name)
		return nil
	})
	fmt.Println("start api on port 9000")
	log.Println(http.ListenAndServe("0.0.0.0:9000", r))
	fmt.Println("server shutdown")
}

func main() {
	ConnectDB()
	handleRequests()
}
