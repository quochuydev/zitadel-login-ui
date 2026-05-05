import React from 'react';

type Size = 'large' | 'medium' | 'small';
type Color = 'blue' | 'red' | 'neutral';

type ButtonType = {
  color: Color;
  disabled?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  size?: Size;
  text?: string;
  fullWidth?: boolean;
  loading?: boolean;
  onClick?: () => void;
  'data-testid'?: string;
};

const textColorMap: { [key in Color]: string } = {
  red: 'text-negative',
  blue: 'text-info',
  neutral: 'text-gray700',
};

const sizeMap: { [key in Size]: string } = {
  large: 'h-[40px]',
  medium: 'h-[32px]',
  small: 'h-[24px]',
};

const borderMap: { [key in Color]: string } = {
  red: 'border-negative',
  blue: 'border-info',
  neutral: 'border-gray700',
};

const bgMap: { [key in Color]: string } = {
  red: 'bg-negative',
  blue: 'bg-info',
  neutral: 'bg-gray700',
};

const Loading: React.FC<
  Pick<ButtonType, 'color'> & { type?: 'primary' | 'secondary' }
> = (props) => {
  const { color, type } = props;

  const style = `animate-spin h-[20px] w-[20px] top-0 left-0
   right-0 bottom-0 m-auto rounded-full border-4 border-t-4`;

  if (type === 'primary')
    return <div className={`${style} border-[#DCE0E4] border-t-white`} />;

  return (
    <div
      className={`${style} ${
        color === 'blue' ? 'border-info100' : 'border-negative100'
      }border-[#DCE0E4]
    ${
      color === 'blue'
        ? 'border-t-info'
        : color === 'red'
          ? 'border-t-negative'
          : 'border-t-gray700'
    }
   `}
    />
  );
};

const Primary: React.FC<ButtonType> = (props) => {
  const {
    text,
    color,
    disabled = false,
    size = 'large',
    fullWidth = true,
    loading = false,
    onClick,
  } = props;

  const disabledStyle = `bg-gray300 text-silver cursor-not-allowed`;

  const className = `mt-[24px] justify-center text-[14px] rounded-md p-[10px] items-center
    ${fullWidth ? 'w-full' : `w-[140px]`}
    ${sizeMap[size]}
    ${disabled ? disabledStyle : `cursor-pointer text-white ${bgMap[color]}`}`;

  return (
    <button
      className={className}
      disabled={disabled}
      onClick={loading || disabled ? undefined : onClick}
      data-testid={props['data-testid']}
    >
      {loading ? <Loading color={color} type="primary" /> : text}
    </button>
  );
};

export default { Primary };
