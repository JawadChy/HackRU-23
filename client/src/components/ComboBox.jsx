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
      style={{marginBottom:"15px"}}
      sx={{ 
        width: 300, 
        "& .MuiAutocomplete-paper": {
          background: "yellow", 
        },
        "& .MuiAutocomplete-clearIndicator": {
          color: "red", 
        },
        "& .MuiAutocomplete-popupIndicator": {
          color: "#ffa061", 
        },
        "& .MuiAutocomplete-option": {
          backgroundColor: "#2e9fc9", 
        },
      }}
      onInputChange={handleRouteChange}
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  );
}