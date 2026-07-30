export const config = {
  marca: "Tres Marías",
  tagline: "Accesorios que se notan, fragancias que se recuerdan",
  whatsapp: {
    // Codigo de pais + numero, sin "+" ni espacios. Ej: "5491112345678"
    numero: "5493413542687",
    mensaje: "Hola, tengo una consulta",
  },
  instagram: "https://instagram.com/tresmariasacc",
  email: "info3marias.accesorios@gmail.com",
};

export function whatsappUrl(mensaje?: string): string {
  const { numero, mensaje: mensajeDefault } = config.whatsapp;
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje ?? mensajeDefault)}`;
}
