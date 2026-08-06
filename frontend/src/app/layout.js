import './globals.css';

export const metadata = {
  title: 'PeoplePulse | Performance Platform',
  description: 'Employee performance and development platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
