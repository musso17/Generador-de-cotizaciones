import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Generador de Cotizaciones - Cerezo Films',
  description: 'Crea, analiza y exporta cotizaciones con ayuda de IA.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-gray-grafito text-white`}>{children}</body>
    </html>
  )
}
