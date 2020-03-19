const express = require('express');
const session = require('express-session');
const app = express();
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'lwhawk.com',
    user: 'lwhawkco_lhyltoncs',
    password: 'Ll6677327',
    database: 'lwhawkco_courses'
})
connection.connect();


app.use(express.static('static_files'));
app.use(session({secret: 'secret'}));

app.get('/departments', (req, res) => {
    connection.query('select distinct Mneumonic from all_courses order by Mneumonic;', (err, rows, fields) => {
        let responseData = {departments: []};
        if (err) throw err;
        for (let i = 0; i < rows.length; i++) {
            responseData.departments.push(rows[i].Mneumonic);

        }
        res.send(responseData);
    });
});

app.get('/courseNumbers/:department', (req, res) => {
    connection.query('SELECT Number from all_courses where Mneumonic=\"' + req.params.department + '\";', (err, rows, field) => {
        let responseData = {numbers: []};
        if (err) throw err;
        let current = "";
        for (let i = 0; i < rows.length; i++) {
            if (rows[i].Number != current) {
                responseData.numbers.push(rows[i].Number);
                current = rows[i].Number;
            }
        }
        res.send(responseData);
    });
});

app.get('/courses/:department/:number', (req, res) => {
    connection.query('SELECT * from all_courses where Mneumonic=\"' + req.params.department + '\" and Number=' + req.params.number, (err, rows, field) => {
        let responseData = {courses: []};
        if (err) throw err;
        for (let i = 0; i < rows.length; i++) {
            responseData.courses.push(rows[i]);
        }
        res.send(responseData);
    });
});

app.get('/courses/:department', (req, res) => {
    connection.query('SELECT * from all_courses where Mneumonic=\"' + req.params.department + '\" order by Number, Section;', (err, rows, field) => {
        let responseData = {courses: []};
        if (err) throw err;
        for (let i = 0; i < rows.length; i++) {
            responseData.courses.push(rows[i]);
        }
        res.send(responseData);
    });
});

app.post('/user', (req, res) => {
    let sess = req.session;
    if (sess.user) {
        res.send({user: sess.user});
    } else {
        res.send({user: "none"});
    }
});

app.post('/login/:user/:pwd', (req, res) => {

});

app.post('/signup/:user/:pwd/:fname/:lname', (req, res) => {

});

app.listen(3000, () => {
    console.log('Server started at http://localhost:3000/');
});

