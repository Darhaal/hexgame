// src/app/layout.js

export const metadata = {
  title: "Hex Game",
  description: "Strategy hex map",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
