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
      sx={{ 
        width: 300, 
        "& .MuiAutocomplete-paper": {
          background: "yellow", // Customize the paper (dropdown) background color
        },
        "& .MuiAutocomplete-inputRoot": {
          backgroundColor: "#0f1df8", // Customize the input root background color
        },
        "& .MuiAutocomplete-clearIndicator": {
          color: "red", // Customize clear indicator color
        },
        "& .MuiAutocomplete-popupIndicator": {
          color: "#ffa061", // Customize popup indicator color
        },
        "& .MuiAutocomplete-option": {
          backgroundColor: "#2e9fc9", // Customize option background color
        },
      }}
      onInputChange={handleRouteChange}
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  );
}