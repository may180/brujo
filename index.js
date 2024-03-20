const express = require('express');
const path = require('path');
const app = express();

const router = require("./routes/user");
const session = require('express-session')


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
    secret: 'ANDKAUSHDUKJ',
    resave: false,
    saveUninitialized: true
}))

app.use("/", router)

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));



const port = 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}
    http://localhost:3000/`);
});



