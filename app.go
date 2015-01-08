package main

import (
	"net/http"
	"os"
)

func main() {

	env := os.Getenv("GO_ENV")
	port := os.Getenv("PORT")

	if env == "" {
		env = "production"
	}

	if port == "" {
		port = "8080"
	}

	if env == "development" {
		http.Handle("/styles/", http.StripPrefix("/styles/", http.FileServer(http.Dir("client/.tmp/styles"))))
		http.Handle("/js/", http.StripPrefix("/js/", http.FileServer(http.Dir("client/.tmp/js"))))
		http.Handle("/", http.FileServer(http.Dir("./client/app")))
	} else {
		http.Handle("/", http.FileServer(http.Dir("./client/dist")))
	}

	http.ListenAndServe(":"+port, nil)
}
