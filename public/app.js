const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');
const fetch = import('node-fetch');
const MongoClient = require('mongodb').MongoClient;
const nodemailer = require('nodemailer');


const PORT = process.env.PORT || 3000;



// Define MongoDB connection details


// Define routes
app.get('/', (req, res) => {
  res.send('Welcome to our tour website!');
});

app.get('/about', (req, res) => {
  res.send('About us page');
});

app.get('/packages', (req, res) => {
  res.send('Packages page');
});

app.get('/destinations', (req, res) => {
  res.send('Destinations page');
});

app.get('/services', (req, res) => {
  res.send('Services page');
});

app.get('/testimonials', (req, res) => {
  res.send('Testimonials page');
});

app.get('/team', (req, res) => {
  res.send('Our team page');
});

app.get('/contact', (req, res) => {
  res.send('Contact us page');
});


app.get('/book-now', (req, res) => {
    const bookingPage = require('./booking.html');
    res.send(bookingPage);
  });
  
// Connect to the database
const mongoUrl = 'mongodb+srv://Abbieholidays:Abbieholidays001@AbbiHolidays1.x5prg2a.mongodb.net/?retryWrites=true&w=majority';
app.listen(PORT, () => {
 
MongoClient.connect(mongoUrl, function(err, client) {
  if (err) {
    console.error('Error connecting to MongoDB Atlas: ', err);
  } else {
    console.log('Connected to MongoDB Atlas');

    // Store a reference to the database
    const db = client.db();

    // Define routes that require database access
    app.post('/book', bodyParser.urlencoded({ extended: true }), [
      check('name').trim().isLength({ min: 1, max: 50 }),
      check('email').trim().isEmail(),
      check('date').trim().isISO8601().toDate(),
      check('time').trim().isLength({ min: 1, max: 10 }),
      check('destination').trim().isLength({ min: 1, max: 50 }),
      check('specialRequest').trim().isLength({ max: 255 })
    ], (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, date, time, destination, specialRequest } = req.body;

      // Save the booking details to the database
      (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
      
        const { name, email, date, time, destination, specialRequest } = req.body;
      
        // Save the booking details to the database
        db.collection('bookings').insertOne({ 
          name: name, 
          email: email, 
          date: date, 
          time: time, 
          destination: destination, 
          specialRequest: specialRequest
        }, function(err, result) {
          if (err) throw err;
          console.log('Saved booking to database');
      
          // Send a notification email
          const transporter = nodemailer.createTransport(transportOptions);
          const message = {
            from: 'Tour Website <info@example.com>',
            to: 'notifications@example.com',
            subject: 'New booking',
            html: `<p>A new booking has been made:</p>
                   <p>Name: ${name}</p>
                   <p>Email: ${email}</p>
                   <p>Date: ${date}</p>
                   <p>Time: ${time}</p>
                   <p>Destination: ${destination}</p>
                   <p>Special request: ${specialRequest}</p>`
          };
          transporter.sendMail(message, function(err, info) {
            if (err) throw err;
            console.log('Sent notification email');
          });
      
          res.status(200).send('Booking successful!');
        });
      };
      
      app.post('/subscribe', bodyParser.urlencoded({ extended: true }), [
        check('email').trim().isEmail()
      ], (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
      
        const { email } = req.body;
      
        // Save the email to the database
        db.collection('subscribers').insertOne({ 
          email: email
        }, function(err, result) {
          if (err) throw err;{
            console.log('Saved subscriber to database');
          }
         
        });
      
        // Send a notification email
        const transporter = nodemailer.createTransport(transportOptions);
        const message = {
          from: 'Tour Website <info@example.com>',
          to: email,
          subject: 'Subscription confirmation',
          html: '<p>Thank you for subscribing to our newsletter!</p>'
        };
        transporter.sendMail(message, function(err, info) {
          if (err) throw err;
          console.log('Sent confirmation email to subscriber');
        });
      
        res.status(200).send('Subscription successful!');
      });

    
    });  
   
  }    
});
});
app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
}); 

 

