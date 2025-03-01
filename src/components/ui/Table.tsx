import {
  createContext,
  ReactNode,
  useContext,
} from "react";
import Empty from "./Empty";
import useMatchMedia from "../../hooks/useMatchMedia";

// Define types
type TableProps = {
  children: ReactNode;
  columns: number;
  isLoading: boolean;
  matchMaxMediaAt?: number | null;
  fixAt?: number | null;
};

// Exclude children
type TableState = {
  isMatched: boolean | null;
} & Omit<TableProps, "children">;

type BodyProps<T> = {
  data: T[];
  render: (value?: T, index?: number, array?: T[]) => ReactNode;
};

// Define the table as compound component to get full control over customize it

const Context: React.Context<TableState> = createContext<TableState>({
  columns: 0,
  isLoading: true,
  matchMaxMediaAt: null,
  isMatched: null,
  fixAt: 1200,
});

// The columns count should be equal to the columns count in the table
// this is used to flexible set the columns count in the grid
function Table({
  columns,
  isLoading,
  children,
  matchMaxMediaAt = null,
  fixAt = 1200,
}: TableProps): JSX.Element {
  const [isMatched] = useMatchMedia(matchMaxMediaAt);

  return (
    <Context.Provider
      value={{
        columns,
        matchMaxMediaAt,
        fixAt: fixAt,
        isLoading,
        isMatched,
      }}
    >
      <div
        role="table"
        className={`data-table flex flex-col border-gray-400 border-[1px] overflow-auto`}
      >
        {children}
      </div>
    </Context.Provider>
  );
}

function Header({ children }): JSX.Element {
  const { isMatched, fixAt } = useContext(Context);

  return (
    <div role="thead" style={isMatched ? { width: `${fixAt}px` } : {}}>
      {children}
    </div>
  );
}

function Body<T>({ data, render }: BodyProps<T>): JSX.Element {
  const { isLoading, columns, isMatched, fixAt } = useContext(Context);

  // When no data is found don't render the row
  if (!isLoading && data.length === 0) return <Empty />;

  // Render loading implicitly
  return (
    <div role="tbody" style={isMatched ? { width: `${fixAt}px` } : {}}>
      {isLoading
        ? Array.from({ length: 10 }, (_, i) => (
            <Tr key={`table-row-${i}`}>
              {Array.from({ length: columns }, (_, i) => (
                <Td key={`table-cell-${i}`}>{null}</Td>
              ))}
            </Tr>
          ))
        : data.map(render)}
    </div>
  );
}

function Tr({ children }): JSX.Element {
  const { columns } = useContext(Context);
  return (
    <div
      role="tr"
      className="grid divide-x-[1px] transition-colors min-w-0"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {children}
    </div>
  );
}

function Th({ children }): JSX.Element {
  return (
    <span
      role="th"
      className="bg-primary-blue border-gray-400 font-semibold text-lg text-center break-words p-1 uppercase"
    >
      {children}
    </span>
  );
}

function Td({ children }): JSX.Element {
  const { isLoading } = useContext(Context);
  return (
    <span
      role="td"
      className={`border-gray-400 text-center p-1 break-words ${
        isLoading ? "animate-pulse bg-gray-300 p-3" : ""
      }`}
    >
      {children}
    </span>
  );
}

Table.Header = Header;
Table.Body = Body;
Table.Tr = Tr;
Table.Th = Th;
Table.Td = Td;

export default Table;
