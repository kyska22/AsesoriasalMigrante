const boton = document.querySelector("button");

boton.addEventListener("click", () => {
  alert("Gracias por contactarnos");
});

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
      mensaje.textContent = "Consulta enviada correctamente.";
      mensaje.classList.add("activo");
      formulario.reset();
      setTimeout(() => {
        mensaje.classList.remove("activo");
      }, 4000);
    } else {
      mensaje.textContent = "Ocurrió un error. Intenta nuevamente.";
      mensaje.classList.add("activo");
    }
  } catch (error) {
    mensaje.textContent = "Error de conexión.";

    mensaje.classList.add("activo");
  }
});
