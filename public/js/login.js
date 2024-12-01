
// axios.interceptors.request.use(function(config) {
//     const token = localStorage.getItem('token'); 
//     if (token) {
//         config.headers['Authorization'] = token;
//     }
//     return config; 
// }, function(error) {
//     return Promise.reject(error);
// });

// document.getElementById('loginForm').addEventListener('submit', function(event) {
//     event.preventDefault(); 
//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;

//     axios.post('/login', { email, password })
//         .then(response => {
//             console.log("Response from server: ", response);
//             if (response.data.success) {
               
//                 localStorage.setItem('token', response.data.token);
//                 alert("Login successful!");
//                 window.location.href = '/mobilephones';  
//             } else {
//                 alert('Login failed: ' + response.data.message);  
//             }
//         })
//         .catch(err => {
//             console.error("Login failed:", err);  
//         });
// });


function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Kiểm tra token và cập nhật giao diện
document.addEventListener('DOMContentLoaded', () => {
    const token = getCookie('token'); // 'token' là tên cookie bạn lưu token

    const authLink = document.getElementById('auth-link');
    const registerLink = document.getElementById('register-link');

    if (token) {
        // Nếu token tồn tại, đổi thành nút Logout
        authLink.innerHTML = '<a href="#" id="logout-btn"><i class="fas fa-sign-out-alt me-2"></i>Logout</a>';
        registerLink.style.display = 'none'; // Ẩn nút Register

        // Xử lý khi click nút Logout
        const logoutBtn = document.getElementById('logout-btn');
        logoutBtn.addEventListener('click', () => {
            // Xóa cookie token
            document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            // Tải lại trang hoặc điều hướng đến trang login
            window.location.href = '/login.html';
        });
    }
});