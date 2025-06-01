declare module 'react-calendar-heatmap' {
  import * as React from 'react';

  interface Value {
    date: string | Date;
    count?: number;
  }

  interface HeatmapProps {
    startDate: string | Date;
    endDate: string | Date;
    values: Value[];
    classForValue?: (value: Value) => string;
    tooltipDataAttrs?: (value: Value) => object;
    showWeekdayLabels?: boolean;
    onClick?: (value: Value) => void;
    onMouseOver?: (value: Value) => void;
    onMouseLeave?: (value: Value) => void;
    gutterSize?: number;
    horizontal?: boolean;
    weekStart?: number;
  }

  const Heatmap: React.FC<HeatmapProps>;

  export default Heatmap;
}
