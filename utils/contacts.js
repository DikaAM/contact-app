const fs = require("fs");

//Check if data folder exist
const pathDir = fs.existsSync("./data/");
if (!pathDir) {
  fs.mkdirSync("data");
}

//Check if contacts.json file exist
const pathFile = fs.existsSync("./data/contacts.json");
if (!pathFile) {
  fs.writeFileSync("data/contacts.json", "[]");
}

const loadContact = () => {
  const file = fs.readFileSync("data/contacts.json", "utf-8");
  const contacts = JSON.parse(file);
  return contacts;
};

const findContact = (nama) => {
  const contacts = loadContact();
  const contact = contacts.find(
    (contact) => contact.nama.toLowerCase() === nama.toLowerCase()
  );
  return contact;
};

const saveContact = (contacts) => {
  fs.writeFileSync("data/contacts.json", JSON.stringify(contacts, null, 2));
};

const addContact = (contact) => {
  const contacts = loadContact();
  contacts.push(contact);
  saveContact(contacts);
};

const cekContact = (nama) => {
  const contacts = loadContact();
  return contacts.find(
    (contact) => contact.nama.toLowerCase() === nama.toLowerCase()
  );
};

const cekEmail = (email) => {
  const contacts = loadContact();
  return contacts.find(
    (contact) => contact.email.toLowerCase() === email.toLowerCase()
  );
};

const cekNoHp = (nohp) => {
  const contacts = loadContact();
  return contacts.find((contact) => contact.nohp === nohp);
};

const deleteContact = (nama) => {
  const contacts = loadContact();
  const filteredContacts = contacts.filter((contact) => contact.nama !== nama);
  saveContact(filteredContacts);
};

const updateContact = (newContact) => {
  const contacts = loadContact();
  const filteredContacts = contacts.filter(
    (contact) => contact.nama !== newContact.oldName
  );
  //Menghapus oldName, oldEmail, oldNohp dari newContact
  const { oldName, oldEmail, oldNohp, ...updatedContact } = newContact;
  filteredContacts.push(updatedContact);
  saveContact(filteredContacts);
};

module.exports = {
  loadContact,
  findContact,
  addContact,
  cekContact,
  cekEmail,
  cekNoHp,
  deleteContact,
  updateContact,
};
