
async function updateFilter() {
  const form = document.getElementById('brand-filter-form');
  const formData = new FormData(form);

  // Lấy danh sách các thương hiệu đã được chọn
  const selectedBrands = formData.getAll('brands');

  // Tạo URL mới với các tham số
  const params = new URLSearchParams(window.location.search);
  params.set('page', 1);
  if (selectedBrands.length > 0) {
    params.set('brand', selectedBrands.join(','));
  } else {
    params.delete('brand');
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

  if (selectedSort === "price-low-to-high") {
    params.set('sort', 'price,asc');
  } else if (selectedSort === "price-high-to-low") {
    params.set('sort', 'price,desc');
  }

  const newURL = `${window.location.pathname}?${params.toString()}`;
  window.history.pushState(null, '', newURL);

  await fetchAndRender(newURL);
}



async function changePage(page) {
  const form = document.getElementById('brand-filter-form');
  const formData = new FormData(form);
  const selectedBrands = formData.getAll('brands');

  const params = new URLSearchParams(window.location.search);
  params.set('page', page);
  if (selectedBrands.length > 0) {
      params.set('brand', selectedBrands.join(','));
  } else {
      params.delete('brand');
  }

  const newURL = `${window.location.pathname}?${params.toString()}`;
  window.history.pushState(null, '', newURL);

  await fetchAndRender(newURL);
}

// Hàm để cập nhật danh sách sản phẩm
function updateProductList(products) {
  const productContainer = document.getElementById('product-list'); // Class container sản phẩm
  productContainer.innerHTML = ''; // Xóa danh sách cũ
  
  // Render danh sách sản phẩm mới
  products.forEach(product => {
    let productHTML = `
      <div class="bg-white shadow-md flex flex-col h-full rounded-lg">
        <div class="relative group w-full h-80 flex items-center justify-center">
          <img src="${product.imageurl}" alt="${product.name}" class="max-w-full max-h-full" />
          <a href="/category/${product.type_name}/${product.id}">
                      <div
                        class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition">
                      </div>
                    </a>
                  </div>

                  <div class="flex-grow pt-4 pb-3 px-4 flex flex-col">
                    <a href="/category/${product.type_name}/${product.id}">
                      <h4 class="uppercase font-medium text-xl mb-2 text-gray-800 hover:text-primary transition">
                        ${product.name}
                      </h4>
                    </a>

                    <div class="flex justify-between mb-1 space-x-2">
                      <p class="text-xl text-primary font-semibold">
                        ${product.brand}
                      </p>`;
                    if (product.numberofpro > 0) {
                        productHTML += `<p class="text-right text-base text-green-600">In stock</p>`;
                      }else{
                        productHTML += `<p class="text-right text-base text-red-600">Out of stock</p>`;
                    }
                    productHTML += `
                    </div>
                    <div class="flex items-baseline mb-1 space-x-2">
                      <p class="text-xl text-primary font-semibold">
                        $${product.price}
                      </p>`;

                    if (product.discount > 0) {
                          productHTML += `<p class="text-base text-red-600 font-extrabold">-${product.discount}%</p>`;
                    }
                    productHTML += `
                    </div>
                    
                    <div class="flex gap-1 text-sm text-yellow-400">
                      <i class="star"></i>
                      <i class="star"></i>
                      <i class="star"></i>
                      <i class="star"></i>
                      <i class="star"></i>
                    </div>
                  </div> 

                  <!-- Nút Add to Cart -->
                  <a href="#"
                    class="block w-full py-3 mt-auto text-center text-white bg-green-700 border border-primary hover:bg-green-500 transition">
                    Add to cart
                  </a>
                </div>`;                
                
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


function updatePagination(total, itemsPerPage,page) {
  const totalPage = Math.ceil(total/ itemsPerPage);
  renderPagination(totalPage,page);
}

function renderPagination(totalPage,page) {
  const paginationElement = document.getElementById('Pagination');
  paginationElement.innerHTML = ''; 

  paginationElement.innerHTML += `
      <button onclick="changePage(${page - 1})" class="relative inline-flex items-center rounded-l-md px-4 py-4 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
          <span class="sr-only">Previous</span>
          <svg class="size-6" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
              <path fill-rule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd" />
          </svg>
      </button>
  `;

  for (let i = 1; i <= totalPage; i++) {
    paginationElement.innerHTML += `
        <button onclick="changePage(${i})" class="relative ${i === page? 'z-10 bg-slate-800 text-white' : 'text-gray-900'} inline-flex items-center px-6 py-4 text-lg font-semibold ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
            ${i}
        </button>
    `;
  }


  paginationElement.innerHTML += `
      <button onclick="changePage(${page + 1})" class="relative inline-flex items-center rounded-r-md px-4 py-4 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
          <span class="sr-only">Next</span>
          <svg class="size-6" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
              <path fill-rule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
          </svg>
      </button>
  `;
}