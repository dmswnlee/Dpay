export const FormatNumber = (value: number): string => {
  return new Intl.NumberFormat("ko-KR").format(value);
};
