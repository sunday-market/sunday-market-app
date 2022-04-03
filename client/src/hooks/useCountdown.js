import { useEffect, useState } from "react";

const useCountdown = (targetDate) => {
  const countdDownDate = new Date(targetDate).getTime();

  const [countdown, setCountdown] = useState(
    countdDownDate - new Date().getTime()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(countdDownDate - new Date().getTime());
    }, 1000);
    return () => clearInterval(interval);
  }, [countdDownDate]);

  return getReturnValues(countdown);
};

const getReturnValues = (countdown) => {
  // calculate the time remaining
  const days = Math.floor(countdown / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (countdown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((countdown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countdown % (1000 * 60)) / 1000);

  return [days, hours, minutes, seconds];
};

export { useCountdown };
