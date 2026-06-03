import './Button.css';

function Button({ href, children, style, className, ...props }) {
  const Tag = href ? 'a' : 'button';

  return (
    <Tag
      className={className ? `button ${className}` : 'button'}
      href={href}
      style={style}
      type={href ? undefined : 'button'}
      {...props}
    >
      {children}
    </Tag>
  );
}

export default Button;
