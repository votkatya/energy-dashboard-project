const Logo = ({ size = 80 }: { size?: number }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(60, 60)">
        <path
          d="M 0,-45 L 39,-22.5 L 39,22.5 L 0,45 L -39,22.5 L -39,-22.5 Z"
          className="fill-accent/80"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        
        <path
          d="M -8,-35 L 2,-35 L -13,5 L -3,5 L -23,40 L -15,15 L -23,15 Z"
          className="fill-primary"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        <path
          d="M -8,-35 L -5,-30 L -15,-5 L -10,-5 L -23,20 L -18,10 L -20,10 L -10,-30 Z"
          className="fill-primary-light opacity-60"
        />
      </g>
    </svg>
  );
};

export default Logo;
