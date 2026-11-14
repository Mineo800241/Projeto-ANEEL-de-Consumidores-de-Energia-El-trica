export function Button({
  children,
  variant = 'salvar',
  type = 'button',
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      className={`btn-${variant} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
