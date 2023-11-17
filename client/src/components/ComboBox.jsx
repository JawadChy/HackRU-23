import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export default function ComboBox({
  options,
  label,
  handleRouteChange,
  disabled,
  value,
}) {
  return (
    <Autocomplete
      disabled={disabled}
      value={value}
      disablePortal
      id="combo-box-demo"
      options={options}
      sx={{ width: 300 }}
      onInputChange={handleRouteChange}
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  );
}