




app.use(express.static('public', {
  setHeaders: (res, path, stat) => {
    if (path.endsWith('.js')) {
      res.set('Content-Type', 'application/javascript');
    }
  }
}));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/users/lenovo/desktop/travel website/index.html');
});

const form = document.querySelector('#booking-form');


const submitButton = document.querySelector('#book-now-button');

submitButton.addEventListener('click', (event) => {
  event.preventDefault();

  const formData = new FormData(form);

  fetch('/api/booking', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    // Handle the server's response
    console.log(data);
  })
  .catch(error => {
    console.error(error);
  });
});
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
  