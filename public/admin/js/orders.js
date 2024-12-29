const viewDetail = document.querySelectorAll('[view-detail]');
const modal = document.querySelector("#orderDetailsModal");
const modalContent = modal.querySelector(".bg-white");

viewDetail.forEach((btn) => {
    btn.addEventListener('click', async () => {
        const row = btn.closest('tr');
        const orderId = row.querySelector('td:first-child').getAttribute("order-id");
        console.log(orderId);
        
        try {
            const response = await fetch(`/admin/order/${orderId}/details`);
            const data = await response.json();
            
            if (data.ok) {
                const details = data.details;
                const orderItemsContainer = document.getElementById('orderItems');
                orderItemsContainer.innerHTML = '';

                // Display order items
                details.forEach(item => {
                    const itemElement = `
                        <div class="flex justify-between items-center p-4 hover:bg-gray-50">
                            <div class="flex items-center space-x-4">
                                <img src="${item.product_url || '/images/default-food.png'}" 
                                     alt="${item.product_name}" 
                                     class="w-16 h-16 object-cover rounded-lg">
                                <div>
                                    <p class="font-medium">${item.product_name}</p>
                                    <p class="text-sm text-gray-500">Số lượng: ${item.quantity}</p>
                                </div>
                            </div>
                            <span class="font-medium">
                                ${(item.price * item.quantity).toLocaleString('vi-VN')}đ
                            </span>
                        </div>
                    `;
                    orderItemsContainer.innerHTML += itemElement;
                });

                // Update other modal content
                document.getElementById('orderIdDetail').textContent = details[0].order_code;
                document.getElementById('customerName').textContent = details[0].name;
                document.getElementById('customerEmail').textContent = details[0].email;
                // document.getElementById('customerPhone').textContent = details[0].phone;
                // document.getElementById('customerAddress').textContent = details[0].address;
                document.getElementById('deliveryFee').textContent = '0đ';
                document.getElementById('orderTotal').textContent = 
                    `${parseInt(details[0].total).toLocaleString('vi-VN')}đ`;

                // Show modal
                modal.classList.remove('hidden');
                modal.classList.add('flex');
                setTimeout(() => {
                    modalContent.classList.remove('scale-95', 'opacity-0');
                    modalContent.classList.add('scale-100', 'opacity-100');
                }, 50);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});

// Close modal with animation
document.getElementById('closeOrderDetails').addEventListener('click', () => {
    modalContent.classList.add('scale-95', 'opacity-0');
    modalContent.classList.remove('scale-100', 'opacity-100');
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }, 300);
});

// Close on outside click
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        document.getElementById('closeOrderDetails').click();
    }
});