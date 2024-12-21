
// Select elements
const createProduct = document.querySelector('[createProduct]');
const createProductModal = document.querySelector('#createProductModal');
const closeModalBtn = createProductModal.querySelector('#closeModalBtn');
const imageInput = document.getElementById('file-input');
const imagePreview = document.getElementById('previewContainer');
const productUrlInput = document.getElementById('product_url');
const toast = document.getElementById('toast');
const createProductForm = document.getElementById('createProductForm');

// Show modal
createProduct.addEventListener('click', () => {
    createProductModal.classList.remove('hidden');
});

// Hide the modal
closeModalBtn.addEventListener('click', () => {
    createProductModal.classList.add('hidden');
    resetForm();
});

// Handle image preview for file input
imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.innerHTML = `<img src="${e.target.result}" alt="Image Preview" class="w-full h-auto rounded-lg">`;
        };
        reader.readAsDataURL(file);
    } else {
        imagePreview.innerHTML = '<span class="text-gray-500">Image Preview</span>';
    }
});

// Handle form submission



// createProductForm.addEventListener('submit', async (event) => {
//     event.preventDefault();

//     const formData = new FormData(createProductForm);

//     console.log('Form data:', formData);

//     try {
//         const response = await fetch('/admin/create', {
//             method: 'POST',
//             body: formData
//         });

//         const data = await response.json();
//         console.log("response:", data);

//         if (response.ok) {
//            console.log('Product created successfully', 'success');
//             createProductForm.reset();
//             createProductModal.classList.add('hidden');
//             resetForm();
//         } else {
//             const errorData = await response.json();
//             console.log(errorData.message, 'error');
//         }
//     } catch (error) {
//         console.log('Error:', error);
//         console.log('Failed to create product', 'error');
//     }
// });

const createBtn = document.querySelector("[createBtn]");

createBtn.addEventListener('click', async () => {
    const formData = new FormData(createProductForm);
    console.log('Form data:', formData);
    createProductForm.submit();
});