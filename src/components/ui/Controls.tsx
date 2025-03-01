import {
  createContext,
  ReactNode,
  SyntheticEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import useMatchMedia from "../../hooks/useMatchMedia";
import useOutsideClick from "../../hooks/useOutsideClick";
import Input from "./Input";

// Define types
type ControlsProps = {
  matchMaxMediaAt?: number | null;
  children: ReactNode;
};

type ControlsState = {
  searchId: string;
  setSearchId: React.Dispatch<React.SetStateAction<string>>;
  isMatched: boolean;
} & Omit<ControlsProps, "children">;

type FilterBtnProps = {
  id: string;
  children: ReactNode;
  placeholder: string;
  type: React.HTMLInputTypeAttribute | undefined;
  disabled: boolean;
  handleSubmit: (e: SyntheticEvent, search: string) => void;
};

type RestartFilterBtnProps = {
  restartHandler: (e: SyntheticEvent) => void;
  children: ReactNode;
};

type SearchInputProps = {
  handleSearch: (value: string) => void;
  placeholder: string;
};

type PaginationControler = {
  handleChange: (e: SyntheticEvent, value: number) => void;
};

// Define the compound component
const Context: React.Context<ControlsState | null> =
  createContext<ControlsState | null>(null);

function Controls({
  children,
  matchMaxMediaAt = null,
}: ControlsProps): JSX.Element {
  // To uniquely identify which filter is currently opened
  const [searchId, setSearchId] = useState<string>("");
  // To give the developer ability to set matchMedia
  const [isMatched] = useMatchMedia(matchMaxMediaAt);

  return (
    <Context.Provider value={{ searchId, setSearchId, isMatched }}>
      <div
        className={`flex justify-between items-center gap-2 w-fit mt-8 mb-10 ${
          isMatched ? "flex-col items-start" : "divide-x-2 divide-gray-300"
        }`}
      >
        {children}
      </div>
    </Context.Provider>
  );
}

function SearchInput({
  handleSearch,
  placeholder,
}: SearchInputProps): JSX.Element {
  const context = useContext(Context);
  if (!context)
    throw new Error("SearchInput must be used inside a Controls provider");

  const { isMatched } = context;
  const [showForm, setShowForm] = useState<boolean>(false);
  const ref = useOutsideClick((e) => {
    // When the form isn't hidden and no match query don't hide it
    if (!showForm && isMatched) return;

    if (
      e?.target instanceof Element &&
      e?.target.closest("[data-open='search']") === null
    )
      setShowForm(false);
  });

  return (
    <div className="flex justify-center items-center pe-1 cursor-pointer gap-1.5">
      <img
        data-open="search"
        role="button"
        src="/src/assets/search.svg"
        className="w-[25px] h-[25px] cursor-pointer"
        onClick={() => {
          // The input will be visible
          if (!showForm) {
            ref.current?.focus();
          }
          setShowForm((state) => !state);
        }}
      />
      <form onSubmit={(e) => e.preventDefault()}>
        <Input
          ref={ref as React.LegacyRef<HTMLInputElement>}
          style={
            showForm || isMatched
              ? { width: "100%" }
              : { width: 0, borderWidth: 0, padding: 0 }
          }
          type="text"
          placeholder={placeholder}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
        />
      </form>
    </div>
  );
}

function PaginationControler({
  handleChange,
}: PaginationControler): JSX.Element {
  return (
    <div className="">
      <select
        onChange={(e) => handleChange(e, Number(e.target.value))}
        className="border-none outline-none cursor-pointer"
      >
        <option value={5}>5 Entries</option>
        <option value={10}>10 Entries</option>
        <option value={15}>15 Entries</option>
        <option value={20}>20 Entries</option>
      </select>
    </div>
  );
}

function FiltersContainer({ children }: { children: ReactNode }): JSX.Element {
  return <div className="flex justify-between gap-3">{children}</div>;
}

// NOTE: I can force the id to be unique but it will cost more for nothing. So when the developer see the word id
// He will make sure it must be unique or both inputs will be visible

function FilterBtn({
  id,
  children,
  placeholder,
  handleSubmit,
  type,
  disabled,
}: FilterBtnProps): JSX.Element {
  const context = useContext(Context);
  if (!context)
    throw new Error("FilterBtn must be used inside a Controls provider");

  const { searchId, setSearchId } = context;
  const [search, setSearch] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const ref = useOutsideClick((e) => {
    // The logic will run when use click outside the form
    // If the nearest data-id=given id we will not do antything the toggler will do the job
    if (
      e?.target instanceof Element &&
      e?.target?.closest(`[data-id="${id}"]`) === null
    ) {
      setSearchId(""); // Close the opened filter input
      setSearch(""); // Empty the field
    }
  });

  // Enforce focus to the input after it appear
  useEffect(() => {
    if (searchId === id) {
      inputRef.current?.focus();
    }
  }, [searchId, id]);

  return (
    <div className="relative">
      <button
        className="cursor-pointer flex justify-between items-baseline gap-2"
        data-id={id}
        onClick={() => (searchId !== id ? setSearchId(id) : setSearchId(""))}
      >
        <span>{children}</span>
        <span className="font-bold">&#9662;</span>
      </button>
      {searchId === id && (
        <form
          className="absolute left-0 bottom-[calc(-100%-0.8rem)]"
          onSubmit={(e) => {
            if (disabled) return; // Don't trigger call
            handleSubmit(e, search);
            setSearch(""); // Empty the field
            setSearchId(""); // Hide the form
          }}
          ref={ref as React.LegacyRef<HTMLFormElement>}
        >
          <Input
            ref={inputRef}
            placeholder={placeholder}
            value={search}
            disabled={disabled}
            type={type}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
      )}
    </div>
  );
}

function RestartFiltersBtn({
  restartHandler,
  children,
}: RestartFilterBtnProps) {
  return (
    <button className="cursor-pointer text-red-400" onClick={restartHandler}>
      {children}
    </button>
  );
}

Controls.SearchInput = SearchInput;
Controls.FilterContainer = FiltersContainer;
Controls.FilterBtn = FilterBtn;
Controls.PaginationControler = PaginationControler;
Controls.RestartFiltersBtn = RestartFiltersBtn;

export default Controls;
