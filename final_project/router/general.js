const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    

    if (username && password) {
        if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
        } else {
        return res.status(404).json({message: "User already exists!"});    
        }
    } 
    return res.status(404).json({message: "Unable to register user."});

});

let getPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
        resolve(JSON.stringify(books, null, 10));
    },6000)
})

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    getPromise.then((succesMessage) =>{
        res.send("From callback: " + succesMessage);
    })

});



// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    
    let getIsbnPromise = new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve(books[isbn]);
        },6000)
    })

    getIsbnPromise.then((succesMessage) =>{
        res.send("From callback: " + succesMessage);
    })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let book;

    let getAuthorPromise = new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve(JSON.stringify(book, null, 3));
        },6000)})

    for (let isbn = 1; isbn < 11; isbn ++){
        book = books[isbn];
        if (book["author"]===author){
            getAuthorPromise.then((succesMessage) =>{
                res.send("From callback: " + succesMessage);
            })
        }
    }

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let book;

    let getTitlePromise = new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve(JSON.stringify(book, null, 3));
        },6000)})

    for (let isbn = 1; isbn < 11; isbn ++){
        book = books[isbn];
        if (book["title"]===title){
            getTitlePromise.then((succesMessage) =>{
                res.send("From callback: " + succesMessage);
            })
        }
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const review = books[isbn];
    res.send(review["reviews"]);
});

module.exports.general = public_users;
