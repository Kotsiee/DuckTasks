import { FunctionalComponent } from 'preact';

// Icon Component
interface IconProps {
  paths: string[];
  size?: number;
  style?: any;
  classs?: string;
  [key: string]: any;
}

export const Icon: FunctionalComponent<IconProps> = ({ paths, size = 24, color = 'currentColor', ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill-rule="evenodd"
      xmlns="http://www.w3.org/2000/svg"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"

      class={`${props.classs} icon`}
      style={props.style}

      {...props}
    >
      {paths.map((d, index) => (
        <path key={index} d={d} />
      ))}
    </svg>
  );
};

// Example Icon Library
export const Icons: Record<string, string[]> = {
  Home: [
    'M3 9L12 2L21 9V20C21 20.55 20.55 21 20 21H4C3.45 21 3 20.55 3 20V9Z',
    'M9 21V12H15V21'
  ],
  Search: [
    'M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z',
    'M21 21L16.65 16.65'
  ],
  Settings: [
    'M 12 1 L 22 6 L 22 18 L 12 23 L 2 18 L 2 6 L 12 1 Z M 12 8 A 4 4 0 1 1 12 16 A 4 4 0 1 1 12 8 Z'
  ],
  X: [
    'M 1 1 L 23 23 Z',
    'M 1 23 L 23 1 Z'
  ]
};

export default Icon;
