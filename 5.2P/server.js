const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

//add routes 
app.use('/api/books', require('./routes/book'));

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
