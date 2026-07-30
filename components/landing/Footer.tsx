import Image from "next/image";
import { config, whatsappUrl } from "@/lib/config";

export default function Footer() {
  return (
    <footer id="contacto" className="bg-marias-300 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-center">
        <Image
          src="/brand/caligrafia.png"
          alt={config.marca}
          width={200}
          height={55}
        />
        <a
          href={config.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-marias-700 transition-colors hover:text-marias-600"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <circle cx="12" cy="12" r="4.2" />
            <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
          </svg>
          <span className="text-sm">@tresmariasacc</span>
        </a>
        <a
          href={whatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-marias-700 transition-colors hover:text-marias-600"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 12c0-4.42 3.58-8 8-8s8 3.58 8 8-3.58 8-8 8c-1.29 0-2.5-.3-3.58-.85L4 20l1.05-3.9A7.94 7.94 0 0 1 4 12Z" />
            <path d="M9 9.8c.25-.55.8-.55 1.05 0l.35.8c.15.35.05.8-.2 1.05l-.25.25c-.2.2-.2.45-.1.7.45.9 1.15 1.6 2.05 2.05.25.1.5.1.7-.1l.25-.25c.25-.25.7-.35 1.05-.2l.8.35c.55.25.55.8 0 1.05-1.35.8-3.05.45-4.3-.8s-1.6-2.95-.8-4.3Z" />
          </svg>
          <span className="text-sm">WhatsApp</span>
        </a>
        <span className="flex items-center gap-2 text-sm text-marias-700">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="4" width="20" height="16" rx="3" />
            <path d="m3 6.5 9 6.5 9-6.5" />
          </svg>
          {config.email}
        </span>
        <span className="flex items-center gap-2 text-sm text-marias-700">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
          Rosario, Santa Fe - Argentina
        </span>
        <p className="text-xs text-marias-700">
          © {new Date().getFullYear()} {config.marca}. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  );
}
