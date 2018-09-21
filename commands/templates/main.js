const main = appName => `package main

import (
	"fmt"
	"syscall/js"
)

func main() {
	document := js.Global().Get("document")
	body := document.Call("querySelector", "body")

	div := document.Call("createElement", "div")
	div.Set("textContent", "Welcome in your wasm app ${appName}")

	body.Call("appendChild", div)

	fmt.Println("Application ${appName} is now started")
}`;

module.exports = main;
