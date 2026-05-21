const boton = document.querySelector("button");

const menuToggle = document.getElementById("menu-toggle");
const nav = document.getElementById("nav");
const navLinks = document.querySelectorAll("#nav a");

menuToggle.addEventListener("click", () => {
  nav.classList.toggle("active");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("active");
  });
});

const formulario = document.getElementById("formulario-contacto");
const mensaje = document.getElementById("mensaje-exito");

formulario.addEventListener("submit", async function (e) {
  e.preventDefault();

  const nombre = formulario.nombre.value.trim();
  const email = formulario.email.value.trim();
  const telefono = formulario.telefono.value.trim();
  const servicio = formulario.servicio.value;
  const mensajeText = formulario.mensaje.value.trim();

  const showMessage = (text, timeout = 4000) => {
    mensaje.textContent = text;
    mensaje.classList.add("activo");
    setTimeout(() => mensaje.classList.remove("activo"), timeout);
  };

  const hasInvalidChars = (str) => /[<>"'`]/.test(str);
  const looksLikeSQLi = (str) =>
    /\b(1=1|or\s+1=1|union\b|select\b|drop\b|insert\b|update\b|delete\b|--|;)\b/i.test(
      str,
    );
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!nombre || !email || !telefono || !servicio || !mensajeText) {
    showMessage("Por favor completa todos los campos.");
    return;
  }

  if (!emailRegex.test(email)) {
    showMessage("Ingresa un email válido.");
    return;
  }

  if (
    hasInvalidChars(nombre) ||
    hasInvalidChars(email) ||
    hasInvalidChars(telefono) ||
    hasInvalidChars(mensajeText)
  ) {
    showMessage("Caracteres no permitidos detectados.");
    return;
  }

  if (
    looksLikeSQLi(nombre) ||
    looksLikeSQLi(email) ||
    looksLikeSQLi(telefono) ||
    looksLikeSQLi(mensajeText)
  ) {
    showMessage("Contenido sospechoso detectado.");
    return;
  }

  const datos = new FormData(formulario);
  try {
    const respuesta = await fetch(formulario.action, {
      method: "POST",
      body: datos,
      headers: {
        Accept: "application/json",
      },
    });

    if (respuesta.ok) {
      showMessage("Consulta enviada correctamente.");
      formulario.reset();
    } else {
      showMessage("Ocurrió un error. Intenta nuevamente.");
    }
  } catch (error) {
    showMessage("Error de conexión.");
  }
});
