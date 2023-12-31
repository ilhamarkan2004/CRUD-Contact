const express = require("express");
const expressLayouts = require('express-ejs-layouts')
const app = express();
const morgan = require('morgan');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const {
  body,
  validationResult,
  check
} = require("express-validator");
const port = 3000;
const {
  loadContact,
  findContact,
  addContact,
  cekDuplikat,
  deleteContact,
  updateContacts
} = require('./utils/contacts')

// Menggunakan ejs
app.set('view engine', 'ejs');

// Third party middleware
app.use(expressLayouts);


// Built In Middleware
app.use(express.static("public"));
app.use(express.urlencoded({
  extended: true
}));


// Konfigurasi flash
app.use(cookieParser('secret'));
app.use(session({
  cookie: {
    maxAge: 6000
  },
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));
app.use(flash());



app.get("/", (req, res) => {

  const mahasiswa = [{
      nama: "Ilham Arkan",
      email: "ilham@gmail.com",
    },
    {
      nama: "budi",
      email: "budi@gmail.com",
    },
    {
      nama: "joko",
      email: "joko@gmail.com",
    },
  ];


  res.render('index', {
    nama: 'arkan',
    title: 'home',
    mahasiswa,
    layout: 'layouts/main-layout'
  });
});

app.get("/about", (req, res) => {
  res.render('about', {
    layout: 'layouts/main-layout',
    title: 'Halaman About'
  });
});
app.get("/contact", (req, res) => {
  const contacts = loadContact();
  res.render("contact", {
    layout: 'layouts/main-layout',
    title: "Halaman Contact",
    contacts,
    msg: req.flash('msg')
  });
});

// Halaman form tambah data
app.get("/contact/add", (req, res) => {
  res.render("add-contact", {
    layout: "layouts/main-layout",
    title: "Tambah Data Contact",
  });
});

// Proses tambah data contact
app.post(
  "/contact",
  [
    body("nama").custom((value) => {
      const duplikat = cekDuplikat(value);
      if (duplikat) {
        throw new Error('Nama contact sudah digunakan');
      }
      return true;
    }),
    check("email", "Email tidak valid").isEmail(),
    check("nohp", "Nomor Handphone tidak valid").isMobilePhone('id-ID'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(400).json({
      //   errors: errors.array()
      // });
      res.render('add-contact', {
        layout: "layouts/main-layout",
        title: "Tambah Data Contact",
        errors: errors.array()
      });
    } else {
      addContact(req.body);

      // Kirimkan flash message
      req.flash('msg', 'Data contact berhasil ditambahkan');
      res.redirect('/contact');
    }
  }
);

// Proses delete contact
app.get('/contact/delete/:nama', (req, res) => {
  const contact = findContact(req.params.nama);

  // Jika contact tidak ada
  if (!contact) {
    res.status(404);
    res.send('404');
  } else {
    deleteContact(req.params.nama);
    req.flash("msg", "Data contact berhasil dihapus");
    res.redirect("/contact");
  }
});


// Form ubah data contact
app.get("/contact/edit/:nama", (req, res) => {
  const contact = findContact(req.params.nama);
  res.render("edit-contact", {
    layout: "layouts/main-layout",
    title: "Ubah Data Contact",
    contact
  });
});

// Proses ubah data
app.post(
  "/contact/update",
  [
    body("nama").custom((value,{req}) => {
      const duplikat = cekDuplikat(value);
      if (value !== req.body.oldNama && duplikat) {
        throw new Error("Nama contact sudah digunakan");
      }
      return true;
    }),
    check("email", "Email tidak valid").isEmail(),
    check("nohp", "Nomor Handphone tidak valid").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(400).json({
      //   errors: errors.array()
      // });
      res.render("edit-contact", {
        layout: "layouts/main-layout",
        title: "Edit Data Contact",
        errors: errors.array(),
        contact : req.body
      });
    } else {
      updateContacts(req.body);

      // Kirimkan flash message
      req.flash("msg", "Data contact berhasil diubah");
      res.redirect("/contact");
    }
  }
);


app.get("/contact/:nama", (req, res) => {
  const contact = findContact(req.params.nama);
  res.render("detail", {
    layout: "layouts/main-layout",
    title: "Halaman Detail",
    contact,
  });
});



// Untuk menangani route yang gaada
app.use('/', (req, res) => {
  res.status(404);
  res.send('404');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});