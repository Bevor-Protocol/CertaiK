import { cn } from "@/lib/utils";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
}

export const Main: React.FC<Props> = ({ children, className, hover = false, ...rest }) => {
  return (
    <div
      className={cn(
        "flex flex-col bg-black shadow-sm rounded-lg",
        "divide-gray-200/10 divide-y divide-solid border border-white",
        hover && "transition-colors hover:bg-slate-700/40",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

export const Header: React.FC<Props> = ({ children, className, ...rest }) => {
  return (
    <div className={cn("flex grow justify-between items-center", className)} {...rest}>
      {children}
    </div>
  );
};

export const Content: React.FC<Props> = ({ children, className, ...rest }) => {
  return (
    <div className={cn("flex grow", className)} {...rest}>
      {children}
    </div>
  );
};

export const Footer: React.FC<Props> = ({ children, className, ...rest }) => {
  return (
    <div className={cn("flex grow justify-between items-center ", className)} {...rest}>
      {children}
    </div>
  );
};
