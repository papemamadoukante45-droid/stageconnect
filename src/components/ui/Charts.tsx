interface BarChartProps {
  data: { label: string; value: number }[];
  color?: string;
  height?: number;
  formatValue?: (v: number) => string;
}

export function BarChart({ data, color = '#059669', height = 200, formatValue }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="w-full" style={{ height }}>
      <div className="flex items-end justify-between gap-2 h-full pb-6">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
            <div className="relative w-full flex flex-col items-center justify-end h-full">
              <span className="text-xs font-bold text-ink-700 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {formatValue ? formatValue(d.value) : d.value}
              </span>
              <div
                className="w-full max-w-12 rounded-t-lg transition-all duration-500 hover:opacity-80"
                style={{
                  height: `${(d.value / max) * 100}%`,
                  backgroundColor: color,
                  minHeight: '4px',
                }}
              />
            </div>
            <span className="text-xs font-medium text-ink-500 absolute bottom-0">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface LineChartProps {
  data: { label: string; value: number }[];
  color?: string;
  height?: number;
  fill?: boolean;
}

export function LineChart({ data, color = '#059669', height = 200, fill = true }: LineChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const min = 0;
  const width = 100;
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1 || 1)) * width;
    const y = height - ((d.value - min) / (max - min)) * (height - 30) - 20;
    return { x, y, ...d };
  });

  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${path} L ${width} ${height} L 0 ${height} Z`;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height }} preserveAspectRatio="none">
        {fill && <path d={areaPath} fill={color} opacity={0.08} />}
        <path d={path} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={1.5} fill={color} />
            <circle cx={p.x} cy={p.y} r={3} fill={color} opacity={0.2} />
          </g>
        ))}
      </svg>
      <div className="flex justify-between mt-2 px-1">
        {data.map((d, i) => (
          <span key={i} className="text-xs font-medium text-ink-500">{d.label}</span>
        ))}
      </div>
    </div>
  );
}

interface DonutChartProps {
  data: { label: string; value: number; color: string }[];
  size?: number;
  centerLabel?: string;
  centerValue?: string;
}

export function DonutChart({ data, size = 180, centerLabel, centerValue }: DonutChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {data.map((d, i) => {
            const dash = (d.value / total) * circumference;
            const segment = (
              <circle
                key={i}
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke={d.color}
                strokeWidth={12}
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
                strokeLinecap="round"
              />
            );
            offset += dash;
            return segment;
          })}
        </svg>
        {(centerLabel || centerValue) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {centerValue && <span className="text-2xl font-bold text-ink-900">{centerValue}</span>}
            {centerLabel && <span className="text-xs text-ink-500 font-medium">{centerLabel}</span>}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 flex-1">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-sm font-medium text-ink-700 flex-1">{d.label}</span>
            <span className="text-sm font-bold text-ink-900">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface HorizontalBarChartProps {
  data: { label: string; value: number }[];
  color?: string;
}

export function HorizontalBarChart({ data, color = '#059669' }: HorizontalBarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-sm font-medium text-ink-600 w-32 flex-shrink-0 truncate">{d.label}</span>
          <div className="flex-1 h-7 bg-ink-50 rounded-lg overflow-hidden">
            <div
              className="h-full rounded-lg flex items-center justify-end px-2 transition-all duration-500"
              style={{ width: `${(d.value / max) * 100}%`, backgroundColor: color }}
            >
              <span className="text-xs font-bold text-white">{d.value}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
