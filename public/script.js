// public/script.js

document.addEventListener("DOMContentLoaded", () => {
  // ---- ESTADO Y USUARIOS DE PRUEBA ----
  let authToken = null;
  const testUsers = [
    { email: "admin@tienda.com", password: "test1234" },
    { email: "noadmin@tienda.com", password: "password1" },
    { email: "bloqueado@tienda.com", password: "password2" },
    { email: "otro@test.com", password: "password3" },
  ];

  // ---- REFERENCIAS A ELEMENTOS DEL DOM ----
  const loginSection = document.getElementById("login-section");
  const adminPanel = document.getElementById("admin-panel");
  const apiResult = document.getElementById("api-result");

  // Formularios y botones
  const loginForm = document.getElementById("login-form");
  const logoutBtn = document.getElementById("logout-btn");
  const listProductsForm = document.getElementById("list-products-form");
  const createProductForm = document.getElementById("create-product-form");
  const updateProductForm = document.getElementById("update-product-form");
  const getProductBtn = document.getElementById("get-product-btn");
  const deleteProductBtn = document.getElementById("delete-product-btn");

  // ---- INICIALIZACIÓN ----
  const datalist = document.getElementById("test-users");
  testUsers.forEach((user) => {
    const option = document.createElement("option");
    option.value = user.email;
    datalist.appendChild(option);
  });

  document.getElementById("email").addEventListener("input", (e) => {
    const user = testUsers.find((u) => u.email === e.target.value);
    if (user) {
      document.getElementById("password").value = user.password;
    }
  });

  // ---- FUNCIÓN HELPER PARA LLAMADAS A LA API ----
  const apiCall = async (endpoint, method = "GET", body = null) => {
    const options = {
      method,
      headers: {}, // Headers se manejan dinámicamente
    };
    if (authToken) {
      options.headers["Authorization"] = `Bearer ${authToken}`;
    }

    // Detectar si el body es FormData
    if (body instanceof FormData) {
      options.body = body;
      // NO establecer 'Content-Type', el navegador lo hace automáticamente
    } else if (body) {
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(endpoint, options);
      const data = await response.json();
      apiResult.textContent = JSON.stringify(data, null, 2);
      return { ok: response.ok, data };
    } catch (error) {
      apiResult.textContent = `Error de red: ${error.message}`;
      return { ok: false, data: { message: error.message } };
    }
  };

  // ---- LÓGICA DE UI ----
  const updateUI = (isLoggedIn) => {
    if (isLoggedIn) {
      loginSection.classList.add("hidden");
      adminPanel.classList.remove("hidden");
    } else {
      loginSection.classList.remove("hidden");
      adminPanel.classList.add("hidden");
      authToken = null;
      document.getElementById("user-info").innerHTML = "";
      apiResult.textContent = "Desconectado. Inicia sesión para probar la API.";
    }
  };

  // ---- MANEJADORES DE EVENTOS ----

  // Login
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const { ok, data } = await apiCall("/api/v1/auth/login", "POST", {
      email,
      password,
    });

    // CORRECCIÓN: Comprobar que 'data.data' y 'data.data.token' existan.
    if (ok && data && data.data && data.data.token) {
      authToken = data.data.token;
      document.getElementById("user-info").innerHTML = `
            <p><strong>Usuario:</strong> ${data.data.user.email}</p>
            <p><strong>Rol:</strong> ${data.data.user.role}</p>
            <p><strong>Token:</strong> <span style="font-size: 12px; word-break: break-all;">${authToken.substring(
              0,
              40
            )}...</span></p>
        `;
      updateUI(true);
    } else {
      updateUI(false);
    }
  });

  // Logout
  logoutBtn.addEventListener("click", () => updateUI(false));

  // Listar productos
  listProductsForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const page = document.getElementById("page").value;
    const limit = document.getElementById("limit").value;
    await apiCall(`/api/v1/productos?page=${page}&limit=${limit}`);
  });

  // Crear producto
  createProductForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(createProductForm); // Usamos FormData
    await apiCall("/api/v1/productos", "POST", formData);
    createProductForm.reset();
  });

  // Obtener producto por ID (y autocompletar)
  getProductBtn.addEventListener("click", async () => {
    const id = document.getElementById("product-id").value;
    if (!id) {
      apiResult.textContent = "Por favor, introduce un ID de producto.";
      return;
    }
    const { ok, data } = await apiCall(`/api/v1/productos/${id}`);
    if (ok) {
      // La data ahora está en data.data
      const product = data.data;
      document.querySelector(
        '#update-product-form input[name="nombre"]'
      ).value = product.nombre;
      document.querySelector(
        '#update-product-form input[name="descripcion"]'
      ).value = product.descripcion;
      document.querySelector(
        '#update-product-form input[name="precio"]'
      ).value = product.precio;
      document.querySelector('#update-product-form input[name="stock"]').value =
        product.stock;
    }
  });

  // Actualizar producto
  updateProductForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("product-id").value;
    if (!id) {
      apiResult.textContent =
        "Introduce un ID para poder actualizar el producto.";
      return;
    }
    const formData = new FormData(updateProductForm);
    await apiCall(`/api/v1/productos/${id}`, "PUT", formData);
  });

  // Eliminar producto
  deleteProductBtn.addEventListener("click", async () => {
    const id = document.getElementById("product-id").value;
    if (!id) {
      apiResult.textContent = "Por favor, introduce un ID de producto.";
      return;
    }
    if (
      confirm(
        `¿Estás seguro de que quieres eliminar el producto con ID: ${id}?`
      )
    ) {
      await apiCall(`/api/v1/productos/${id}`, "DELETE");
    }
  });

  // Estado inicial
  updateUI(false);
});
