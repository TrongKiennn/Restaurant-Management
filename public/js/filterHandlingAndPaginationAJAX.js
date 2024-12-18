async function updateFilter() {
  const form = document.getElementById('typeOfFood-filter-form');
  const formData = new FormData(form);

  // Lấy danh sách các thương hiệu (nhà sản xuất) đã được chọn
  const selectedtypeOfFoods = formData.getAll('typeOfFoods');

  // Tạo URL mới với các tham số
  const params = new URLSearchParams(window.location.search);
  params.set('page', 1);
  if (selectedtypeOfFoods.length > 0) {
    params.set('typeOfFood', selectedtypeOfFoods.join(','));
  } else {
    params.delete('typeOfFood');
  }

  // Cập nhật URL mà không tải lại trang
  const newURL = `${window.location.pathname}?${params.toString()}`;
  window.history.pushState(null, '', newURL);
  // Gửi yêu cầu AJAX tới server
  await fetchAndRender(newURL);
}

async function applyFilters() {
  const form = document.getElementById('price-filter-form');
  const formData = new FormData(form);

  // Lấy giá trị min và max
  const minPrice = formData.get('min');
  const maxPrice = formData.get('max');

  // Tạo URL mới với các tham số
  const params = new URLSearchParams(window.location.search);
  params.set('page', 1); // Reset về trang đầu tiên
  if (minPrice) {
    params.set('min', minPrice);
  } else {
    params.delete('min');
  }
  if (maxPrice) {
    params.set('max', maxPrice);
  } else {
    params.delete('max');
  }

  // Cập nhật URL mà không tải lại trang
  const newURL = `${window.location.pathname}?${params.toString()}`;
  window.history.pushState(null, '', newURL);

  // Gửi yêu cầu AJAX tới server
  await fetchAndRender(newURL);
}

function applyAndUpdateFilters() {
  applyFilters();
  updateFilter();
}

async function updateSortFilter() {
  const selectElement = document.getElementById('sort');
  const selectedSort = selectElement.value;

  if (!selectedSort) {
    return;
  }

  const params = new URLSearchParams(window.location.search);

  if (selectedSort === 'price-low-to-high') {
    params.set('sort', 'price,asc');
  } else if (selectedSort === 'price-high-to-low') {
    params.set('sort', 'price,desc');
  }

  const newURL = `${window.location.pathname}?${params.toString()}`;
  window.history.pushState(null, '', newURL);

  await fetchAndRender(newURL);
}

async function changePage(page) {
  const form = document.getElementById('typeOfFood-filter-form');
  const formData = new FormData(form);
  const selectedtypeOfFoods = formData.getAll('typeOfFoods');

  const params = new URLSearchParams(window.location.search);
  params.set('page', page);
  if (selectedtypeOfFoods.length > 0) {
    params.set('typeOfFood', selectedtypeOfFoods.join(','));
  } else {
    params.delete('typeOfFood');
  }

  const newURL = `${window.location.pathname}?${params.toString()}`;
  window.history.pushState(null, '', newURL);

  await fetchAndRender(newURL);
}

// Hàm để cập nhật danh sách sản phẩm
function updateProductList(products) {
  const productContainer = document.getElementById('product-list'); // Lấy container
  productContainer.innerHTML = ''; // Xóa danh sách cũ

  // Render danh sách sản phẩm mới
  products.forEach((product) => {
    let productHTML = `
      <div class="bg-white shadow-md flex flex-col h-full overflow-hidden">
        <!-- Phần hình ảnh sản phẩm -->
        <div class="relative w-full h-72 bg-gray-200 flex items-center justify-center">
          <img src="${product.product_url}" 
               alt="${product.name}" 
               class="w-full h-full object-cover"
               onerror="this.onerror=null; this.src='/images/placeholder.png';" />
        </div>

        <!-- Nội dung sản phẩm -->
        <div class="p-4 flex-grow">
          <h4 class="uppercase font-bold text-lg mb-2 text-gray-800">${product.name}</h4>
          <p class="text-xl text-black font-semibold mb-4">
            $${product.price}
          </p>
        </div>

        <!-- Nút Xem chi tiết -->
        <a href="#"
           class="block w-full text-center text-white bg-[#984B01] py-3 hover:bg-gray-300 transition">
           Xem chi tiết
        </a>
      </div>
    `;

    productContainer.insertAdjacentHTML('beforeend', productHTML);
  });
}

async function fetchAndRender(newURL) {
  try {
    const response = await fetch(newURL, {
      method: 'GET',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    });

    if (response.ok) {
      const contentType = response.headers.get('Content-Type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        if (!data.error) {
          updateProductList(data.products);
          updatePagination(data.total, data.itemsPerPage, data.page);
        } else {
          console.error('Error fetching data:', data.error);
        }
      } else {
        console.error('Unexpected response type:', await response.text());
      }
    } else {
      console.error('Server error:', response.status);
    }
  } catch (error) {
    console.error('Error in AJAX request:', error);
  }
}

function updatePagination(total, itemsPerPage, page) {
  const totalPage = Math.ceil(total / itemsPerPage);
  renderPagination(totalPage, page);
}

function renderPagination(totalPage, page) {
  const paginationElement = document.getElementById('Pagination');
  paginationElement.innerHTML = '';

  paginationElement.innerHTML += `
      <button onclick="changePage(${
        Math.max(1, page - 1)
      })" class="relative inline-flex items-center rounded-l-md px-4 py-4 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
          <span class="sr-only">Previous</span>
          <svg class="size-6" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
              <path fill-rule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd" />
          </svg>
      </button>
  `;

  for (let i = 1; i <= totalPage; i++) {
    paginationElement.innerHTML += `
        <button onclick="changePage(${i})" class="relative ${
      i === page ? 'z-10 bg-slate-800 text-white' : 'text-gray-900'
    } inline-flex items-center px-6 py-4 text-lg font-semibold ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
            ${i}
        </button>
    `;
  }

  paginationElement.innerHTML += `
      <button onclick="changePage(${
        Math.min(totalPage, page + 1)
      })" class="relative inline-flex items-center rounded-r-md px-4 py-4 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
          <span class="sr-only">Next</span>
          <svg class="size-6" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
              <path fill-rule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
          </svg>
      </button>
  `;
}
