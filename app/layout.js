import './site.css';

export const metadata = {
  title: 'WedsTemplates',
  description: "Elegant, mobile first invitation websites for weddings and life's biggest occasions.",
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
