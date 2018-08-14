(function () {
        // Object definition
        const searchField = document.querySelector('#contact-search');
        const addNewContact = document.querySelector('.add-new-contact');
        const refreshContacts = document.querySelector('.refresh-contacts');
        const contactEdit = document.querySelector('.contactEdit');
        const contactIsNewField = contactEdit.querySelector('[name="isNew"]');
        const contactIdField = contactEdit.querySelector('[name="contactId"]');
        const contactFirstNameField = contactEdit.querySelector('[name="firstName"]');
        const contactLastNameField = contactEdit.querySelector('[name="lastName"]');
        const contactPhoneNumberField = contactEdit.querySelector('[name="phoneNumber"]');
        const saveButton = contactEdit.querySelector('.contactEdit__controls__save');
        const cancelButton = contactEdit.querySelector('.contactEdit__controls__cancel');
        const contactItemTemplate = document.querySelector('body > .contactItem');
        const contactsList = document.querySelector('.contacts-list');
        let contactsArray = [];

        // Subscribe events
        //=====================================================
        searchField.addEventListener('input', searchContact);

        addNewContact.addEventListener('click', addContact);

        refreshContacts.addEventListener('click', reloadContactsManual);

        saveButton.addEventListener('click', saveContact);

        cancelButton.addEventListener('click', cancelContact);

        // load data at startup
        getContacts();

        // my functions
        //=====================================================
        function searchContact(event) {
            //search here
            //console.log('Search query: ' + event.target.value);
            const searchQuery = event.target.value.trim();
            reloadContacts(searchQuery);
        }

        function addContact(event) {
            //console.log('Add contact event');
            clearEditForm();
            contactIsNewField.value = 1;
            contactsList.parentNode.insertBefore(contactEdit, contactsList);
            showNode(contactEdit);
        }

        function reloadContactsManual(event) {
            searchField.value = '';
            reloadContacts();
        }

        function editContact(event) {
            //console.log('Edit contact event');
            const contactNode = getContactNode(event.target, 'main');
            if (contactNode) {
                contactNode.appendChild(contactEdit);
                showNode(contactEdit);
                fillEditForm(contactNode);
            }
        }

        function deleteContact(event) {
            //console.log('Delete contact event');
            const contactNode = getContactNode(event.target, 'main');
            const contactId = contactNode.querySelector('.contactItem__id').innerText.trim();
            const objIndex = contactsArray.map(function (contact) {
                return contact.id;
            }).indexOf(parseInt(contactId));
            //const objIndex = contactsArray.findIndex((obj => obj.id === parseInt(contactId)));
            contactsArray.splice(objIndex, 1);
            localStorage.phoneBook = JSON.stringify(contactsArray);
            reloadContacts();
        }

        function saveContact(event) {
            //console.log('Save contact event');
            let newContactObject = getContactFromEdit();
            if (!newContactObject)
                return;
            if (contactIsNewField.value === '1') {
                if (contactsArray.length === 0) {
                    newContactObject.id = 1;
                } else {
                    newContactObject.id = Math.max(...contactsArray.map(o => o.id)) + 1;
                }
                contactsArray.push(newContactObject);
            } else {
                newContactObject.id = parseInt(newContactObject.id);
                const objIndex = contactsArray.map(function (contact) {
                    return contact.id;
                }).indexOf(parseInt(newContactObject.id));
                //const objIndex = contactsArray.findIndex((obj => obj.id === parseInt(newContactObject.id)));
                contactsArray[objIndex] = newContactObject;
            }

            contactsArray.sort((a, b) => a.lastName.localeCompare(b.lastName));

            localStorage.phoneBook = JSON.stringify(contactsArray);
            // add to storage & reload items
            hideNode(contactEdit);
            clearEditForm();
            reloadContacts();
        }

        function cancelContact(event) {
            //console.log('Cancel contact event');
            hideNode(contactEdit);
            clearEditForm();
        }

        function getContacts() {
            //reload contacts from storage
            if (localStorage.phoneBook) {
                contactsArray = JSON.parse(localStorage.phoneBook);
                reloadContacts();
            } else {
                loadJSON(function (json) {
                    contactsArray = JSON.parse(json);
                    reloadContacts();
                });
            }
        }

        function reloadContacts(filterString = '') {
            while (contactsList.firstChild)
                contactsList.removeChild(contactsList.firstChild);

            contactsArray.forEach(function (item) {
                if (item.lastName.toLowerCase().includes(filterString.toLowerCase())
                    || item.firstName.toLowerCase().includes(filterString.toLowerCase())
                    || item.phoneNumber.toLowerCase().includes(filterString.toLowerCase())) {
                    let newContactItemNode = contactItemTemplate.cloneNode(true);
                    showNode(newContactItemNode);
                    fillContactItem(newContactItemNode, item);

                    const editButtons = newContactItemNode.querySelector('.contactItem__controls__edit');
                    const deleteButtons = newContactItemNode.querySelector('.contactItem__controls__delete');

                    editButtons.addEventListener('click', editContact);
                    deleteButtons.addEventListener('click', deleteContact);

                    const liElement = document.createElement('li');
                    liElement.appendChild(newContactItemNode);
                    contactsList.appendChild(liElement);
                }
            })
        }

        function fillEditForm(contactItemNode) {
            contactIdField.value = contactItemNode.querySelector('.contactItem__id').innerText.trim();
            contactFirstNameField.value = contactItemNode.querySelector('.contactItem__name__first').innerText;
            contactLastNameField.value = contactItemNode.querySelector('.contactItem__name__last').innerText;
            contactPhoneNumberField.value = contactItemNode.querySelector('.contactItem__phoneNumber').innerText;
        }

        function fillContactItem(contactItemNode, contactObject) {
            contactItemNode.querySelector('.contactItem__id').innerText = contactObject.id;
            contactItemNode.querySelector('.contactItem__name__first').innerText = contactObject.firstName;
            contactItemNode.querySelector('.contactItem__name__last').innerText = contactObject.lastName;
            contactItemNode.querySelector('.contactItem__phoneNumber').innerText = contactObject.phoneNumber;
        }

        function getContactFromEdit() {
            let contactObject = {};
            let errorMessage = '';
            contactObject.id = contactIdField.value;
            if (contactFirstNameField.value !== '')
                contactObject.firstName = contactFirstNameField.value;
            else
                errorMessage += 'Field "First Name" can\'t be empty!\n';
            if (contactLastNameField.value !== '')
                contactObject.lastName = contactLastNameField.value;
            else
                errorMessage += 'Field "Last Name" can\'t be empty!\n';
            if (contactPhoneNumberField.value !== '' && !isNaN(contactPhoneNumberField.value))
                contactObject.phoneNumber = contactPhoneNumberField.value;
            else
                errorMessage += 'Field "Phone Number" can\'t be empty and can contain only numbers!\n';

            if (errorMessage === '')
                return contactObject;
            else
                alert(errorMessage);
        }

        function clearEditForm() {
            contactIsNewField.value = 0;
            contactEdit.reset();
        }

        function showNode(node) {
            node.removeAttribute('style');
        }

        function hideNode(node) {
            node.style.display = 'none';
        }

        function getContactNode(buttonNode, buttonCase) {
            let contactNode;
            if (buttonCase === 'main') {
                contactNode = buttonNode.parentNode.parentNode;
            }
            else {
                contactNode = buttonNode.parentNode.parentNode.parentNode;
            }
            if (contactNode.classList.contains('contactItem')) {
                return contactNode;
            }
        }

        function loadJSON(callback) {
            let xobj = new XMLHttpRequest();
            xobj.overrideMimeType("application/json");
            xobj.open('GET', './js/data.json', true);
            xobj.onreadystatechange = function () {
                if (xobj.readyState === 4 && xobj.status === 200) {
                    callback(xobj.responseText);
                }
            };
            xobj.send(null);
        }
    }
)
();