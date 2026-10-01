var contactImage = document.getElementById("ContactImage");
var contactName = document.getElementById("ContactName");
var contactPhone = document.getElementById("ContactPhone");
var contactEmail = document.getElementById("ContactEmail");
var contactAddress = document.getElementById("ContactAddress");
var contactGroup = document.getElementById("ContactGroup");
var contactNotes = document.getElementById("ContactNotes");
var contactFavorite = document.getElementById("ContactFavorite");
var contactEmergency = document.getElementById("ContactEmergency");
var emptyState = document.getElementById("emptyState");
var saveBtn = document.getElementById("saveBtn");
var updateBtn = document.getElementById("btnUpdate");
var searchInput = document.getElementById("search");
var totalContacts = document.getElementById("totalContacts");
var favoriteContacts = document.getElementById("FavoriteContacts");
var emergencyContacts = document.getElementById("EmergencyContacts");
var contactsCount = document.getElementById("contactsCount");
var favoritesList = document.getElementById("favoritesList");
var emergencyList = document.getElementById("emergencyList");
var addModal = new bootstrap.Modal(document.getElementById("addModal"));

var contactList = [];

if (localStorage.getItem("contactContainer") !== null) {
  contactList = JSON.parse(localStorage.getItem("contactContainer"));
  displayContact();
}

function addContact() {
  var nameValid = validation(contactName, "msgName");
  var phoneValid = validation(contactPhone, "msgPhone");
  var emailValid = validation(contactEmail, "msgEmail");

  if (!nameValid) {
    Swal.fire({
      title: "Missing Name",
      text: "Please enter a name for the contact!",
      icon: "error",
      confirmButtonText: "Ok",
    });
    return;
  }

  if (!phoneValid) {
    Swal.fire({
      title: "Missing Phone",
      text: "Please enter a phone number!",
      icon: "error",
      confirmButtonText: "Ok",
    });
    return;
  }

  if (!emailValid) {
    Swal.fire({
      title: "Missing Email",
      text: "Please enter a valid Email!",
      icon: "error",
      confirmButtonText: "Ok",
    });
    return;
  }

  for (var i = 0; i < contactList.length; i++) {
    if (contactList[i].phone === contactPhone.value) {
      Swal.fire({
        title: "Duplicate Phone Number",
        text:
          "A contact with this phone number already exists: " +
          contactList[i].name,
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }
  }

  var contacts = {
    name: contactName.value.trim(),
    phone: contactPhone.value,
    email: contactEmail.value,
    address: contactAddress.value,
    group: contactGroup.value,
    notes: contactNotes.value,
    favorite: contactFavorite.checked,
    emergency: contactEmergency.checked,
    image: contactImage.files[0] ? `images/${contactImage.files[0].name}` : ``,
  };
  contactList.push(contacts);
  localStorage.setItem("contactContainer", JSON.stringify(contactList));

  clearInput();
  displayContact();
  addModal.hide();

  Swal.fire({
    title: "Added",
    text: "Contact has been added successfully.",
    icon: "success",
    confirmButtonText: "Ok",
  });
}

function clearInput() {
  contactAddress.value = "";
  contactPhone.value = "";
  contactImage.value = "";
  contactGroup.value = "";
  contactName.value = "";
  contactNotes.value = "";
  contactFavorite.checked = false;
  contactEmergency.checked = false;
  contactEmail.value = "";
}

function displayContact() {
  var cartona = "";

  for (var i = 0; i < contactList.length; i++) {
    var contact = contactList[i];
    var badge = "";
    if (contact.favorite) {
      badge = `<span class="avatar-badge favorite-badge"><i class="fa-solid fa-star"></i></span>`;
    }
    var emergencyAvatarBadge = "";
    if (contact.emergency) {
      emergencyAvatarBadge = `<span class="avatar-badge emergency-badge-position"><i class="fa-solid fa-heart-pulse"></i></span>`;
    }
    var emergencyBadge = "";
    if (contact.emergency) {
      emergencyBadge = `<span class="group-badge emergency-tag"><i class="fa-solid fa-heart-pulse me-1"></i>Emergency</span>`;
    }
    var avatarColorClass = "";
    if (contact.name.split(" ").length < 2) {
      avatarColorClass = "single-word-avatar";
    }

    cartona += `
  <div class="col-12 col-md-6">
    <div class="contact-card">
      <div class="d-flex align-items-center gap-3 mb-2">
        <div class="avatar-wrapper">
          <div class="avatar-circle-card ${avatarColorClass}">
  ${
    contact.image
      ? `<img src="${contact.image}" alt="${contact.name}">`
      : getInitials(contact.name)
  }
</div>
          ${badge}
          ${emergencyAvatarBadge}
        </div>
        <div class="d-flex flex-column gap-1">
        <h3 class="m-0 name">${contact.name}</h3>
        <p class="phone"><i class="fa-solid fa-phone contact-icon phone-icon mb-0"></i> ${contact.phone}</p>
        </div>
      </div>

      <p class="email"><i class="fa-solid fa-envelope contact-icon email-icon"></i> ${contact.email}</p>
      <p class="address"><i class="fa-solid fa-location-dot contact-icon location-icon"></i> ${contact.address}</p>

      <span class="group-badge group-${contact.group}">${contact.group}</span>
      ${emergencyBadge}

      <div class="card-actions">
        <div class="actions-left">
          <a href="tel:${contact.phone}" class="action-btn call-btn">
            <i class="fa-solid fa-phone"></i>
          </a>
          <a href="mailto:${contact.email}" class="action-btn email-btn">
            <i class="fa-solid fa-envelope"></i>
          </a>
        </div>
        <div class="actions-right">
          <button class="star action-btn ${contact.favorite ? "active-favorite" : ""}" onclick="toggleFavorite(${i})">
            <i class="fa-solid fa-star"></i>
          </button>
          <button class="heart action-btn ${contact.emergency ? "active-emergency" : ""}" onclick="toggleEmergency(${i})">
            <i class="fa-solid fa-heart-pulse"></i>
          </button>
          <button class="edit action-btn" onclick="setUpdate(${i})">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="trash action-btn" onclick="deleteContact(${i})">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
`;
  }

  document.getElementById("contactsList").innerHTML = cartona;

  if (contactList.length === 0) {
    emptyState.classList.remove("d-none");
  } else {
    emptyState.classList.add("d-none");
  }

  updateStats();
  updateSide();
}

function getInitials(name) {
  var words = name.split(" ");

  if (words.length >= 2) {
    return words[0][0] + words[1][0];
  } else {
    return words[0][0];
  }
}

function deleteContact(idx) {
  Swal.fire({
    title: "Delete Contact?",
    text:
      "Are you sure you want to delete " +
      contactList[idx].name +
      "? This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
    preConfirm: function () {
      contactList.splice(idx, 1);
      localStorage.setItem("contactContainer", JSON.stringify(contactList));
      displayContact();

      Swal.fire({
        title: "Deleted!",
        text: "Contact has been deleted.",
        icon: "success",
        confirmButtonText: "Ok",
      });
    },
  });
}

function toggleFavorite(idx) {
  contactList[idx].favorite = !contactList[idx].favorite;
  localStorage.setItem("contactContainer", JSON.stringify(contactList));
  displayContact();
}

function toggleEmergency(idx) {
  contactList[idx].emergency = !contactList[idx].emergency;
  localStorage.setItem("contactContainer", JSON.stringify(contactList));
  displayContact();
}

var currentIndex;

function setUpdate(index) {
  currentIndex = index;
  contactAddress.value = contactList[index].address;
  contactEmail.value = contactList[index].email;
  contactName.value = contactList[index].name;
  contactGroup.value = contactList[index].group;
  contactNotes.value = contactList[index].notes;
  contactFavorite.checked = contactList[index].favorite;
  contactEmergency.checked = contactList[index].emergency;
  contactPhone.value = contactList[index].phone;

  addModal.show();

  saveBtn.classList.add("d-none");
  updateBtn.classList.remove("d-none");
}

function updateContact() {
  var nameValid = validation(contactName, "msgName");
  var phoneValid = validation(contactPhone, "msgPhone");
  var emailValid = validation(contactEmail, "msgEmail");

  if (!nameValid) {
    Swal.fire({
      title: "Missing Name",
      text: "Please enter a name for the contact!",
      icon: "error",
      confirmButtonText: "Ok",
    });
    return;
  }

  if (!phoneValid) {
    Swal.fire({
      title: "Missing Phone",
      text: "Please enter a phone number!",
      icon: "error",
      confirmButtonText: "Ok",
    });
    return;
  }

  if (!emailValid) {
    Swal.fire({
      title: "Missing Phone",
      text: "Please enter a phone number!",
      icon: "error",
      confirmButtonText: "Ok",
    });
    return;
  }

  for (var i = 0; i < contactList.length; i++) {
    if (i !== currentIndex && contactList[i].phone === contactPhone.value) {
      Swal.fire({
        title: "Duplicate Phone Number",
        text:
          "A contact with this phone number already exists: " +
          contactList[i].name,
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }
  }

  var contacts = {
    name: contactName.value.trim(),
    phone: contactPhone.value,
    email: contactEmail.value,
    address: contactAddress.value,
    group: contactGroup.value,
    notes: contactNotes.value,
    favorite: contactFavorite.checked,
    emergency: contactEmergency.checked,
    image: contactImage.files[0]
      ? `images/${contactImage.files[0].name}`
      : contactList[currentIndex].image,
  };
  contactList.splice(currentIndex, 1, contacts);
  localStorage.setItem("contactContainer", JSON.stringify(contactList));

  clearInput();
  displayContact();
  addModal.hide();
  saveBtn.classList.remove("d-none");
  updateBtn.classList.add("d-none");

  Swal.fire({
    title: "Updated",
    text: "Contact has been updated successfully.",
    icon: "success",
    confirmButtonText: "Ok",
  });
}

function search() {
  var word = searchInput.value;
  var cartona = "";

  for (var i = 0; i < contactList.length; i++) {
    var contact = contactList[i];

    var badge = "";
    if (contact.favorite) {
      badge = `<span class="avatar-badge favorite-badge"><i class="fa-solid fa-star"></i></span>`;
    }
    var emergencyAvatarBadge = "";
    if (contact.emergency) {
      emergencyAvatarBadge = `<span class="avatar-badge emergency-badge-position"><i class="fa-solid fa-heart"></i></span>`;
    }
    var emergencyBadge = "";
    if (contact.emergency) {
      emergencyBadge = `<span class="group-badge emergency-tag"><i class="fa-solid fa-heart-pulse me-1"></i>Emergency</span>`;
    }

    var avatarColorClass = "";
    if (contact.name.split(" ").length < 2) {
      avatarColorClass = "single-word-avatar";
    }

    if (
      contact.name.toLowerCase().includes(word.toLowerCase()) ||
      contact.phone.includes(word) ||
      contact.email.toLowerCase().includes(word.toLowerCase())
    ) {
      cartona += `
  <div class="col-12 col-md-6">
    <div class="contact-card">
      <div class="d-flex align-items-center gap-3 mb-2">
        <div class="avatar-wrapper">
          <div class="avatar-circle-card ${avatarColorClass}">
  ${
    contact.image
      ? `<img src="${contact.image}" alt="${contact.name}">`
      : getInitials(contact.name)
  }
</div>
          ${badge}
          ${emergencyAvatarBadge}
        </div>
        <div class="d-flex flex-column gap-1">
        <h3 class="m-0 name">${contact.name}</h3>
        <p class="phone"><i class="fa-solid fa-phone contact-icon phone-icon mb-0"></i> ${contact.phone}</p>
        </div>
      </div>

      <p class="email"><i class="fa-solid fa-envelope contact-icon email-icon"></i> ${contact.email}</p>
      <p class="address"><i class="fa-solid fa-location-dot contact-icon location-icon"></i> ${contact.address}</p>

      <span class="group-badge group-${contact.group}">${contact.group}</span>
      ${emergencyBadge}

      <div class="card-actions">
        <div class="actions-left">
          <a href="tel:${contact.phone}" class="action-btn call-btn">
            <i class="fa-solid fa-phone"></i>
          </a>
          <a href="mailto:${contact.email}" class="action-btn email-btn">
            <i class="fa-solid fa-envelope"></i>
          </a>
        </div>
        <div class="actions-right">
          <button class="star action-btn ${contact.favorite ? "active-favorite" : ""}" onclick="toggleFavorite(${i})">
            <i class="fa-solid fa-star"></i>
          </button>
          <button class="heart action-btn ${contact.emergency ? "active-emergency" : ""}" onclick="toggleEmergency(${i})">
            <i class="fa-solid fa-heart-pulse"></i>
          </button>
          <button class="edit action-btn" onclick="setUpdate(${i})">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="trash action-btn" onclick="deleteContact(${i})">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
`;
    }
  }

  document.getElementById("contactsList").innerHTML = cartona;
  if (cartona === "") {
    emptyState.classList.remove("d-none");
  } else {
    emptyState.classList.add("d-none");
  }

  updateStats();
  updateSide();
}

function resetToAddMode() {
  saveBtn.classList.remove("d-none");
  updateBtn.classList.add("d-none");
  clearInput();
}

function updateStats() {
  var favCount = 0;
  var emgCount = 0;
  var conCount = 0;

  for (var i = 0; i < contactList.length; i++) {
    if (contactList[i].favorite) {
      favCount++;
    }
    if (contactList[i].emergency) {
      emgCount++;
    }
    if (contactList[i]) {
      conCount++;
    }
  }

  totalContacts.innerHTML = contactList.length;
  favoriteContacts.innerHTML = favCount;
  emergencyContacts.innerHTML = emgCount;
  contactsCount.innerHTML = conCount;
}

function updateSide() {
  var favHtml = "";
  var emgHtml = "";

  for (var i = 0; i < contactList.length; i++) {
    var contact = contactList[i];

    if (contact.favorite) {
      favHtml += `
        <div class="side-item favorite-item">
          <div class="side-item-avatar">
  ${
    contact.image
      ? `<img src="${contact.image}" alt="${contact.name}">`
      : getInitials(contact.name)
  }
</div>
          <div class="side-item-info">
            <p class="m-0 side-item-name">${contact.name}</p>
            <span class="side-item-phone">${contact.phone}</span>
          </div>
          <a href="tel:${contact.phone}" class="side-item-call">
            <i class="fa-solid fa-phone icon-phone"></i>
          </a>
        </div>
      `;
    }

    if (contact.emergency) {
      emgHtml += `
        <div class="side-item emergency-item">
          <div class="side-item-avatar">
  ${
    contact.image
      ? `<img src="${contact.image}" alt="${contact.name}">`
      : getInitials(contact.name)
  }
</div>
          <div class="side-item-info">
            <p class="m-0 side-item-name">${contact.name}</p>
            <span class="side-item-phone">${contact.phone}</span>
          </div>
          <a href="tel:${contact.phone}" class="side-item-call">
            <i class="fa-solid fa-phone phone-icon"></i>
          </a>
        </div>
      `;
    }
  }

  if (favHtml === "") {
    favHtml = "<span class='text-center'>No favorites yet</span>";
  }

  if (emgHtml === "") {
    emgHtml = "<span class='text-center'>No emergency contacts</span>";
  }

  favoritesList.innerHTML = favHtml;
  emergencyList.innerHTML = emgHtml;
}

function validation(element, msgId) {
  var text = element.value;
  var msgId = document.getElementById(msgId);
  var regex = {
    ContactName: /^[a-zA-Z\s]{2,50}$/,
    ContactPhone: /^01[0125][0-9]{8}$/,
    ContactEmail: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    ContactGroup: /^(family|friends|work|school|other)$/i,
  };

  if (regex[element.id].test(text)) {
    element.classList.add("is-valid");
    element.classList.remove("is-invalid");
    msgId.classList.add("d-none");
    return true;
  } else {
    element.classList.add("is-invalid");
    element.classList.remove("is-valid");
    msgId.classList.remove("d-none");
    return false;
  }
}
