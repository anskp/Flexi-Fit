// src/components/Header.jsx
export default function Header({ title = "Dashboard", subtitle = "" }) {
  return (
    <header className="ml-4 p-6 bg-white border-b border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
    </header>
  );
}