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

if (formulario) {
  const mensaje = document.getElementById("mensaje-exito");
  const pasos = document.querySelectorAll(".form-step");
  const contadorPaso = document.getElementById("form-step-counter");
  const progreso = document.querySelector(".form-progress-fill");
  const acciones = document.querySelector(".form-actions");
  const btnAtras = document.getElementById("btn-atras");
  const btnSiguiente = document.getElementById("btn-siguiente");
  const btnEnviar = document.getElementById("btn-enviar");
  const totalPasos = pasos.length;
  let pasoActual = 0;

const showMessage = (text, type = "success", timeout = 4000) => {
  mensaje.textContent = text;
  mensaje.classList.remove("exito", "error");
  mensaje.classList.add("activo", type);
  setTimeout(() => mensaje.classList.remove("activo"), timeout);
};

const actualizarPaso = () => {
  pasos.forEach((paso, index) => {
    paso.classList.toggle("activo", index === pasoActual);
  });

  contadorPaso.textContent = `Paso ${pasoActual + 1} de ${totalPasos}`;
  progreso.style.width = `${((pasoActual + 1) / totalPasos) * 100}%`;
  btnAtras.style.display = pasoActual === 0 ? "none" : "block";
  acciones.classList.toggle("inicio-activo", pasoActual === 0);
  acciones.classList.toggle("enviar-activo", pasoActual === totalPasos - 1);
};

const camposDelPasoActual = () =>
  Array.from(pasos[pasoActual].querySelectorAll("input, select, textarea"));

const validarPasoActual = () => {
  const campos = camposDelPasoActual();
  const primerCampoInvalido = campos.find((campo) => !campo.checkValidity());

  if (primerCampoInvalido) {
    primerCampoInvalido.reportValidity();
    showMessage("Por favor completa los campos de este paso.", "error");
    return false;
  }

  return true;
};

btnSiguiente.addEventListener("click", () => {
  if (!validarPasoActual()) return;

  pasoActual += 1;
  actualizarPaso();
});

btnAtras.addEventListener("click", () => {
  if (pasoActual === 0) return;

  pasoActual -= 1;
  actualizarPaso();
});

formulario.addEventListener("submit", async function (e) {
  e.preventDefault();

  const nombre = formulario.nombre.value.trim();
  const email = formulario.email.value.trim();
  const telefono = formulario.telefono.value.trim();
  const paisDestino = formulario.pais_destino.value;
  const tipoTramite = formulario.tipo_tramite.value;
  const nacionalidad = formulario.nacionalidad.value.trim();
  const mensajeText = formulario.mensaje.value.trim();

  const hasInvalidChars = (str) => /[<>"'`]/.test(str);
  const looksLikeSQLi = (str) =>
    /\b(1=1|or\s+1=1|union\b|select\b|drop\b|insert\b|update\b|delete\b|--|;)\b/i.test(
      str,
    );
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!validarPasoActual()) return;

  if (
    !paisDestino ||
    !tipoTramite ||
    !nacionalidad ||
    !mensajeText ||
    !nombre ||
    !email ||
    !telefono
  ) {
    showMessage("Por favor completa todos los campos.", "error");
    return;
  }

  if (!emailRegex.test(email)) {
    showMessage("Ingresa un email valido.", "error");
    return;
  }

  if (
    hasInvalidChars(paisDestino) ||
    hasInvalidChars(tipoTramite) ||
    hasInvalidChars(nacionalidad) ||
    hasInvalidChars(nombre) ||
    hasInvalidChars(email) ||
    hasInvalidChars(telefono) ||
    hasInvalidChars(mensajeText)
  ) {
    showMessage("Caracteres no permitidos detectados.", "error");
    return;
  }

  if (
    looksLikeSQLi(paisDestino) ||
    looksLikeSQLi(tipoTramite) ||
    looksLikeSQLi(nacionalidad) ||
    looksLikeSQLi(nombre) ||
    looksLikeSQLi(email) ||
    looksLikeSQLi(telefono) ||
    looksLikeSQLi(mensajeText)
  ) {
    showMessage("Contenido sospechoso detectado.", "error");
    return;
  }

  const datos = new FormData(formulario);
  btnEnviar.disabled = true;
  btnEnviar.textContent = "Enviando...";

  try {
    const respuesta = await fetch(formulario.action, {
      method: formulario.method,
      body: datos,
      headers: {
        Accept: "application/json",
      },
    });

    if (respuesta.ok) {
      showMessage("Consulta enviada correctamente.", "success");
      formulario.reset();
      pasoActual = 0;
      actualizarPaso();
    } else {
      showMessage("Ocurrio un error. Intenta nuevamente.", "error");
    }
  } catch (error) {
    showMessage("Error de conexion.", "error");
  } finally {
    btnEnviar.disabled = false;
    btnEnviar.textContent = "Enviar Consulta";
  }
});

  actualizarPaso();
}

const historiasCarousel = document.querySelector(".historias-carousel");

if (historiasCarousel) {
  const slides = historiasCarousel.querySelectorAll(".historia-slide");
  const dots = document.querySelectorAll(".historia-dots .dot");
  const prevBtn = historiasCarousel.querySelector(".historia-nav.prev");
  const nextBtn = historiasCarousel.querySelector(".historia-nav.next");
  const autoPlayDelay = 20000;
  let currentIndex = 0;
  let autoPlayInterval;

  const showSlide = (index) => {
    currentIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("active", slideIndex === currentIndex);
    });

    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === currentIndex;
      dot.classList.toggle("active", isActive);
      dot.setAttribute("aria-current", isActive ? "true" : "false");
    });
  };

  const nextSlide = () => showSlide(currentIndex + 1);
  const prevSlide = () => showSlide(currentIndex - 1);

  const startAutoPlay = () => {
    clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
  };

  nextBtn.addEventListener("click", () => {
    nextSlide();
    startAutoPlay();
  });

  prevBtn.addEventListener("click", () => {
    prevSlide();
    startAutoPlay();
  });

  dots.forEach((dot, dotIndex) => {
    dot.addEventListener("click", () => {
      showSlide(dotIndex);
      startAutoPlay();
    });
  });

  startAutoPlay();
}

const metodoSection = document.querySelector("#metodo");

if (metodoSection) {
  const timelineItems = metodoSection.querySelectorAll(".timeline-item");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if ("IntersectionObserver" in window && !reducedMotion) {
    metodoSection.classList.add("metodo-reveal-ready");

    timelineItems.forEach((item, index) => {
      item.style.setProperty("--reveal-delay", `${index * 100}ms`);
    });

    const metodoObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    timelineItems.forEach((item) => metodoObserver.observe(item));
  }
}
