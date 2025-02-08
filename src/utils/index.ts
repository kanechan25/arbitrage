import { spotFees } from '@/constants/fees';
import { CEX, ICalculateSpotFees } from '@/types/cex.types';

export function calculateTimeDifference(endTime: string, startTime: string): string {
  const end = new Date(endTime);
  const start = new Date(startTime);
  // Calculate difference in milliseconds
  const diffMs = end.getTime() - start.getTime();
  // Convert to hours, minutes, seconds
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
  // Format with leading zeros
  const formatNumber = (num: number): string => num.toString().padStart(2, '0');
  return `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(seconds)}`;
}

export function calculateAverageTime(satisfiedCount: number, duration: string): string {
  // Parse duration "hh:mm:ss" to total seconds
  const [hours, minutes, seconds] = duration.split(':').map(Number);
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;

  // Calculate average time in seconds
  const averageSeconds = totalSeconds / satisfiedCount;

  // Convert to hours, minutes, seconds, and milliseconds
  const hours_part = Math.floor(averageSeconds / 3600);
  const minutes_part = Math.floor((averageSeconds % 3600) / 60);
  const seconds_part = Math.floor(averageSeconds % 60);
  const milliseconds_part = Math.floor((averageSeconds % 1) * 1000);

  // Format with leading zeros
  const formatNumber = (num: number, digits: number = 2): string => num.toString().padStart(digits, '0');

  return `${formatNumber(hours_part)}:${formatNumber(minutes_part)}:${formatNumber(seconds_part)}.${formatNumber(milliseconds_part, 3)}`;
}

export function calculateSpotFees(params: ICalculateSpotFees): {
  totalFeePct: number;
  minExFeePct: number;
  maxExFeePct: number;
} {
  const { minExchange, maxExchange, spotFeeType, symbol } = params;
  const symbolMexcFeePct = spotFees[CEX.MEXC].customValues[symbol] ?? spotFees[CEX.MEXC][spotFeeType];
  const minExFeePct = minExchange === CEX.MEXC ? symbolMexcFeePct : spotFees[minExchange][spotFeeType];
  const maxExFeePct = maxExchange === CEX.MEXC ? symbolMexcFeePct : spotFees[maxExchange][spotFeeType];
  return { totalFeePct: minExFeePct + maxExFeePct, minExFeePct, maxExFeePct };
}
