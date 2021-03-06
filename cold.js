// Initialize==================================================================================
var nodemailer = require('nodemailer');

const bodyparser = require('body-parser');
const http = require('http');
var formidable = require("formidable");
const Swal = require("sweetalert");
var form = new formidable.IncomingForm();
const express = require('express');
const app = express();
app.use(bodyparser.urlencoded({ extended: true }));

var router = express.Router();
const path = require("path");
var urlencodedParser = bodyparser.urlencoded({ extended: false })
app.use(urlencodedParser);
const fs = require("fs");
const port = process.env.PORT || 7874;
var pg = require('pg');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ascwarehouse2021@gmail.com',
    pass: 'ascw1234'
  }
});

// DBConnection==============================================================================
var conString = "postgres://postgres:asb@localhost:5432/postgres";

var client = new pg.Client(conString);
client.connect(function (err) {
  if (err) {
    return console.error('could not connect to postgres', err);
  }
  client.query('SELECT NOW() AS "theTime"', function (err, result) {
    if (err) {
      return console.error('error running query', err);
    }
    console.log("connected to the database", result.rows[0].theTime);

  });
});
// ==================================================================================
app.set('view engine', 'pug') // Set the template engine as pug
app.set('views', path.join(__dirname, 'views'))
// =======================================================================================================================
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/login.html'));
});

app.get('/x', function (req, res) {
  res.sendFile(path.join(__dirname + '/x.html'));
});

app.get('/otp', function (req, res) {
  res.sendFile(path.join(__dirname + '/otp.html'));
});
app.get('/bill1', function (req, res) {
  res.sendFile(path.join(__dirname + '/bill1.html'));
});

app.get('/login', function (req, res) {
  res.sendFile(path.join(__dirname + '/login.html'));
});
app.get('/register', function (req, res) {
  res.sendFile(path.join(__dirname + '/register.html'));
});
// navbar=================================================================================================================
app.get('/home', function (req, res) {
  res.sendFile(path.join(__dirname + '/home.html'));
});
app.get('/aboutus', function (req, res) {
  res.sendFile(path.join(__dirname + '/aboutus.html'));
});
app.get('/contactus', function (req, res) {
  res.sendFile(path.join(__dirname + '/contactus.html'));
});
// admin=============================================
app.get('/admin', function (req, res) {
  res.sendFile(path.join(__dirname + '/admin_db.html'));
});
// tables============================================================================================================================
app.get('/custable', function (req, res) {
  res.sendFile(path.join(__dirname + '/custable.html'));
});
app.get('/protable', function (req, res) {
  res.sendFile(path.join(__dirname + '/protable.html'));
});
app.get('/emptable', function (req, res) {
  res.sendFile(path.join(__dirname + '/emptable.html'));
});
app.get('/waretable', function (req, res) {
  res.sendFile(path.join(__dirname + '/waretable.html'));
});
// datalink--------------------------------------------------------------------------------------
app.get('/waredit', function (req, res) {
  res.sendFile(path.join(__dirname + '/waredit.html'));
});
app.get('/empedit', function (req, res) {
  res.sendFile(path.join(__dirname + '/empedit.html'));
});
app.get('/cusedit', function (req, res) {
  res.sendFile(path.join(__dirname + '/cusedit.html'));
});
app.get('/proedit', function (req, res) {
  res.sendFile(path.join(__dirname + '/proedit.html'));
});
// =================================================================================================================================================================

app.post('/contactinp', (req, res) => {
  // res.send(`Full name is:${req.body.segno} ${req.body.area}.`);
  name1 = req.body.name;
  email1 = req.body.email;
  message1 = req.body.message;
   
  if (name1) {

    client.query("INSERT INTO contact (name,email,message) values ($1, $2, $3)", [name1, email1, message1]);
    res.sendFile(path.join(__dirname + '/contactus.html'));

  } else {
    res.send('<script>alert("Message Could Not Be Sent!!"); window.location.href = "/contactus"; </script>');
  }
  

});

// --------------------------------------------------WAREHOUSE SEGMENT--------------------------------------------------
app.post('/example', (req, res) => {
  // res.send(`Full name is:${req.body.segno} ${req.body.area}.`);
  segno1 = req.body.segno;
  area1 = req.body.area;
  temp1 = req.body.temp;
  chamber1 = req.body.chamber;
  if (segno1 && temp1) {
    client.query("INSERT INTO WARESEGMENT(segno,temp,area,chamber) values($1, $2, $3, $4)", [segno1, temp1, area1, chamber1]);
    res.sendFile(path.join(__dirname + '/waretable.html'));


  } else {
      res.send('<script>alert("Both Segno and temprature required!!"); window.location.href = "/waretable"; </script>');
  }
  console.log(segno1);

});
app.get('/example', (req, res) => {
  // res.redirect(path.join(__dirname + 'http://localhost:7874/waretable'));
  res.redirect('/waretable');
});
app.post('/example2', (req, res) => {
  // res.send(`Full name is:${req.body.segno} ${req.body.area}.`);
  segno1 = req.body.segno;

  if (segno1) {
    client.query("DELETE FROM WARESEGMENT WHERE segno=($1)", [segno1]);
    res.sendFile(path.join(__dirname + '/waretable.html'));

  } else {
      res.send('<script>alert("Segno Input Is InValid"); window.location.href = "/waretable"; </script>');
    
  }
  console.log(segno1);

});
app.get('/example2', (req, res) => {
  // res.redirect(path.join(__dirname + 'http://localhost:7874/waretable'));
  res.redirect('/waretable');
});

app.get('/wd', (req, res) => {
  client.query("SELECT * FROM WARESEGMENT order by segno asc", (err, result) => {
    var wda;
    wda = JSON.stringify(result.rows);
    res.send(wda);
  });
});

app.post('/changeware', (req, res) => {
  // res.send(`Full name is:${req.body.segno} ${req.body.area}.`);
  segno1 = req.body.oldsegno;
  temp1 = req.body.temp;
  area1 = req.body.area;
  chamber1 = req.body.chamber;

  if (segno1 && (temp1 || area1 || chamber1)) {
    // client.query("Update w1 set temp=$1,area=$2,chamber=$3 where segno=$4", [temp1,area1,chamber1,segno1]);
    // res.sendFile(path.join(__dirname + '/waretable.html'));
    if (temp1) {
      client.query("Update WARESEGMENT set temp=$1 where segno=$2", [temp1, segno1]);
      res.sendFile(path.join(__dirname + '/waretable.html'));

    }
    if (area1) {
      client.query("Update WARESEGMENT set area=$1 where segno=$2", [area1, segno1]);
      res.sendFile(path.join(__dirname + '/waretable.html'));

    }
    if (chamber1) {
      client.query("Update WARESEGMENT set chamber=$1 where segno=$2", [chamber1, segno1]);
      res.sendFile(path.join(__dirname + '/waretable.html'));

    }

  } else {
          res.send('<script>alert("Segno with any one parameter required!!"); window.location.href = "/waredit"; </script>');
    
  }
  console.log(segno1);

});
app.get('/changeware', (req, res) => {
  res.redirect(path.join(__dirname + 'http://localhost:7874/waretable'));
  // res.redirect('/waretable');
});
app.get('/wd', (req, res) => {
  client.query("SELECT * FROM WARESEGMENT order by segno asc", (err, result) => {
    var wda;
    wda = JSON.stringify(result.rows);
    res.send(wda);
  });
});


// =================================================================================================================================================================
// -------------------------------------------------------Employee Page---------------------------------------------------------------------------------------------

app.post('/empinput', (req, res) => {
  // res.send(`Full name is:${req.body.segno} ${req.body.area}.`);
  empno1 = req.body.empno;
  name1 = req.body.name;
  dob1 = req.body.dob;
  gender1 = req.body.gender;
  address1 = req.body.address;
  designation1 = req.body.designation;
  salary1 = req.body.salary;
  segno1 = req.body.segno;
  if (empno1 && name1) {
    client.query("INSERT INTO EMPDATA(empno,name,dob,gender,address,salary,segno,designation) values ($1, $2, $3, $4, $5, $6, $7, $8)", [empno1, name1, dob1, gender1, address1, salary1, segno1, designation1]);
    res.sendFile(path.join(__dirname + '/emptable.html'));

  } else {
    res.send('<script>alert("Both Empno and Name requied!!"); window.location.href = "/emptable"; </script>');
  }
  console.log(empno1);

});
app.get('/empinput', (req, res) => {
  res.redirect(path.join(__dirname + 'http://localhost:7874/emptable'));
  // res.redirect('/emptable');
});

app.post('/empdelete', (req, res) => {
  // res.send(`Full name is:${req.body.segno} ${req.body.area}.`);
  empno1 = req.body.empno;

  if (empno1) {
    client.query("DELETE FROM EMPDATA WHERE empno=($1)", [empno1]);
    res.sendFile(path.join(__dirname + '/emptable.html'));

  } else {
    res.send('<script>alert("Empno Is InValid"); window.location.href = "/emptable"; </script>');
  }
  console.log(empno1);

});
app.get('/empdelete', (req, res) => {
  // res.redirect(path.join(__dirname + 'http://localhost:7874/waretable'));
  res.redirect('/emptable');
});

app.post('/empchange', (req, res) => {
  // res.send(`Full name is:${req.body.segno} ${req.body.area}.`);
  empno1 = req.body.empno;
  name1 = req.body.name;
  gender1 = req.body.gender;
  address1 = req.body.address;
  designation1 = req.body.designation;
  salary1 = req.body.salary;
  segno1 = req.body.segno;
  dob1 = req.body.dob;


  if (empno1 && (name1 || dob1 || gender1 || address1 || designation1 || salary1 || segno1)) {
    // client.query("Update w1 set temp=$1,area=$2,chamber=$3 where segno=$4", [temp1,area1,chamber1,segno1]);
    // res.sendFile(path.join(__dirname + '/waretable.html'));
    if (name1) {
      client.query("Update EMPDATA set name=$1 where empno=$2", [name1, empno1]);
      res.sendFile(path.join(__dirname + '/emptable.html'));

    }
    if (dob1) {
      client.query("Update EMPDATA set dob=$1 where empno=$2", [dob1, empno1]);
      res.sendFile(path.join(__dirname + '/emptable.html'));
    }
    if (gender1) {
      client.query("Update EMPDATA set gender=$1 where empno=$2", [gender1, empno1]);
      res.sendFile(path.join(__dirname + '/emptable.html'));

    }
    if (address1) {
      client.query("Update EMPDATA set address=$1 where empno=$2", [address1, empno1]);
      res.sendFile(path.join(__dirname + '/emptable.html'));

    }
    if (designation1) {
      client.query("Update EMPDATA set designation=$1 where empno=$2", [designation1, empno1]);
      res.sendFile(path.join(__dirname + '/emptable.html'));

    }
    if (salary1) {
      client.query("Update EMPDATA set salary=$1 where empno=$2", [salary1, empno1]);
      res.sendFile(path.join(__dirname + '/emptable.html'));

    }
    if (segno1) {
      client.query("Update EMPDATA set segno=$1 where empno=$2", [segno1, empno1]);
      res.sendFile(path.join(__dirname + '/emptable.html'));

    }

  } else {
    res.send('<script>alert("Empno with minimum 1 parameter required!!"); window.location.href = "/empedit"; </script>');
  }
  console.log(segno1);

});
app.get('/empchange', (req, res) => {
  res.redirect(path.join(__dirname + 'http://localhost:7874/emptable'));
  // res.redirect('/waretable');
});

app.get('/empd', (req, res) => {
  client.query("SELECT * FROM EMPDATA ", (err, result) => {
    var wda;
    wda = JSON.stringify(result.rows);
    res.send(wda);
  });
});
// ------------------------------------------------------------------------CUSTOMER---------------------------------------------------------------------------
app.post('/cusinput', (req, res) => {
  // res.send(`Full name is:${req.body.segno} ${req.body.area}.`);
  fname1 = req.body.fname;
  lname1 = req.body.lname;
  gender1 = req.body.gender;
  occupation1 = req.body.occupation;
  email1 = req.body.email;
  phone1 = req.body.phone;
  address1 = req.body.address;

  if (fname1 && email1) {

    client.query("INSERT INTO CUSTOMER(fname,lname,gender,occupation,email,phone,address) values ($1, $2, $3, $4, $5, $6, $7)", [fname1, lname1, gender1, occupation1, email1, phone1, address1]);
    res.sendFile(path.join(__dirname + '/custable.html'));

  } else {
    res.send('<script>alert("Both First Name and Email required"); window.location.href = "/custable"; </script>');
  }
  console.log(fname1);

});
app.get('/cusinput', (req, res) => {
  res.redirect(path.join(__dirname + 'http://localhost:7874/custable'));
  // res.redirect('/emptable');
});

app.post('/cusdelete', (req, res) => {
  // res.send(`Full name is:${req.body.segno} ${req.body.area}.`);
  cusid1 = req.body.cusid;

  if (cusid1) {
    client.query("DELETE FROM CUSTOMER WHERE cusid=($1)", [cusid1]);
    res.sendFile(path.join(__dirname + '/custable.html'));

  } else {
    res.send('<script>alert("Customer Id Is InValid"); window.location.href = "/custable"; </script>');
  }
  console.log(cusid1);
});
app.get('/cusdelete', (req, res) => {
  // res.redirect(path.join(__dirname + 'http://localhost:7874/waretable'));
  res.redirect('/custable');
});

app.post('/cuschange', (req, res) => {
  // res.send(`Full name is:${req.body.segno} ${req.body.area}.`);
  cusid1 = req.body.cusid;
  fname1 = req.body.fname;
  lname1 = req.body.lname;
  gender1 = req.body.gender;
  occupation1 = req.body.occupation;
  email1 = req.body.email;
  address1 = req.body.address;
  phone1 = req.body.phone;


  if (cusid1 && (fname1 || lname1 || gender1 || occupation1 || email1 || address1 || phone1)) {
    // client.query("Update w1 set temp=$1,area=$2,chamber=$3 where segno=$4", [temp1,area1,chamber1,segno1]);
    // res.sendFile(path.join(__dirname + '/waretable.html'));
    if (fname1) {
      client.query("Update CUSTOMER set fname=$1 where cusid=$2", [fname1, cusid1]);
      res.sendFile(path.join(__dirname + '/custable.html'));

    }
    if (lname1) {
      client.query("Update CUSTOMER set lname=$1 where cusid=$2", [lname1, cusid1]);
      res.sendFile(path.join(__dirname + '/custable.html'));
    }
    if (gender1) {
      client.query("Update CUSTOMER set gender=$1 where cusid=$2", [gender1, cusid1]);
      res.sendFile(path.join(__dirname + '/custable.html'));

    }
    if (occupation1) {
      client.query("Update CUSTOMER set occupation=$1 where cusid=$2", [occupation1, cusid1]);
      res.sendFile(path.join(__dirname + '/custable.html'));

    }
    if (email1) {
      client.query("Update CUSTOMER set email=$1 where cusid=$2", [email1, cusid1]);
      res.sendFile(path.join(__dirname + '/custable.html'));

    }
    if (address1) {
      client.query("Update CUSTOMER set address=$1 where cusid=$2", [address1, cusid1]);
      res.sendFile(path.join(__dirname + '/custable.html'));

    }
    if (phone1) {
      client.query("Update CUSTOMER set phone=$1 where cusid=$2", [phone1, cusid1]);
      res.sendFile(path.join(__dirname + '/custable.html'));

    }

  } else {
    res.send('<script>alert("Customer Id with any one parameter required"); window.location.href = "/cusedit"; </script>');
  }
  console.log(cusid1);

});
app.get('/cuschange', (req, res) => {
  res.redirect(path.join(__dirname + 'http://localhost:7874/custable'));
  // res.redirect('/waretable');
});

app.get('/cusd', (req, res) => {
  client.query("SELECT * FROM CUSTOMER order by cusid asc", (err, result) => {
    var wda;
    wda = JSON.stringify(result.rows);
    res.send(wda);
  });
});

// ----------------------------------------------------------------------pRODUCT------------------------------------------------------------

app.post('/proinput', (req, res) => {
  // res.send(`Full name is:${req.body.segno} ${req.body.area}.`);
  cusid1 = req.body.cusid;
  chamid1 = req.body.chamid;
  type1 = req.body.type;
  quantity1 = req.body.quantity;
  timep1 = req.body.timep;
  if (cusid1) {

    client.query("INSERT INTO PRODUCT (cusid,chamid,type,quantity,timep) values ($1, $2, $3, $4, $5)", [cusid1, chamid1, type1, quantity1, timep1]);
    res.sendFile(path.join(__dirname + '/protable.html'));

  } else {
    res.send('<script>alert("Customer Id Required"); window.location.href = "/protable"; </script>');
  }
  console.log(cusid1);

});
app.get('/proinput', (req, res) => {
  res.redirect(path.join(__dirname + 'http://localhost:7874/protable'));
  // res.redirect('/emptable');
});

app.post('/prodelete', (req, res) => {
  // res.send(`Full name is:${req.body.segno} ${req.body.area}.`);
  proid1 = req.body.proid;

  if (proid1) {
    client.query("DELETE FROM PRODUCT WHERE proid=($1)", [proid1]);
    res.sendFile(path.join(__dirname + '/protable.html'));

  } else {
    res.send('<script>alert("Product Id Required"); window.location.href = "/protable"; </script>');
  }
  console.log(proid1);
});
app.get('/prodelete', (req, res) => {
  // res.redirect(path.join(__dirname + 'http://localhost:7874/waretable'));
  res.redirect('/protable');
});


app.post('/prochange', (req, res) => {
  // res.send(`Full name is:${req.body.segno} ${req.body.area}.`);
  proid1 = req.body.proid;
  cusid1 = req.body.cusid;
  chamid1 = req.body.chamid;

  type1 = req.body.type;
  quantity1 = req.body.quantity;
  timep1 = req.body.timep;

  if (proid1 && (cusid1 || chamid1 || type1 || quantity1 || timep1)) {
    // client.query("Update w1 set temp=$1,area=$2,chamber=$3 where segno=$4", [temp1,area1,chamber1,segno1]);
    // res.sendFile(path.join(__dirname + '/waretable.html'));
    if (cusid1) {
      client.query("Update PRODUCT set cusid=$1 where proid=$2", [cusid1, proid1]);
      res.sendFile(path.join(__dirname + '/protable.html'));

    }
    if (chamid1) {
      client.query("Update PRODUCT set chamid=$1 where proid=$2", [chamid1, proid1]);
      res.sendFile(path.join(__dirname + '/protable.html'));

    }
    if (type1) {
      client.query("Update PRODUCT set type=$1 where proid=$2", [type1, proid1]);
      res.sendFile(path.join(__dirname + '/protable.html'));

    }
    if (quantity1) {
      client.query("Update PRODUCT set quantity=$1 where proid=$2", [quantity1, proid1]);
      res.sendFile(path.join(__dirname + '/protable.html'));

    }
    if (timep1) {
      client.query("Update PRODUCT set timep=$1 where proid=$2", [timep1, proid1]);
      res.sendFile(path.join(__dirname + '/protable.html'));

    }

  } else {
    res.send('<script>alert("Product Id with any 1 parameter required"); window.location.href = "/proedit"; </script>');
  }

  console.log(proid1);

});
app.get('/prochange', (req, res) => {
  res.redirect(path.join(__dirname + 'http://localhost:7874/protable'));
  // res.redirect('/waretable');
});

app.get('/prod', (req, res) => {
  client.query("SELECT * FROM Product ORDER BY proid asc ", (err, result) => {
    var wda;
    wda = JSON.stringify(result.rows);
    res.send(wda);
  });
});
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------
var fname1,lname1,gender1,email1,phone1,pwd1,cpwd1,msg1;
app.post('/reginput', (req, res) => {
  // res.send(`Full name is:${req.body.segno} ${req.body.area}.`);
  fname1 = req.body.fname;
  lname1 = req.body.lname;
  gender1 = req.body.gender;
  email1 = req.body.email;
  phone1 = req.body.phone;
  pwd1 = req.body.pwd;
  cpwd1 = req.body.cpwd;

var msg=Math.floor((Math.random() * 100000) + 1);
msg1=msg;
var mailOptions = {
  from: 'ascwarehouse2021@gmail.com',
  to: email1,
  subject: 'Mail from ASC Warehouse',
  text: `One time otp for registration = `+msg
//   html: "<b>{{msg}}</b>"
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

res.sendFile(path.join(__dirname + '/otp.html'));
// if(ssk1==securitykey){
//   if (pwd1 == cpwd1) {

//     client.query("INSERT INTO ADMIN(fname,lname,gender,email,phone,pwd,cpwd) values ($1, $2, $3, $4, $5, $6, $7)", [fname1, lname1, gender1, email1, phone1, pwd1, cpwd1]);
//     res.sendFile(path.join(__dirname + '/login.html'));
//     // res.send('<script>Confirm("REgistration Successfull"); window.location.href = "/login"; </script>');

//   } else {
//     res.send('<script>alert("Password InValid"); window.location.href = "/register"; </script>');
//   }
//   console.log("Registered:-", fname1);
// }
// else{
//   {
//     res.send('<script>alert("Incorrect Security Key"); window.location.href = "/register"; </script>');
//   }
// }
});
app.post('/otp', (req, res) => {
  otp1 = req.body.otp;
  if(otp1==msg1){
      if (pwd1 == cpwd1) {
    
        client.query("INSERT INTO ADMIN(fname,lname,gender,email,phone,pwd,cpwd) values ($1, $2, $3, $4, $5, $6, $7)", [fname1, lname1, gender1, email1, phone1, pwd1, cpwd1]);
        res.sendFile(path.join(__dirname + '/login.html'));
        // res.send('<script>Confirm("REgistration Successfull"); window.location.href = "/login"; </script>');
    
      } else {
        res.send('<script>alert("Password Values Do Not Match!!"); window.location.href = "/register"; </script>');
      }
      console.log("Registered:-", fname1);
    }
    else{
      {
        res.send('<script>alert("Incorrect OTP!!"); window.location.href = "/otp"; </script>');
      }
    }
  
});


app.post('/loginput', (req, res) => {
  // res.send(`Full name is:${req.body.segno} ${req.body.area}.`);
  email1 = req.body.email;
  pwd1 = req.body.pwd;

  if (email1 && pwd1) {
    client.query("SELECT * FROM ADMIN WHERE email like ($1) and pwd like($2)", [email1, pwd1], (err, result) => {
      if (result.rows.length == 0) {
        res.send('<script>alert("InValid Email or Password"); window.location.href = "/login"; </script>');
      }
      else {
        res.sendFile(path.join(__dirname + '/admin_db.html'));
      }
    });
  } else {
    res.send('<script>alert("Both email and Password"); window.location.href = "/login"; </script>');
  }

});



// -------------------------------------------------------INvoice-------------------------------
var cusid1=0;
app.post('/voiceinput', (req, res) => {
  // res.send(`Full name is:${req.body.segno} ${req.body.area}.`);
  cusid1 = req.body.cusid;  
  res.sendFile(path.join(__dirname + '/bill1.html'));
  console.log(cusid1);
});

console.log(cusid1);
app.get('/ind', (req, res) => {

  if(cusid1!=0){
  client.query("SELECT * FROM Costomer_VIEW where cusid=($1) ",[cusid1], (err, result) => {
    // if (result.rows.length == 0) {
    //   // res.send('<script>alert("Customer Id Invalid"); window.location.href = "/x"; </script>');
    //   res.send('');
    // }
    // else{
    var wda;
    wda = JSON.stringify(result.rows);
    res.send(wda);
  // }
  });
}
});

app.get('/amt', (req, res) => {

  if(cusid1!=0){
  client.query("SELECT Sum(rent) as subtotal,sum(rent)*0.1 as gst,sum(rent)+sum(rent)*0.1 as total FROM Product where cusid=($1)",[cusid1], (err, result) => {
    // if (result.rows.length == 0) {
    //   // res.send('<script>alert("Customer Id Invalid"); window.location.href = "/x"; </script>');
    //   res.send('');
    // }
    // else{
    var wda;
    wda = JSON.stringify(result.rows);
    res.send(wda);
  // }
  });
}
else{
  res.send('.')
}
});

app.post('/paid', (req, res) => {
  client.query("DELETE FROM PRODUCT WHERE cusid=($1)", [cusid1]);
  res.sendFile(path.join(__dirname + '/admin_db.html'));
});
// -----------------------------
app.listen(port, () => {
  console.log(`The application started successfully on port ${port}`);
});










