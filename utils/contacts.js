const fs = require("fs");

//Membuat folder data
const dirPath = "./data";
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}

// Membuat file contact.json jika belum ada
const dataPath = "./data/contacts.json";
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, "[]", "utf-8");
}

// Ambil semua data contact di contacts.json
const loadContact = () => {
  const file = fs.readFileSync("data/contacts.json", "utf-8");
  const contacts = JSON.parse(file);
  return contacts;
};

// Cari contact berdasarkan nama
const findContact = (nama) => {
   const contacts = loadContact();

   const contact = contacts.find(
     (contact) => contact.nama.toLowerCase() === nama.toLowerCase()
   );
   return contact;

}

// Menimpa file contacts.json dengan data yang baru
const saveContacts = (contacts) => {
  fs.writeFileSync('data/contacts.json', JSON.stringify(contacts));
}


// Menambahkan data contact baru
const addContact = (contact) => {
  const contacts = loadContact();
  contacts.push(contact);
  saveContacts(contacts);
}

// Cek nama yang duplikat
const cekDuplikat = (nama) => {
  const contacts = loadContact();
  return contacts.find((contact) => contact.nama === nama)
}

// Hapus Contact
const deleteContact = (nama) =>{
  const contacts = loadContact();
  const filteredContacts = contacts.filter((contact) => contact.nama !== nama);
  saveContacts(filteredContacts);
}

// Menngubah contacts
const updateContacts = (contactBaru) => {
  const contact = loadContact();

  // hilangkan contact nama yang namanya sama dengan oldNama
  const filteredContacts = contacts.filter((contact) => contact.nama !== contactBaru.oldNama);
  delete contactBaru.oldNama;
  filteredContacts.push(contactBaru);
  saveContacts(filteredContacts);
}

module.exports = {loadContact, findContact, addContact, cekDuplikat, deleteContact, updateContacts}
