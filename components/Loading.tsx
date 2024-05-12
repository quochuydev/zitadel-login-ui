/* eslint-disable max-len */
import React from 'react';

const LoadingState = ({ loading }: { loading?: boolean }) => {
  if (!loading) return;

  return (
    <div className="w-full h-full opacity-60 bg-white fixed z-50 top-0 left-0">
      <div className="animate-spin h-[54px] w-[54px] absolute top-0 left-0 right-0 bottom-0 m-auto rounded-full border-8 border-[#DCE0E4] border-t-8 border-t-[#356BF5]" />
    </div>
  );
};

export default LoadingState;
