const DropdownSelector = ({ selected, setSelected, options }) => {
  return (
    <div>
      <select value={selected} onChange={(e) => setSelected(e.target.value)}>
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
