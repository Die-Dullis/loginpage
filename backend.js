const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");
const mysql = require('mysql2');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON and form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Create a connection to the MySQL server
const db = mysql.createConnection({
    host: 'localhost',      // MySQL server address
    user: 'root',  // MySQL username
    password: '1234',  // MySQL password
    database: 'login',  // Database name
});

// Connect to the database
db.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err.stack);
      return;
    }
    console.log('Connected to the MySQL server');
});

// Serve static HTML, CSS files (login page)
app.use(express.static('public'));

// Serve the login page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "main.html"));
});

app.get("/monke", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "bild.html"));
});

//WICHTIG TEMPORÄR
app.get('/user', (req, res) => {
  db.query('SELECT username FROM user', (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      res.status(500).send('Error fetching user');
      return;
    }
    // Send the query results as JSON response
    res.json(results);
    console.log(results);
  });
});




// POST endpoint for login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Query the database to check if the user exists and the password matches
  const query = 'SELECT * FROM user WHERE username = ? AND password = ?';
  
  db.query(query, [username, password], (err, results) => {
    //console.log(password);
    if (err) {
      console.error('Error querying the database:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    // If a user with matching username and password is found
    if (results.length > 0) {
      // Successful login, redirect to the overview page
      res.sendFile(path.join(__dirname, "public", "overview.html"));
    } else {
      // Invalid credentials
      res.status(401).json({ message: 'Invalid username or password' });
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
