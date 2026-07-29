export const config = {
  marca: "Tres Marías",
  tagline: "Accesorios que cuentan tu historia",
  whatsapp: {
    // Codigo de pais + numero, sin "+" ni espacios. Ej: "5491112345678"
    numero: "5493413542687",
    mensaje: "Hola, tengo una consulta",
  },
  instagram: "https://instagram.com/tresmariasacc",
  email: "info3marias.accesorios@gmail.com",
  notaPorEncargo:
    "Los productos por encargo se piden al momento y llegan en 15 a 20 días.",
};

export function whatsappUrl(): string {
  const { numero, mensaje } = config.whatsapp;
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}
