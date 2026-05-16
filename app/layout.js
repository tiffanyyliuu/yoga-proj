import './globals.css';

export const metadata = {
  title: 'Yoga Planner',
  description: 'AI-powered yoga sequence planning for instructors',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-stone-50 text-stone-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
