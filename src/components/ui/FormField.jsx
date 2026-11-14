export function FormField({
  label,
  name,
  type = 'text',
  value,
  options = [],
  onChange,
  ...props
}) {
  if (type === 'select') {
    return (
      <select name={name} value={value} onChange={onChange} {...props}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }

  if (type === 'checkbox') {
    return (
      <label className="checkbox-status">
        <input
          type="checkbox"
          name={name}
          checked={Boolean(value)}
          onChange={onChange}
          {...props}
        />
        {typeof label === 'function' ? label(value) : label}
      </label>
    );
  }

  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      {...props}
    />
  );
}
