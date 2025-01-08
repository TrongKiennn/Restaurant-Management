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
  const productContainer = document.getElementById('product-list'); // Class container sản phẩm
  productContainer.innerHTML = ''; // Xóa danh sách cũ

  // Render danh sách sản phẩm mới
  products.forEach((product) => {
    let productHTML = `
      <div class="bg-white shadow-md flex flex-col h-full rounded-lg">
                  <div class="relative group w-full h-80 flex items-center justify-center">
                    <img src="${product.product_url}" alt="${product.name}" class="max-w-full max-h-full" />
                    <a href="/category/${product.product_id}">
                      <div
                        class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition">
                      </div>
                    </a>
                  </div>

                  <div class="flex-grow pt-4 pb-3 px-4 flex flex-col">
                    <a href="/category/${product.product_id}">
                      <h4 class="uppercase font-medium text-xl mb-2 text-gray-800 hover:text-primary transition">
                        ${product.name}
                      </h4>
                    </a>
                    <div class="flex items-baseline mb-1 space-x-2">
                      <p class="text-xl text-primary font-semibold">
                        ${product.price} VNĐ
                      </p>
                    </div> 
                  </div>
                
                  <a href="#"
                    class="add-to-cart-btn block w-full py-3 mt-auto text-center text-white bg-[#9c5e25]  hover:bg-[#b87434] transition rounded-b-lg"
                    data-product-id="${product.product_id}"
                    data-product-price="${product.price}">
                    Thêm vào giỏ hàng
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
      i === page ? 'z-10 bg-[#9c5e25]  text-white' : 'text-gray-900'
    } inline-flex items-center px-6 py-4 text-lg font-semibold ring-1 ring-inset ring-gray-300 hover:bg-[#b87434] focus:z-20 focus:outline-offset-0">
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



async function updateFilter(urlParamKey, urlParamValue) {

  const params = new URLSearchParams(window.location.search);

  params.set(urlParamKey, urlParamValue);


  const newURL = `${window.location.pathname}?${params.toString()}`;
  window.history.pushState(null, '', newURL);
 

  await fetchAndRenderOrderPage(newURL);
}



async function fetchAndRenderOrderPage(newURL) {
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
          updateOrderList(data.orderList);
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

function updateOrderList(products) {
  const productContainer = document.querySelector('.container.mx-auto.my-6.space-y-6'); // Class container sản phẩm
  productContainer.innerHTML = ''; // Xóa danh sách cũ

  // Render danh sách sản phẩm mới
  products.forEach((order) => {
    let orderHTML = `
      <div class="main-box border border-gray-200 rounded-xl w-full">
        <div class="flex flex-col lg:flex-row justify-between px-6 pb-6 border-b border-gray-200">
          <div>
            <p class="font-semibold text-base text-black">
              Order Id: <span class="text-indigo-600 font-medium">#${order.order_code}</span>
            </p>
            <p class="font-semibold text-base text-black">
              Status: <span class="text-emerald-600">${order.order_status}</span>
            </p>
          </div>
          <div class="mt-4">
            ${order.status_payment === 'Unpaid' ? `
              <p class="font-semibold text-base text-black">
                <span class="text-red-600 font-medium text-2xl">${order.status_payment}</span>
              </p>` : `
              <p class="font-semibold text-base text-black">
                <span class="text-green-600 font-medium text-2xl">${order.status_payment}</span>
              </p>`}
          </div>
        </div>

        <div class="w-full px-6">
          ${order.products.map(item => `
          <div class="flex flex-row items-center py-6 border-b border-gray-200 gap-6">
            <!-- Product Image -->
            <div class="w-28 h-28">
              <img src="${item.product_url}" alt="${item.name} image" class="w-full h-full rounded-lg object-cover">
            </div>

            <!-- Product Details -->
            <div class="flex-1 grid grid-cols-5 gap-4">
              <div class="col-span-3">
                <h3 class="font-semibold text-xl text-black mb-2">${item.name}</h3>
                <p class="text-gray-500">Qty: ${item.quantity}</p>
              </div>
              <div class="col-span-2 text-right">
                <p class="font-medium text-sm text-black">Price</p>
                <p class="font-semibold text-lg text-indigo-600">$${item.price}</p>
              </div>
            </div>
          </div>`).join('')}
        </div>

      

        <div class="w-full border-t border-gray-200 px-6 py-6 flex flex-col lg:flex-row items-center justify-between">
            <div>
            <p class="font-semibold text-lg text-black mt-4 lg:mt-0">
              Total Price: <span class="text-indigo-600">$${order.total}</span>
            </p>
          </div>
          <div>
            <button class="bg-gray-200 p-4 rounded-lg">
              <a href="/checkout/payment?order_code=${order.order_code} " class="text-red-500 font-semibold" onclick="event.preventDefault(); updateFilter('status', 'Canceled'); window.location.href=this.href;">Go To Payment</a>
            </button>
            
        </div>
        </div>
      </div>`;

    productContainer.insertAdjacentHTML('beforeend', orderHTML);
  });
}



document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll("nav a");

  function setActiveLink(clickedLink) {
  
    links.forEach((link) => link.classList.remove("text-red-500"));

    clickedLink.classList.add("text-red-500");
  }

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      setActiveLink(event.target);
    });
  });
});