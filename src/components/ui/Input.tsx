import { InputHTMLAttributes, forwardRef } from "react";

// Just remove className to customize it for the entire website
type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "className">;

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(props, ref) {
  return (
    <input
      {...props}
      ref={ref}
      className="border-[2px] border-stone-400 p-1 rounded-lg outline-none disabled:cursor-not-allowed transition-all"
    />
  );
});

export default Input;