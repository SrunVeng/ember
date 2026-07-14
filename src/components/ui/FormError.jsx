export function FormError({ children, id }) {
  if (!children) {
    return null;
  }

  return (
    <p id={id} className="mt-1 text-sm font-medium text-red-600">
      {children}
    </p>
  );
}
