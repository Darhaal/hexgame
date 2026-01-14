// src/app/layout.js

export const metadata = {
  title: "Hex Game",
  description: "Strategy hex map",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body style={{
        backgroundColor: '#1b1b1b',
        color: '#a8a8a8',
        margin: 0,
        padding: 0,
        overflow: 'hidden', // Жесткое отключение скролла
        overscrollBehavior: 'none', // [NEW] Отключает эффекты резинки (pull-to-refresh)
        fontFamily: "'Courier New', monospace",
        WebkitFontSmoothing: 'none'
      }}>
        {children}
      </body>
    </html>
  );
}