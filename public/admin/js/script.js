
const editButton = document.querySelectorAll("[edit-btn]");

console.log(editButton);

if(editButton.length > 0){
   editButton.forEach(button =>{
    button.addEventListener("click",()=>{
        const modal = document.querySelector("[modal]");
        console.log(modal);
        modal.classList.remove("hidden");
    });
   });
}


// bắt sự kiện click delete
// show modal
const deleteButton = document.querySelectorAll("[delete-btn]");
if(deleteButton){
    
    deleteButton.forEach(button =>{
        button.addEventListener("click",()=>{
            const id_product = button.getAttribute("product-id");
            console.log(id_product);

            const modal = document.querySelector("[modal-delete]");
            modal.classList.remove("hidden");


            if(modal){
                const cancelBtn = modal.querySelector("#cancelDelete");
                const confirmBtn = modal.querySelector("#confirmDelete");


                cancelBtn.addEventListener("click",()=>{
                    modal.classList.add("hidden");
                });
            
                confirmBtn.addEventListener("click", async()=>{
                    modal.classList.add("hidden");
                    const response = await fetch(`/amdin/products/delete`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({id: id_product})
                    });

                    const data = await response.json();
                    if(response.ok){
                        console.log(data.message);
                    }
                });
            }
            
        });
    });
}

