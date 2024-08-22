const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const {
  loadContact,
  findContact,
  addContact,
  cekContact,
  cekEmail,
  cekNoHp,
  deleteContact,
  updateContact,
} = require("./utils/contacts");
const { body, validationResult, check } = require("express-validator");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

const app = express();
const port = 3000;

//static file
app.use(express.static("public"));

//set the view engine to ejs
app.set("view engine", "ejs");

//third party middleware
app.use(expressLayouts);

//built-in middleware
app.use(express.urlencoded({ extended: true }));

//cookie-parser middleware
app.use(cookieParser("secret"));

//express-session middleware
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

//connect-flash middleware
app.use(flash());

//routing
app.get("/", (req, res) => {
  res.render("index", {
    layout: "layouts/main-layout",
    title: "Home",
    nama: "Fadhil Andika Muslim",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About",
    layout: "layouts/main-layout",
  });
});

app.get("/contact", (req, res) => {
  const contacts = loadContact();

  res.render("contact", {
    title: "Contact",
    layout: "layouts/main-layout",
    contacts,
    msg: req.flash("success"),
  });
});

app.get("/contact/add", (req, res) => {
  res.render("add-contact", {
    title: "Add Contact",
    layout: "layouts/main-layout",
  });
});

app.post(
  "/contact",
  [
    body("nama").custom((value) => {
      const duplicate = cekContact(value);
      if (duplicate) {
        throw new Error("Nama sudah terdaftar!");
      }
      return true;
    }),
    body("email").custom((value) => {
      const duplicate = cekEmail(value);
      if (duplicate) {
        throw new Error("Email sudah terdaftar!");
      }
      return true;
    }),
    body("nohp").custom((value) => {
      const duplicate = cekNoHp(value);
      if (duplicate) {
        throw new Error("Nomor HP sudah terdaftar!");
      }
      return true;
    }),
    check("email", "email tidak valid!").isEmail(),
    check("nohp", "nohp tidak valid!").isMobilePhone(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("add-contact", {
        title: "Add Contact",
        layout: "layouts/main-layout",
        errors: errors.array(),
      });
      // return res.status(400).json({ errors: errors.array() });
    } else {
      addContact(req.body);
      req.flash("success", "Contact berhasil ditambahkan!");
      res.redirect("/contact");
    }
  }
);

app.get("/contact/delete/:nama", (req, res) => {
  const contact = findContact(req.params.nama);
  if (!contact) {
    res.status(404).send("Contact not found");
  } else {
    deleteContact(req.params.nama);
    req.flash("success", "Contact berhasil dihapus!");
    res.redirect("/contact");
  }
});

app.get("/contact/edit/:nama", (req, res) => {
  const contact = findContact(req.params.nama);
  res.render("edit-contact", {
    title: "Edit Contact",
    layout: "layouts/main-layout",
    contact,
  });
});

app.post(
  "/contact/update",
  [
    body("nama").custom((value, { req }) => {
      const duplicate = cekContact(value);
      if (value !== req.body.oldName && duplicate) {
        throw new Error("Nama sudah terdaftar!");
      }
      return true;
      //Ket: Jika nama tidak sama dengan nama lama, tetapi nama baru sudah ada, maka tampilkan pesan error.
    }),
    body("email").custom((value, { req }) => {
      const duplicate = cekEmail(value);
      if (value !== req.body.oldEmail && duplicate) {
        throw new Error("Email sudah terdaftar!");
      }
      return true;
    }),
    body("nohp").custom((value, { req }) => {
      const duplicate = cekNoHp(value);
      if (value !== req.body.oldNohp && duplicate) {
        throw new Error("Nomor HP sudah terdaftar!");
      }
      return true;
    }),
    check("email", "email tidak valid!").isEmail(),
    check("nohp", "nohp tidak valid!").isMobilePhone(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("edit-contact", {
        title: "Edit Contact",
        layout: "layouts/main-layout",
        errors: errors.array(),
        contact: req.body,
      });
      // return res.status(400).json({ errors: errors.array() });
    } else {
      updateContact(req.body);
      req.flash("success", "Contact berhasil diubah!");
      res.redirect("/contact");
    }
  }
);

app.get("/contact/:nama", (req, res) => {
  const contact = findContact(req.params.nama);
  res.render("detail-contact", {
    title: "Detail Contact",
    layout: "layouts/main-layout",
    contact,
  });
});
//routing untuk halaman yang tidak ada
app.use((req, res) => {
  res.status(404).send("404 Page Not Found");
});

app.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}/`);
});
