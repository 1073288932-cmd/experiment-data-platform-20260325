import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function StudentIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" {...props}>
      <path d="M12 13.5c3.18 0 5.75 1.93 5.75 4.32v.43c0 .69-.56 1.25-1.25 1.25h-9c-.69 0-1.25-.56-1.25-1.25v-.43c0-2.39 2.57-4.32 5.75-4.32Z" />
      <path d="M12 11a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5Z" />
    </svg>
  );
}

export function TeacherIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" {...props}>
      <path d="M4.75 5.5c0-.69.56-1.25 1.25-1.25h12c.69 0 1.25.56 1.25 1.25v8.75H4.75V5.5Z" />
      <path d="M8 18.75h8M12 14.25v4.5" />
      <path d="M8.5 8h4.25M8.5 10.75h7" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" {...props}>
      <path d="m6.75 12.4 3.1 3.1 7.4-7.4" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" {...props}>
      <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
      <path d="M12 7.5V12l3 1.8" />
    </svg>
  );
}

export function RefreshIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" {...props}>
      <path d="M19 7.75A8.25 8.25 0 0 0 5.2 6.3L4 7.5" />
      <path d="M4 4.25V7.5h3.25" />
      <path d="M5 16.25a8.25 8.25 0 0 0 13.8 1.45L20 16.5" />
      <path d="M20 19.75V16.5h-3.25" />
    </svg>
  );
}

export function SignalIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" {...props}>
      <path d="M5 18.5h.01" />
      <path d="M8.75 18.5a3.75 3.75 0 0 0-3.75-3.75" />
      <path d="M13.25 18.5A8.25 8.25 0 0 0 5 10.25" />
      <path d="M18.75 18.5A13.75 13.75 0 0 0 5 4.75" />
    </svg>
  );
}

export function ArrowIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" {...props}>
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}
