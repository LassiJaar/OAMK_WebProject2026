const DropdownSelector = ({ selected, setSelected, options }) => {
  return (
    <div>
      <select
        value={selected}
        onChange={(e) => setSelected(Number(e.target.value))}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownSelector;
