document.addEventListener("deviceready", onDeviceReady, false);
    let activeContactId = 0;
    function onDeviceReady() {
        rechercherContact();
        
        document.querySelector("a[href='#homePage']").addEventListener("click", rechercherContact);
        document.querySelector("#btn-add").addEventListener("click", addContact);

    }

    
    function rechercherContact(){
        let option  = new ContactFindOptions();
        option.multiple=true;
        option.hasPhoneNumber  =true;
        let fields  = ['*'];
        navigator.contacts.find(fields, listContact, onContactError, option);
    }
    
    function listContact(contacts){
        listHtml = "";
        contacts.forEach(function(contact) {
            listHtml += `
                <li>
                    <a href='#detailsContactPage' data-id='${contact.id}' class='allContact'>
                        <img src='img/user.png' alt='contact'>
                        <h2>${contact.name.givenName?contact.name.givenName:''} ${contact.name.familyName?contact.name.familyName:''}</h2>
                        <p>${contact.phoneNumbers ? contact.phoneNumbers[0].value : ''}</p>
                    </a>
                </li>
            `;
        });
        
        let contactList = document.querySelector("#contactList");
        contactList.innerHTML = listHtml;
        $(contactList).listview('refresh');

        document.querySelectorAll(".allContact").forEach(function(element) {
            element.addEventListener("click", function(event) {
                activeContactId = element.getAttribute('data-id'); 
                console.log(activeContactId)
                detailContact();

            });
        });
    }
    
    
    function addContact() {
        let form = document.querySelector("#addContactForm");
        let nom = form.querySelector("input[name='nom']").value;
        let prenom = form.querySelector("input[name='prenom']").value;
        let adresse = form.querySelector("input[name='address']").value;
        let numero = form.querySelector("input[name='numero']").value;
        if(!numero){
            onContactError("Veuillez entrez votre le numéro")
        }else{
            let newContact = navigator.contacts.create();
            newContact.name = new ContactName();
            newContact.name.givenName  = prenom?prenom:"";
            newContact.name.familyName = nom?nom:"";
        
            let address = new ContactAddress();
            address.locality = adresse?adresse:"";
            newContact.addresses = [address];
        
            let phoneCateg = "Mobile";
            if(numero.startsWith("+33") || numero.startsWith("33")){
                phoneCateg = "Domicile";
            }
        
            let phoneNumber = new ContactField(phoneCateg, numero, true);
            newContact.phoneNumbers = [phoneNumber];
        
            // Save contact
            newContact.save(function() {
                resetInput();
                alert("Vous avez un nouveau contacte");
                homePage();
            }, function(error) {
                onContactError("Erreur lors de la création du contact : ");
            });
        }
    
        
    }
   
    
    
    function detailContact(){
        let option  = new ContactFindOptions();
        option.filter = activeContactId; 
        option.multiple=false;
        option.hasPhoneNumber  =true;
        let fields = ['id', 'name', 'phoneNumbers', 'addresses'];
        navigator.contacts.find(fields, function(contacts) {
            let contact = contacts[0];
            console.log(contact)
            if (contact) {
                const form = document.querySelector("#detailContactForm");
                form.querySelector("input[name='nom']").value = contact.name.givenName || "";
                form.querySelector("input[name='prenom']").value = contact.name.familyName || "";
                form.querySelector("input[name='address']").value = contact.addresses[0].locality || "";
                form.querySelector("input[name='numero']").value = contact.phoneNumbers[0].value || "";

                document.querySelector("#btn-update").addEventListener("click", updateContact);
                document.querySelector("#btn-delete").addEventListener("click", function (params) {
                event.preventDefault(); 
                var confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce contacte ?");
                    if (confirmation) {
                        deleteContact();
                    }
                    /*else{
                        homePage();
                    }*/
                });

            } else {
                onContactError("erreur Mauvaise recuperation de l'ID");
                homePage();
            }
        }, onContactError, option);
    }
    
    function updateContact(){
        const form = document.querySelector("#detailContactForm");
        const nom =form.querySelector("input[name='nom']").value;
        const prenom =form.querySelector("input[name='prenom']").value;
        const address =form.querySelector("input[name='address']").value ;
        const numero =form.querySelector("input[name='numero']").value;
        let option  = new ContactFindOptions();
        option.filter = activeContactId; 
        option.multiple=false;
        option.hasPhoneNumber  =true;
        let fields = ['id', 'name', 'phoneNumbers', 'addresses'];
        navigator.contacts.find(fields, function(contacts) {
            let contact = contacts[0];
            console.log(contact)
            if (contact) {
                contact.name.givenName = nom;
                contact.name.familyName = prenom;
                contact.addresses[0].locality = address;
                contact.addresses[0].formatted = address;
                contact.phoneNumbers[0].value = numero;
                contact.save(function() {
                    alert("Contact mis à jour avec succès.");
                    homePage(); 
                }, onContactError);            
            } else {
                onContactError("erreur de la Modification");
                homePage();
            }
        }, onContactError, option);

    }

    function deleteContact(){
        let option  = new ContactFindOptions();
        option.multiple=false;
        option.filter = activeContactId; 
        option.hasPhoneNumber  =true;
        let fields = ['id'];
        navigator.contacts.find(fields, function(contacts) {
            let contact = contacts[0];
            if (contact) {
                contact.remove(function() {
                    alert("Contact supprimé avec succès.");
                    homePage();
                }, onContactError);
            } else {
                onContactError("Contact introuvable");
                homePage();
            }
        }, onContactError, option);  
    }
    
    function resetInput(){
        document.querySelectorAll("form").forEach(function (element) {
            element.reset();
        });
    }
    
    function onContactError (error) {
        alert("Erreur: "+error);
    }
    function getIdFromHref(href) {
        const parts = href.split('?');
        return parts.length > 1 ? parts[1] : null;
    }


function homePage() {
    let link = document.querySelector("a[href='#homePage']");
    link.click();
}