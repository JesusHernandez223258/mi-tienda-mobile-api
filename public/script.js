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
  // Cargar usuarios de prueba en el datalist
  const datalist = document.getElementById("test-users");
  testUsers.forEach((user) => {
    const option = document.createElement("option");
    option.value = user.email;
    datalist.appendChild(option);
  });

  // Autocompletar contraseña al seleccionar un email
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
      headers: { "Content-Type": "application/json" },
    };
    if (authToken) {
      options.headers["Authorization"] = `Bearer ${authToken}`;
    }
    if (body) {
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

    if (ok && data.token) {
      authToken = data.token;
      document.getElementById("user-info").innerHTML = `
              <p><strong>Usuario:</strong> ${data.user.email}</p>
              <p><strong>Rol:</strong> ${data.user.role}</p>
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
    const product = {
      nombre: document.getElementById("create-nombre").value,
      descripcion: document.getElementById("create-descripcion").value,
      precio: parseFloat(document.getElementById("create-precio").value),
      stock: parseInt(document.getElementById("create-stock").value),
    };
    print(`Creando producto: ${JSON.stringify(product)}`);
    await apiCall("/api/v1/productos", "POST", product);
    createProductForm.reset();
  });

  // Obtener producto por ID
  getProductBtn.addEventListener("click", async () => {
    const id = document.getElementById("product-id").value;
    if (!id) {
      apiResult.textContent = "Por favor, introduce un ID de producto.";
      return;
    }
    const { ok, data } = await apiCall(`/api/v1/productos/${id}`);
    // Autocompletar el formulario de actualización si la petición fue exitosa
    if (ok) {
      document.getElementById("update-nombre").value = data.nombre;
      document.getElementById("update-descripcion").value = data.descripcion;
      document.getElementById("update-precio").value = data.precio;
      document.getElementById("update-stock").value = data.stock;
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
    const updatedProduct = {
      nombre: document.getElementById("update-nombre").value,
      descripcion: document.getElementById("update-descripcion").value,
      precio: parseFloat(document.getElementById("update-precio").value),
      stock: parseInt(document.getElementById("update-stock").value),
    };
    await apiCall(`/api/v1/productos/${id}`, "PUT", updatedProduct);
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
