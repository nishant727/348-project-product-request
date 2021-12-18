// client-side js

//ITEM List Form
const usersForm = document.forms[0];
const titleInput = usersForm.elements["name"];
const descInput = usersForm.elements["product_name"];
const contactInput = usersForm.elements["comments"];


//updates the user table on the page
const appendNewProd = prod => {
  const newProd = document.createElement("tr");
  const titleProd = document.createElement("td");
  titleProd.innerHTML = prod.name;
  const descProd = document.createElement("td");
  descProd.innerHTML = prod.product_name;
  const contactProd = document.createElement("td");
  contactProd.innerHTML = prod.comments;

  newProd.appendChild(titleProd);
  newProd.appendChild(descProd);
  newProd.appendChild(contactProd);
  
  const tbReq = document.getElementById("req_table");
  tbReq.appendChild(newProd);
};

//add a new user to the list when submitted
usersForm.onsubmit = event => {
  //stop the form submission from refreshing the page
  event.preventDefault();
  const data = {
    title: titleInput.value,
    description: descInput.value,
    contact: contactInput.value,
  };

  fetch("/addReq", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  })
    .then(res => res.json())
    .then(response => {
      console.log(JSON.stringify(response));
    });

  fetch("/getReq", {})
    .then(res => res.json())
    .then(response => {
      response.forEach(row => {
        appendNewProd({
          name: row.name,
          product_name: row.product_name,
          comments: row.comments,
        });
      });
    });

  //reset form
  titleInput.value = "";
  titleInput.focus();
  descInput.value = "";
  contactInput.value = "";
};
