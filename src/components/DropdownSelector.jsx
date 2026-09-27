import styles from './DropdownSelector.module.css';

const DropdownSelector = ({ selected, setSelected, options }) => {
  return (
    <select
      className={styles.select}
      value={selected}
      onChange={(e) => setSelected(Number(e.target.value))}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.name}
        </option>
      ))}
    </select>
  );
};

export default DropdownSelector;
