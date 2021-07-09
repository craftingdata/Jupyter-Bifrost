/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import { useState, useRef, useEffect } from 'react';
import { PlainObject, VegaLite, VisualizationSpec } from 'react-vega';
import {
  useModelState,
  SuggestedGraphs,
  GraphSpec,
} from '../../hooks/bifrost-model';
import NavHeader from './NavHeader';
import theme from '../../theme';

const suggestedChartCss = css`
  width: 100vw;

  .suggestedCharts {
    padding: 20px;
    padding-left: 40px;
    display: flex;
    overflow: scroll;
    width: 85%;
  }

  .graph-wrapper {
    padding: 10px;
    margin: 0 10px;
    border: 3px solid transparent;
    border-radius: 5px;
    transition: border-color 0.5s;
    &.selected {
      border: 10px solid ${theme.color.primary.light};
    }
  }
`;

interface ChartChooserProps {
  onBack?: () => void;
  onChartSelected: (spec: VisualizationSpec) => void;
}

export default function ChartChooser(props: ChartChooserProps) {
  const suggestedGraphs = useModelState<SuggestedGraphs>('suggested_graphs')[0];
  const data = useModelState<PlainObject>('graph_data', (data) => ({
    data,
  }))[0];
  const setGraphSpec = useModelState<GraphSpec>('graph_spec')[1];
  const setOpHistory = useModelState<GraphSpec[]>('spec_history')[1];
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const chartChooserRef = useRef<HTMLElement>(null);

  useEffect(() => {
    chartChooserRef.current?.focus();
  }, []);

  function displayChart() {
    if (selectedIndex === -1) {
      return;
    }

    const spec = suggestedGraphs[selectedIndex] as GraphSpec;
    setGraphSpec(spec);
    setOpHistory([spec]);
    props.onChartSelected(spec);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        e.stopPropagation();
        displayChart();
        break;
      case 'ArrowRight':
        if (selectedIndex < suggestedGraphs.length - 1) {
          setSelectedIndex(selectedIndex + 1);
        }
        chartChooserRef.current
          ?.querySelector('.graph-wrapper.selected')
          ?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'start',
          });
        break;
      case 'ArrowLeft':
        if (selectedIndex !== 0) {
          setSelectedIndex(selectedIndex - 1);
        }
        chartChooserRef.current
          ?.querySelector('.graph-wrapper.selected')
          ?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'end',
          });
        break;
      case 'Backspace':
        props.onBack && props.onBack();
        break;
    }
  }

  return (
    <section
      tabIndex={-1}
      className="ChartChooser"
      onKeyDown={handleKeyDown}
      css={suggestedChartCss}
      ref={chartChooserRef}
    >
      <NavHeader
        title="Select Chart"
        onNext={displayChart}
        onPrevious={props.onBack}
      />
      <div className="suggestedCharts">
        {suggestedGraphs.map((spec, i) => (
          <div
            className={
              selectedIndex === i ? 'graph-wrapper selected' : 'graph-wrapper'
            }
            key={`spec_${i}`}
            onClick={() => setSelectedIndex(i)}
          >
            <VegaLite
              spec={spec as VisualizationSpec}
              data={data}
              actions={false}
            />
            <div
              className="graph-info"
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginLeft: '20px',
              }}
            >
              <b style={{ textTransform: 'capitalize' }}>{`${
                (spec as any).mark
              } Chart`}</b>
              <span>
                <b>x: </b>
                {(spec as any).encoding.x.field}
              </span>
              <span>
                <b>y: </b>
                {(spec as any).encoding.y.field}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
