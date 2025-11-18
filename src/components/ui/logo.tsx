const Logo = ({ size = 80 }: { size?: number }) => {
  return (
    <img 
      src="https://cdn.poehali.dev/files/5ad5321f-843c-4306-8c74-1b457105908d.png" 
      alt="FlowKat Logo"
      width={size}
      height={size}
      style={{ width: size, height: size }}
    />
  );
};

export default Logo;