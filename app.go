package main

import (
	"net/http"
)

func main() {

	http.Handle("/styles/", http.StripPrefix("/styles/", http.FileServer(http.Dir("client/.tmp/styles"))))
	http.Handle("/js/", http.StripPrefix("/js/", http.FileServer(http.Dir("client/.tmp/js"))))
	http.Handle("/", http.FileServer(http.Dir("./client/app")))

	http.ListenAndServe(":8080", nil)
}
