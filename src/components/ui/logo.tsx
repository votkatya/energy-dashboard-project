const Logo = ({ size = 80 }: { size?: number }) => {
  return (
    <img 
      src="https://cdn.poehali.dev/files/fb85270b-824f-4854-8274-3e0430aab75a.png" 
      alt="FlowKat Logo"
      width={size}
      height={size}
      style={{ width: size, height: size }}
    />
  );
};

export default Logo;