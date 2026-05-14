export const metadata = { title: 'Family OS' }

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'sans-serif', background: '#F5F0E8' }}>
        {children}
      </body>
    </html>
  )
}
