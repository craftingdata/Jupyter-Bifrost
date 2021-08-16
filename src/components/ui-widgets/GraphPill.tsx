/**@jsx jsx */
import { jsx, css } from '@emotion/react';
import { X, Sliders, Maximize2, CheckSquare } from 'react-feather';
import theme from '../../theme';
import NumericalIcon from '../../assets/NumericalIcon';
import CategoryIcon from '../../assets/CategoryIcon';
import FunnelIcon from '../../assets/FilterIcon';
import AggregateIcon from '../../assets/AggregateIcon';
import SliderIcon from '../../assets/icons/SliderIcon';
import { Fragment } from 'react';

const typeIconMap: Record<string, typeof NumericalIcon> = {
  quantitative: NumericalIcon,
  nominal: CategoryIcon,
};

const filterIconMap: Record<string, any> = {
  quantitative: SliderIcon,
  nominal: () => <CheckSquare size={12} />,
};

interface GraphPillProps extends React.LiHTMLAttributes<HTMLLIElement> {
  onClose: () => void;
  onFilterSelected: () => void;
  onEncodingSelected: () => void;
  onFieldSelected: () => void;
  onFieldTypeSelected: () => void;
  position: number;
  type: string;
  encoding: string;
  filters: string[];
  aggregation: string;
  scale: string;
  field: string;
  selectedField: 'field' | 'encoding' | 'filter' | '';
}
export default function GraphPill(props: GraphPillProps) {
  const {
    onClose,
    position,
    type,
    encoding,
    field,
    filters,
    aggregation,
    scale,
    selectedField,
    onFilterSelected,
    onEncodingSelected,
    onFieldSelected,
    ...rest
  } = props;
  const color = theme.color.pill[position % theme.color.pill.length];
  const TypeIcon = type in typeIconMap ? typeIconMap[type] : FunnelIcon;
  const FilterIcon = type in filterIconMap ? filterIconMap[type] : FunnelIcon;

  const borderRadius = '5px';

  const graphPillCss = css`
    list-style: none;
    background: white;
    border-radius: ${borderRadius};
    width: min-content;
    margin: 5px;
    box-shadow: ${theme.shadow.handle};

    .pill-header {
      display: flex;
      align-items: stretch;
      justify-content: stretch;
      height: 25px;
      border-radius: 20px;
      background-color: ${color};
      border-radius: ${borderRadius} ${borderRadius} 0 0;
      overflow: hidden;
      .selected {
        color: white;
        backdrop-filter: contrast(30%) saturate(660%);
      }
      span {
        white-space: nowrap;
        cursor: pointer;
        width: 100%;
        text-align: center;

        &:hover {
          text-decoration: underline;
        }
      }

      button {
        width: 100%;
        text-align: center;
      }
    }

    .options {
      display: flex;
      align-items: start;
      .slider-button {
        border-radius: 0 15px 15px 0;
        background-color: ${theme.color.primary.dark};
        padding: 5px;
      }
    }

    .modifiers {
      display: grid;
      grid-template-columns: auto 1fr;
      justify-content: start;
      align-items: start;

      padding: 8px;

      button.icon {
        background-color: transparent;
        transition: background-color 0.3s;
        height: 1em;
        width: 1em;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 4px;
        margin-bottom: -2px;
        &:hover {
          background-color: ${theme.color.primary.light};
        }
      }

      .filter-list {
        list-style: none;
        padding: 0 5px;
        li {
          margin-bottom: 7px;
          padding: 0;
          white-space: nowrap;
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  `;

  return (
    <li css={graphPillCss} {...rest}>
      <div className="pill-header">
        <button className="wrapper" onClick={props.onFieldTypeSelected}>
          <TypeIcon />
        </button>
        <span
          onClick={onEncodingSelected}
          className={selectedField === 'encoding' ? 'selected' : undefined}
        >
          {encoding}
        </span>
        <span
          onClick={onFieldSelected}
          className={selectedField === 'field' ? 'selected' : undefined}
        >
          <b>{field}</b>
        </span>
        <button className="wrapper icon" onClick={onClose}>
          <X size={15} />
        </button>
      </div>
      <div className="options">
        <button className="slider-button" onClick={onFilterSelected}>
          <Sliders size={15} color="white" />
        </button>
        <div className="modifiers">
          {!!filters.length && (
            <Fragment>
              <button className="wrapper icon" onClick={onFilterSelected}>
                <FilterIcon />
              </button>
              <ul className="filter-list">
                {filters.map((filter, i) => (
                  <li key={i}>{filter}</li>
                ))}
              </ul>
            </Fragment>
          )}

          {aggregation && (
            <Fragment>
              <button className="wrapper icon" onClick={props.onFilterSelected}>
                <AggregateIcon />
              </button>
              <div style={{ padding: '0 5px' }}>{aggregation}</div>
            </Fragment>
          )}

          {scale && (
            <Fragment>
              <button className="wrapper icon" onClick={props.onFilterSelected}>
                <Maximize2 size={12} />
              </button>
              <div style={{ padding: '0 5px' }}>{scale}</div>
            </Fragment>
          )}
        </div>
      </div>
    </li>
  );
}
