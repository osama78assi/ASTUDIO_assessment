type ErrProps = {
  errorMessage: string;
  refetch: () => void;
};

function Err({ errorMessage, refetch }: ErrProps): JSX.Element {
  return (
    <div className="bg-red-200 text-red-600 p-2 rounded-lg space-y-2">
      <p className="text-xl">{errorMessage}</p>
      <button onClick={refetch} className="bg-red-300 p-2 rounded-lg cursor-pointer text-l">Reload</button>
    </div>
  );
}

export default Err;
