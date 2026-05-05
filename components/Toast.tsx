import React, { useImperativeHandle, useRef, useState } from 'react';

type Intent = 'success' | 'error' | 'warning';
type Params = {
  message: string;
  timeout?: number;
  intent: Intent;
};

export type ToastType = {
  show: (params: Params) => void;
};

const intentMap: { [key in Intent]: string } = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  warning: 'bg-yellow-500',
};

const Toast = React.forwardRef((_, ref) => {
  const [state, setState] = useState<{
    message?: string;
    intent: Intent;
  }>({ message: undefined, intent: 'success' });

  const { message, intent } = state;

  const timer = useRef<ReturnType<typeof setTimeout>>();

  const show = (params: Params) => {
    const { message, intent, timeout = 5000 } = params;

    if (timeout)
      timer.current = setTimeout(
        () =>
          setState({
            ...state,
            message: undefined,
          }),
        timeout,
      );

    setState({
      message,
      intent,
    });

    return () => {
      if (timer?.current) clearTimeout(timer.current);
    };
  };

  useImperativeHandle(ref, () => ({
    show,
  }));

  if (!message) return <></>;

  return (
    <div
      id="toast-default"
      className={`fixed top-3 flex items-center w-full max-w-xs p-4 text-gray-500 ${intentMap[intent]} rounded-lg shadow`}
      role="alert"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.42734 2.83303L14.7826 11.8081C15.0779 12.3308 15.0697 12.9351 14.7744 13.4415C14.4791 13.9478 13.9459 14.25 13.3634 14.25H2.63766C2.05521 14.25 1.52207 13.9478 1.22675 13.4415C0.931386 12.9352 0.923183 12.3308 1.21032 11.8163L6.57265 2.82483C6.86796 2.31033 7.40119 2 7.99999 2C8.59879 2 9.13202 2.31033 9.42734 2.83303ZM7.00329 6.06296L7.2583 9.18183C7.28851 9.55214 7.59126 9.84167 7.96209 9.84167C8.33292 9.84167 8.63567 9.55214 8.66588 9.18183L8.92063 6.06612C8.925 6.03674 8.92499 6.00532 8.92499 5.98448V5.98446L8.92499 5.98194C8.92499 5.44591 8.49985 5 7.96209 5C7.39486 5 6.95752 5.49327 7.00329 6.06296ZM7.11338 11.5C7.11338 11.9743 7.49333 12.3653 7.96209 12.3653C8.43085 12.3653 8.8108 11.9743 8.8108 11.5C8.8108 11.0257 8.43085 10.6347 7.96209 10.6347C7.49333 10.6347 7.11338 11.0257 7.11338 11.5Z"
          fill="white"
        />
      </svg>
      <div className="ml-3 text-sm font-normal text-white">{message}</div>
      <button
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 bg-none text-white rounded-lg p-1.5 inline-flex items-center justify-center h-8 w-8"
        data-dismiss-target="#toast-default"
        aria-label="Close"
        onClick={() => {
          timer.current = undefined;
          setState({ ...state, message: undefined });
        }}
      >
        <span className="sr-only">Close</span>
        <svg
          className="w-3 h-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
      </button>
    </div>
  );
});

export default Toast;
